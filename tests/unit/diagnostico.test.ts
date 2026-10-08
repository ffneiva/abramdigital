import { describe, expect, it } from 'vitest'
import { montarPlano, PERGUNTAS, type Respostas } from '@/lib/business'

/**
 * O diagnóstico tem 4 × 5 × 4 × 4 = 320 combinações. Todas são percorridas:
 * três exemplos escolhidos a dedo nunca pegariam o caso que ninguém pensou.
 */
function* combinacoes(): Generator<Respostas> {
  const [a, b, c, d] = PERGUNTAS
  for (const precisa of a.opcoes)
    for (const negocio of b.opcoes)
      for (const hoje of c.opcoes)
        for (const meta of d.opcoes)
          yield { precisa: precisa.id, negocio: negocio.id, hoje: hoje.id, meta: meta.id }
}

const todas = [...combinacoes()]

describe('diagnóstico', () => {
  it('tem 320 combinações', () => {
    expect(todas).toHaveLength(320)
  })

  it('toda combinação produz um plano completo, sem buraco', () => {
    for (const r of todas) {
      const p = montarPlano(r)
      const texto = JSON.stringify(p)
      expect(texto, JSON.stringify(r)).not.toMatch(/undefined|null|NaN/)
      expect(p.titulo.length).toBeGreaterThan(8)
      expect(p.passos.length).toBeGreaterThanOrEqual(3)
      expect(new Set(p.passos).size).toBe(p.passos.length)
      expect(p.nota.length).toBeGreaterThan(40)
    }
  })

  it('a mensagem leva as quatro respostas, por extenso', () => {
    for (const r of todas) {
      const m = montarPlano(r).mensagem
      for (const q of PERGUNTAS) {
        const rotulo = q.opcoes.find((o) => o.id === r[q.id])?.rotulo ?? '?'
        expect(m).toContain(rotulo)
      }
    }
  })

  it('nenhum plano promete número, prazo ou posição', () => {
    for (const r of todas) {
      const texto = JSON.stringify(montarPlano(r))
      expect(texto).not.toMatch(/R\$|\d+ ?%|em \d+ dias|primeir[ao] (lugar|página)|garant/i)
    }
  })

  it('quem só quer tráfego não recebe um plano de site, e vice-versa', () => {
    for (const r of todas) {
      const passos = montarPlano(r).passos.join(' ')
      if (r.precisa === 'trafego') expect(passos).toContain('página que vai receber os anúncios')
      if (r.precisa === 'site-novo' || r.precisa === 'refazer')
        expect(passos).toContain('pronto para anúncio')
    }
  })
})
