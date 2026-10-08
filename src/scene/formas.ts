import type { IdForma } from '@/lib/estados'
import { FIOS, type IdPonto, NOS, PONTOS, QUADRO } from '@/lib/marca'

/**
 * As formas que as partículas desenham — geometria pura, sem three.js.
 *
 * Cada forma é um `Float32Array` de `n` posições (x, y, z). A partícula `i`
 * é a MESMA em todas as formas: é ela que voa da posição `i` de uma forma
 * para a posição `i` da seguinte. As primeiras `k` são as partículas
 * grandes (os "nós"), e cada forma as põe nos seus pontos importantes — os
 * nós da marca, os cantos do navegador, os pontos do gráfico. Assim o
 * desenho continua legível no meio do voo: os nós chegam juntos.
 *
 * Determinístico (gerador com semente): a mesma página desenha sempre a
 * mesma constelação.
 */

export type Vec3 = readonly [number, number, number]
type Segmento = readonly [Vec3, Vec3, number]

/** mulberry32 — pequeno, rápido e bom o bastante para espalhar pontos. */
export function aleatorio(semente: number) {
  let a = semente >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Rnd = () => number

/** Normal padrão (Box–Muller). */
const gauss = (r: Rnd) => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r())

/** Um ponto dentro de uma esfera de raio `raio`. */
function naEsfera(r: Rnd, raio: number): Vec3 {
  const u = r() * 2 - 1
  const t = r() * Math.PI * 2
  const s = Math.sqrt(1 - u * u)
  const d = raio * Math.cbrt(r())
  return [s * Math.cos(t) * d, s * Math.sin(t) * d, u * d]
}

/**
 * Distribui `qtd` pontos ao longo dos segmentos, proporcionalmente ao
 * comprimento × peso, com um tremor perpendicular de até `tremor`.
 */
function aoLongo(
  saida: Float32Array,
  inicio: number,
  qtd: number,
  segs: readonly Segmento[],
  r: Rnd,
  tremor = 0.006,
) {
  const pesos = segs.map(([a, b, p]) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) * p)
  const total = pesos.reduce((s, p) => s + p, 0)
  const acumulado: number[] = []
  let soma = 0
  for (const p of pesos) {
    soma += p / total
    acumulado.push(soma)
  }
  for (let i = 0; i < qtd; i++) {
    const x = r()
    let j = acumulado.findIndex((c) => c >= x)
    if (j < 0) j = segs.length - 1
    const [a, b] = segs[j]
    const t = r()
    const o = (inicio + i) * 3
    saida[o] = a[0] + (b[0] - a[0]) * t + gauss(r) * tremor
    saida[o + 1] = a[1] + (b[1] - a[1]) * t + gauss(r) * tremor
    saida[o + 2] = a[2] + (b[2] - a[2]) * t + gauss(r) * tremor
  }
}

function colocar(saida: Float32Array, i: number, p: Vec3) {
  saida[i * 3] = p[0]
  saida[i * 3 + 1] = p[1]
  saida[i * 3 + 2] = p[2]
}

/** Os `k` nós: cada partícula grande vai para um ponto-chave, ciclando, com tremor. */
function nos(saida: Float32Array, k: number, chaves: readonly Vec3[], r: Rnd, raio: number) {
  for (let i = 0; i < k; i++) {
    const c = chaves[i % chaves.length]
    const d = i < chaves.length ? [0, 0, 0] : naEsfera(r, raio)
    colocar(saida, i, [c[0] + d[0], c[1] + d[1], c[2] + d[2]])
  }
}

/* ── A marca ──────────────────────────────────────────────────────────── */

/** Escala do quadro da marca (720 de largura) para a cena (~3,6 de largura). */
export const ESCALA_MARCA = 3.6 / QUADRO.w

/**
 * A profundidade de cada ponto. A marca é plana; a escultura não: os fios
 * internos do "A" recuam, e os nós da rede se espalham em z, para a
 * constelação ter volume quando gira. O valor sai de um hash do nome, para
 * ser estável.
 */
function profundidade(id: IdPonto): number {
  if (id === 't2' || id === 't3') return -0.09
  if (id === 'pico2' || id === 'q2' || id === 'q3' || id === 'q4') return -0.16
  if (!id.startsWith('N')) return 0
  let h = 0
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return (((h % 1000) / 1000) * 2 - 1) * 0.32
}

/** Um ponto da marca já em coordenadas da cena (centro no meio, y para cima). */
export function pontoDaMarca(id: IdPonto): Vec3 {
  const [x, y] = PONTOS[id]
  return [(x - QUADRO.w / 2) * ESCALA_MARCA, -(y - QUADRO.h / 2) * ESCALA_MARCA, profundidade(id)]
}

