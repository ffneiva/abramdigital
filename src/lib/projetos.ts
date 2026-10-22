/**
 * Estudos de caso (/projetos/<slug>/) e a página Sobre (/sobre/).
 *
 * Paradizzo e Ponta da Vila são vitrines feitas pela equipe para mostrar o
 * que um site de empreendimento pode ser: o texto diz isso, sem afirmar
 * contrato com a incorporadora e sem resultado de venda inventado. Tudo o que
 * está aqui pode ser conferido abrindo o site.
 */

export type Projeto = {
  slug: string
  nome: string
  titulo: string
  descricao: string
  h1: string
  og: readonly [string, string]
  segmento: string
  cidade: string
  url: string
  video: string
  poster: string
  resumo: string
  desafio: string[]
  solucao: { titulo: string; texto: string }[]
  tecnica: string[]
  mensagem: string
}

export const PROJETOS: Projeto[] = [
  {
    slug: 'paradizzo',
    nome: 'Paradizzo',
    titulo: 'Paradizzo: site 3D de empreendimento · Abram Digital',
    descricao:
      'Estudo de caso: o site do Paradizzo, em Goiânia, com a maquete inteira em 3D no navegador, do lago ao entardecer às janelas acesas à noite.',
    h1: 'Paradizzo: o prédio em 3D antes de existir',
    og: ['Paradizzo:', 'o prédio em 3D.'],
    segmento: 'Empreendimento residencial',
    cidade: 'Goiânia',
    url: 'https://paradizzo.abramdigital.com.br',
    video: '/videos/trabalhos/paradizzo',
    poster: '/images/trabalhos/paradizzo-capa.webp',
    resumo:
      'Um site de lançamento imobiliário em que a maquete é o próprio site: o visitante rola a página e voa pelo empreendimento, do lago ao entardecer até as unidades acesas à noite. Feito pela nossa equipe como vitrine do que um site de empreendimento pode ser.',
    desafio: [
      'Prédio na planta vende por imagem e confiança. O comprador ainda não pode visitar, e o site costuma ser um catálogo de renders parecido com o de todos os outros lançamentos.',
      'A meta era um site que fizesse a pessoa sentir o lugar: a vista, a luz do fim de tarde, o lazer, o andar dela. E que continuasse leve no celular, onde a maioria abre o link que recebe pelo WhatsApp.',
    ],
    solucao: [
      {
        titulo: 'A maquete vira o site',
        texto:
          'Uma maquete 3D procedural fica fixa atrás da página. Cada capítulo da rolagem leva a câmera a um ponto: a orla do lago, o mapa da região, a obra em raio-x, o lazer, a varanda e a noite com as janelas acesas.',
      },
      {
        titulo: 'Explorar com as mãos',
        texto:
          'Arrastar gira a câmera; na varanda, a pessoa olha em volta como se estivesse lá. A implantação é interativa e as plantas, a galeria e as proximidades ficam em seções próprias, fáceis de ler.',
      },
      {
        titulo: 'Leve onde importa',
        texto:
          'O 3D roda com resolução que se adapta ao aparelho e nada que pese é carregado antes da hora. Sem WebGL, o site mostra as imagens e continua completo.',
      },
    ],
    tecnica: [
      '3D em tempo real no navegador',
      'Implantação interativa',
      'Dia e noite',
      'Galeria com prévia instantânea',
      'Pronto para o celular',
    ],
    mensagem:
      'Olá, Abram! Vi o estudo de caso do Paradizzo e quero um site assim para o meu empreendimento.',
  },
  {
    slug: 'ponta-da-vila',
    nome: 'Ponta da Vila',
    titulo: 'Ponta da Vila: site 3D de loteamento · Abram Digital',
    descricao:
      'Estudo de caso: o Ponta da Vila, em Blumenau, com o vale real em 3D e os 268 lotes do projeto. Clique num lote e veja área, altitude e a vista dele.',
    h1: 'Ponta da Vila: o vale real, lote por lote',
    og: ['Ponta da Vila:', 'o vale em 3D.'],
    segmento: 'Loteamento',
    cidade: 'Blumenau',
    url: 'https://pontadavila.abramdigital.com.br',
    video: '/videos/trabalhos/pontadavila',
    poster: '/images/trabalhos/pontadavila-capa.webp',
    resumo:
      'O site de um condomínio de lotes com o terreno de verdade em 3D: o relevo, o rio e os 268 lotes do projeto. O visitante escolhe um lote, vê os dados dele e enxerga a vista que vai ter. Feito pela nossa equipe como vitrine do que um site de loteamento pode ser.',
    desafio: [
      'Quem compra lote compra o lugar: a inclinação, a vista, a distância do rio e do centro. Planta baixa e foto aérea não respondem essas perguntas, e o corretor passa horas explicando o mesmo mapa.',
      'O desafio era colocar o terreno inteiro na tela do celular, com cada lote clicável, sem travar.',
    ],
    solucao: [
      {
        titulo: 'O terreno de verdade',
        texto:
          'O relevo foi montado a partir de dados de elevação e corrigido pelas curvas do projeto; o rio e os prédios da região vêm de mapas abertos. Os 268 lotes foram posicionados a partir do projeto georreferenciado.',
      },
      {
        titulo: 'Clique no lote, veja a vista',
        texto:
          'Cada lote abre um painel com área, altitude e orientação, e um botão leva a câmera para a altura de um segundo andar naquele ponto, olhando para o vale. Daí sai a conversa no WhatsApp, já com o lote na mensagem.',
      },
      {
        titulo: 'A luz conta a história',
        texto:
          'O site percorre um dia inteiro: entardecer, o rio, o explorador de lotes, o lazer, o crepúsculo e a noite com as ruas do parque acesas em sequência, até o amanhecer.',
      },
    ],
    tecnica: [
      'Relevo real em 3D',
      '268 lotes clicáveis',
      'Vista de cada lote',
      'Luzes à noite',
      'Resolução que se adapta ao aparelho',
    ],
    mensagem:
      'Olá, Abram! Vi o estudo de caso do Ponta da Vila e quero um site assim para o meu loteamento.',
  },
]

