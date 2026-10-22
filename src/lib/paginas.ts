/**
 * O conteúdo das páginas de serviço (/servicos/<slug>/) — par de
 * business.ts: texto que o visitante lê não fica em componente.
 *
 * Uma página por serviço, porque é o que alguém digita no Google ("criação
 * de sites Goiânia", "gestão de Google Ads") e uma home não responde bem a
 * quatro buscas diferentes. Cada página tem conteúdo próprio — quando faz
 * sentido, o que entra, como funciona e perguntas específicas —, nada de
 * texto repetido com o nome trocado. Sem preço, sem prazo e sem promessa de
 * resultado: os três saem da conversa, por escrito, na proposta.
 */

import { type Detalhe, EXTRAS } from './paginasDetalhe.ts'

export type PaginaServico = {
  slug: string
  /** O nome curto — trilha, menus, links. */
  nome: string
  /** O <title> (com " · Abram Digital", até 65 caracteres). */
  titulo: string
  /** A meta description (80 a 170 caracteres). */
  descricao: string
  h1: string
  /** As duas linhas da arte de compartilhamento. */
  og: readonly [string, string]
  /** O primeiro parágrafo: a resposta direta, em duas ou três frases. */
  resumo: string
  /** Quando este serviço é o que a pessoa precisa. */
  quando: string[]
  /** O que entra no trabalho. */
  entregamos: string[]
  /** Como funciona, em passos. */
  passos: { titulo: string; texto: string }[]
  perguntas: { pergunta: string; resposta: string }[]
  /** Blocos de texto corrido ("Em detalhe"), de paginasDetalhe.ts. */
  detalhe?: Detalhe[]
  mensagem: string
}

