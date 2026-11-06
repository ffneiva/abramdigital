/**
 * Google Analytics / Ads — carregado só se houver ID configurado.
 *
 * O ID entra por variável de ambiente (`VITE_GTAG_ID`), não pelo código: o
 * repositório é público, e um ID de medição no fonte é o tipo de coisa que
 * alguém cola no próprio site sem querer, poluindo o relatório.
 *
 * O bootstrap mora no bundle, e não num `<script>` inline: assim a CSP não
 * precisa de `'unsafe-inline'` em `script-src`.
 */
const GTAG_ID = import.meta.env.VITE_GTAG_ID as string | undefined

type Gtag = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: Gtag
  }
}

let carregado = false

/**
 * Pixel da Meta (Instagram e Facebook Ads). Mesmo princípio do GA: o ID vem
 * de `VITE_META_PIXEL_ID`, e o carregador oficial é reproduzido aqui, no
 * bundle, em vez do `<script>` inline do snippet (CSP sem 'unsafe-inline').
 */
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  loaded: boolean
  version: string
  push: Fbq
}

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

let ultimaPagina = ''

function paginaVista(): void {
  const atual = window.location.pathname
  if (!window.fbq || atual === ultimaPagina) return
  ultimaPagina = atual
  window.fbq('track', 'PageView')
}

export function iniciarPixel(): void {
  if (!PIXEL_ID || window.fbq || typeof document === 'undefined') return
  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue.push(args)
  }) as Fbq
  fbq.queue = []
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.push = fbq
  window.fbq = fbq
  window._fbq = fbq
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)
  fbq('init', PIXEL_ID)
  paginaVista()
}

export function iniciarAnalytics(): void {
  iniciarPixel()
  if (!GTAG_ID || carregado || typeof document === 'undefined') return
  carregado = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  const gtag: Gtag = (...args) => {
    window.dataLayer?.push(args)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', GTAG_ID, { anonymize_ip: true })
}

/**
 * Eventos que indicam intenção real — a lista é curta de propósito. Medir
 * tudo produz um relatório onde nada se destaca.
 */
type Evento =
  | 'contato_clique'
  | 'servico_clique'
  | 'diagnostico_resposta'
  | 'instagram_clique'
  | 'rota_mudou'

export function registrar(evento: Evento, dados?: Record<string, unknown>): void {
  window.gtag?.('event', evento, dados)
  // Pixel da Meta: a visita a cada página e o clique de contato (WhatsApp),
  // que é a conversão das campanhas.
  if (evento === 'rota_mudou') paginaVista()
  if (evento === 'contato_clique') window.fbq?.('track', 'Contact', dados)
}

/** O clique em "pedir orçamento" é a conversão do site. */
export function registrarContato(origem: string): void {
  registrar('contato_clique', { origem })
}
