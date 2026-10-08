import { describe, expect, it } from 'vitest'
import { FIOS, NOS, PONTOS, QUADRO, simboloSvg } from '@/lib/marca'

/** O símbolo é um grafo: estes testes impedem um fio solto ou fora do quadro. */
describe('marca', () => {
  it('todo ponto cabe no quadro', () => {
    for (const [id, [x, y]] of Object.entries(PONTOS)) {
      expect(x, id).toBeGreaterThanOrEqual(0)
      expect(x, id).toBeLessThanOrEqual(QUADRO.w)
      expect(y, id).toBeGreaterThanOrEqual(0)
      expect(y, id).toBeLessThanOrEqual(QUADRO.h)
    }
  })

  it('todo fio liga dois pontos diferentes, e nenhum fio se repete', () => {
    const vistos = new Set<string>()
    for (const [a, b] of FIOS) {
      expect(a).not.toBe(b)
      const chave = [a, b].sort().join('-')
      expect(vistos.has(chave), chave).toBe(false)
      vistos.add(chave)
    }
  })

  it('todo nó é um ponto da rede (N*) e tem raio positivo', () => {
    for (const [id, r] of NOS) {
      expect(id.startsWith('N')).toBe(true)
      expect(r).toBeGreaterThan(0)
    }
  })

  it('o SVG tem um <line> por fio e um <circle> por nó', () => {
    const svg = simboloSvg()
    expect(svg.match(/<line /g)).toHaveLength(FIOS.length)
    expect(svg.match(/<circle /g)).toHaveLength(NOS.length)
  })
})
