# AGENTS.md

Instruções para qualquer agente de IA — de qualquer modelo — que for trabalhar
neste repositório. Também servem para humanos; são as mesmas regras.

> Este arquivo é a fonte. `CLAUDE.md` apenas aponta para cá.

---

## 1. O fluxo é Issue → branch → PR → merge

**Nenhuma mudança entra na `main` direto.**

```
1. Abra uma Issue (templates em .github/ISSUE_TEMPLATE).
2. Branch a partir da main:  fix/12-pose-do-funil · content/13-instagram
3. Commits em Conventional Commits (seção 2).
4. PR mencionando a Issue:   "Closes #12"
5. CI verde. Squash merge.
```

## 2. Commits

`tipo(escopo): descrição no imperativo, minúscula, sem ponto final`

**Tipos:** `feat`, `fix`, `content`, `refactor`, `perf`, `style`, `test`,
`docs`, `build`, `ci`, `chore`, `revert`.

**Escopos:** `heroi`, `secoes`, `trabalhos`, `painel`, `diagnostico`,
`marca`, `3d`, `seo`, `a11y`, `infra`, `ci`, `deps`, `docs`, `testes`.

```
content(trabalhos): acrescenta o site da Lottus ao portfólio
fix(3d): dt negativo no primeiro quadro tirava a pose da faixa
perf(3d): 13 mil partículas no celular
```

## 3. Onde as coisas moram

```
src/lib/business.ts   ← TODO o conteúdo: empresa, metades, fatos, serviços, trabalhos, método, diagnóstico, FAQ
src/lib/marca.ts      ← o símbolo como grafo (pontos, fios, nós) e a paleta — fonte do SVG, do favicon e da cena
src/lib/paginas.ts    ← o conteúdo das páginas por serviço (/servicos/<slug>/): uma busca, uma página
src/lib/estados.ts    ← o contrato entre as seções (data-s) e a cena: qual forma, onde, com que opacidade
src/lib/telemetria.ts ← o que a cena mede de si (fps, partículas), lido pelo painel ao vivo
src/lib/movimento.ts  ← o motor (GSAP + ScrollTrigger sob demanda) e o parallax declarativo
src/hooks/useCena.ts  ← arma uma cena de rolagem numa seção, e desfaz ao sair
src/lib/routes.ts     ← rotas e o <head> de cada uma
src/lib/seo.ts        ← JSON-LD (ProfessionalService) e llms.txt
src/scene/base.ts     ← o que toda cena 3D tem (estúdio de luz cozido, laço, arrasto)
src/scene/formas.ts   ← as formas das partículas (marca, galáxia, site, funil, gráfico, anel) — geometria pura
src/scene/constelacao.ts ← o shader das partículas, a escultura de ouro e a pose por estado
src/sections/         ← seções da home, na ordem em que aparecem (Resto.tsx explica a ordem)
scripts/              ← fontes, marca (favicon, ícones, OG), smoke do dev
tests/unit/           ← Vitest — lógica pura (inclui as 320 combinações do diagnóstico)
tests/e2e/            ← Playwright — contra o build de produção, servido como o S3 serve
```

**Regra dura:** texto que o visitante lê não fica em componente. Fica em
`business.ts`.

## 4. Regras de conteúdo

- **Nenhum preço no site.** O valor sai na proposta. O teste `nenhum preço`
  quebra se um `R$` aparecer.
- **Nada inventado.** Nenhum depoimento, nenhuma nota, nenhum "+300 clientes",
  nenhum "ROI de 10x". A prova social é o que dá para conferir: o portfólio
  (sites que se abrem) e o painel (números medidos na hora).
- **Fato tem fonte na tela**, com link. Hoje: Índice de Qualidade do Google
  Ads, Think with Google (53% no celular), Core Web Vitals.
- **Trabalho só entra no portfólio com `publicar: true`** — e só com o ok do
  cliente. Link só para o domínio do cliente, nunca para endereço provisório
  (o teste confere).
- **Proposta é marcada.** O jeito de trabalhar que o site promete está como
  `CONFIRMAR` em `business.ts` e listado no DEPLOY.md.
- **Dado que não existe fica `null`** — Instagram, e-mail, cidade, CNPJ. O
  site se adapta.
- **O símbolo é o da marca, retraçado.** Não "melhore" o desenho: os pontos de
  `marca.ts` foram conferidos por sobreposição com o arquivo original.

## 5. Movimento e acessibilidade

1. **Estado escondido nunca sobrevive a uma falha.** Cena só esconde algo
   dentro do `useCena` (com o motor presente, `data-armada`). Sem JS ou sem
   GSAP, tudo visível.
2. **`prefers-reduced-motion` desliga o movimento automático, não o 3D:**
   abertura, cursor, cenas GSAP, parallax e scroll suave saem; a constelação
   fica, em modo calmo (muda só com a rolagem da pessoa). No Windows a
   preferência vem ligada sem a pessoa saber. Só sem WebGL aparece o
   símbolo em SVG.
3. **Anime `transform` e `opacity`.** Altura: `grid-template-rows: 0fr → 1fr`.
4. **A constelação atravessa a página.** O canvas é fixo atrás da home
   (`components/Palco3D.tsx`) e o texto rola por cima; cada seção marca o seu
   estado com `data-s` (contrato em `lib/estados.ts`). A forma fica do lado
   oposto ao conteúdo; no celular ela vira fundo (45%), exceto no herói e no
   fecho.
5. **A cena roda no celular**, em modo `compacto` (13 mil partículas em vez de
   36 mil, DPR ≤ 1,5, sem antialias).

Um `<h1>` por página, todo botão com nome acessível, foco visível, região viva
anunciando troca de rota. O menu é diálogo modal de verdade.

## 6. Desempenho

O CI falha se o caminho crítico passar de **170 kB comprimidos** (hoje ~96).

Carregado sob demanda, e precisa continuar sendo: tudo abaixo do herói
(`sections/Resto.tsx`), `three` e a cena (quando o palco chega perto da
tela), `gsap`, `lenis` (só com mouse), `web-vitals`, `@sentry/react` e a
privacidade.

## 7. Antes de abrir o PR

```bash
npm run lint && npx tsc -b && npm run test && npm run knip
npm run check:dev && npm run build && npm run e2e
```

Mexeu na marca? `npm run brand` refaz favicon, ícones e a arte de
compartilhamento.

## 8. Publicação

Arquivos estáticos no **S3 (static website hosting) atrás da Cloudflare** —
sem CloudFront. **Custo operacional próximo de zero é restrição do projeto.**
Nada de servidor, banco ou mensalidade.

O S3 serve `/rota/` como `/rota/index.html` e responde `/rota` com 302 para
`/rota/`: por isso canonical, sitemap e links internos levam **barra final**.

**Nunca comite chave, ARN, ID de conta, token da Cloudflare ou ID de zona** —
o repositório é público. O `deploy.yml` lê tudo de `vars.*` e `secrets.*`.

## 9. Estilo de código

- **Português** em nomes e comentários.
- Comentário explica o **porquê**.
- Sem `any`, sem `console.log`.
- Aspas simples, sem ponto e vírgula, vírgula final, 100 colunas. O Biome cuida.
