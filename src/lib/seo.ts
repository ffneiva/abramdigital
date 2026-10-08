import {
  EMPRESA,
  ETAPAS,
  FAQ,
  FATOS,
  linkContato,
  METADES,
  NAO_FAZEMOS,
  NOME_SIGNIFICADO,
  SERVICOS,
  SITE_URL,
  TRABALHOS_PUBLICADOS,
} from './business.ts'
import { PAGINAS } from './paginas.ts'
import { canonicalDe, ROTAS } from './routes.ts'

/**
 * Dados estruturados (JSON-LD) e llms.txt — ambos derivados de business.ts.
 *
 * A Abram é uma `ProfessionalService` com sede em Goiânia e atendimento
 * para o Brasil inteiro (por WhatsApp): o endereço é só a cidade.
 * Três ausências deliberadas:
 *
 *   · sem `aggregateRating`: nota autodeclarada o Google não mostra e pode
 *     punir;
 *   · sem `priceRange` nem `offers` com preço: o valor sai na proposta;
 *   · sem `review`: depoimento só entra quando for real e autorizado.
 */
const ID = `${SITE_URL}/#abram`

function noDaEmpresa() {
  const sameAs = [
    ...(EMPRESA.instagram ? [`https://www.instagram.com/${EMPRESA.instagram}/`] : []),
    ...(EMPRESA.google ? [EMPRESA.google] : []),
  ]
  return {
    '@type': 'ProfessionalService',
    '@id': ID,
    name: EMPRESA.nome,
    slogan: EMPRESA.lema,
    description: EMPRESA.descricao,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/icon-512.png`,
    image: `${SITE_URL}/og.jpg`,
    telephone: `+${EMPRESA.whatsapp}`,
    ...(EMPRESA.email ? { email: EMPRESA.email } : {}),
    ...(EMPRESA.cidade
      ? {
          areaServed: 'BR',
          address: {
            '@type': 'PostalAddress',
            addressLocality: EMPRESA.cidade,
            addressRegion: EMPRESA.uf,
            addressCountry: 'BR',
          },
        }
      : { areaServed: 'BR' }),
    knowsAbout: [
      'Criação de sites',
      'Landing pages',
      'Google Ads',
      'Meta Ads',
      'Tráfego pago',
      'SEO técnico',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços',
      itemListElement: SERVICOS.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.nome, description: s.detalhe },
      })),
    },
    potentialAction: {
      '@type': 'CommunicateAction',
      target: linkContato(),
      name: 'Conversar no WhatsApp',
    },
    ...(sameAs.length ? { sameAs } : {}),
  }
}

/** O site em si: nome, idioma e quem publica — o que o Google usa no nome do resultado. */
function noDoSite() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#site`,
    url: `${SITE_URL}/`,
    name: EMPRESA.nome,
    alternateName: 'Abram',
    inLanguage: 'pt-BR',
    publisher: { '@id': ID },
  }
}

function faq(itens: readonly { pergunta: string; resposta: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: itens.map((p) => ({
      '@type': 'Question',
      name: p.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: p.resposta },
    })),
  }
}

/** Página de serviço: o serviço, quem oferece, onde — e as perguntas dela. */
function noDoServico(slug: string) {
  const p = PAGINAS.find((x) => x.slug === slug)
  if (!p) return []
  const url = `${SITE_URL}/servicos/${p.slug}/`
  return [
    {
      '@type': 'Service',
      '@id': `${url}#servico`,
      name: p.h1,
      serviceType: p.nome,
      description: p.resumo,
      url,
      provider: { '@id': ID },
      areaServed: [
        { '@type': 'City', name: 'Goiânia' },
        { '@type': 'Country', name: 'Brasil' },
      ],
      potentialAction: {
        '@type': 'CommunicateAction',
        target: linkContato(p.mensagem),
        name: 'Conversar no WhatsApp',
      },
    },
    faq(p.perguntas),
  ]
}