function marca(n: number, k: number, r: Rnd): Float32Array {
  const s = new Float32Array(n * 3)
  const chaves = NOS.map(([id]) => pontoDaMarca(id))
  nos(s, k, chaves, r, 0.035)
  const segs: Segmento[] = FIOS.map(([a, b, g]) => [pontoDaMarca(a), pontoDaMarca(b), g ? 2.4 : 1])
  const resto = n - k
  const nosFios = Math.floor(resto * 0.8)
  aoLongo(s, k, nosFios, segs, r, 0.007)
  // A poeira que se desprende para cima e para a direita — o "estouro" do
  // logotipo, continuado.
  for (let i = k + nosFios; i < n; i++) {
    const longe = r() < 0.35
    const c: Vec3 = longe ? [0, 0, 0] : [1.1, 0.75, 0]
    const d = longe ? naEsfera(r, 3.2) : [gauss(r) * 0.55, gauss(r) * 0.4, gauss(r) * 0.35]
    colocar(s, i, [c[0] + d[0], c[1] + d[1], c[2] + d[2]])
  }
  return s
}

/* ── A galáxia ────────────────────────────────────────────────────────── */

/** Três braços em espiral no plano xz; a inclinação vem do estado. */
function galaxia(n: number, k: number, r: Rnd): Float32Array {
  const s = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const braco = i % 3
    const u = r()
    const raio = 0.15 + 2.9 * u ** 0.75
    const ang = (braco * Math.PI * 2) / 3 + raio * 1.7 + gauss(r) * (0.22 + 0.1 / (raio + 0.2))
    const espessura = 0.05 + 0.1 * (1 - raio / 3)
    colocar(s, i, [
      Math.cos(ang) * raio + gauss(r) * 0.06,
      gauss(r) * espessura,
      Math.sin(ang) * raio + gauss(r) * 0.06,
    ])
  }
  // O núcleo: os nós se juntam no centro, como o brilho de uma galáxia.
  for (let i = 0; i < Math.min(k, n); i += 2) colocar(s, i, naEsfera(r, 0.35))
  return s
}

/* ── O site ───────────────────────────────────────────────────────────── */

const retangulo = (x: number, y: number, w: number, h: number, z = 0, p = 1): Segmento[] => [
  [[x, y, z], [x + w, y, z], p],
  [[x + w, y, z], [x + w, y - h, z], p],
  [[x + w, y - h, z], [x, y - h, z], p],
  [[x, y - h, z], [x, y, z], p],
]

const linha = (x1: number, y1: number, x2: number, y2: number, z = 0, p = 1): Segmento => [
  [x1, y1, z],
  [x2, y2, z],
  p,
]

/** Uma janela de navegador com um site dentro, em camadas de profundidade. */
function site(n: number, k: number, r: Rnd): Float32Array {
  const s = new Float32Array(n * 3)
  const W = 3.3
  const H = 2.2
  const x0 = -W / 2
  const y0 = H / 2
  const segs: Segmento[] = [
    ...retangulo(x0, y0, W, H, 0, 1.6),
    linha(x0, y0 - 0.24, x0 + W, y0 - 0.24, 0, 1.2),
    // Barra de endereço.
    ...retangulo(x0 + 0.62, y0 - 0.06, 1.5, 0.12, 0, 0.6),
    // Título do herói (três linhas, a primeira mais longa) e o botão.
    linha(x0 + 0.25, y0 - 0.6, x0 + 1.75, y0 - 0.6, 0.12, 2.6),
    linha(x0 + 0.25, y0 - 0.78, x0 + 1.5, y0 - 0.78, 0.12, 2.6),
    linha(x0 + 0.25, y0 - 0.98, x0 + 1.25, y0 - 0.98, 0.12, 0.8),
    ...retangulo(x0 + 0.25, y0 - 1.12, 0.62, 0.17, 0.2, 1.8),
    // A imagem do herói, com a diagonal.
    ...retangulo(x0 + 2.0, y0 - 0.45, 1.05, 0.8, 0.08, 1),
    linha(x0 + 2.0, y0 - 1.25, x0 + 3.05, y0 - 0.45, 0.08, 0.5),
    // Três cartões, mais à frente.
    ...retangulo(x0 + 0.25, y0 - 1.48, 0.86, 0.55, 0.22, 0.9),
    ...retangulo(x0 + 1.22, y0 - 1.48, 0.86, 0.55, 0.22, 0.9),
    ...retangulo(x0 + 2.19, y0 - 1.48, 0.86, 0.55, 0.22, 0.9),
  ]
  const chaves: Vec3[] = [
    [x0 + 0.13, y0 - 0.12, 0],
    [x0 + 0.27, y0 - 0.12, 0],
    [x0 + 0.41, y0 - 0.12, 0],
    [x0, y0, 0],
    [x0 + W, y0, 0],
    [x0 + W, y0 - H, 0],
    [x0, y0 - H, 0],
    [x0 + 0.56, y0 - 1.2, 0.2],
  ]
  nos(s, k, chaves, r, 0.03)
  const resto = n - k
  const fios = Math.floor(resto * 0.86)
  aoLongo(s, k, fios, segs, r, 0.005)
  // Um véu de partículas na área da imagem: o "conteúdo" sendo desenhado.
  for (let i = k + fios; i < n; i++) {
    colocar(s, i, [x0 + 2.0 + r() * 1.05, y0 - 0.45 - r() * 0.8, 0.08 + gauss(r) * 0.03])
  }
  return s
}

