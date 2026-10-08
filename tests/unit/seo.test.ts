import { describe, expect, it } from 'vitest'
import * as conteudo from '@/lib/business'
import {
  EMPRESA,
  FAQ,
  FATOS,
  linkContato,
  SITE_URL,
  TRABALHOS,
  TRABALHOS_PUBLICADOS,
} from '@/lib/business'
import { canonicalDe, NAO_ENCONTRADA, ogArquivoDe, ROTAS, rotaDe } from '@/lib/routes'
import { gerarJsonLd, gerarLlmsTxt } from '@/lib/seo'

/** Todo texto do site, junto, para as varreduras de conteúdo. */
const TUDO = JSON.stringify(conteudo)

type No = Record<string, unknown>
const grafo = (path: string) => gerarJsonLd(path)['@graph'] as No[]

describe('rotas', () => {
  it('reconhecem o caminho com e sem barra, e em qualquer caixa', () => {
    expect(rotaDe('/politica-de-privacidade').path).toBe('/politica-de-privacidade')
    expect(rotaDe('/politica-de-privacidade/').path).toBe('/politica-de-privacidade')
    expect(rotaDe('/Politica-De-Privacidade/').path).toBe('/politica-de-privacidade')
    expect(rotaDe('/').path).toBe('/')
    expect(rotaDe('/nao-existe')).toBe(NAO_ENCONTRADA)
  })

  it('têm canonical absoluta, com barra final (o endereço que o S3 serve sem 302)', () => {
    for (const r of ROTAS) {
      const c = canonicalDe(r)
      expect(c.startsWith(`${SITE_URL}/`)).toBe(true)
      expect(c.endsWith('/')).toBe(true)
    }
  })

  it('têm título e descrição próprios, sem repetir', () => {
    const titulos = ROTAS.map((r) => r.titulo)
    expect(new Set(titulos).size).toBe(titulos.length)
    for (const r of ROTAS) {
      expect(r.titulo.length).toBeLessThanOrEqual(65)
      expect(r.descricao.length).toBeGreaterThan(80)
      expect(r.descricao.length).toBeLessThanOrEqual(170)
    }
  })

  it('a home usa og.jpg', () => {
    expect(ogArquivoDe(ROTAS[0])).toBe('og.jpg')
  })
})

describe('JSON-LD', () => {
  it('a empresa aparece em toda rota; FAQ só onde há perguntas na página', () => {
    for (const r of ROTAS) {
      const g = grafo(r.path)
      expect(g[0]['@type']).toBe('ProfessionalService')
      expect(g.some((n) => n['@type'] === 'FAQPage')).toBe(r.path === '/' || Boolean(r.pagina))
    }
  })

  it('o FAQ do JSON-LD é exatamente o FAQ da página', () => {
    const faq = grafo('/').find((n) => n['@type'] === 'FAQPage') as {
      mainEntity: { name: string }[]
    }
    expect(faq.mainEntity.map((q) => q.name)).toEqual(FAQ.map((p) => p.pergunta))
  })

  it('não declara nota, avaliação nem preço', () => {
    const json = JSON.stringify(gerarJsonLd('/'))
    for (const proibido of ['aggregateRating', 'review', 'priceRange', '"price"']) {
      expect(json).not.toContain(proibido)
    }
  })

  it('internas levam a trilha de navegação', () => {
    expect(grafo('/politica-de-privacidade').some((n) => n['@type'] === 'BreadcrumbList')).toBe(
      true,
    )
  })
})

describe('conteúdo', () => {
  it('nenhum preço', () => {
    expect(TUDO).not.toMatch(/R\$\s?\d/)
  })

  it('nenhuma promessa de resultado ou prova social inventada', () => {
    for (const termo of [
      /garantimos (resultado|vendas|primeiro)/i,
      /\+\s?\d+\s?(clientes|empresas|projetos)/i,
      /ROI de \d/i,
      /100%/,
    ]) {
      expect(TUDO).not.toMatch(termo)
    }
  })

  it('todo fato tem fonte com link https', () => {
    for (const f of FATOS) {
      expect(f.fonte.length).toBeGreaterThan(5)
      expect(f.url).toMatch(/^https:\/\//)
    }
  })

  it('trabalho com link aponta para o domínio do cliente, não para endereço provisório', () => {
    for (const t of TRABALHOS) {
      if (t.url) expect(t.url).not.toMatch(/cloudfront|amazonaws|s3-website/)
    }
    expect(TRABALHOS_PUBLICADOS.every((t) => t.publicar)).toBe(true)
  })

  it('o WhatsApp abre com a mensagem escrita', () => {
    const url = new URL(linkContato('Olá, Abram!'))
    expect(url.host).toBe('wa.me')
    expect(url.pathname).toBe(`/${EMPRESA.whatsapp}`)
    expect(url.searchParams.get('text')).toBe('Olá, Abram!')
  })
})

describe('llms.txt', () => {
  it('traz contato, serviços e o FAQ inteiro', () => {
    const txt = gerarLlmsTxt()
    expect(txt).toContain(EMPRESA.telefone)
    for (const p of FAQ) expect(txt).toContain(p.pergunta)
    expect(txt).not.toContain('undefined')
  })
})

describe('páginas de serviço', () => {
  it('cada uma vira rota com HTML, título e descrição próprios', async () => {
    const { PAGINAS } = await import('@/lib/paginas')
    for (const p of PAGINAS) {
      const rota = ROTAS.find((r) => r.pagina === p.slug)
      expect(rota?.path).toBe(`/servicos/${p.slug}`)
      expect(canonicalDe(rota!)).toBe(`${SITE_URL}/servicos/${p.slug}/`)
      expect(p.perguntas.length).toBeGreaterThanOrEqual(3)
      expect(p.quando.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('o JSON-LD da página traz o serviço, as perguntas dela e a trilha em três níveis', async () => {
    const { PAGINAS } = await import('@/lib/paginas')
    for (const p of PAGINAS) {
      const g = grafo(`/servicos/${p.slug}`)
      expect(g.some((n) => n['@type'] === 'Service' && n.name === p.h1)).toBe(true)
      const faq = g.find((n) => n['@type'] === 'FAQPage') as { mainEntity: unknown[] }
      expect(faq.mainEntity).toHaveLength(p.perguntas.length)
      const trilha = g.find((n) => n['@type'] === 'BreadcrumbList') as {
        itemListElement: unknown[]
      }
      expect(trilha.itemListElement).toHaveLength(3)
    }
  })

  it('nenhuma página promete preço, prazo ou posição', async () => {
    const { PAGINAS } = await import('@/lib/paginas')
    const texto = JSON.stringify(PAGINAS)
    expect(texto).not.toMatch(/R\$\s?\d|em \d+ dias|garantimos|primeir[ao] (lugar|página)|100%/i)
  })

  it('toda página tem o site (WebSite) no grafo', () => {
    for (const r of ROTAS) expect(grafo(r.path).some((n) => n['@type'] === 'WebSite')).toBe(true)
  })
})