function trilha(path: string) {
  const rota = ROTAS.find((r) => r.path === path)
  if (!rota || path === '/') return null
  const meio = rota.pagina
    ? [{ '@type': 'ListItem', position: 2, name: 'Serviços', item: `${SITE_URL}/#servicos` }]
    : []
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: `${SITE_URL}/` },
      ...meio,
      {
        '@type': 'ListItem',
        position: meio.length + 2,
        name: rota.rotulo,
        item: canonicalDe(rota),
      },
    ],
  }
}

/**
 * O grafo de uma rota: a empresa e o site em todas; o FAQ geral só na home;
 * nas páginas de serviço, o serviço e as perguntas dela.
 */
export function gerarJsonLd(path = '/') {
  const grafo: Record<string, unknown>[] = [noDaEmpresa(), noDoSite()]
  if (path === '/') grafo.push(faq(FAQ))
  const rota = ROTAS.find((r) => r.path === path)
  if (rota?.pagina) grafo.push(...noDoServico(rota.pagina))
  const b = trilha(path)
  if (b) grafo.push(b)
  return { '@context': 'https://schema.org', '@graph': grafo }
}

/** llms.txt — o site resumido para assistentes de IA, com os dados da página. */
export function gerarLlmsTxt(): string {
  const l: string[] = [
    `# ${EMPRESA.nome}`,
    '',
    `> ${EMPRESA.lema} ${EMPRESA.descricao}`,
    '',
    '## Contato',
    '',
    `- Site: ${SITE_URL}`,
    `- WhatsApp: ${EMPRESA.telefone} (https://wa.me/${EMPRESA.whatsapp})`,
  ]
  if (EMPRESA.email) l.push(`- E-mail: ${EMPRESA.email}`)
  if (EMPRESA.instagram) l.push(`- Instagram: @${EMPRESA.instagram}`)
  if (EMPRESA.google) l.push(`- Google Maps: ${EMPRESA.google}`)
  if (EMPRESA.cidade) l.push(`- Sede: ${EMPRESA.cidade} - ${EMPRESA.uf} (atende qualquer cidade)`)
  l.push('- Preços: informados na proposta (o site não publica preço).', '')
  l.push('## O que fazemos', '')
  for (const m of METADES) l.push(`- ${m.titulo} ${m.enfase} ${m.texto}`)
  l.push('', '## Serviços', '')
  for (const s of SERVICOS) l.push(`- ${s.nome}: ${s.detalhe}`)
  l.push('', '## Páginas por serviço', '')
  for (const p of PAGINAS) {
    l.push(`### ${p.h1}`, '', `${SITE_URL}/servicos/${p.slug}/`, '', p.resumo, '')
    l.push('Quando faz sentido:', ...p.quando.map((q) => `- ${q}`), '')
    l.push('O que entra:', ...p.entregamos.map((q) => `- ${q}`), '')
    for (const q of p.perguntas) l.push(`**${q.pergunta}** ${q.resposta}`)
    l.push('')
  }
  l.push('', '## Trabalhos', '')
  for (const t of TRABALHOS_PUBLICADOS)
    l.push(`- ${t.nome} (${t.segmento}, ${t.cidade}): ${t.feito}.${t.url ? ` ${t.url}` : ''}`)
  l.push('', '## Método', '')
  for (const e of ETAPAS) l.push(`${e.numero}. ${e.titulo} — ${e.texto}`)
  l.push('', '## O que não fazemos', '')
  for (const n of NAO_FAZEMOS) l.push(`- ${n.titulo}: ${n.texto}`)
  l.push(
    '',
    '## O nome',
    '',
    `${NOME_SIGNIFICADO.titulo} ${NOME_SIGNIFICADO.enfase} ${NOME_SIGNIFICADO.texto}`,
  )
  l.push(`"${NOME_SIGNIFICADO.versiculo}" (${NOME_SIGNIFICADO.referencia})`)
  l.push('', '## Fatos citados no site', '')
  for (const f of FATOS)
    l.push(`- ${f.numero} ${f.unidade ?? ''} ${f.texto} (${f.fonte}: ${f.url})`)
  l.push('', '## Perguntas frequentes', '')
  for (const p of FAQ) l.push(`**${p.pergunta}**`, p.resposta, '')
  return `${l.join('\n').trim()}\n`
}
