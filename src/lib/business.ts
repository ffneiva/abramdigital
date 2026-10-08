/**
 * TODO o conteúdo do site. Fonte única: a página, o JSON-LD, o llms.txt, o
 * <noscript> e as mensagens de WhatsApp saem daqui.
 *
 * A Abram Digital vende duas coisas: sites sob medida e tráfego pago. Três
 * tipos de informação convivem neste arquivo, e não se misturam:
 *
 *   · **Fato com fonte** — o que o Google diz sobre o Índice de Qualidade e
 *     sobre velocidade no celular. Vai para a tela com o link.
 *   · **Trabalho entregue** — os sites que a equipe fez, com o endereço no
 *     ar. É a prova social que existe, e é verificável: basta abrir.
 *   · **Proposta** — o jeito de trabalhar que o site promete (código e
 *     domínio do cliente, relatório, sem fidelidade). Está marcada CONFIRMAR
 *     e listada no DEPLOY.md, para os sócios validarem.
 *
 * Nada aqui é inventado: sem depoimento, sem "+300 clientes", sem "ROI de
 * 10x", sem preço.
 */

export const SITE_URL = 'https://abramdigital.com.br'

/** O domínio é da própria marca: o site já nasce indexável. */
export const INDEXAVEL = true

export const EMPRESA = {
  nome: 'Abram Digital',
  dominio: 'abramdigital.com.br',
  lema: 'O anúncio traz. O site convence.',
  descricao:
    'Sites sob medida e tráfego pago no Google e no Meta, feitos pela mesma equipe — para o clique que você paga cair numa página feita para virar conversa.',
  /**
   * O WhatsApp, só dígitos com DDI e DDD. Passado pelo Felipe em 06/10/2026
   * como "+55 62 9355-7730". CONFIRMAR: tem 8 dígitos depois do DDD; se a
   * conta foi criada com o 9 na frente, trocar por 5562993557730.
   */
  whatsapp: '556293557730',
  telefone: '(62) 9355-7730',
  /** O perfil do Instagram, sem @ (passado pelo Carmelito em 06/10/2026). */
  instagram: 'abramdigital.br' as string | null,
  /** O perfil no Google Maps (Google Business), pronto desde 06/10/2026. */
  google: 'https://g.page/r/Cf8gSaM7nu8FECE' as string | null,
  /** CONFIRMAR: e-mail de contato. */
  email: null as string | null,
  /** A sede. O atendimento é por WhatsApp e videochamada, para qualquer cidade. */
  cidade: 'Goiânia' as string | null,
  uf: 'GO',
  /** A empresa ainda não tem CNPJ (06/10/2026). Quando tiver, aparece no rodapé. */
  cnpj: null as string | null,
} as const

/* ── Contato ─────────────────────────────────────────────────────────── */

export const MENSAGEM_PADRAO = 'Olá, Abram! Vim pelo site e quero conversar sobre um projeto.'

export function linkContato(texto: string = MENSAGEM_PADRAO): string {
  return `https://wa.me/${EMPRESA.whatsapp}?text=${encodeURIComponent(texto)}`
}

export const ROTULO_CONTATO = 'Conversar no WhatsApp'

/* ── Herói ───────────────────────────────────────────────────────────── */

export const HEROI = {
  rotulo: 'Sites sob medida · Tráfego pago',
  linhas: ['O anúncio traz.', 'O site convence.'],
  /** A palavra de cada linha que vai em itálico dourado. */
  enfase: ['traz.', 'convence.'],
  texto:
    'A Abram Digital faz as duas metades — o site e as campanhas no Google e no Meta — pensadas juntas, pela mesma equipe. Assim, cada real que você investe em clique cai numa página feita para virar conversa.',
  secundario: 'Ver trabalhos',
} as const

export const MARQUEE = [
  'Sites sob medida',
  'Landing pages',
  'Google Ads',
  'Meta Ads',
  'Pixel e API de conversões',
  'GA4 e Tag Manager',
  'SEO técnico',
  'Identidade visual',
  'WhatsApp como funil',
] as const

