/**
 * Os estados da constelação ao longo da home — o contrato entre as seções
 * (que marcam a posição com `data-s`) e a cena (src/scene/constelacao.ts).
 *
 * Cada estado diz QUAL forma as partículas desenham e ONDE ela fica na tela.
 * A cena interpola entre dois estados vizinhos conforme a rolagem: as
 * partículas voam de uma forma para a outra, e a pose (posição, escala,
 * inclinação) acompanha.
 *
 * Importado pela cena e pelas seções; não toca em DOM além de
 * `estadoDaRolagem`, que recebe a raiz.
 */

export const FORMAS = ['marca', 'galaxia', 'site', 'funil', 'grafico', 'anel'] as const
export type IdForma = (typeof FORMAS)[number]

export type Estado = {
  id: string
  forma: IdForma
  /** Deslocamento horizontal no desktop (unidades da cena; ~±2 cabe na tela). */
  x: number
  y: number
  escala: number
  /** Inclinação (rad) em torno de x e de y. */
  rx: number
  ry: number
  /** Opacidade das partículas (0…1). No celular, as do meio da página caem a 45%. */
  op: number
}

export const ESTADOS = [
  { id: 'heroi', forma: 'marca', x: 1.35, y: 0.05, escala: 1.05, rx: 0, ry: -0.25, op: 1 },
  { id: 'manifesto', forma: 'galaxia', x: 0, y: -0.2, escala: 1.25, rx: 1.05, ry: 0, op: 0.75 },
  { id: 'site', forma: 'site', x: 1.45, y: 0, escala: 0.9, rx: 0.12, ry: -0.42, op: 1 },
  { id: 'trafego', forma: 'funil', x: 1.5, y: 0, escala: 0.95, rx: 0.2, ry: 0, op: 1 },
  { id: 'fatos', forma: 'grafico', x: 1.4, y: -0.05, escala: 0.9, rx: 0.18, ry: -0.5, op: 0.9 },
  { id: 'servicos', forma: 'galaxia', x: -1.6, y: 0, escala: 1.1, rx: 1.2, ry: 0.3, op: 0.5 },
  { id: 'trabalhos', forma: 'anel', x: 0, y: 0, escala: 1.25, rx: 1.25, ry: 0, op: 0.55 },
  { id: 'painel', forma: 'grafico', x: -2.3, y: -0.1, escala: 0.62, rx: 0.15, ry: 0.55, op: 0.85 },
  { id: 'metodo', forma: 'galaxia', x: 0, y: 0.3, escala: 1.4, rx: 1.3, ry: 0, op: 0.55 },
  { id: 'diagnostico', forma: 'site', x: -2.35, y: 0, escala: 0.55, rx: 0.1, ry: 0.5, op: 0.75 },
  { id: 'nao-fazemos', forma: 'funil', x: 1.6, y: 0, escala: 0.85, rx: 0.4, ry: 0, op: 0.6 },
  { id: 'nome', forma: 'galaxia', x: 0, y: 0.1, escala: 1.55, rx: 1.42, ry: 0, op: 0.75 },
  { id: 'duvidas', forma: 'anel', x: 0, y: 0, escala: 1.1, rx: 1.35, ry: 0, op: 0.4 },
  { id: 'fecho', forma: 'marca', x: 0, y: 1.32, escala: 0.7, rx: 0, ry: 0, op: 1 },
] as const satisfies readonly Estado[]

export type IdEstado = (typeof ESTADOS)[number]['id']

/** O índice do estado — o valor de `data-s` que a seção marca. */
export function estado(id: IdEstado): number {
  return ESTADOS.findIndex((e) => e.id === id)
}

export const TOTAL_ESTADOS = ESTADOS.length - 1

/**
 * O estado contínuo da cena a partir da rolagem: os marcadores `data-s` cujo
 * centro está acima e abaixo do meio da tela, interpolados. Antes do
 * primeiro, o primeiro; depois do último, o último.
 */
export function estadoDaRolagem(raiz: ParentNode, meio: number): number {
  const pontos = [...raiz.querySelectorAll<HTMLElement>('[data-s]')]
    .map((m) => {
      const r = m.getBoundingClientRect()
      return { s: Number(m.dataset.s), c: r.top + r.height / 2 }
    })
    .sort((a, b) => a.c - b.c)
  if (!pontos.length || meio <= pontos[0].c) return pontos[0]?.s ?? 0
  for (let i = 0; i < pontos.length - 1; i++) {
    const a = pontos[i]
    const b = pontos[i + 1]
    if (meio >= a.c && meio <= b.c) {
      // Dois marcadores na mesma altura (no pin de uma seção, por exemplo):
      // sem isto, 0/0 vira NaN e a cena inteira perde a pose.
      if (b.c - a.c < 1) return b.s
      return a.s + ((meio - a.c) / (b.c - a.c)) * (b.s - a.s)
    }
  }
  return pontos[pontos.length - 1].s
}
