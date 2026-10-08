/**
 * Gera os arquivos de marca: favicon, ícones e artes de compartilhamento.
 *
 *   npm run brand
 *
 * Fontes: o grafo da marca (src/lib/marca.ts) e a lista de rotas
 * (src/lib/routes.ts). As artes são renderizadas por um Chromium de verdade
 * (o do Playwright), com as fontes do próprio site.
 *
 * Roda com --experimental-strip-types para importar os .ts sem build.
 * CHROMIUM=/caminho/chrome aponta um Chromium específico, se preciso.
 */
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from '@playwright/test'
import sharp from 'sharp'
import { CORES, simboloSvg } from '../src/lib/marca.ts'
import { ogArquivoDe, ROTAS } from '../src/lib/routes.ts'

const RAIZ = path.resolve(import.meta.dirname, '..')
const PUBLIC = path.join(RAIZ, 'public')

/**
 * Ícone de aplicativo: o símbolo em ouro sobre a noite, com um brilho. Em
 * tamanho pequeno os fios engrossam (`escala`), senão o fino some.
 */
function iconeSvg(margem, escala) {
  const lado = 1000
  const miolo = simboloSvg({ escala, margem: 0 })
  const vb = miolo
    .match(/viewBox="([^"]+)"/)[1]
    .split(' ')
    .map(Number)
  const util = lado * (1 - margem * 2)
  const k = util / Math.max(vb[2], vb[3])
  const dx = (lado - vb[2] * k) / 2 - vb[0] * k
  const dy = (lado - vb[3] * k) / 2 - vb[1] * k
  const interno = miolo.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}"><defs><radialGradient id="g" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="${CORES.ouro}" stop-opacity="0.2"/><stop offset="1" stop-color="${CORES.ouro}" stop-opacity="0"/></radialGradient></defs><rect width="${lado}" height="${lado}" fill="${CORES.noite}"/><rect width="${lado}" height="${lado}" fill="url(#g)"/><g transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)}) scale(${k.toFixed(4)})">${interno}</g></svg>`
}

/**
 * O .ico que o navegador pede sozinho em /favicon.ico, mesmo com o SVG
 * declarado — sem ele, cada visita gera um 404 no log. O ICO aceita PNG
 * embutido: um cabeçalho de 22 bytes e o PNG de 32 px.
 */
function icoDePng(png) {
  const c = Buffer.alloc(22)
  c.writeUInt16LE(0, 0)
  c.writeUInt16LE(1, 2)
  c.writeUInt16LE(1, 4)
  c.writeUInt8(32, 6)
  c.writeUInt8(32, 7)
  c.writeUInt16LE(1, 10)
  c.writeUInt16LE(32, 12)
  c.writeUInt32LE(png.length, 14)
  c.writeUInt32LE(22, 18)
  return Buffer.concat([c, png])
}

const png = async (svg, tamanho, destino) => {
  await sharp(Buffer.from(svg), { density: 300 })
    .resize(tamanho, tamanho)
    .png({ compressionLevel: 9 })
    .toFile(destino)
  console.log(`  ${path.relative(PUBLIC, destino)}`)
}

async function icones() {
  const favicon = iconeSvg(0.06, 2.6)
  await writeFile(path.join(PUBLIC, 'favicon.svg'), favicon)
  console.log('  favicon.svg')
  await png(favicon, 32, path.join(PUBLIC, 'favicon-32.png'))
  await png(iconeSvg(0.06, 2), 64, path.join(PUBLIC, 'favicon-64.png'))
  // Tela inicial e manifesto: margem maior, porque o sistema recorta em
  // círculo ou squircle (e o "maskable" exige a zona segura de 80%).
  await png(iconeSvg(0.18, 1.5), 180, path.join(PUBLIC, 'apple-touch-icon.png'))
  await png(iconeSvg(0.22, 1.5), 192, path.join(PUBLIC, 'icon-192.png'))
  await png(iconeSvg(0.22, 1.2), 512, path.join(PUBLIC, 'icon-512.png'))
  await writeFile(
    path.join(PUBLIC, 'favicon.ico'),
    icoDePng(await readFile(path.join(PUBLIC, 'favicon-32.png'))),
  )
  console.log('  favicon.ico')

  const v = async (arquivo) =>
    createHash('sha1')
      .update(await readFile(path.join(PUBLIC, arquivo)))
      .digest('hex')
      .slice(0, 8)
  const versoes = { 192: await v('icon-192.png'), 512: await v('icon-512.png') }
  const manifesto = {
    name: 'Abram Digital — sites e tráfego pago',
    short_name: 'Abram',
    description: 'O anúncio traz. O site convence.',
    lang: 'pt-BR',
    start_url: '/',
    display: 'standalone',
    background_color: CORES.noite,
    theme_color: CORES.noite,
    icons: ['any', 'maskable'].flatMap((purpose) =>
      [192, 512].map((l) => ({
        src: `/icon-${l}.png?v=${versoes[l]}`,
        sizes: `${l}x${l}`,
        type: 'image/png',
        purpose,
      })),
    ),
  }
  await writeFile(path.join(PUBLIC, 'site.webmanifest'), `${JSON.stringify(manifesto, null, 2)}\n`)
  console.log('  site.webmanifest')
}