/* ── Manifesto ───────────────────────────────────────────────────────── */

/**
 * Lido palavra a palavra conforme a rolagem. As palavras entre asteriscos
 * acendem em ouro.
 */
export const MANIFESTO =
  'A maioria dos negócios paga para *levar* gente a uma página que não *convence.* A agência de anúncio culpa o site. Quem fez o site culpa o anúncio. E o dinheiro some *no meio.* A gente decidiu fazer *as duas metades.*'

/* ── As duas metades ─────────────────────────────────────────────────── */

export type Metade = {
  id: 'site' | 'trafego'
  numero: string
  titulo: string
  enfase: string
  texto: string
  itens: string[]
}

export const METADES: Metade[] = [
  {
    id: 'site',
    numero: '01',
    titulo: 'O site',
    enfase: 'que convence.',
    texto:
      'Desenhado do zero para o seu negócio — sem tema comprado, sem construtor de arrastar. Rápido no celular, encontrado no Google e com um caminho só: a conversa com você.',
    itens: [
      'Design sob medida, do conceito ao último pixel',
      'Carrega rápido em rede móvel',
      'Um título e uma prévia de WhatsApp por página',
      'Botões que já abrem o WhatsApp com a mensagem escrita',
    ],
  },
  {
    id: 'trafego',
    numero: '02',
    titulo: 'O tráfego',
    enfase: 'que traz.',
    texto:
      'Campanhas no Google e no Meta (Instagram e Facebook) apontadas para páginas feitas para elas. A mesma promessa no anúncio e na página — e a medição ligada antes do primeiro real.',
    itens: [
      'Google Ads: pesquisa, Performance Max e YouTube',
      'Meta Ads: Instagram e Facebook',
      'Pixel, API de conversões, GA4 e Tag Manager',
      'Ajuste contínuo pelo que a medição mostra',
    ],
  },
]

/* ── Fatos com fonte ─────────────────────────────────────────────────── */

export type Fato = {
  numero: string
  unidade?: string
  texto: string
  fonte: string
  url: string
}

export const FATOS: Fato[] = [
  {
    numero: '1',
    unidade: 'de 3',
    texto:
      'componentes do Índice de Qualidade do Google Ads é a experiência na página de destino. Página ruim encarece o clique.',
    fonte: 'Google Ads · Sobre o Índice de Qualidade',
    url: 'https://support.google.com/google-ads/answer/6167118?hl=pt-BR',
  },
  {
    numero: '53',
    unidade: '%',
    texto:
      'das visitas a sites no celular são abandonadas quando a página demora mais de 3 segundos para carregar.',
    fonte: 'Think with Google · The Need for Mobile Speed',
    url: 'https://www.thinkwithgoogle.com/consumer-insights/consumer-trends/mobile-site-load-time-statistics/',
  },
  {
    numero: '3',
    unidade: 'métricas',
    texto:
      'de experiência (as Core Web Vitals: carregamento, resposta e estabilidade) entram nos sistemas de classificação da Busca do Google.',
    fonte: 'Google Search Central · Experiência na página',
    url: 'https://developers.google.com/search/docs/appearance/page-experience?hl=pt-br',
  },
]

/* ── Serviços ────────────────────────────────────────────────────────── */

export type Servico = {
  id: string
  nome: string
  resumo: string
  detalhe: string
  itens: string[]
  /** A página própria do serviço (lib/paginas.ts), quando existe. */
  pagina?: string
}

