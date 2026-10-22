# SEO da Abram Digital

Ranquear depende de cinco frentes: técnica (o site abre rápido e os robôs conseguem ler), conteúdo (responde de verdade o que a pessoa buscou), entidade (o Google sabe exatamente quem é a empresa), local (dados iguais em todo lugar) e autoridade (outros sites e pessoas falam dela). O site cuida das três primeiras; as duas últimas dependem de ações fora dele, no checklist do fim.

## O que está no site

**Robôs leem a página inteira (pré-renderização)**
- O site é um app React: antes, o HTML que chegava aos robôs tinha só cerca de 80 palavras por página, porque o conteúdo era desenhado no navegador. O Google até executa JavaScript, com atraso; os robôs de IA (ChatGPT, Claude, Perplexity) não executam e viam páginas vazias.
- Agora `scripts/prerender.mjs` roda no fim do `npm run build`: abre cada rota num Chrome sem tela, rola até o fim e grava o conteúdo no HTML. As páginas chegam com 850 a 1.960 palavras.
- Para quem visita nada muda: o conteúdo gravado fica invisível (`#root[data-pre]` no CSS) e o React o substitui pelo mesmo conteúdo vivo ao montar (`Montado` em `main.tsx`).
- No deploy pelo GitHub, o workflow instala o Chromium antes do build e exige a pré-renderização (`PRERENDER_OBRIGATORIO=1`).

**Conteúdo**
- Páginas de serviço aprofundadas (blocos "Em detalhe" e 3 perguntas a mais em cada, em `src/lib/paginasDetalhe.ts`): `/servicos/criacao-de-sites-goiania/`, `/servicos/landing-page-para-anuncios/`, `/servicos/google-ads-goiania/`, `/servicos/anuncios-instagram-facebook/`.
- Estudos de caso novos: `/projetos/paradizzo/` e `/projetos/ponta-da-vila/`, com vídeo do site e link para o site no ar (`src/lib/projetos.ts`).
- `/sobre/`: quem é a Abram, como trabalha e o porquê do nome.
- Links internos: serviços apontam para os estudos de caso, os estudos de caso para os serviços, e o rodapé para tudo.
- Textos sem travessão (45 trocados em 22/10/2026).

**Entidade (JSON-LD, gerado de `src/lib/seo.ts`)**
- A empresa (`https://abramdigital.com.br/#abram`) é `Organization` + `ProfessionalService` em todas as páginas, com logo, Goiânia, WhatsApp, Instagram e o perfil do Google em `sameAs`.
- Em cada página: `WebPage` (ou `AboutPage`), `BreadcrumbList`, e conforme a rota `Service` + `FAQPage` (serviços) ou `CreativeWork` + `VideoObject` (estudos de caso). Todos com `@id` estáveis.

**Técnico**
- Canonical, Open Graph com imagem própria por página (`npm run brand` gera), sitemap com data do último commit, robots liberando também os robôs de IA, `llms.txt` e `llms-full.txt` (texto completo das páginas para assistentes de IA).
- IndexNow: chave em `public/51543ebe95ef5d3a2b2a41921170bc49.txt`; `bash ../_infra-sites/indexnow-abram.sh` avisa Bing, Yandex e outros depois de cada deploy.
- Validação: `python -I scripts/validar-seo.py` depois do build (JSON-LD válido, todo `@id` resolvido, campos obrigatórios, um H1, alt em toda imagem, title e description no tamanho, nenhum travessão).
- Lighthouse no celular: páginas de serviço com desempenho 95, SEO 100, boas práticas 100, CLS 0. A home fica entre 43 e 47 de desempenho por causa do 3D (já era assim; melhorar exige mexer no visual).

## Como manter

```bash
npm run brand                    # imagens de compartilhamento (quando criar ou renomear página)
npm run build                    # build + pré-renderização
python -I scripts/validar-seo.py
bash ../_infra-sites/deploy-local.sh abramdigital && bash ../_infra-sites/comprimir-s3.sh abramdigital
bash ../_infra-sites/indexnow-abram.sh
```

Página nova: rota em `src/lib/routes.ts`, conteúdo em `src/lib/` e componente em `src/pages/`. O sitemap, o JSON-LD, o llms e a pré-renderização acompanham sozinhos.

## O que só o Felipe pode fazer

Lista viva: marque `[x]` quando fizer. Em ordem de impacto.

### Agora (poucos minutos)

- [ ] **Search Console: enviar o sitemap.** O arquivo de verificação `google306e90c4318f5ca7.html` já está no ar. Em **Sitemaps**, enviar `sitemap.xml` (10 páginas).
- [ ] **Search Console: pedir indexação das páginas novas e das que mudaram.** Em **Inspeção de URL** → **Solicitar indexação**:
  - https://abramdigital.com.br/
  - https://abramdigital.com.br/servicos/criacao-de-sites-goiania/
  - https://abramdigital.com.br/servicos/google-ads-goiania/
  - https://abramdigital.com.br/servicos/anuncios-instagram-facebook/
  - https://abramdigital.com.br/servicos/landing-page-para-anuncios/
  - https://abramdigital.com.br/projetos/paradizzo/
  - https://abramdigital.com.br/projetos/ponta-da-vila/
  - https://abramdigital.com.br/sobre/
- [ ] **Bing Webmaster Tools.** https://www.bing.com/webmasters → **Importar do Google Search Console**. O Bing alimenta o ChatGPT e o Copilot.
- [ ] **Liberar o token da Cloudflare** (tirar o filtro de IP). Com ele: limpar o cache das imagens de compartilhamento e ligar HTTP/3 e Early Hints. Não é preciso criar regras novas (a zona já usa as 10 Transform Rules do plano Free).

### Esta semana

- [ ] **Perfil da Empresa no Google** (já existe: g.page/r/Cf8gSaM7nu8FECE). Conferir nome "Abram Digital", telefone (62) 9355-7730 igual ao do site, site https://abramdigital.com.br, categoria "Agência de marketing" e "Web designer", serviços com os mesmos nomes das páginas, fotos.
- [ ] **Confirmar o WhatsApp.** O número tem 8 dígitos depois do DDD; se a conta usa o 9, trocar em `src/lib/business.ts` e no Perfil da Empresa (dados divergentes atrapalham).
- [ ] **CNPJ e e-mail.** Quando houver, entram no rodapé e nos dados estruturados (`business.ts`), o que reforça a confiança da entidade.
- [ ] **Mesmos dados em todo lugar (NAP).** Nome, telefone, site e cidade idênticos no Instagram @abramdigital.br, Facebook, LinkedIn e diretórios (Apontador, Guia Mais, Cylex).

### Sempre

- [ ] **Avaliações no Google.** Pedir a cada cliente satisfeito uma avaliação com texto, e responder todas.
- [ ] **Backlinks.** "Site por Abram Digital" com link no rodapé dos sites de clientes (Smarthere, Delamayer, Silverado), Behance, listas de agências de Goiânia, associações (CDL, ACIEG, Sebrae).
- [ ] **Um estudo de caso novo por mês**, com autorização do cliente.
- [ ] **Search Console uma vez por mês.** Relatório **Desempenho**: as buscas que já trazem gente viram ideia de página ou de pergunta frequente.

### Já feito

- [x] Arquivo de verificação do Google no ar.
- [x] Pré-renderização, páginas aprofundadas, estudos de caso, sobre, dados estruturados, llms.txt e IndexNow (22/10/2026).