const BASE: PaginaServico[] = [
  {
    slug: 'criacao-de-sites-goiania',
    nome: 'Criação de sites',
    titulo: 'Criação de sites em Goiânia · Abram Digital',
    descricao:
      'Site sob medida em Goiânia: roteiro, texto, design e código feitos do zero, rápido no celular e pronto para o Google. Converse pelo WhatsApp.',
    h1: 'Criação de sites em Goiânia',
    og: ['Criação de sites', 'em Goiânia.'],
    resumo:
      'Um site desenhado só para o seu negócio, sem tema comprado, sem construtor de arrastar. Rápido no celular, com cada página pronta para o Google e cada botão abrindo o WhatsApp com a mensagem já escrita.',
    quando: [
      'Você não tem site e depende só do Instagram para ser encontrado',
      'O seu site é um modelo pronto, igual ao dos concorrentes',
      'O site atual demora para abrir no celular ou não aparece no Google',
      'Você vai anunciar e precisa de uma página à altura do anúncio',
    ],
    entregamos: [
      'Roteiro das seções e texto escritos a partir da nossa conversa',
      'Design sob medida, com animação e 3D quando fazem sentido para a marca',
      'Título, descrição e prévia de WhatsApp próprios em cada página',
      'Dados estruturados para o Google, mapa do site e robots.txt',
      'Cliques no WhatsApp medidos como conversão, prontos para anúncio',
      'Hospedagem estática, rápida e com custo mensal próximo de zero',
    ],
    passos: [
      {
        titulo: 'Conversa',
        texto:
          'O que você vende, para quem e o que só você pode dizer. Olhamos também os concorrentes, para o seu site não sair igual ao deles.',
      },
      {
        titulo: 'Roteiro e texto',
        texto:
          'A ordem das seções e o texto de cada uma, antes do design. É aqui que o site ganha o argumento.',
      },
      {
        titulo: 'Design e código',
        texto: 'Você acompanha por prints e por um endereço de prévia, e aprova antes de ir ao ar.',
      },
      {
        titulo: 'No ar',
        texto:
          'Domínio apontado, Google Search Console configurado e medição ligada. O site sai pronto para receber anúncio.',
      },
    ],
    perguntas: [
      {
        pergunta: 'O site já sai pronto para aparecer no Google?',
        resposta:
          'Sai com tudo o que depende do site: título e descrição por página, dados estruturados, mapa do site, velocidade e conteúdo escrito para o que o seu cliente procura. A posição na busca depende também de concorrência e tempo, e ninguém pode prometê-la.',
      },
      {
        pergunta: 'Preciso ter textos e fotos prontos?',
        resposta:
          'Não. O texto nasce da nossa conversa, e dizemos quais fotos fazem diferença. Se você já tem material bom, ele é aproveitado.',
      },
      {
        pergunta: 'Consigo mudar o site depois?',
        resposta:
          'Sim. Trocar texto, telefone ou acrescentar um serviço é rápido, porque todo o conteúdo fica num lugar só do código. Você pede pelo WhatsApp.',
      },
      {
        pergunta: 'Atendem fora de Goiânia?',
        resposta:
          'Sim. A conversa é por WhatsApp e videochamada: já entregamos sites para negócios de Goiás e de Minas Gerais.',
      },
    ],
    mensagem: 'Olá, Abram! Vim pela página de criação de sites e quero conversar sobre o meu.',
  },
  {
    slug: 'landing-page-para-anuncios',
    nome: 'Landing page',
    titulo: 'Landing page para anúncios · Abram Digital',
    descricao:
      'Landing page feita para o anúncio: a mesma promessa, uma oferta, um botão. Medição de conversão no Google Ads, no GA4 e no Pixel do Meta.',
    h1: 'Landing page para anúncios',
    og: ['Landing page', 'para anúncios.'],
    resumo:
      'Uma página feita para receber o clique: repete a promessa do anúncio, apresenta uma oferta e leva a um próximo passo só. A experiência na página de destino é um dos três componentes do Índice de Qualidade do Google Ads, a página pesa na conta do anúncio.',
    quando: [
      'Você vai rodar campanha no Google ou no Meta',
      'O anúncio leva para a página inicial e a pessoa se perde',
      'Você tem um serviço ou uma oferta específica para vender',
      'Você quer comparar duas versões de página',
    ],
    entregamos: [
      'Texto com a mesma promessa do anúncio, quem clica encontra o que leu',
      'Um objetivo por página: WhatsApp, cadastro ou compra',
      'Carregamento rápido em rede móvel',
      'Eventos de conversão no GA4, no Google Ads e no Pixel do Meta',
      'Versões para testar, quando o volume de cliques permite',
    ],
    passos: [
      {
        titulo: 'A oferta',
        texto: 'Para quem é a página, o que ela oferece e qual é o único próximo passo.',
      },
      {
        titulo: 'Página e anúncio juntos',
        texto:
          'O texto da página e o do anúncio são escritos lado a lado, para dizerem a mesma coisa.',
      },
      {
        titulo: 'Medição',
        texto:
          'Cada clique no botão vira um evento de conversão, testado antes da campanha começar.',
      },
      {
        titulo: 'Ajuste',
        texto: 'Com os números na mão, mudamos o que não converte, na página ou no anúncio.',
      },
    ],
    perguntas: [
      {
        pergunta: 'Landing page ou site completo?',
        resposta:
          'Para uma campanha com uma oferta, a landing page costuma funcionar melhor: menos caminhos, menos distração. Para ser encontrado no Google sem anúncio e apresentar tudo o que você faz, o site completo. Muitos negócios usam os dois.',
      },
      {
        pergunta: 'A landing page funciona sem anúncio?',
        resposta:
          'Funciona, mas ela é pensada para receber tráfego: alguém precisa chegar até ela: anúncio, link na bio, QR code ou campanha de e-mail.',
      },
      {
        pergunta: 'Vocês fazem a campanha também?',
        resposta:
          'Sim, e é a combinação que defendemos: a mesma equipe escreve o anúncio e a página, e lê os números dos dois lados.',
      },
    ],
    mensagem: 'Olá, Abram! Vim pela página de landing page e quero conversar sobre uma campanha.',
  },
  {
    slug: 'google-ads-goiania',
    nome: 'Google Ads',
    titulo: 'Gestão de Google Ads em Goiânia · Abram Digital',
    descricao:
      'Gestão de Google Ads em Goiânia: pesquisa, Performance Max e YouTube, com conversões configuradas antes do primeiro real e página feita para o anúncio.',
    h1: 'Gestão de Google Ads em Goiânia',
    og: ['Google Ads', 'em Goiânia.'],
    resumo:
      'Campanhas para aparecer quando alguém procura o que você vende, em Goiânia ou onde estiver o seu cliente. Pesquisa, Performance Max e YouTube, com as conversões medidas desde o primeiro dia.',
    quando: [
      'O seu cliente procura o seu serviço no Google',
      'Você já anuncia, mas não sabe de onde vêm as conversas',
      'Os concorrentes aparecem acima de você na busca',
      'Você quer ser encontrado enquanto o site ainda ganha posição orgânica',
    ],
    entregamos: [
      'Pesquisa de palavras-chave e lista de palavras negativas',
      'Anúncios e recursos (sitelinks, chamada, local) escritos para a sua oferta',
      'Segmentação por região e horário',
      'Conversões no Google Ads e no GA4, incluindo o clique no WhatsApp',
      'Leitura dos termos de pesquisa e ajuste de lances e orçamento',
    ],
    passos: [
      {
        titulo: 'Medição primeiro',
        texto: 'Tag Manager, GA4 e conversões instalados e testados antes de a campanha começar.',
      },
      {
        titulo: 'Estrutura',
        texto:
          'Campanhas separadas por serviço e intenção de busca, cada uma apontando para a página certa.',
      },
      {
        titulo: 'Lançamento',
        texto: 'Orçamento diário combinado com você. O valor do anúncio é pago direto ao Google.',
      },
      {
        titulo: 'Ajuste contínuo',
        texto:
          'Cortar o termo que gasta sem converter, reforçar o que traz conversa, mexer na página quando é ela que trava.',
      },
    ],
    perguntas: [
      {
        pergunta: 'Quanto preciso investir em anúncio?',
        resposta:
          'Você define o teto. Começamos com um orçamento que caiba no seu negócio e só aumentamos quando os números mostram que vale a pena.',
      },
      {
        pergunta: 'O dinheiro do anúncio passa por vocês?',
        resposta:
          'Não. O investimento em mídia é cobrado pelo Google, direto na conta de anúncios. A gestão é um serviço à parte, combinado na proposta.',
      },
      {
        pergunta: 'Em quanto tempo aparece resultado?',
        resposta:
          'Os anúncios começam a aparecer logo depois de aprovados. O que leva tempo é a otimização: a campanha precisa de dados para aprender, e o ritmo depende do orçamento e da concorrência. Ninguém sério promete prazo de resultado.',
      },
    ],
    mensagem: 'Olá, Abram! Vim pela página de Google Ads e quero conversar sobre anúncios.',
  },
  {
    slug: 'anuncios-instagram-facebook',
    nome: 'Meta Ads',
    titulo: 'Anúncios no Instagram e Facebook · Abram Digital',
    descricao:
      'Meta Ads com objetivo de mensagens, cadastro ou venda, não impulsionar post. Públicos, criativos e Pixel com API de conversões, de Goiânia para o Brasil.',
    h1: 'Anúncios no Instagram e no Facebook',
    og: ['Instagram e', 'Facebook Ads.'],
    resumo:
      'Campanhas no Meta Ads com objetivo de mensagens, cadastro ou venda, e não "impulsionar publicação". Públicos, criativos e o Pixel com a API de conversões, para o algoritmo aprender com quem de fato chamou você.',
    quando: [
      'Você impulsiona posts e não vê retorno em conversa',
      'O seu cliente ainda não sabe que precisa de você',
      'Você quer falar de novo com quem já visitou o site ou o perfil',
      'Você tem fotos e vídeos bons do seu trabalho',
    ],
    entregamos: [
      'Campanhas por objetivo: mensagens no WhatsApp, cadastro ou venda',
      'Públicos por região, interesse e remarketing',
      'Orientação do que gravar e de como montar os criativos',
      'Pixel e API de conversões instalados e testados',
      'Leitura do custo por conversa e ajuste de públicos e criativos',
    ],
    passos: [
      {
        titulo: 'Conta e Pixel',
        texto: 'Gerenciador de negócios organizado, Pixel e API de conversões ligados ao site.',
      },
      {
        titulo: 'Objetivo certo',
        texto:
          'A campanha otimiza para o que você quer (conversa, cadastro ou venda), não para curtida.',
      },
      {
        titulo: 'Criativos',
        texto:
          'Peças a partir do seu material, com a mesma promessa da página que recebe o clique.',
      },
      {
        titulo: 'Ajuste',
        texto:
          'Trocar o criativo que cansou, cortar o público que não responde, reforçar o que traz conversa.',
      },
    ],
    perguntas: [
      {
        pergunta: 'Qual a diferença para o "impulsionar"?',
        resposta:
          'Impulsionar é o anúncio mais simples do Meta, feito a partir de um post, com poucas opções de objetivo e de público. No Gerenciador de Anúncios dá para escolher o objetivo (mensagens, cadastro, venda), montar públicos e medir conversões com o Pixel.',
      },
      {
        pergunta: 'Funciona para negócio local?',
        resposta:
          'Sim. Dá para anunciar só para quem mora ou passa perto do seu endereço, num raio que você escolhe.',
      },
      {
        pergunta: 'Preciso de perfil profissional no Instagram?',
        resposta:
          'Sim: o perfil precisa ser profissional e estar ligado a uma conta de anúncios no Meta. Se ainda não estiver, organizamos isso no começo.',
      },
    ],
    mensagem: 'Olá, Abram! Vim pela página de anúncios no Instagram e quero conversar.',
  },
]

/** As páginas com o aprofundamento (blocos e perguntas a mais) de paginasDetalhe.ts. */
export const PAGINAS: PaginaServico[] = BASE.map((p) => {
  const extra = EXTRAS[p.slug]
  return extra
    ? { ...p, detalhe: extra.detalhe, perguntas: [...p.perguntas, ...extra.perguntas] }
    : p
})

export function paginaDe(slug: string): PaginaServico | undefined {
  return PAGINAS.find((p) => p.slug === slug)
}