export const SERVICOS: Servico[] = [
  {
    id: 'sites',
    pagina: 'criacao-de-sites-goiania',
    nome: 'Sites institucionais',
    resumo: 'A casa do seu negócio na internet, feita só para ele.',
    detalhe:
      'Começa por entender o que o seu cliente procura e o que só você pode dizer. Daí sai o roteiro das seções, o texto e o design — e só então o código. Cada página sai com título, descrição e prévia de compartilhamento próprios.',
    itens: [
      'Roteiro e texto',
      'Design sob medida',
      'Animação e 3D quando fazem sentido',
      'SEO técnico',
    ],
  },
  {
    id: 'landing',
    pagina: 'landing-page-para-anuncios',
    nome: 'Landing pages para campanha',
    resumo: 'Uma página, uma oferta, um botão — feita para o anúncio.',
    detalhe:
      'A página que recebe o clique precisa repetir a promessa do anúncio e ter um próximo passo só. Montamos a landing junto com a campanha, para as duas falarem a mesma língua.',
    itens: [
      'Mesma promessa do anúncio',
      'Um objetivo por página',
      'Medição de conversão',
      'Versões para testar',
    ],
  },
  {
    id: 'google',
    pagina: 'google-ads-goiania',
    nome: 'Google Ads',
    resumo: 'Aparecer para quem já está procurando o que você vende.',
    detalhe:
      'Campanhas de pesquisa para quem digita o seu serviço, Performance Max e YouTube quando fazem sentido. Palavras-chave negativas, extensões e conversões configuradas — e o orçamento acompanhado de perto.',
    itens: ['Pesquisa', 'Performance Max', 'YouTube', 'Conversões no GA4'],
  },
  {
    id: 'meta',
    pagina: 'anuncios-instagram-facebook',
    nome: 'Meta Ads',
    resumo: 'Instagram e Facebook, para quem ainda não sabe que precisa.',
    detalhe:
      'Campanhas com objetivo de mensagens, cadastro ou venda — não "impulsionar publicação". Públicos, criativos e o Pixel com a API de conversões, para o algoritmo aprender com quem de fato chamou.',
    itens: ['Mensagens no WhatsApp', 'Cadastros', 'Remarketing', 'Pixel + API de conversões'],
  },
  {
    id: 'medicao',
    nome: 'Medição',
    resumo: 'Saber de onde veio cada conversa — e o que ela custou.',
    detalhe:
      'Google Tag Manager, GA4, Pixel e API de conversões ligados antes do primeiro anúncio. Sem medição, otimizar campanha é chute.',
    itens: ['Tag Manager', 'GA4', 'Eventos de clique no WhatsApp', 'Painel de resultados'],
  },
  {
    id: 'marca',
    nome: 'Identidade visual',
    resumo: 'Quando o negócio ainda não tem cara, a gente desenha.',
    detalhe:
      'Símbolo, cores, tipografia e um manual de uso — criados junto com o site, para a marca já nascer pensada para a tela, o favicon e a foto de perfil.',
    itens: ['Símbolo e logotipo', 'Paleta e fontes', 'Manual de uso', 'Arquivos para redes'],
  },
]

/* ── Trabalhos ───────────────────────────────────────────────────────── */

export type Trabalho = {
  id: string
  nome: string
  segmento: string
  cidade: string
  /** O que foi feito, numa linha. */
  feito: string
  /** O detalhe que mais impressiona — verdadeiro e verificável no site. */
  destaque: string
  /** O endereço definitivo, se já estiver no ar. Sem ele, não há link. */
  url: string | null
  /** A cor dominante do site, para o brilho em volta da captura. */
  cor: string
  /**
   * Aparece no portfólio? Escolha do Felipe em 07/10/2026: Smarthere,
   * Delamayer, Silverado, Lottus e International. Kyotto e Touro's ficam de
   * fora (a Harca saiu antes, em 06/10).
   */
  publicar: boolean
}

