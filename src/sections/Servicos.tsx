import { useId, useState } from 'react'
import { IconeMais, IconeSetaDiagonal } from '@/components/Icones'
import { Titulo } from '@/components/Titulo'
import { SERVICOS } from '@/lib/business'
import { estado } from '@/lib/estados'
import { cn } from '@/lib/utils'

/**
 * Os serviços, numa lista que abre um de cada vez. O resumo fica sempre à
 * vista; o detalhe e os itens, a um clique. A galáxia gira do lado esquerdo.
 */
export function Servicos() {
  const [aberto, setAberto] = useState(0)
  const id = useId()

  return (
    <section id="servicos" data-s={estado('servicos')} className="relative py-28 sm:py-36">
      <div className="container-x grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="lg:col-start-2">
          <Titulo
            rotulo="Serviços"
            titulo="Tudo o que fica"
            enfase="entre o clique e a conversa."
          />
          <ul className="mt-14 border-t border-marfim/12">
            {SERVICOS.map((s, i) => {
              const esta = aberto === i
              return (
                <li key={s.id} className="border-b border-marfim/12">
                  <h3>
                    <button
                      type="button"
                      id={`${id}-b${i}`}
                      aria-expanded={esta}
                      aria-controls={`${id}-p${i}`}
                      onClick={() => setAberto(esta ? -1 : i)}
                      className="group grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 py-6 text-left sm:grid-cols-[4rem_1fr_auto]"
                    >
                      <span className="font-mono text-xs text-ouro">0{i + 1}</span>
                      <span>
                        <span
                          className={cn(
                            'block font-display text-[clamp(1.3rem,2.4vw,2rem)] leading-tight font-bold tracking-[-0.03em] transition-colors duration-500',
                            esta ? 'text-ouro-claro' : 'text-marfim group-hover:text-ouro-claro',
                          )}
                        >
                          {s.nome}
                        </span>
                        <span className="mt-1 block text-[0.95rem] text-areia">{s.resumo}</span>
                      </span>
                      <span
                        className={cn(
                          'grid h-10 w-10 place-items-center rounded-full border border-marfim/25 transition-[transform,background-color,color,border-color] duration-500 ease-[var(--ease-sh)]',
                          esta && 'rotate-45 border-ouro bg-ouro text-noite',
                        )}
                      >
                        <IconeMais className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <section
                    id={`${id}-p${i}`}
                    aria-labelledby={`${id}-b${i}`}
                    className="grid transition-[grid-template-rows] duration-500 ease-[var(--ease-sh)]"
                    style={{ gridTemplateRows: esta ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <div className="grid gap-5 pb-8 pl-[4rem] sm:pl-[5rem]">
                        <p className="max-w-[56ch] text-[1.02rem] leading-relaxed text-creme">
                          {s.detalhe}
                        </p>
                        <ul className="flex flex-wrap gap-2">
                          {s.itens.map((it) => (
                            <li
                              key={it}
                              className="rounded-full border border-ouro/35 px-3.5 py-1.5 font-mono text-[0.7rem] tracking-[0.06em] text-ouro-claro"
                            >
                              {it}
                            </li>
                          ))}
                        </ul>
                        {s.pagina && (
                          <a
                            href={`/servicos/${s.pagina}/`}
                            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-ouro-claro underline-offset-4 hover:underline"
                          >
                            Tudo sobre {s.nome.toLowerCase()}
                            <IconeSetaDiagonal className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </section>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
