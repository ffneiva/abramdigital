import { describe, expect, it } from 'vitest'
import { ESTADOS, estado, FORMAS, TOTAL_ESTADOS } from '@/lib/estados'
import { GIRO_DA_FORMA, gerarFormas } from '@/scene/formas'

describe('formas da constelação', () => {
  const N = 4000
  const K = 120
  const formas = gerarFormas(N, K)

  it('toda forma tem n posições finitas, dentro de uma caixa razoável', () => {
    for (const id of FORMAS) {
      const f = formas[id]
      expect(f.length, id).toBe(N * 3)
      for (let i = 0; i < f.length; i++) {
        if (!Number.isFinite(f[i]) || Math.abs(f[i]) > 6) {
          expect.fail(`${id}[${i}] = ${f[i]}`)
        }
      }
    }
  })

  it('é determinística', () => {
    const outra = gerarFormas(N, K)
    for (const id of FORMAS) expect(outra[id]).toEqual(formas[id])
  })

  it('toda forma tem giro definido', () => {
    for (const id of FORMAS) expect(typeof GIRO_DA_FORMA[id]).toBe('number')
  })
})

describe('estados', () => {
  it('ids únicos, e o índice bate com a posição', () => {
    const ids = ESTADOS.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    ESTADOS.forEach((e, i) => {
      expect(estado(e.id)).toBe(i)
    })
    expect(TOTAL_ESTADOS).toBe(ESTADOS.length - 1)
  })

  it('a página começa e termina na marca', () => {
    expect(ESTADOS[0].forma).toBe('marca')
    expect(ESTADOS[ESTADOS.length - 1].forma).toBe('marca')
  })
})

describe('estadoDaRolagem', () => {
  /** Uma raiz falsa: marcadores com o centro em `c`. */
  const raiz = (pontos: { s: number; c: number }[]) =>
    ({
      querySelectorAll: () =>
        pontos.map((p) => ({
          dataset: { s: String(p.s) },
          getBoundingClientRect: () => ({ top: p.c - 10, height: 20 }),
        })),
    }) as unknown as ParentNode

  it('interpola entre os vizinhos e fica nas pontas fora deles', async () => {
    const { estadoDaRolagem } = await import('@/lib/estados')
    const r = raiz([
      { s: 0, c: 100 },
      { s: 1, c: 300 },
    ])
    expect(estadoDaRolagem(r, 50)).toBe(0)
    expect(estadoDaRolagem(r, 200)).toBeCloseTo(0.5)
    expect(estadoDaRolagem(r, 900)).toBe(1)
  })

  it('dois marcadores na mesma altura não produzem NaN', async () => {
    const { estadoDaRolagem } = await import('@/lib/estados')
    const r = raiz([
      { s: 5, c: 400 },
      { s: 6, c: 400 },
      { s: 7, c: 900 },
    ])
    expect(Number.isFinite(estadoDaRolagem(r, 400))).toBe(true)
  })
})