export const TRABALHOS: Trabalho[] = [
  {
    id: 'smarthere',
    nome: 'Smarthere',
    segmento: 'Conserto de celular',
    cidade: 'Goiás',
    feito: 'Marca criada do zero e site',
    destaque: 'Um celular 3D que se monta peça por peça enquanto a página rola.',
    url: 'https://smarthere.com.br',
    cor: '#c8ff2e',
    publicar: true,
  },
  {
    id: 'delamayer',
    nome: 'Delamayer',
    segmento: 'Assessoria de crédito',
    cidade: 'Goiânia',
    feito: 'Landing page e diagnóstico interativo',
    destaque:
      'Um setor cheio de promessa enganosa — e um site que transforma a recusa em prometer no argumento de venda.',
    url: 'https://delamayer.com.br',
    cor: '#c9a46a',
    publicar: true,
  },
  {
    id: 'silverado',
    nome: 'Barbearia Silverado',
    segmento: 'Barbearia',
    cidade: 'Goiânia',
    feito: 'Landing page no lugar de um Google Sites',
    destaque: 'Cada visita termina numa mensagem de WhatsApp já preenchida.',
    url: 'https://barbeariasilverado.com.br',
    cor: '#b9b9b9',
    publicar: true,
  },
  {
    id: 'kyotto',
    nome: 'Kyotto Sushi',
    segmento: 'Sushi delivery',
    cidade: 'Senador Canedo',
    feito: 'Site com cardápio',
    destaque: 'As criações da casa, que se perdiam no Instagram, ganharam uma página própria.',
    url: null,
    cor: '#e0473a',
    publicar: false,
  },
  {
    id: 'touros',
    nome: 'Touro’s Burguer',
    segmento: 'Hamburgueria',
    cidade: 'Juiz de Fora',
    feito: 'Site com cardápio',
    destaque: 'O hambúrguer da casa se desmonta camada por camada enquanto a página rola.',
    url: null,
    cor: '#f2a33a',
    publicar: false,
  },
  {
    id: 'lottus',
    nome: 'Lottus Barbearia Clube',
    segmento: 'Barbearia',
    cidade: 'Goiânia',
    feito: 'Site com parallax e símbolo 3D',
    destaque: 'Parallax do começo ao fim e o símbolo da casa em 3D, girando na mão de quem visita.',
    url: 'https://lottus.abramdigital.com.br',
    cor: '#c8a25a',
    publicar: true,
  },
  {
    id: 'international',
    nome: 'International Idiomas',
    segmento: 'Escola de inglês',
    cidade: 'Goiânia',
    feito: 'Landing page e site institucional',
    destaque: 'Duas páginas do mesmo código, com leads direto no e-mail da escola.',
    url: 'https://international.abramdigital.com.br',
    cor: '#3a7bd5',
    publicar: true,
  },
]

export const TRABALHOS_PUBLICADOS = TRABALHOS.filter((t) => t.publicar)

/* ── Método ──────────────────────────────────────────────────────────── */

export type Etapa = { numero: string; titulo: string; texto: string }

export const ETAPAS: Etapa[] = [
  {
    numero: '01',
    titulo: 'Conversa',
    texto:
      'Entender o negócio, quem compra e por quê. O que você vende que os outros não vendem — e o que o seu cliente digita quando procura.',
  },
  {
    numero: '02',
    titulo: 'Ângulo',
    texto:
      'Pesquisar os concorrentes e encontrar a frase que só você pode dizer. Ela vira o título do site e a promessa do anúncio.',
  },
  {
    numero: '03',
    titulo: 'Site',
    texto:
      'Roteiro, texto, design e código. Você acompanha por prints e por um endereço de prévia antes de ir ao ar.',
  },
  {
    numero: '04',
    titulo: 'Medição',
    texto:
      'Tag Manager, GA4, Pixel e API de conversões instalados e testados. Cada clique no WhatsApp vira um evento contável.',
  },
  {
    numero: '05',
    titulo: 'Campanhas',
    texto:
      'Anúncios no Google e no Meta com a mesma promessa da página. Orçamento definido com você, sem surpresa.',
  },
  {
    numero: '06',
    titulo: 'Ajuste',
    texto:
      'Ler os números, cortar o que não funciona e reforçar o que funciona. Na campanha e na página — porque somos nós dos dois lados.',
  },
]

/* ── Diagnóstico ─────────────────────────────────────────────────────── */

export type Opcao = { id: string; rotulo: string }
export type Pergunta = {
  id: 'precisa' | 'negocio' | 'hoje' | 'meta'
  titulo: string
  opcoes: Opcao[]
}

