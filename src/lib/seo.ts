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
import { PROJETOS, SOBRE } from './projetos.ts'
import { canonicalDe, ogUrlDe, ROTAS } from './routes.ts'

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
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ID,
    name: EMPRESA.nome,
    alternateName: 'Abram',
    slogan: EMPRESA.lema,
    description: EMPRESA.descricao,
    url: `${SITE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: `${SITE_URL}/icon-512.png`,
      width: 512,
      height: 512,
      caption: EMPRESA.nome,
    },
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
      'Sites 3D',
      'Sites de empreendimentos imobiliários',
      'Google Ads',
      'Meta Ads',
      'Tráfego pago',
      'SEO técnico',
      'Identidade visual',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `+${EMPRESA.whatsapp}`,
      contactType: 'sales',
      areaServed: 'BR',
      availableLanguage: ['pt-BR'],
      url: linkContato(),
    },
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

function faq(itens: readonly { pergunta: string; resposta: string }[], id: string) {
  return {
    '@type': 'FAQPage',
    '@id': id,
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
    faq(p.perguntas, `${url}#faq`),
  ]
}

function trilha(path: string) {
  const rota = ROTAS.find((r) => r.path === path)
  if (!rota || path === '/') return null
  const meio = rota.pagina
    ? [{ '@type': 'ListItem', position: 2, name: 'Serviços', item: `${SITE_URL}/#servicos` }]
    : rota.projeto
      ? [{ '@type': 'ListItem', position: 2, name: 'Trabalhos', item: `${SITE_URL}/#trabalhos` }]
      : []
  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalDe(rota)}#trilha`,
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

/** Estudo de caso: o site feito (CreativeWork) e o vídeo dele rolando. */
function noDoProjeto(slug: string) {
  const p = PROJETOS.find((x) => x.slug === slug)
  if (!p) return []
  const url = `${SITE_URL}/projetos/${p.slug}/`
  return [
    {
      '@type': 'CreativeWork',
      '@id': `${url}#projeto`,
      name: `Site ${p.nome}`,
      description: p.resumo,
      url: p.url,
      genre: p.segmento,
      creator: { '@id': ID },
      inLanguage: 'pt-BR',
      keywords: p.tecnica.join(', '),
      locationCreated: { '@type': 'Place', name: p.cidade },
      video: { '@id': `${url}#video` },
    },
    {
      '@type': 'VideoObject',
      '@id': `${url}#video`,
      name: `O site ${p.nome} rolando`,
      description: p.resumo,
      thumbnailUrl: `${SITE_URL}${p.poster}`,
      contentUrl: `${SITE_URL}${p.video}.mp4`,
      // Data em que a gravação foi publicada no site: fixa, não envelhece.
      uploadDate: '2026-10-22',
      publisher: { '@id': ID },
    },
  ]
}

/**
 * O grafo de uma rota: a empresa e o site em todas; a página (WebPage) com
 * trilha e imagem; o FAQ geral só na home; serviço, estudo de caso ou sobre
 * conforme a rota.
 */
export function gerarJsonLd(path = '/') {
  const grafo: Record<string, unknown>[] = [noDaEmpresa(), noDoSite()]
  const rota = ROTAS.find((r) => r.path === path)
  if (rota && !rota.noindex) {
    const url = canonicalDe(rota)
    const principal = rota.pagina
      ? `${url}#servico`
      : rota.projeto
        ? `${url}#projeto`
        : path === '/'
          ? ID
          : undefined
    grafo.push({
      '@type': path === '/sobre' ? 'AboutPage' : 'WebPage',
      '@id': `${url}#pagina`,
      url,
      name: rota.titulo,
      description: rota.descricao,
      inLanguage: 'pt-BR',
      isPartOf: { '@id': `${SITE_URL}/#site` },
      about: { '@id': ID },
      primaryImageOfPage: { '@type': 'ImageObject', url: ogUrlDe(rota), width: 1200, height: 630 },
      ...(principal ? { mainEntity: { '@id': principal } } : {}),
      ...(path !== '/' ? { breadcrumb: { '@id': `${url}#trilha` } } : {}),
    })
  }
  if (path === '/') grafo.push(faq(FAQ, `${SITE_URL}/#faq`))
  if (rota?.pagina) grafo.push(...noDoServico(rota.pagina))
  if (rota?.projeto) grafo.push(...noDoProjeto(rota.projeto))
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
  l.push('', '## Estudos de caso', '')
  for (const p of PROJETOS)
    l.push(
      `- ${p.h1} (${p.segmento}, ${p.cidade}): ${SITE_URL}/projetos/${p.slug}/ . Site: ${p.url}`,
    )
  l.push('', `## Sobre`, '', `${SITE_URL}/sobre/`, '', SOBRE.resumo)
  l.push('', '## Trabalhos', '')
  for (const t of TRABALHOS_PUBLICADOS)
    l.push(`- ${t.nome} (${t.segmento}, ${t.cidade}): ${t.feito}.${t.url ? ` ${t.url}` : ''}`)
  l.push('', '## Método', '')
  for (const e of ETAPAS) l.push(`${e.numero}. ${e.titulo}: ${e.texto}`)
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

/** llms-full.txt: o llms.txt mais o texto completo das páginas de serviço e dos estudos de caso. */
export function gerarLlmsFullTxt(): string {
  const l: string[] = [gerarLlmsTxt().trim(), '', '# Texto completo das páginas', '']
  for (const p of PAGINAS) {
    l.push(`## ${p.h1}`, '', `${SITE_URL}/servicos/${p.slug}/`, '', p.resumo, '')
    for (const passo of p.passos) l.push(`- ${passo.titulo}: ${passo.texto}`)
    l.push('')
    for (const d of p.detalhe ?? []) l.push(`### ${d.titulo}`, '', ...d.texto, '')
  }
  for (const p of PROJETOS) {
    l.push(`## ${p.h1}`, '', `${SITE_URL}/projetos/${p.slug}/`, '', p.resumo, '', ...p.desafio, '')
    for (const x of p.solucao) l.push(`### ${x.titulo}`, '', x.texto, '')
  }
  l.push(`## ${SOBRE.h1}`, '', `${SITE_URL}/sobre/`, '', SOBRE.resumo, '')
  for (const b of SOBRE.blocos) l.push(`### ${b.titulo}`, '', ...b.texto, '')
  return `${l.join('\n').trim()}\n`
}
