/**
 * Pré-renderização: grava o conteúdo de cada página dentro do HTML estático.
 *
 * O site é um app React, e o HTML que sai do `vite build` traz só o <head>
 * (título, descrição, JSON-LD) e um <div id="root"> vazio. O Google executa
 * JavaScript, mas com atraso; os robôs de IA (GPTBot, ClaudeBot, Perplexity)
 * não executam: para eles as páginas estavam vazias.
 *
 * Aqui cada rota é aberta num Chrome sem tela (o mesmo `vite preview` que
 * imita o S3), rolada até o fim para as seções sob demanda montarem, e o
 * conteúdo do #root vai para o HTML com `data-pre`. Para quem visita nada muda:
 * o CSS esconde esse conteúdo (`#root[data-pre]`) e o React, ao montar,
 * substitui pelo mesmo conteúdo vivo e tira o atributo (ver main.tsx).
 *
 * Roda depois do `vite build` (npm run build). Sem navegador disponível, avisa
 * e segue; com PRERENDER_OBRIGATORIO=1 (no deploy), falha.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { preview } from 'vite'

const DIST = path.resolve(import.meta.dirname, '..', 'dist')
const obrigatorio = process.env.PRERENDER_OBRIGATORIO === '1'

function paginas(dir = DIST, saida = []) {
  for (const nome of readdirSync(dir)) {
    const c = path.join(dir, nome)
    if (statSync(c).isDirectory()) paginas(c, saida)
    else if (nome === 'index.html') saida.push(c)
  }
  return saida
}

async function navegador() {
  const { chromium } = await import('@playwright/test')
  try {
    return await chromium.launch({ channel: 'chrome' })
  } catch {
    return await chromium.launch()
  }
}

let browser
try {
  browser = await navegador()
} catch (e) {
  const msg = `prerender: sem navegador (${e.message.split('\n')[0]}).`
  if (obrigatorio) throw new Error(msg)
  console.warn(`${msg} As páginas saem sem o conteúdo gravado.`)
  process.exit(0)
}

const servidor = await preview({ preview: { port: 4399, strictPort: false }, logLevel: 'warn' })
const base = servidor.resolvedUrls.local[0].replace(/\/$/, '')
const ctx = await browser.newContext({
  viewport: { width: 1366, height: 900 },
  reducedMotion: 'reduce',
})

// A 404 também: o preview (como o S3) serve o 404.html para endereço inexistente.
const alvos = [
  ...paginas().map((arquivo) => {
    const rel = path.relative(DIST, path.dirname(arquivo)).replaceAll('\\', '/')
    return { arquivo, rel, url: `${base}/${rel ? `${rel}/` : ''}` }
  }),
  { arquivo: path.join(DIST, '404.html'), rel: '404', url: `${base}/pagina-que-nao-existe/` },
]

let total = 0
for (const { arquivo, rel, url } of alvos) {
  const p = await ctx.newPage()
  await p.goto(url, { waitUntil: 'domcontentloaded' })
  await p.waitForSelector('#root main, #root h1', { timeout: 20000 })
  // Rola até o fim: as seções sob demanda (lazy) e os "revelar ao entrar" montam.
  await p.evaluate(async () => {
    for (let y = 0; y <= document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
  })
  await p.waitForTimeout(800)
  const html = await p.evaluate(() => {
    const raiz = document.getElementById('root').cloneNode(true)
    // Camadas decorativas fixas (3D, cursor, abertura) e o que não é conteúdo.
    for (const el of raiz.querySelectorAll('canvas, script, div[aria-hidden].fixed')) el.remove()
    return raiz.innerHTML
  })
  await p.close()
  const original = readFileSync(arquivo, 'utf8')
  if (!original.includes('<div id="root"></div>'))
    throw new Error(`prerender: #root não encontrado em ${arquivo}`)
  writeFileSync(
    arquivo,
    original.replace('<div id="root"></div>', `<div id="root" data-pre="">${html}</div>`),
  )
  const palavras = html
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  console.log(`prerender: /${rel}${rel ? '/' : ''} (${palavras} palavras)`)
  total++
}

await browser.close()
await new Promise((r) => servidor.httpServer.close(r))
console.log(`prerender: ${total} páginas gravadas.`)
