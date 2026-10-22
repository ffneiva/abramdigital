/**
 * O aprofundamento das páginas de serviço: blocos "Em detalhe" e perguntas a
 * mais. Separado de paginas.ts para o texto de base continuar curto de ler.
 *
 * Mesmas regras: sem preço, sem prazo fechado, sem promessa de posição ou de
 * resultado, e nada que envelheça (número de clientes, "este ano"...).
 */

export type Detalhe = { titulo: string; texto: string[] }
export type Extra = { detalhe: Detalhe[]; perguntas: { pergunta: string; resposta: string }[] }

export const EXTRAS: Record<string, Extra> = {
  'criacao-de-sites-goiania': {
    detalhe: [
      {
        titulo: 'Por que sob medida, e não um modelo pronto',
        texto: [
          'Um tema comprado resolve a aparência, mas não o argumento. Ele chega com seções pensadas para qualquer negócio, e o seu acaba encaixado nelas: o mesmo banner, os mesmos três ícones, o mesmo "sobre nós". Quem compara você com o concorrente vê dois sites iguais e decide pelo preço.',
          'No site sob medida, a ordem das seções nasce da pergunta que o seu cliente faz antes de comprar. Uma clínica precisa mostrar confiança antes de mostrar o preço; uma hamburgueria precisa dar fome antes de mostrar o endereço. O design vem depois desse roteiro, e é por isso que ele parece seu.',
        ],
      },
      {
        titulo: 'O que faz um site ser encontrado no Google',
        texto: [
          'O Google precisa entender do que a página trata e confiar que ela responde bem. Isso passa por coisas que ninguém vê: um título e uma descrição próprios em cada página, dados estruturados dizendo quem é a empresa e onde atende, mapa do site, endereço canônico, imagens com texto alternativo e velocidade no celular.',
          'Passa também pelo que todo mundo vê: conteúdo escrito para o que a pessoa digita. Por isso cada serviço importante ganha uma página própria, com as dúvidas reais de quem procura. Um site de uma página só raramente aparece para buscas diferentes.',
          'O que nenhum site controla é a concorrência e o tempo. A gente entrega tudo o que depende do site e configura o Google Search Console para você acompanhar as buscas que já trazem visitas.',
        ],
      },
      {
        titulo: 'Rápido no celular, sem mensalidade de construtor',
        texto: [
          'A maior parte de quem chega até você vem pelo celular, muitas vezes no 4G. Por isso o site é publicado como arquivos estáticos, servidos de perto por uma rede de distribuição, com imagens em formato leve e carregamento sob demanda. O resultado é uma página que abre rápido mesmo com animação e 3D.',
          'Hospedagem assim custa muito pouco por mês e não prende você a um construtor. O código é seu, o domínio fica no seu nome, e o site continua funcionando mesmo se um dia você trocar de agência.',
        ],
      },
    ],
    perguntas: [
      {
        pergunta: 'O site fica no meu nome?',
        resposta:
          'Sim. O domínio é registrado no seu nome e o código do site é entregue a você. Se um dia quiser mudar de equipe, o site vai junto.',
      },
      {
        pergunta: 'Dá para eu mesmo alterar textos e fotos depois?',
        resposta:
          'Ajustes pequenos a gente faz pelo WhatsApp, rápido. Se você precisa publicar com frequência (blog, cardápio que muda toda semana), combinamos uma área de edição simples na proposta.',
      },
      {
        pergunta: 'Vocês fazem o site com 3D e animação para qualquer negócio?',
        resposta:
          'Só quando ajuda a vender. Em alguns negócios o 3D mostra o produto melhor que foto (um prédio, um celular, um prato); em outros, o melhor site é limpo e direto. A escolha sai do roteiro, nunca do enfeite.',
      },
    ],
  },
  'landing-page-para-anuncios': {
    detalhe: [
      {
        titulo: 'Por que mandar o anúncio para a home costuma sair caro',
        texto: [
          'A home fala de tudo o que a empresa faz. Quem clicou num anúncio sobre um serviço específico chega e precisa procurar o que viu: muitos desistem antes de achar. Cada desistência é um clique pago que não virou conversa.',
          'A landing page resolve isso repetindo a promessa do anúncio logo no topo e levando a um único próximo passo. Quanto mais a página combina com o anúncio e com o que a pessoa buscou, melhor a experiência que o Google mede, e essa experiência entra no Índice de Qualidade, que pesa no custo de cada clique.',
        ],
      },
      {
        titulo: 'O que uma boa página de destino tem',
        texto: [
          'Um título que responde à busca, uma oferta clara, provas de que você entrega (fotos reais, como funciona, perguntas respondidas) e um botão que abre a conversa com a mensagem já escrita. Sem menu levando para outros lugares, sem formulário longo, sem pop-up atrapalhando.',
          'E medição: cada clique no botão é registrado como conversão no Google Ads e no Meta. É isso que permite ao algoritmo procurar mais pessoas parecidas com quem chamou, e a você saber quanto custou cada conversa.',
        ],
      },
      {
        titulo: 'Uma página para cada campanha',
        texto: [
          'Quando você anuncia serviços diferentes, ou fala com públicos diferentes, vale ter uma página para cada um. Como as páginas saem do mesmo projeto, criar uma variação é rápido: muda o texto, a oferta e as fotos, e a estrutura testada continua a mesma.',
          'Isso também permite testar. Duas versões de título ou de oferta disputam o mesmo orçamento, e os números mostram qual traz mais conversas. A página melhora com o tempo, junto com a campanha.',
        ],
      },
    ],
    perguntas: [
      {
        pergunta: 'A landing page aparece no Google sem anúncio?',
        resposta:
          'Ela pode aparecer, mas não é o objetivo. A página de anúncio é feita para converter quem já clicou; para ser encontrado na busca orgânica, o melhor é o site com uma página por serviço.',
      },
      {
        pergunta: 'Vocês fazem a página e os anúncios juntos?',
        resposta:
          'Sim, e é o que mais recomendamos. Quem escreve o anúncio escreve a página, então a promessa é a mesma dos dois lados e a medição já sai ligada.',
      },
      {
        pergunta: 'Preciso de formulário ou só o WhatsApp basta?',
        resposta:
          'Para a maioria dos negócios locais, o WhatsApp com a mensagem pronta converte melhor que formulário. Quando o seu comercial precisa de dados antes da conversa, colocamos um formulário curto, com poucos campos.',
      },
    ],
  },
  'google-ads-goiania': {
    detalhe: [
      {
        titulo: 'Pesquisa primeiro: aparecer para quem já está procurando',
        texto: [
          'No Google Ads, a campanha de pesquisa mostra o seu anúncio para quem digitou o serviço. É o tráfego mais quente que existe: a pessoa já tem a necessidade e está comparando opções. Por isso começamos por ela, com palavras-chave escolhidas pela intenção de compra e uma lista de palavras negativas para não pagar por buscas que não viram cliente.',
          'Quando a pesquisa está estável e medindo bem, Performance Max e YouTube entram para ampliar o alcance, sempre com as conversões configuradas para o algoritmo saber o que é um bom resultado para você.',
        ],
      },
      {
        titulo: 'Segmentação por região em Goiânia e no Brasil',
        texto: [
          'Um negócio local não precisa pagar por cliques de quem mora longe. A campanha pode mirar Goiânia inteira, alguns bairros ou um raio em volta do seu endereço, e mostrar o anúncio só nos horários em que alguém pode atender.',
          'Para quem vende para o país todo, a lógica muda: separamos campanhas por região ou por produto, para o orçamento ir para onde o custo por conversa é melhor.',
        ],
      },
      {
        titulo: 'O que você recebe para acompanhar',
        texto: [
          'Relatórios com o que importa para o caixa: quantas conversas e vendas vieram dos anúncios, quanto custou cada uma e o que mudamos desde a última vez. Os termos que as pessoas pesquisaram entram no relatório, porque é deles que saem os ajustes.',
          'A conta de anúncios fica no seu nome e você paga a verba direto ao Google. A gestão é nossa, mas o acesso e o histórico continuam seus.',
        ],
      },
    ],
    perguntas: [
      {
        pergunta: 'Quanto preciso investir no Google Ads?',
        resposta:
          'Depende do seu mercado: o custo do clique varia muito entre segmentos e cidades. Na conversa olhamos o seu caso e sugerimos uma verba para começar e medir, que você paga direto ao Google.',
      },
      {
        pergunta: 'Em quanto tempo os anúncios começam a trazer contato?',
        resposta:
          'A campanha de pesquisa costuma gerar cliques desde os primeiros dias. As primeiras semanas servem para aprender e ajustar; ninguém sério promete número de vendas antes de ver os dados.',
      },
      {
        pergunta: 'A conta de anúncios fica no meu nome?',
        resposta:
          'Sim. A conta é sua, com a sua forma de pagamento, e nós entramos como gestores. Se um dia a parceria acabar, o histórico continua com você.',
      },
    ],
  },
  'anuncios-instagram-facebook': {
    detalhe: [
      {
        titulo: 'Por que impulsionar publicação não é o mesmo que anunciar',
        texto: [
          'O botão "impulsionar" do Instagram otimiza para curtidas e alcance. Isso pode deixar o post bonito nos números, mas não diz ao Meta quem é o seu cliente. As campanhas no Gerenciador de Anúncios fazem o contrário: você escolhe o resultado que quer (conversa no WhatsApp, cadastro ou venda) e o algoritmo procura as pessoas com mais chance de fazer isso.',
          'Para o algoritmo aprender, ele precisa ver as conversões. Por isso instalamos o Pixel e a API de conversões, que mandam ao Meta cada clique no WhatsApp e cada cadastro, mesmo quando o navegador bloqueia rastreamento.',
        ],
      },
      {
        titulo: 'Criativo é o que mais pesa',
        texto: [
          'No Meta, a segmentação ficou cada vez mais automática; quem decide o resultado é o criativo. Testamos ângulos diferentes (o problema do cliente, a prova, a oferta) em imagem, carrossel e vídeo curto, e deixamos o orçamento ir para o que traz conversa mais barata.',
          'Você não precisa de estúdio: vídeos gravados no celular, bem roteirizados, costumam funcionar melhor que peças muito produzidas. Mandamos o roteiro e ajudamos a escolher o que gravar.',
        ],
      },
      {
        titulo: 'Do anúncio à conversa',
        texto: [
          'O anúncio pode abrir o WhatsApp direto, uma landing page ou um formulário do próprio Instagram. A escolha depende do que você vende: serviço de decisão rápida vai bem direto no WhatsApp; produto que precisa de explicação ganha com uma página antes.',
          'Em todos os casos, a mensagem chega identificada, e os relatórios mostram quanto custou cada conversa. É com esse número que decidimos onde colocar mais verba.',
        ],
      },
    ],
    perguntas: [
      {
        pergunta: 'Preciso ter muitos seguidores para anunciar?',
        resposta:
          'Não. O anúncio aparece para quem ainda não segue você. Um perfil organizado ajuda a passar confiança, mas o tamanho da conta não muda o alcance da campanha.',
      },
      {
        pergunta: 'Vocês criam as artes e os vídeos?',
        resposta:
          'Criamos as artes e os roteiros dos vídeos. A gravação pode ser sua, no celular, com o nosso roteiro; quando faz sentido, indicamos quem filme.',
      },
      {
        pergunta: 'Os anúncios aparecem no Facebook também?',
        resposta:
          'Aparecem onde o Meta entrega melhor: Instagram, Facebook, Messenger e a rede de parceiros. Quando um lugar traz conversa cara, tiramos ele da campanha.',
      },
    ],
  },
}