/* ── O funil ──────────────────────────────────────────────────────────── */

/**
 * Um redemoinho: gente chegando de toda parte pelo alto, girando para dentro
 * do funil e saindo num feixe fino embaixo. O giro é do shader (o funil
 * "gira"); aqui só a forma.
 */
function funil(n: number, k: number, r: Rnd): Float32Array {
  const s = new Float32Array(n * 3)
  const nuvem = Math.floor(n * 0.14)
  const feixe = Math.floor(n * 0.05)
  for (let i = 0; i < n; i++) {
    if (i >= k && i < k + nuvem) {
      // A chegada: uma nuvem larga acima da boca.
      const a = r() * Math.PI * 2
      const raio = 1.2 + r() * 1.6
      colocar(s, i, [Math.cos(a) * raio, 1.45 + r() * 0.9, Math.sin(a) * raio])
    } else if (i >= k + nuvem && i < k + nuvem + feixe) {
      colocar(s, i, [gauss(r) * 0.02, -1.35 - r() * 0.75, gauss(r) * 0.02])
    } else {
      const h = i < k ? (i % 7) / 6 : r()
      const raio = 0.07 + 1.55 * h ** 1.7
      const a = r() * Math.PI * 2
      const t = i < k ? 0 : gauss(r) * 0.02
      colocar(s, i, [Math.cos(a) * (raio + t), -1.3 + 2.75 * h, Math.sin(a) * (raio + t)])
    }
  }
  return s
}

/* ── O gráfico ────────────────────────────────────────────────────────── */

/** A curva que sobe, as barras e o piso quadriculado da medição. */
const PONTOS_DO_GRAFICO = [-0.85, -0.62, -0.7, -0.3, -0.38, 0.08, 0.3, 0.82] as const

function grafico(n: number, k: number, r: Rnd): Float32Array {
  const s = new Float32Array(n * 3)
  const piso = -1.1
  const xs = PONTOS_DO_GRAFICO.map((_, i) => -1.6 + (3.2 * i) / (PONTOS_DO_GRAFICO.length - 1))
  const pts: Vec3[] = xs.map((x, i) => [x, PONTOS_DO_GRAFICO[i], 0.25])
  const segs: Segmento[] = []
  for (let i = 0; i < pts.length - 1; i++) segs.push([pts[i], pts[i + 1], 3])
  for (const p of pts) segs.push([[p[0], piso, 0.25], p, 0.7])
  for (let z = -0.6; z <= 0.61; z += 0.3) segs.push([[-1.8, piso, z], [1.8, piso, z], 0.35])
  for (let x = -1.8; x <= 1.81; x += 0.45) segs.push([[x, piso, -0.6], [x, piso, 0.6], 0.35])
  segs.push([[-1.8, piso, 0.25], [-1.8, 1.1, 0.25], 0.5])
  nos(s, k, pts, r, 0.04)
  aoLongo(s, k, n - k, segs, r, 0.005)
  return s
}

/* ── O anel ───────────────────────────────────────────────────────────── */

/** Dois anéis finos no plano xz — o fundo discreto do portfólio. */
function anel(n: number, k: number, r: Rnd): Float32Array {
  const s = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const dentro = r() < 0.3
    const raio = (dentro ? 1.75 : 2.7) + gauss(r) * (dentro ? 0.03 : 0.07)
    const a = r() * Math.PI * 2
    colocar(s, i, [Math.cos(a) * raio, gauss(r) * 0.025, Math.sin(a) * raio])
  }
  for (let i = 0; i < k; i += 3) {
    const a = (i / k) * Math.PI * 2
    colocar(s, i, [Math.cos(a) * 2.7, 0, Math.sin(a) * 2.7])
  }
  return s
}

const GERADORES: Record<IdForma, (n: number, k: number, r: Rnd) => Float32Array> = {
  marca,
  galaxia,
  site,
  funil,
  grafico,
  anel,
}

/** Todas as formas, para `n` partículas das quais `k` são nós. */
export function gerarFormas(n: number, k: number): Record<IdForma, Float32Array> {
  const saida = {} as Record<IdForma, Float32Array>
  let semente = 7
  for (const id of Object.keys(GERADORES) as IdForma[]) {
    saida[id] = GERADORES[id](n, k, aleatorio(semente++ * 7919))
  }
  return saida
}

/**
 * O giro de cada forma no shader (o redemoinho em torno do eixo y). Só as
 * formas "vivas" giram; o site e o gráfico ficam parados para serem lidos.
 */
export const GIRO_DA_FORMA: Record<IdForma, number> = {
  marca: 0,
  galaxia: 0.22,
  site: 0,
  funil: 1.1,
  grafico: 0,
  anel: 0.12,
}
