import { BotaoContato } from '@/components/Contato'
import { IconeCheck, IconeSetaDiagonal } from '@/components/Icones'
import { Reveal } from '@/components/Reveal'
import { TopoPagina } from '@/components/TopoPagina'
import { PAGINAS } from '@/lib/paginas'
import { PROJETOS, projetoDe } from '@/lib/projetos'

/**
 * Estudo de caso (/projetos/<slug>/): o desafio, o que foi feito e o site no
 * ar para conferir. Mesma linguagem das páginas de serviço.
 */
export default function Projeto({ slug }: { slug: string }) {
  const p = projetoDe(slug)
  if (!p) return null
  const outro = PROJETOS.find((x) => x.slug !== slug)
  const host = new URL(p.url).host

  return (
    <>
      <TopoPagina
        rotulo={`Estudo de caso · ${p.segmento} · ${p.cidade}`}
        titulo={p.h1}
        apoio={p.resumo}
      >
        <nav aria-label="Trilha" className="mt-8 font-mono text-xs text-areia">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href="/" className="hover:text-marfim">
                Início
              </a>
            </li>
            <li aria-hidden>/</li>
            <li>
              <a href="/#trabalhos" className="hover:text-marfim">
                Trabalhos
              </a>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ouro">
              {p.nome}
            </li>
          </ol>
        </nav>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={p.url} target="_blank" rel="noopener" className="botao botao-ouro">
            Abrir o site <IconeSetaDiagonal className="h-4 w-4" />
          </a>
          <BotaoContato
            origem={`projeto-${p.slug}`}
            mensagem={p.mensagem}
            className="botao-linha"
            icone
          />
        </div>
      </TopoPagina>

      <section className="bg-carvao py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <a
              href={p.url}
              target="_blank"
              rel="noopener"
              aria-label={`Abrir o site ${p.nome} em nova aba`}
              className="block overflow-hidden rounded-[1.75rem] border border-borda"
            >
              <video
                className="aspect-[16/10] w-full object-cover"
                muted
                loop
                playsInline
                autoPlay
                preload="none"
                poster={p.poster}
                aria-label={`O site ${p.nome} rolando: ${p.resumo}`}
              >
                <source src={`${p.video}.webm`} type="video/webm" />
                <source src={`${p.video}.mp4`} type="video/mp4" />
              </video>
            </a>
          </Reveal>
          <p className="mt-4 font-mono text-xs text-areia">
            O site rolando, gravado da tela. No ar em{' '}
            <a
              href={p.url}
              target="_blank"
              rel="noopener"
              className="text-ouro-claro hover:underline"
            >
              {host}
            </a>
            .
          </p>
        </div>
      </section>

      <section className="bg-noite py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <h2 className="titulo text-[clamp(1.8rem,3.4vw,2.8rem)] text-marfim">
              O <span className="enfase">desafio</span>
            </h2>
            {p.desafio.map((t) => (
              <p key={t} className="mt-6 text-[1.05rem] leading-relaxed text-creme">
                {t}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.08} className="vidro rounded-[1.75rem] p-7 sm:p-9">
            <h2 className="titulo text-[clamp(1.8rem,3.4vw,2.8rem)] text-marfim">
              No <span className="enfase">site</span>
            </h2>
            <ul className="mt-8 grid gap-4">
              {p.tecnica.map((e) => (
                <li key={e} className="flex gap-3 text-[1rem] leading-relaxed text-marfim">
                  <IconeCheck className="mt-0.5 h-5 w-5 shrink-0 text-ouro" />
                  {e}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="bg-carvao py-20 sm:py-28">
        <div className="container-x">
          <h2 className="titulo text-[clamp(1.8rem,3.4vw,2.8rem)] text-marfim">
            O que foi <span className="enfase">feito</span>
          </h2>
          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {p.solucao.map((s, i) => (
              <Reveal
                as="li"
                key={s.titulo}
                delay={i * 0.06}
                className="rounded-3xl border border-borda p-6"
              >
                <p className="font-mono text-xs text-ouro">0{i + 1}</p>
                <h3 className="mt-3 font-display text-[1.3rem] font-bold tracking-[-0.02em] text-marfim">
                  {s.titulo}
                </h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-creme">{s.texto}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-noite py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div>
            <p className="rotulo text-ouro">Quer um assim?</p>
            <h2 className="titulo mt-4 text-[clamp(1.8rem,3.4vw,2.8rem)] text-marfim">
              Conte o seu <span className="enfase">projeto.</span>
            </h2>
            <p className="mt-6 max-w-[48ch] text-[1.05rem] leading-relaxed text-creme">
              Cada site nasce do zero, a partir do que você vende e de quem compra. A conversa
              começa pelo WhatsApp.
            </p>
            <BotaoContato
              origem={`projeto-${p.slug}-pe`}
              mensagem={p.mensagem}
              className="botao-ouro mt-8"
              icone
            />
          </div>
          <div>
            <p className="rotulo text-ouro">Continue</p>
            <ul className="mt-6 border-t border-marfim/12">
              {outro && (
                <li className="border-b border-marfim/12">
                  <a
                    href={`/projetos/${outro.slug}/`}
                    className="group flex items-center justify-between gap-4 py-5"
                  >
                    <span className="font-display text-[1.3rem] font-bold tracking-[-0.02em] text-marfim group-hover:text-ouro-claro">
                      Estudo de caso: {outro.nome}
                    </span>
                    <IconeSetaDiagonal className="h-5 w-5 shrink-0 text-ouro" />
                  </a>
                </li>
              )}
              {PAGINAS.map((o) => (
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
          </div>
        </div>
      </section>
    </>
  )
}