export const PERGUNTAS: Pergunta[] = [
  {
    id: 'precisa',
    titulo: 'Do que você precisa?',
    opcoes: [
      { id: 'site-novo', rotulo: 'Um site novo' },
      { id: 'refazer', rotulo: 'Refazer o site que tenho' },
      { id: 'trafego', rotulo: 'Tráfego pago' },
      { id: 'tudo', rotulo: 'Site e tráfego' },
    ],
  },
  {
    id: 'negocio',
    titulo: 'Qual é o seu negócio?',
    opcoes: [
      { id: 'local', rotulo: 'Serviço com endereço (barbearia, clínica, restaurante…)' },
      { id: 'liberal', rotulo: 'Profissional liberal' },
      { id: 'loja', rotulo: 'Loja ou e-commerce' },
      { id: 'b2b', rotulo: 'Empresa que vende para empresas' },
      { id: 'outro', rotulo: 'Outro' },
    ],
  },
  {
    id: 'hoje',
    titulo: 'Como você anuncia hoje?',
    opcoes: [
      { id: 'nada', rotulo: 'Não anuncio' },
      { id: 'impulsiono', rotulo: 'Impulsiono posts no Instagram' },
      { id: 'proprio', rotulo: 'Rodo Google ou Meta Ads por conta' },
      { id: 'agencia', rotulo: 'Tenho agência ou gestor' },
    ],
  },
  {
    id: 'meta',
    titulo: 'O que mais importa agora?',
    opcoes: [
      { id: 'whatsapp', rotulo: 'Mais conversas no WhatsApp' },
      { id: 'vendas', rotulo: 'Vender pelo site' },
      { id: 'agenda', rotulo: 'Agenda cheia' },
      { id: 'marca', rotulo: 'Ser levado a sério' },
    ],
  },
]

export type Respostas = Record<Pergunta['id'], string>

export type Plano = {
  /** O título do resultado. */
  titulo: string
  /** Os passos sugeridos, na ordem. */
  passos: string[]
  /** Uma observação honesta sobre o ponto de partida. */
  nota: string
  /** A mensagem que vai para o WhatsApp. */
  mensagem: string
}

const rotulo = (p: Pergunta['id'], id: string) =>
  PERGUNTAS.find((q) => q.id === p)?.opcoes.find((o) => o.id === id)?.rotulo ?? id

/**
 * O resultado do diagnóstico. Não promete número nenhum: só ordena os
 * passos e diz, com honestidade, o que costuma vir primeiro. Testado em
 * todas as 320 combinações (tests/unit/diagnostico.test.ts).
 */