const base64 = async (arquivo) => (await readFile(arquivo)).toString('base64')

async function comNavegador(fn) {
  const navegador = await chromium.launch(
    process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {},
  )
  try {
    await fn(navegador)
  } finally {
    await navegador.close()
  }
}

async function cssFontes() {
  const m = await base64(path.join(PUBLIC, 'fonts', 'montserrat-latin.woff2'))
  const i = await base64(path.join(PUBLIC, 'fonts', 'serif-italico-latin.woff2'))
  const o = await base64(path.join(PUBLIC, 'fonts', 'mono-latin.woff2'))
  return `@font-face{font-family:Mo;src:url(data:font/woff2;base64,${m}) format('woff2');font-weight:100 900}
    @font-face{font-family:Se;font-style:italic;src:url(data:font/woff2;base64,${i}) format('woff2')}
    @font-face{font-family:Mn;src:url(data:font/woff2;base64,${o}) format('woff2');font-weight:400 600}`
}

/** As artes de 1200×630 que o WhatsApp, o Instagram e o Google mostram. */
async function artes(navegador) {
  const fontes = await cssFontes()
  const simbolo = `data:image/svg+xml;base64,${Buffer.from(simboloSvg({ escala: 1.15 })).toString('base64')}`
  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } })
  const feitas = new Set()
  // Uma poeira de estrelas determinística: a arte não muda a cada geração.
  let semente = 11
  const r = () => {
    semente = (semente * 16807) % 2147483647
    return semente / 2147483647
  }
  const estrelas = Array.from({ length: 160 }, () => {
    const x = (r() * 1200).toFixed(0)
    const y = (r() * 630).toFixed(0)
    const t = (r() ** 3 * 2.4 + 0.5).toFixed(1)
    const a = (r() * 0.6 + 0.15).toFixed(2)
    return `<i style="left:${x}px;top:${y}px;width:${t}px;height:${t}px;opacity:${a}"></i>`
  }).join('')

  for (const rota of ROTAS) {
    const arquivo = ogArquivoDe(rota)
    if (feitas.has(arquivo) || !rota.og) continue
    feitas.add(arquivo)
    const [linha1, linha2] = rota.og
    const enf = (l) => l.replace(/(\S+)$/, '<em>$1</em>')
    await pagina.setContent(`<!doctype html><html><head><style>${fontes}
      *{margin:0;box-sizing:border-box}
      body{width:1200px;height:630px;background:${CORES.noite};color:${CORES.marfim};font-family:Mo;position:relative;overflow:hidden}
      i{position:absolute;border-radius:50%;background:${CORES.ouroClaro};box-shadow:0 0 6px ${CORES.ouro}}
      .brilho{position:absolute;right:-160px;top:-120px;width:900px;height:860px;border-radius:50%;background:radial-gradient(circle,rgba(214,180,106,.2),transparent 60%)}
      .simbolo{position:absolute;right:16px;top:86px;height:470px;filter:drop-shadow(0 0 24px rgba(214,180,106,.45))}
      .txt{position:absolute;left:72px;top:0;bottom:0;width:680px;display:flex;flex-direction:column;justify-content:center;gap:30px;padding-top:40px}
      h1{font-weight:800;font-size:74px;line-height:1.04;letter-spacing:-.045em}
      h1 em{font-family:Se;font-style:italic;font-weight:400;letter-spacing:-.02em;font-size:1.1em;padding-right:.08em;background:linear-gradient(100deg,#f6e2a6,#d2a952 45%,#9c7632 75%,#ecd08a);-webkit-background-clip:text;color:transparent}
      p{font-family:Mn;font-size:15px;letter-spacing:.14em;text-transform:uppercase;color:${CORES.areia}}
      .marca{position:absolute;left:72px;top:58px;font-size:24px;letter-spacing:.16em;text-transform:uppercase}
      .marca b{font-weight:700}.marca span{font-weight:300}
    </style></head><body>
      ${estrelas}<div class="brilho"></div>
      <img class="simbolo" src="${simbolo}">
      <div class="marca"><b>Abram</b> <span>Digital</span></div>
      <div class="txt"><h1>${enf(linha1)}<br>${enf(linha2)}</h1>${rota.ogNota ? `<p>${rota.ogNota}</p>` : ''}</div>
    </body></html>`)
    await pagina.evaluate(() => document.fonts.ready)
    const shot = await pagina.screenshot({ type: 'png' })
    await sharp(shot).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(PUBLIC, arquivo))
    console.log(`  ${arquivo}`)
  }
  await pagina.close()
}

console.log('Ícones:')
await icones()
await comNavegador(async (navegador) => {
  console.log('Artes de compartilhamento:')
  await artes(navegador)
})
