import { BotaoContato } from '@/components/Contato'
import { IconeCheck, IconeSetaDiagonal } from '@/components/Icones'
import { Perguntas } from '@/components/Perguntas'
import { Reveal } from '@/components/Reveal'
import { TopoPagina } from '@/components/TopoPagina'
import { TRABALHOS_PUBLICADOS } from '@/lib/business'
import { PAGINAS, paginaDe } from '@/lib/paginas'
import { PROJETOS } from '@/lib/projetos'

/**
 * Página de serviço (/servicos/<slug>/) — a resposta para quem chega do
 * Google procurando uma coisa só.
 *
 * A ordem segue a pergunta de quem procura: "é isso que eu preciso?"
 * (quando faz sentido), "o que vem?" (o que entra), "como?" (os passos), as
 * dúvidas — e o botão já com a mensagem do serviço. No pé, os trabalhos e os
 * outros serviços: links internos que levam o Google (e a pessoa) pelo resto
 * do site.
 */
export default function Servico({ slug }: { slug: string }) {
  const p = paginaDe(slug)
  if (!p) return null
  const outros = PAGINAS.filter((x) => x.slug !== slug)

  return (
    <>
      <TopoPagina rotulo="Abram Digital · Goiânia" titulo={p.h1} apoio={p.resumo}>
        <nav aria-label="Trilha" className="mt-8 font-mono text-xs text-areia">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href="/" className="hover:text-marfim">
                Início
              </a>
            </li>
            <li aria-hidden>/</li>
            <li>
              <a href="/#servicos" className="hover:text-marfim">
                Serviços
              </a>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ouro">
              {p.nome}
            </li>
          </ol>
        </nav>
        <div className="mt-10 flex flex-wrap gap-3">
          <BotaoContato
            origem={`pagina-${p.slug}`}
            mensagem={p.mensagem}
            className="botao-ouro"
            icone
          />
          <a href="/#diagnostico" className="botao botao-linha">
            Diagnóstico em 30 segundos
          </a>
        </div>
      </TopoPagina>

      <section className="bg-carvao py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="titulo text-[clamp(1.8rem,3.4vw,2.8rem)] text-marfim">
              Quando faz <span className="enfase">sentido</span>
            </h2>
            <ul className="mt-8 grid gap-4">
              {p.quando.map((q) => (
                <li key={q} className="flex gap-3 text-[1.02rem] leading-relaxed text-creme">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ouro" />
                  {q}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="vidro rounded-[1.75rem] p-7 sm:p-9">
            <h2 className="titulo text-[clamp(1.8rem,3.4vw,2.8rem)] text-marfim">
              O que <span className="enfase">entra</span>
            </h2>
            <ul className="mt-8 grid gap-4">
              {p.entregamos.map((e) => (
                <li key={e} className="flex gap-3 text-[1rem] leading-relaxed text-marfim">
                  <IconeCheck className="mt-0.5 h-5 w-5 shrink-0 text-ouro" />
                  {e}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-noite py-20 sm:py-28">
        <div className="container-x">
          <h2 className="titulo text-[clamp(1.8rem,3.4vw,2.8rem)] text-marfim">
            Como <span className="enfase">funciona</span>
          </h2>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {p.passos.map((passo, i) => (
              <Reveal
                as="li"
                key={passo.titulo}
                delay={i * 0.06}
                className="rounded-3xl border border-borda p-6"
              >
                <p className="font-mono text-xs text-ouro">0{i + 1}</p>
                <h3 className="mt-3 font-display text-[1.3rem] font-bold tracking-[-0.02em] text-marfim">
                  {passo.titulo}
                </h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-creme">{passo.texto}</p>
              </Reveal>
            ))}
          </ol>
          {p.detalhe && (
            <div className="mt-20 grid gap-x-16 gap-y-12 lg:grid-cols-2">
              {p.detalhe.map((d) => (
                <Reveal key={d.titulo}>
                  <h3 className="font-display text-[clamp(1.4rem,2.4vw,1.9rem)] font-bold tracking-[-0.02em] text-marfim">
                    {d.titulo}
                  </h3>
                  {d.texto.map((t) => (
                    <p key={t} className="mt-4 text-[1.02rem] leading-relaxed text-creme">
                      {t}
                    </p>
                  ))}
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-carvao py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <h2 className="titulo text-[clamp(1.8rem,3.4vw,2.8rem)] text-marfim">
            Dúvidas sobre <span className="enfase">{p.nome}</span>
          </h2>
          <Perguntas itens={p.perguntas} />
        </div>
      </section>

      <section className="bg-noite py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div>
            <p className="rotulo text-ouro">Trabalhos</p>
            <h2 className="titulo mt-4 text-[clamp(1.8rem,3.4vw,2.8rem)] text-marfim">
              Sites que já <span className="enfase">fizemos.</span>
            </h2>
            <ul className="mt-8 grid gap-3">
              {TRABALHOS_PUBLICADOS.map((t) => (
                <li key={t.id} className="flex flex-wrap items-baseline gap-x-3 text-creme">
                  <span className="font-display font-bold text-marfim">{t.nome}</span>
                  <span className="text-sm text-areia">
                    {t.segmento} · {t.cidade}
                  </span>
                  {t.url && (
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1 text-sm text-ouro-claro hover:underline"
                    >
                      {new URL(t.url).host}
                      <IconeSetaDiagonal className="h-3.5 w-3.5" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <a href="/#trabalhos" className="botao botao-linha mt-8">
              Ver os trabalhos em vídeo
            </a>
            <p className="mt-8 font-mono text-xs text-areia">
              Estudos de caso:{' '}
              {PROJETOS.map((pr, i) => (
                <span key={pr.slug}>
                  {i > 0 && ' · '}
                  <a href={`/projetos/${pr.slug}/`} className="text-ouro-claro hover:underline">
                    {pr.nome}
                  </a>
                </span>
              ))}
            </p>
          </div>
          <div>
            <p className="rotulo text-ouro">Outros serviços</p>
            <ul className="mt-6 border-t border-marfim/12">
              {outros.map((o) => (
                <li key={o.slug} className="border-b border-marfim/12">
                  <a
                    href={`/servicos/${o.slug}/`}
                    className="group flex items-center justify-between gap-4 py-5"
                  >
                    <span className="font-display text-[1.3rem] font-bold tracking-[-0.02em] text-marfim group-hover:text-ouro-claro">
                      {o.h1}
                    </span>
                    <IconeSetaDiagonal className="h-5 w-5 shrink-0 text-ouro" />
                  </a>
                </li>
              ))}
            </ul>
            <BotaoContato
              origem={`pagina-${p.slug}-pe`}
              mensagem={p.mensagem}
              className="botao-ouro mt-10"
              icone
            />
          </div>
        </div>
      </section>
    </>
  )
}