export function montarPlano(r: Respostas): Plano {
  const querSite = r.precisa !== 'trafego'
  const querTrafego = r.precisa === 'trafego' || r.precisa === 'tudo'
  const passos: string[] = []

  if (querSite) {
    passos.push(
      r.precisa === 'refazer'
        ? 'Ler o site atual: o que já funciona, o que trava, o que o Google vê'
        : 'Encontrar o ângulo: a frase que só o seu negócio pode dizer',
    )
    passos.push(
      r.meta === 'vendas'
        ? 'Site com catálogo e caminho curto até a compra'
        : r.meta === 'agenda'
          ? 'Site com o caminho mais curto até o horário marcado'
          : r.meta === 'marca'
            ? 'Site sob medida, com a apresentação à altura do que você entrega'
            : 'Site com cada botão abrindo o WhatsApp com a mensagem escrita',
    )
  } else {
    passos.push('Conferir a página que vai receber os anúncios — ela pesa no custo do clique')
  }

  passos.push('Medição: Tag Manager, GA4 e Pixel, antes do primeiro anúncio')

  if (querTrafego) {
    passos.push(
      r.negocio === 'local'
        ? 'Google Ads para quem procura o seu serviço na sua região, e Meta Ads para quem mora perto'
        : r.negocio === 'b2b'
          ? 'Google Ads de pesquisa para quem já procura a solução'
          : r.negocio === 'loja'
            ? 'Campanhas de venda no Google e no Meta, com remarketing'
            : 'Campanhas no Google e no Meta com a mesma promessa da página',
    )
  } else {
    passos.push('Deixar o site pronto para anúncio, para quando fizer sentido anunciar')
  }

  const nota =
    r.hoje === 'impulsiono'
      ? 'Impulsionar publicação é o anúncio mais simples do Meta, mas ele não escolhe o objetivo que você precisa. Campanha com objetivo de mensagens costuma ser o próximo passo.'
      : r.hoje === 'agencia'
        ? 'Se você já tem quem cuide dos anúncios, o site pode ser feito para trabalhar junto com essa equipe — a gente entrega a medição pronta para ela.'
        : r.hoje === 'proprio'
          ? 'Você já conhece o painel. Antes de aumentar o orçamento, vale olhar a página de destino e a medição: é onde o dinheiro costuma escapar.'
          : querTrafego
            ? 'Começar do zero é uma vantagem: a medição já nasce certa e o orçamento cresce só quando os números pedirem.'
            : 'Um site bem feito trabalha sozinho no Google; o tráfego pago pode vir depois, quando você quiser acelerar.'

  const titulo =
    r.precisa === 'tudo'
      ? 'As duas metades, juntas.'
      : r.precisa === 'trafego'
        ? 'Tráfego, com a página certa.'
        : r.precisa === 'refazer'
          ? 'Um site novo, a partir do que já existe.'
          : 'Um site feito para o seu negócio.'

  const mensagem = [
    'Olá, Abram! Fiz o diagnóstico no site:',
    `• Preciso de: ${rotulo('precisa', r.precisa)}`,
    `• Negócio: ${rotulo('negocio', r.negocio)}`,
    `• Hoje: ${rotulo('hoje', r.hoje)}`,
    `• O que importa: ${rotulo('meta', r.meta)}`,
    'Podemos conversar?',
  ].join('\n')

  return { titulo, passos, nota, mensagem }
}

/* ── O que não fazemos ───────────────────────────────────────────────── */

export const NAO_FAZEMOS = [
  {
    titulo: 'Prometer primeiro lugar no Google',
    texto:
      'Ninguém controla a posição orgânica — o próprio Google diz isso. A gente controla o que é nosso: um site rápido, claro e bem estruturado.',
  },
  {
    titulo: 'Prometer número de vendas',
    texto:
      'Resultado depende de produto, preço, atendimento e mercado. Prometemos método, medição e transparência sobre cada real investido.',
  },
  {
    titulo: 'Usar tema pronto',
    texto:
      'Nada de template comprado com o seu logo colado em cima. Cada site é desenhado do zero.',
  },
  {
    titulo: 'Vender seguidor ou curtida',
    texto:
      'Número que não conversa com você não paga conta. O que medimos é conversa, cadastro e venda.',
  },
  {
    // CONFIRMAR: os sócios garantem domínio e conta de anúncio no nome do cliente?
    titulo: 'Prender você',
    texto:
      'O domínio e as contas de anúncio ficam no seu nome. Se um dia você quiser seguir com outra equipe, leva tudo.',
  },
] as const

/* ── O nome ───────────────────────────────────────────────────────────── */

/**
 * O porquê do nome. Os sócios são cristãos, e para eles "Abram" é exaltar a
 * Deus (passado pelo Carmelito em 07/10/2026). O texto diz isso como o que
 * o nome significa PARA ELES — não arrisca etimologia. CONFIRMAR: o
 * Carmelito ainda vai mandar as correções gerais do site.
 */
export const NOME_SIGNIFICADO = {
  rotulo: 'O nome',
  titulo: 'Abram, para nós, é',
  enfase: 'exaltar a Deus.',
  texto:
    'Somos cristãos. O nome lembra o porquê do trabalho: fazer cada site e cada campanha como quem faz para Deus — com verdade no que prometemos e capricho até no que ninguém vê. É por isso que a lista do que a gente não faz existe.',
  versiculo:
    'Tudo o que fizerem, façam de todo o coração, como para o Senhor, e não para os homens.',
  referencia: 'Colossenses 3:23',
} as const

/* ── Perguntas frequentes ────────────────────────────────────────────── */

