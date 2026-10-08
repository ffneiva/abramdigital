/**
 * A marca da Abram Digital em vetor.
 *
 * O símbolo chegou como imagem (o "A" dourado em fios finos que se desfaz
 * numa rede de nós). Para virar SVG, favicon, abertura e escultura 3D, ele
 * foi retraçado à mão sobre uma grade, ponto a ponto, a partir do arquivo
 * original — e conferido por sobreposição. O resultado é um GRAFO: pontos,
 * fios entre eles (grossos no contorno da letra, finos na rede) e nós (as
 * esferas). Tudo o que desenha a marca lê daqui:
 *
 *   · components/Logo.tsx e a abertura — o SVG;
 *   · scripts/make-brand.mjs — favicon, ícones e artes de compartilhamento;
 *   · scene/constelacao.ts — a escultura de ouro e as partículas.
 *
 * Quadro de 720 × 610, origem no canto de cima à esquerda, y para baixo.
 */

export const QUADRO = { w: 720, h: 610 } as const

/** Os pontos do desenho. `N*` são os nós da rede; o resto, vértices dos fios. */
export const PONTOS = {
  topo: [294, 9],
  be: [10, 597],
  bi: [122, 597],
  t2: [290, 25],
  t3: [293, 37],
  pico2: [294, 87],
  pico3: [294, 207],
  q2: [210, 340],
  q3: [370, 297],
  q4: [387, 287],
  cd: [416, 275],
  J: [205, 397],
  C: [352, 347],
  N1: [530, 140],
  N2: [680, 97],
  N3: [601, 70],
  N4: [461, 145],
  N5: [438, 193],
  N6: [566, 197],
  N7: [618, 220],
  N8a: [687, 207],
  N8b: [704, 206],
  N9: [511, 247],
  N10: [450, 276],
  N11: [388, 305],
  N12: [676, 289],
  N13: [616, 302],
  N14: [519, 325],
  N15: [578, 333],
  N16: [643, 342],
  N17: [416, 370],
  N18: [575, 392],
  N19: [417, 419],
  N20: [322, 460],
  N21: [256, 390],
  N22: [258, 440],
  N23: [151, 419],
  N24: [127, 482],
  N25: [175, 487],
  pd1: [475, 375],
  pd2: [570, 602],
  pd3: [460, 602],
  pd4: [390, 433],
  pd5: [470, 395],
  pd6: [465, 597],
  pd7: [555, 593],
  pd8: [398, 447],
  s10: [412, 309],
  s14: [462, 346],
  pd9: [472, 404],
} as const satisfies Record<string, readonly [number, number]>

export type IdPonto = keyof typeof PONTOS

/** Os fios: de, para e 1 se é traço grosso (o contorno da letra). */
export const FIOS: readonly (readonly [IdPonto, IdPonto, 0 | 1])[] = [
  ['topo', 'be', 1],
  ['be', 'bi', 1],
  ['topo', 'cd', 1],
  ['pd1', 'pd2', 1],
  ['pd3', 'pd2', 1],
  ['pd4', 'pd3', 1],
  ['N20', 'pd4', 1],
  ['bi', 'N25', 1],
  ['N25', 'J', 1],
  ['J', 'pico3', 1],
  ['pico3', 'C', 1],
  ['J', 'N21', 1],
  ['N21', 'C', 1],
  ['t2', 'N23', 0],
  ['t3', 'J', 0],
  ['pico2', 'q2', 0],
  ['pico2', 'q3', 0],
  ['t2', 'q4', 0],
  ['N1', 'N2', 0],
  ['N1', 'N6', 0],
  ['N1', 'N9', 0],
  ['N2', 'N6', 0],
  ['N2', 'N7', 0],
  ['N6', 'N9', 0],
  ['N9', 'N7', 0],
  ['N7', 'N12', 0],
  ['N12', 'N13', 0],
  ['N9', 'N13', 0],
  ['N5', 'N9', 0],
  ['N5', 'N10', 0],
  ['N5', 'N11', 0],
  ['N10', 'N9', 0],
  ['N10', 's10', 0],
  ['N9', 'N14', 0],
  ['N14', 's14', 0],
  ['N9', 'N17', 0],
  ['N14', 'N18', 0],
  ['N15', 'N18', 0],
  ['N18', 'pd1', 0],
  ['N17', 'N11', 0],
  ['N17', 'N19', 0],
  ['N11', 'N20', 0],
  ['N17', 'N20', 0],
  ['N19', 'pd7', 0],
  ['pd8', 'pd7', 0],
  ['pd5', 'pd6', 0],
  ['N17', 'pd9', 0],
  ['N14', 'N19', 0],
  ['J', 'N22', 0],
  ['N21', 'N20', 0],
  ['N22', 'N20', 0],
  ['N22', 'N25', 0],
  ['N22', 'C', 0],
  ['N20', 'N25', 0],
  ['be', 'N23', 0],
  ['be', 'J', 0],
  ['be', 'N25', 0],
  ['be', 'N22', 0],
  ['N23', 'N24', 0],
  ['N23', 'N25', 0],
  ['N23', 'J', 0],
  ['N24', 'N25', 0],
  ['N24', 'bi', 0],
  ['N24', 'J', 0],
  ['N25', 'N21', 0],
]

