import { BotaoContato } from '@/components/Contato'
import { IconeSetaDiagonal } from '@/components/Icones'
import { Reveal } from '@/components/Reveal'
import { TopoPagina } from '@/components/TopoPagina'
import { NOME_SIGNIFICADO } from '@/lib/business'
import { PAGINAS } from '@/lib/paginas'
import { PROJETOS, SOBRE } from '@/lib/projetos'

/** Sobre (/sobre/): quem é a Abram, como trabalha e o porquê do nome. */
export default function Sobre() {
  return (
    <>
      <TopoPagina rotulo="Abram Digital · Goiânia" titulo={SOBRE.h1} apoio={SOBRE.resumo}>
        <nav aria-label="Trilha" className="mt-8 font-mono text-xs text-areia">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <a href="/" className="hover:text-marfim">
                Início
              </a>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ouro">
              Sobre
            </li>
          </ol>
        </nav>
        <div className="mt-10 flex flex-wrap gap-3">
          <BotaoContato origem="pagina-sobre" className="botao-ouro" icone />
        </div>
      </TopoPagina>

      <section className="bg-carvao py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-3">
          {SOBRE.blocos.map((b, i) => (
            <Reveal key={b.titulo} delay={i * 0.06}>
              <h2 className="titulo text-[clamp(1.6rem,2.8vw,2.3rem)] text-marfim">{b.titulo}</h2>
              {b.texto.map((t) => (
                <p key={t} className="mt-5 text-[1.02rem] leading-relaxed text-creme">
                  {t}
                </p>
              ))}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-noite py-20 sm:py-28">
        <div className="container-x max-w-[60rem]">
          <p className="rotulo text-ouro">O nome</p>
          <h2 className="titulo mt-4 text-[clamp(1.8rem,3.4vw,2.8rem)] text-marfim">
            {NOME_SIGNIFICADO.titulo} <span className="enfase">{NOME_SIGNIFICADO.enfase}</span>
          </h2>
          <p className="mt-6 text-[1.05rem] leading-relaxed text-creme">{NOME_SIGNIFICADO.texto}</p>
          <p className="mt-6 font-display text-[1.2rem] italic text-marfim">
            "{NOME_SIGNIFICADO.versiculo}"{' '}
            <span className="text-areia not-italic">({NOME_SIGNIFICADO.referencia})</span>
          </p>
        </div>
      </section>

      <section className="bg-carvao py-20 sm:py-28">
        <div className="container-x">
          <p className="rotulo text-ouro">Por onde seguir</p>
          <ul className="mt-6 grid border-t border-marfim/12 lg:grid-cols-2 lg:gap-x-12">
            {[
              ...PAGINAS.map((o) => ({ href: `/servicos/${o.slug}/`, nome: o.h1 })),
              ...PROJETOS.map((p) => ({
                href: `/projetos/${p.slug}/`,
                nome: `Estudo de caso: ${p.nome}`,
              })),
            ].map((l) => (
              <li key={l.href} className="border-b border-marfim/12">
                <a href={l.href} className="group flex items-center justify-between gap-4 py-5">
                  <span className="font-display text-[1.3rem] font-bold tracking-[-0.02em] text-marfim group-hover:text-ouro-claro">
                    {l.nome}
                  </span>
                  <IconeSetaDiagonal className="h-5 w-5 shrink-0 text-ouro" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