export const FAQ = [
  {
    pergunta: 'Quanto custa um site?',
    resposta:
      'Depende do tamanho, do que ele precisa fazer e se a marca já existe. Depois de uma conversa curta, mandamos uma proposta por escrito, com escopo e prazo.',
  },
  {
    pergunta: 'Quanto preciso investir em anúncio?',
    resposta:
      'O valor dos anúncios é pago direto ao Google e ao Meta, e você define o teto. Começamos com um orçamento que caiba no seu negócio e só aumentamos quando os números mostrarem que vale.',
  },
  {
    pergunta: 'Em quanto tempo o site fica pronto?',
    resposta:
      'O prazo vai na proposta, porque depende do escopo e da rapidez com que textos e fotos chegam. Você acompanha a construção por um endereço de prévia.',
  },
  {
    pergunta: 'Vocês fazem só o site, ou só o tráfego?',
    resposta:
      'Fazemos os dois separados também. Mas a vantagem de fazer junto é que ninguém culpa o outro lado: a página e o anúncio são pensados um para o outro.',
  },
  {
    pergunta: 'O site aparece no Google?',
    resposta:
      'Ele sai pronto para ser encontrado: título e descrição por página, dados estruturados, mapa do site, velocidade. A posição na busca depende também de concorrência e tempo, e não prometemos posição.',
  },
  {
    pergunta: 'Preciso ter fotos e textos prontos?',
    resposta:
      'Não. Escrevemos o texto a partir da nossa conversa e dizemos quais fotos fazem diferença. Se você já tem material, aproveitamos.',
  },
  {
    pergunta: 'Atendem outras cidades?',
    resposta:
      'Sim. Tudo funciona por WhatsApp e videochamada — já entregamos sites para negócios em Goiás e em Minas Gerais.',
  },
] as const

/* ── O painel ao vivo ────────────────────────────────────────────────── */

/** Os rótulos do painel que mede esta própria página no aparelho de quem lê. */
export const PAINEL = {
  titulo: 'Não acredite no que a gente diz.',
  enfase: 'Meça.',
  texto:
    'Estes números não foram escritos por ninguém: são medidos agora, no seu aparelho, enquanto você lê. É o mesmo cuidado que vai no seu site.',
} as const

/* ── Páginas internas ────────────────────────────────────────────────── */

export const NAO_ENCONTRADA_TEXTO = {
  rotulo: 'Erro 404',
  titulo: 'Esta estrela não existe.',
  apoio:
    'O endereço pode ter mudado ou ter sido digitado com algum erro. Os caminhos abaixo levam ao que quase sempre se procura.',
} as const

/**
 * A política de privacidade. O site não tem formulário, não tem login e
 * não grava cookie próprio. O que vai para o WhatsApp é a pessoa quem envia.
 */
export const PRIVACIDADE = [
  {
    titulo: 'O que o site coleta',
    texto:
      'Nada que identifique você. Não há formulário, cadastro nem login. O diagnóstico roda inteiro no seu navegador: as respostas não são enviadas a lugar nenhum até você tocar no botão do WhatsApp.',
  },
  {
    titulo: 'O WhatsApp',
    texto:
      'Os botões abrem o WhatsApp com uma mensagem já escrita. Ela só é enviada se você enviar, e a partir daí a conversa segue a política do próprio WhatsApp.',
  },
  {
    titulo: 'Cookies e medição',
    texto:
      'Este site não grava cookies próprios. Se uma ferramenta de medição de visitas (como o Google Analytics) for ligada, ela é descrita aqui antes, com o que coleta e por quê.',
  },
  {
    titulo: 'O que fica no seu aparelho',
    texto:
      'Apenas uma marcação de que você já viu a animação de abertura nesta sessão, para não repeti-la. Ela some quando você fecha o navegador.',
  },
  {
    titulo: 'Seus direitos',
    texto: `A Lei Geral de Proteção de Dados (Lei 13.709/2018) garante acesso, correção e exclusão dos seus dados. Como o site não guarda dados pessoais, o que existir estará na conversa do WhatsApp — e pode ser pedido por lá, no (62) 9355-7730.`,
  },
] as const
