import { expect, test } from '@playwright/test'
import { EMPRESA, TRABALHOS_PUBLICADOS } from '../../src/lib/business'
import { canonicalDe, ROTAS } from '../../src/lib/routes'

/**
 * Navegação e HTML por rota — contra o build de produção, servido como o S3
 * serve (ver vite.config.ts). O dev server serviria o mesmo index.html para
 * tudo.
 */

for (const rota of ROTAS) {
  const endereco = rota.path === '/' ? '/' : `${rota.path}/`
  test(`${endereco} chega com título, canonical e um único h1`, async ({ page, request }) => {
    const html = await (await request.get(endereco)).text()
    expect(html).toContain(`<title>${rota.titulo.replace(/&/g, '&amp;')}</title>`)
    expect(html).toContain(`<link rel="canonical" href="${canonicalDe(rota)}"`)
    expect(html).toContain('application/ld+json')

    await page.goto(endereco)
    await expect(page.locator('h1')).toHaveCount(1)
  })
}

test('rota sem barra final redireciona para a com barra, como o S3', async ({ request }) => {
  const r = await request.get('/politica-de-privacidade', { maxRedirects: 0 })
  expect(r.status()).toBe(302)
  expect(r.headers().location).toBe('/politica-de-privacidade/')
})

test('endereço inexistente mostra a página de 404 com noindex', async ({ page }) => {
  const resposta = await page.goto('/uma-rota-que-nao-existe')
  expect(resposta?.status()).toBe(404)
  await expect(page.locator('h1')).toContainText('Esta estrela não existe')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
})

test('link interno navega sem recarregar a página', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    ;(window as unknown as { marcador: boolean }).marcador = true
  })
  await page.locator('footer').getByRole('link', { name: 'Política de privacidade' }).click()
  await expect(page).toHaveURL(/\/politica-de-privacidade\/$/)
  await expect(page.locator('h1')).toContainText('seus dados')
  expect(await page.evaluate(() => (window as unknown as { marcador?: boolean }).marcador)).toBe(
    true,
  )
})

test('todo contato vai para o WhatsApp da Abram', async ({ page }) => {
  await page.goto('/')
  await page.locator('#contato').waitFor()
  const hrefs = await page
    .locator('a[href^="https://wa.me/"]')
    .evaluateAll((els) => els.map((e) => e.getAttribute('href') ?? ''))
  expect(hrefs.length).toBeGreaterThan(5)
  for (const h of hrefs) expect(h).toContain(`wa.me/${EMPRESA.whatsapp}`)
})

test('o diagnóstico só mostra o plano com as quatro respostas, e ele vira mensagem', async ({
  page,
}) => {
  await page.goto('/')
  const secao = page.locator('#diagnostico')
  await secao.scrollIntoViewIfNeeded()
  await secao.getByRole('button', { name: 'Site e tráfego' }).click()
  await secao.getByRole('button', { name: 'Profissional liberal' }).click()
  await secao.getByRole('button', { name: 'Impulsiono posts no Instagram' }).click()
  await expect(secao.getByText('Seu ponto de partida')).toHaveCount(0)
  await secao.getByRole('button', { name: 'Agenda cheia' }).click()
  await expect(secao.getByText('Seu ponto de partida')).toBeVisible()
  const href =
    (await secao.getByRole('link', { name: /Mandar isso no WhatsApp/ }).getAttribute('href')) ?? ''
  const texto = new URL(href).searchParams.get('text') ?? ''
  expect(texto).toContain('Profissional liberal')
  expect(texto).toContain('Agenda cheia')
})

test('o portfólio traz um cartão por trabalho, e capas e vídeos existem', async ({
  page,
  request,
}) => {
  await page.goto('/')
  const cartoes = page.locator('#trabalhos .cartao-trabalho')
  await expect(cartoes).toHaveCount(TRABALHOS_PUBLICADOS.length)
  // O vídeo não é baixado antes de o cartão aparecer.
  await expect(page.locator('#trabalhos video[preload="none"]')).toHaveCount(
    TRABALHOS_PUBLICADOS.length,
  )
  for (const t of TRABALHOS_PUBLICADOS) {
    for (const arquivo of [
      `/images/trabalhos/${t.id}-capa.webp`,
      `/images/trabalhos/${t.id}-capa.avif`,
      `/videos/trabalhos/${t.id}.webm`,
      `/videos/trabalhos/${t.id}.mp4`,
    ]) {
      expect((await request.get(arquivo)).status(), arquivo).toBe(200)
    }
  }
})

test('nenhum preço aparece na página', async ({ page }) => {
  await page.goto('/')
  await page.locator('#duvidas').waitFor()
  const texto = await page.locator('body').innerText()
  expect(texto).not.toMatch(/R\$\s?\d/)
})

test('o painel ao vivo mede a página, sem número escrito à mão', async ({ page }) => {
  await page.goto('/')
  const painel = page.locator('#ao-vivo')
  await painel.scrollIntoViewIfNeeded()
  await expect(painel.locator('dt')).toHaveCount(6)
  await expect(painel).toContainText('Página pronta')
  // Sem rastreador: nenhum domínio de terceiros e nenhum cookie.
  await expect(painel.locator('dd').nth(4)).toContainText(/^0 domínios/)
  await expect(painel.locator('dd').nth(5)).toContainText(/^0 cookies/)
})

test('o JSON-LD traz a empresa', async ({ request }) => {
  const html = await (await request.get('/')).text()
  const json = JSON.parse(
    html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? '{}',
  )
  const empresas = json['@graph'].filter(
    (n: { '@type': string }) => n['@type'] === 'ProfessionalService',
  )
  expect(empresas).toHaveLength(1)
  expect(empresas[0].name).toBe(EMPRESA.nome)
})

/**
 * Sair da home depois de rolar até o meio — com a cena 3D montada. Desmontar
 * a home desfaz o contexto WebGL e os gatilhos do GSAP (inclusive o pin do
 * portfólio); um erro ali derrubaria o React na troca de rota.
 */
test('da home para a privacidade depois de rolar a página', async ({ page }) => {
  const erros: string[] = []
  page.on('pageerror', (e) => erros.push(e.message))
  await page.goto('/')
  await page.waitForTimeout(2500)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
  await page.waitForTimeout(1000)
  await page.evaluate(() => {
    const a = document.createElement('a')
    a.href = '/politica-de-privacidade/'
    document.body.appendChild(a)
    a.click()
  })
  await expect(page).toHaveURL(/\/politica-de-privacidade\/$/)
  await page.waitForTimeout(500)
  expect(erros).toEqual([])
})