export const projetoDe = (slug: string) => PROJETOS.find((p) => p.slug === slug)

export const SOBRE = {
  titulo: 'Sobre a Abram Digital · Sites e tráfego pago em Goiânia',
  descricao:
    'Quem é a Abram Digital: uma equipe de Goiânia que faz o site e os anúncios juntos, para o clique pago virar conversa. Como trabalhamos e no que acreditamos.',
  h1: 'A mesma equipe nas duas pontas',
  resumo:
    'A Abram Digital nasceu em Goiânia para resolver um problema simples: quem faz o anúncio raramente é quem faz o site, e o clique pago cai numa página que não foi pensada para ele. Aqui as duas metades são feitas juntas.',
  blocos: [
    {
      titulo: 'O que fazemos',
      texto: [
        'Sites sob medida, landing pages para anúncio e gestão de tráfego pago no Google Ads e no Meta Ads (Instagram e Facebook). Também criamos identidade visual quando a marca ainda não existe ou precisa nascer de novo junto com o site.',
        'O atendimento é por WhatsApp e videochamada, para qualquer cidade.',
      ],
    },
    {
      titulo: 'Como trabalhamos',
      texto: [
        'Começamos por uma conversa sobre o seu negócio e o seu cliente. Depois vem o roteiro e o texto, o design e o código, com prévia para você aprovar, e só então o site vai ao ar com a medição ligada. Nos anúncios, acompanhamos os números e ajustamos a campanha e a página, porque somos nós dos dois lados.',
      ],
    },
    {
      titulo: 'Em que acreditamos',
      texto: [
        'Preferimos prometer menos e entregar o que dá para medir. Não vendemos posição no Google, seguidores ou resultado garantido; entregamos um site rápido, claro e bem estruturado e campanhas acompanhadas de perto.',
      ],
    },
  ],
}