/** Os nós da rede e o raio de cada um, nas unidades do quadro. */
export const NOS: readonly (readonly [IdPonto, number])[] = [
  ['N1', 13],
  ['N2', 14],
  ['N3', 7],
  ['N4', 6],
  ['N5', 8],
  ['N6', 8.5],
  ['N7', 8.5],
  ['N8a', 9],
  ['N8b', 9],
  ['N9', 5],
  ['N10', 9],
  ['N11', 9],
  ['N12', 7],
  ['N13', 10],
  ['N14', 10],
  ['N15', 4],
  ['N16', 6],
  ['N17', 13],
  ['N18', 10],
  ['N19', 9],
  ['N20', 11],
  ['N21', 11],
  ['N22', 11.5],
  ['N23', 10],
  ['N24', 11.5],
  ['N25', 12],
]

/** Espessura dos traços nas unidades do quadro. */
export const TRACO = { grosso: 5.5, fino: 2.6 } as const

/** O nome: "ABRAM" pesado, "DIGITAL" leve — como no logotipo original. */
export const NOME = { forte: 'Abram', leve: 'Digital' } as const

/**
 * A paleta — os mesmos valores do `@theme` em index.css, para quem não lê
 * CSS (cena 3D, gerador de ícones).
 */
export const CORES = {
  noite: '#070605',
  carvao: '#0e0c0a',
  carvao2: '#16130f',
  borda: '#2a251d',
  areia: '#a39a8a',
  marfim: '#f3ede2',
  ouro: '#d6b46a',
  ouroClaro: '#f3dc9b',
  ouroEscuro: '#8a6a2e',
} as const

/** As paradas do degradê de ouro (claro → escuro → claro), do SVG à cena. */
export const DEGRADE_OURO = [
  [0, '#f6e2a6'],
  [0.38, '#d2a952'],
  [0.7, '#8f6b2c'],
  [1, '#e7c67c'],
] as const

const f = (n: number) => Number(n.toFixed(1))

/**
 * O símbolo em SVG (só o miolo — os `<line>` e `<circle>`), numa cor ou
 * num `url(#id)` de degradê. `escala` engrossa os traços para tamanhos
 * pequenos (no favicon, o fio fino de 2,6 some).
 */
function desenhoSvg(cor: string, escala = 1): string {
  const linhas = FIOS.map(([a, b, g]) => {
    const [x1, y1] = PONTOS[a]
    const [x2, y2] = PONTOS[b]
    const w = (g ? TRACO.grosso : TRACO.fino) * escala
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${f(w)}"/>`
  }).join('')
  const nos = NOS.map(([p, r]) => {
    const [x, y] = PONTOS[p]
    return `<circle cx="${x}" cy="${y}" r="${f(r * Math.min(1.4, 0.75 + escala * 0.25))}"/>`
  }).join('')
  return `<g stroke="${cor}" stroke-linecap="round" fill="none">${linhas}</g><g fill="${cor}">${nos}</g>`
}

/** Um `<linearGradient>` de ouro com o id dado, para usar com `desenhoSvg('url(#id)')`. */
function degradeSvg(id: string): string {
  const paradas = DEGRADE_OURO.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">${paradas}</linearGradient>`
}

/** O símbolo inteiro, autônomo, em ouro. */
export function simboloSvg({ escala = 1, margem = 12 } = {}): string {
  const m = margem
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-m} ${-m} ${QUADRO.w + m * 2} ${QUADRO.h + m * 2}"><defs>${degradeSvg('o')}</defs>${desenhoSvg('url(#o)', escala)}</svg>`
}
