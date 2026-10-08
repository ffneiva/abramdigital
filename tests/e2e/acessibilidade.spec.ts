import { expect, test } from '@playwright/test'
import { EMPRESA } from '../../src/lib/business'

/**
 * As regras de movimento e acessibilidade do AGENTS.md, verificadas.
 */

const PAGINAS = ['/', '/politica-de-privacidade/']

for (const caminho of PAGINAS) {
  test(`${caminho}: todo botão e link tem nome`, async ({ page }) => {
    await page.goto(caminho)
    await page.waitForTimeout(600)
    const semNome = await page.evaluate(() =>
      [...document.querySelectorAll('button, a[href]')]
        .filter((el) => (el as HTMLElement).offsetParent !== null)
        .filter((el) => {
          const nome = (el.getAttribute('aria-label') ?? (el as HTMLElement).innerText ?? '').trim()
          return !nome && !el.querySelector('img[alt]:not([alt=""])')
        })
        .map((el) => el.outerHTML.slice(0, 120)),
    )
    expect(semNome).toEqual([])
  })

  test(`${caminho}: nada vaza na horizontal em 320 px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 })
    await page.goto(caminho)
    await page.waitForTimeout(800)
    const largura = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(largura).toBeLessThanOrEqual(320)
  })
}

/**
 * "Reduzir movimento" não desliga a constelação: no Windows a preferência vem
 * ligada sem a pessoa saber (Efeitos de animação desligado). A cena roda em
 * modo calmo — e o resto do movimento automático some.
 */
test.describe('movimento reduzido', () => {
  test.use({ reducedMotion: 'reduce' })

  test('sem abertura e sem cenas armadas, mas com a constelação — tudo legível', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    const opacidade = await page
      .locator('[data-linha] > span')
      .first()
      .evaluate((el) => getComputedStyle(el).opacity)
    expect(opacidade).toBe('1')
    await expect(page.locator('.abertura-selo')).toHaveCount(0)
    await page.waitForTimeout(2500)
    await expect(page.locator('canvas')).toHaveCount(1)
    // Nenhuma cena de rolagem armada: o GSAP nem é baixado; nada fica apagado.
    await expect(page.locator('[data-armada]')).toHaveCount(0)
  })
})

test('a constelação monta e o topo não trava', async ({ page }) => {
  const erros: string[] = []
  page.on('pageerror', (e) => erros.push(e.message))
  await page.goto('/')
  await page.waitForTimeout(4000)
  const canvas = await page.evaluate(
    () =>
      [...document.querySelectorAll('canvas')].filter((c) => (c as HTMLCanvasElement).width > 0)
        .length,
  )
  expect(canvas).toBe(1)
  expect(erros).toEqual([])
})

/**
 * Sem JavaScript, o <noscript> precisa trazer o essencial. O teste lê o HTML
 * cru: a opção `javaScriptEnabled: false` do Playwright só desliga a execução.
 */
test('sem JavaScript, o noscript traz o nome e o contato', async ({ request }) => {
  const html = await (await request.get('/')).text()
  const bloco = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1] ?? ''
  expect(bloco).toContain(EMPRESA.nome)
  expect(bloco).toContain(`wa.me/${EMPRESA.whatsapp}`)
})
