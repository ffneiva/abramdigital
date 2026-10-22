import { SITE_URL } from './business.ts'
import { PAGINAS } from './paginas.ts'
import { PROJETOS, SOBRE } from './projetos.ts'

/**
 * As rotas do site e o `<head>` de cada uma.
 *
 * Importado dos dois lados: pelo React e pelo vite.config.ts, que gera um HTML
 * estático por rota. Por isso não toca em `window` nem importa nada de DOM.
 *
 * As rotas internas terminam em barra (`/politica-de-privacidade/`): é o
 * endereço que o S3 serve sem redirecionar (`/rota` responde 302 para
 * `/rota/`), então é ele que vai na canonical e no sitemap.
 */
export type Rota = {
  path: string
  rotulo: string
  titulo: string
  descricao: string
  noindex?: boolean
  /** Página de serviço: o slug do conteúdo em lib/paginas.ts. */
  pagina?: string
  /** Estudo de caso: o slug em lib/projetos.ts. */
  projeto?: string
  /** As duas linhas grandes da arte de compartilhamento. */
  og?: readonly [string, string]
  ogNota?: string
}

export const ROTAS: Rota[] = [
  {
    path: '/',
    rotulo: 'Início',
    titulo: 'Criação de sites e tráfego pago em Goiânia · Abram Digital',
    descricao:
      'Sites sob medida e anúncios no Google e no Instagram, feitos pela mesma equipe em Goiânia, para o clique que você paga virar conversa no WhatsApp.',
    og: ['O anúncio traz.', 'O site convence.'],
    ogNota: 'Sites sob medida · Tráfego pago · abramdigital.com.br',
  },
  // Uma página por serviço — o que as pessoas procuram no Google.
  ...PAGINAS.map((p) => ({
    path: `/servicos/${p.slug}`,
    rotulo: p.nome,
    titulo: p.titulo,
    descricao: p.descricao,
    pagina: p.slug,
    og: p.og,
    ogNota: 'Abram Digital · Goiânia · abramdigital.com.br',
  })),
  // Estudos de caso: quem procura "site para empreendimento" ou "site de loteamento".
  ...PROJETOS.map((p) => ({
    path: `/projetos/${p.slug}`,
    rotulo: p.nome,
    titulo: p.titulo,
    descricao: p.descricao,
    projeto: p.slug,
    og: p.og,
    ogNota: 'Estudo de caso · Abram Digital · abramdigital.com.br',
  })),
  {
    path: '/sobre',
    rotulo: 'Sobre',
    titulo: SOBRE.titulo,
    descricao: SOBRE.descricao,
    og: ['A mesma equipe', 'nas duas pontas.'],
    ogNota: 'Abram Digital · Goiânia · abramdigital.com.br',
  },
  {
    path: '/politica-de-privacidade',
    rotulo: 'Privacidade',
    titulo: 'Política de privacidade · Abram Digital',
    descricao:
      'Como o site da Abram Digital trata dados: o que fica no seu aparelho, o que vai para o WhatsApp e o que não é coletado.',
  },
]

/**
 * Endereço inexistente — servido como 404 de verdade (ErrorDocument do S3).
 * `noindex` evita o *soft 404*: uma URL errada devolvendo a home com 200.
 */
export const NAO_ENCONTRADA: Rota = {
  path: '/404',
  rotulo: 'Não encontrada',
  titulo: 'Página não encontrada · Abram Digital',
  descricao: 'Este endereço não existe no site da Abram Digital.',
  noindex: true,
}

function limpar(pathname: string): string {
  return pathname.replace(/\/+$/, '').toLowerCase() || '/'
}

export function rotaDe(pathname: string): Rota {
  return ROTAS.find((r) => r.path === limpar(pathname)) ?? NAO_ENCONTRADA
}

export function canonicalDe(rota: Rota): string {
  return rota.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${rota.path}/`
}

/**
 * Arquivo da arte de compartilhamento — a MESMA função no gerador
 * (scripts/make-brand.mjs) e no plugin que escreve o `<head>`.
 */
export function ogArquivoDe(rota: Rota): string {
  if (!rota.og || rota.path === '/') return 'og.jpg'
  return `og-${rota.path.replace(/^\//, '').replace(/\//g, '-')}.jpg`
}

export function ogUrlDe(rota: Rota): string {
  return `${SITE_URL}/${ogArquivoDe(rota)}`
}
