import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { EMPRESA, INDEXAVEL, linkContato, SITE_URL } from './src/lib/business.ts'
import { canonicalDe, NAO_ENCONTRADA, ogArquivoDe, ogUrlDe, ROTAS } from './src/lib/routes.ts'
import { gerarJsonLd, gerarLlmsFullTxt, gerarLlmsTxt } from './src/lib/seo.ts'

/**
 * Diretiva de robôs.
 *
 * Enquanto o site vive no subdomínio de apresentação, ele fica FORA do índice
 * do Google (`INDEXAVEL` em business.ts). Não é timidez: um endereço que não é
 * da marca, indexado com os telefones e preços dela, competiria na busca com
 * o domínio definitivo quando ele existir — e a cópia antiga continuaria
 * aparecendo por meses. Virar a chave é uma linha.
 */
const ROBOTS_INDEX = 'index, follow, max-snippet:-1, max-image-preview:large'
const robotsDe = (noindex?: boolean) => (!INDEXAVEL || noindex ? 'noindex, follow' : ROBOTS_INDEX)

function escapar(valor: string): string {
  return valor
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Versão por conteúdo para os arquivos de marca: `favicon.svg?v=3f9a1c2e`.
 *
 * Favicon, ícones, manifesto e arte de compartilhamento têm nome fixo — o
 * navegador procura /favicon.ico e o robô do WhatsApp guarda a URL do
 * og:image. Sem versão no endereço, trocar a arte não tem efeito: foi o que
 * aconteceu quando a marca mudou, e quem já tinha aberto o site continuou
 * vendo o favicon antigo. O hash muda só quando o arquivo muda.
 */
function versao(arquivo: string): string {
  const caminho = path.resolve(import.meta.dirname, 'public', arquivo)
  if (!existsSync(caminho)) return '0'
  return createHash('sha1').update(readFileSync(caminho)).digest('hex').slice(0, 8)
}

const ARQUIVOS_DE_MARCA = [
  'favicon.svg',
  'favicon-32.png',
  'apple-touch-icon.png',
  'site.webmanifest',
] as const

/**
 * Reescreve o `<head>` do index.html para uma rota.
 *
 * É o mesmo trabalho para a home (no `transformIndexHtml`) e para as demais
 * rotas (no `generateBundle`) — uma função só impede que as duas divirjam.
 */
/**
 * O conteúdo do <noscript>, a partir de business.ts — endereço e contatos
 * escritos à mão no index.html envelheceriam sem ninguém notar.
 */
function noscript(): string {
  const estilo = 'color: #d6b46a'
  return `<noscript>
      <div style="padding: 3rem 1.5rem; font-family: Arial, sans-serif; color: #f3ede2; background: #070605">
        <p style="font-size: 1.8rem; margin: 0 0 1rem; font-weight: 700">${escapar(EMPRESA.nome)}</p>
        <p>${escapar(EMPRESA.lema)} ${escapar(EMPRESA.descricao)}</p>
        <p>
          <a href="${escapar(linkContato())}" style="${estilo}">Conversar no WhatsApp</a> ·
          WhatsApp ${escapar(EMPRESA.telefone)}
        </p>
      </div>
    </noscript>`
}

function headDaRota(html: string, rota: (typeof ROTAS)[number]): string {
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, noscript())
  const titulo = escapar(rota.titulo)
  const descricao = escapar(rota.descricao)
  const canonica = canonicalDe(rota)
  const og = `${ogUrlDe(rota)}?v=${versao(ogArquivoDe(rota))}`
  for (const arquivo of ARQUIVOS_DE_MARCA) {
    html = html.replaceAll(`href="/${arquivo}"`, `href="/${arquivo}?v=${versao(arquivo)}"`)
  }
  const alt = escapar(rota.og ? rota.og.join(' ') : rota.titulo)

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${titulo}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${descricao}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonica}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${titulo}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${descricao}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonica}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${og}$2`)
    .replace(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${alt}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${titulo}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${descricao}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${og}$2`)
    .replace(/(<meta name="robots" content=")[^"]*(")/, `$1${robotsDe(rota.noindex)}$2`)
    .replace(
      /(<script type="application\/ld\+json">)[\s\S]*?(<\/script>)/,
      `$1${JSON.stringify(gerarJsonLd(rota.path))}$2`,
    )
}

/**
 * Injeta o JSON-LD e acerta o `<head>` da home.
 *
 * O schema sai de business.ts — a mesma fonte da página —, então telefone,
 * horário e endereço não têm como divergir entre o que o visitante lê e o que
 * o Google indexa. E chega estático no HTML, sem depender de o robô executar
 * JavaScript.
 */
function headPlugin(): Plugin {
  return {
    name: 'abram-head',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const comScript = html.replace(
          '</head>',
          '    <script type="application/ld+json"></script>\n  </head>',
        )
        return headDaRota(comScript, ROTAS[0])
      },
    },
  }
}

/**
 * Um HTML estático por rota, a partir do index.html já construído.
 *
 * Sem isto, /politica-de-privacidade seria servidos com o `<head>`
 * da home: mesmo título, mesma prévia no WhatsApp, mesma canonical. O app
 * continua sendo uma SPA — mesmo bundle, mesmo CSS —, só o `<head>` muda por
 * arquivo. O S3 serve `/rota/` como `/rota/index.html` (IndexDocument).
 */
function rotasEstaticasPlugin(): Plugin {
  return {
    name: 'abram-rotas-estaticas',
    apply: 'build',
    enforce: 'post',
    generateBundle(_opcoes, bundle) {
      const index = bundle['index.html']
      if (index?.type !== 'asset') return
      const base = String(index.source)

      for (const rota of [...ROTAS, NAO_ENCONTRADA]) {
        if (rota.path === '/') continue
        this.emitFile({
          type: 'asset',
          fileName:
            rota.path === '/404' ? '404.html' : `${rota.path.replace(/^\//, '')}/index.html`,
          source: headDaRota(base, rota),
        })
      }
    },
  }
}

/**
 * Data do último commit — o `lastmod` do sitemap.
 *
 * Não o relógio do build: um redeploy sem mudança nenhuma marcaria todas as
 * páginas como alteradas hoje, e um sitemap que diz isso toda semana é um
 * sitemap que o Google aprende a ignorar.
 */
function dataDoUltimoCommit(): string {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cI'], { encoding: 'utf8' })
      .trim()
      .slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

/** sitemap.xml, robots.txt e llms.txt — gerados, nunca escritos à mão. */
function seoPlugin(): Plugin {
  return {
    name: 'abram-seo',
    apply: 'build',
    generateBundle() {
      const lastmod = dataDoUltimoCommit()
      const urls = ROTAS.filter((r) => !r.noindex)
        .map(
          (r) =>
            `  <url>\n    <loc>${canonicalDe(r)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
        )
        .join('\n')

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })

      // O robots.txt acompanha a chave INDEXAVEL. Com ela desligada, o
      // `Disallow` não é o mecanismo que tira a página do índice — isso é o
      // `noindex` do HTML, que o robô só lê se puder rastrear. Por isso o
      // rastreio fica liberado nos dois casos, e só a indicação do sitemap
      // some (o arquivo continua sendo gerado, pronto para quando a chave
      // virar).
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: INDEXAVEL
          ? `User-agent: *\nAllow: /\n\n# Assistentes de IA: liberados (resumo em ${SITE_URL}/llms.txt)\nUser-agent: GPTBot\nUser-agent: OAI-SearchBot\nUser-agent: ChatGPT-User\nUser-agent: ClaudeBot\nUser-agent: Claude-SearchBot\nUser-agent: PerplexityBot\nUser-agent: Google-Extended\nUser-agent: Applebot-Extended\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
          : 'User-agent: *\nAllow: /\n',
      })

      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: gerarLlmsTxt() })
      this.emitFile({ type: 'asset', fileName: 'llms-full.txt', source: gerarLlmsFullTxt() })
    },
  }
}

/**
 * O `vite preview` imitando o S3 (static website hosting).
 *
 * Sem isto, o preview faz fallback de SPA: /politica-de-privacidade/ devolve
 * o index.html da HOME, e os testes de ponta a ponta mediriam um site que não
 * é o que vai ao ar. Aqui a regra é a do S3: `/rota/` serve
 * `/rota/index.html`; `/rota` (sem barra) responde 302 para `/rota/`; o que não
 * existe responde o 404.html com status 404 de verdade.
 */
function previewComoOS3Plugin(): Plugin {
  return {
    name: 'abram-preview-s3',
    configurePreviewServer(servidor) {
      const dist = path.resolve(import.meta.dirname, 'dist')
      servidor.middlewares.use((req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://x')
        const caminho = url.pathname
        if (caminho === '/' || path.extname(caminho)) return next()
        const semBarra = caminho.replace(/\/+$/, '')
        const arquivo = path.join(dist, semBarra, 'index.html')
        if (existsSync(arquivo)) {
          if (!caminho.endsWith('/')) {
            res.statusCode = 302
            res.setHeader('Location', `${semBarra}/${url.search}`)
            res.end()
            return
          }
          req.url = `${semBarra}/index.html${url.search}`
          return next()
        }
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(readFileSync(path.join(dist, '404.html')))
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    headPlugin(),
    rotasEstaticasPlugin(),
    seoPlugin(),
    previewComoOS3Plugin(),
  ],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    // Os chunks grandes (three.js e GSAP) são carregados sob demanda, depois
    // que a página já está interativa.
    chunkSizeWarningLimit: 800,
  },
})
