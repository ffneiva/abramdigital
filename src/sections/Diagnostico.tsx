import { useState } from 'react'
import { BotaoContato } from '@/components/Contato'
import { Titulo } from '@/components/Titulo'
import { registrar } from '@/lib/analytics'
import { montarPlano, PERGUNTAS, type Respostas } from '@/lib/business'
import { estado } from '@/lib/estados'
import { cn } from '@/lib/utils'

/**
 * O diagnóstico: quatro perguntas de um toque e um ponto de partida — que
 * vira uma mensagem de WhatsApp já escrita. Roda inteiro no navegador; nada
 * é enviado antes de a pessoa tocar no botão.
 */
export function Diagnostico() {
  const [r, setR] = useState<Partial<Respostas>>({})
  const completo = PERGUNTAS.every((p) => r[p.id])
  const plano = completo ? montarPlano(r as Respostas) : null
  const respondidas = PERGUNTAS.filter((p) => r[p.id]).length

  return (
    <section id="diagnostico" data-s={estado('diagnostico')} className="relative py-28 sm:py-36">
      <div className="container-x grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="lg:col-start-2">
          <Titulo
            rotulo="Diagnóstico · 30 segundos"
            titulo="Por onde"
            enfase="começar?"
            apoio="Quatro toques. No fim, um ponto de partida honesto e a mensagem pronta para mandar, sem formulário, sem e-mail, sem cadastro."
          />

          <div className="vidro mt-12 rounded-[1.75rem] p-6 sm:p-9">
            <div className="mb-8 flex items-center gap-3" aria-hidden>
              {PERGUNTAS.map((p, i) => (
                <span
                  key={p.id}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors duration-500',
                    i < respondidas ? 'bg-ouro' : 'bg-marfim/10',
                  )}
                />
              ))}
            </div>

            <div className="grid gap-9">
              {PERGUNTAS.map((p, i) => (
                <fieldset key={p.id}>
                  <legend className="mb-4 flex items-baseline gap-3 font-display text-[1.2rem] font-bold tracking-[-0.02em] text-marfim">
                    <span className="font-mono text-xs font-normal text-ouro">0{i + 1}</span>
                    {p.titulo}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {p.opcoes.map((o) => {
                      const marcada = r[p.id] === o.id
                      return (
                        <button
                          key={o.id}
                          type="button"
                          aria-pressed={marcada}
                          onClick={() => {
                            setR((atual) => ({ ...atual, [p.id]: o.id }))
                            registrar('diagnostico_resposta', { pergunta: p.id, opcao: o.id })
                          }}
                          className={cn(
                            'rounded-full border px-4 py-2.5 text-left text-[0.92rem] transition-[background-color,color,border-color] duration-300',
                            marcada
                              ? 'border-ouro bg-ouro text-noite'
                              : 'border-marfim/18 text-creme hover:border-ouro/70 hover:text-marfim',
                          )}
                        >
                          {o.rotulo}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            <div
              className="grid transition-[grid-template-rows] duration-700 ease-[var(--ease-sh)]"
              style={{ gridTemplateRows: plano ? '1fr' : '0fr' }}
              aria-live="polite"
            >
              <div className="overflow-hidden">
                {plano && (
                  <div className="mt-10 border-t border-borda pt-9">
                    <p className="rotulo text-ouro">Seu ponto de partida</p>
                    <h3 className="titulo mt-3 text-[clamp(1.6rem,3vw,2.4rem)] text-marfim">
                      {plano.titulo}
                    </h3>
                    <ol className="mt-6 grid gap-3">
                      {plano.passos.map((passo, i) => (
                        <li
                          key={passo}
                          className="flex gap-4 text-[1rem] leading-relaxed text-creme"
                        >
                          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ouro/60 font-mono text-[0.65rem] text-ouro">
                            {i + 1}
                          </span>
                          {passo}
                        </li>
                      ))}
                    </ol>
                    <p className="mt-6 rounded-2xl bg-ouro/[0.07] p-4 text-[0.95rem] leading-relaxed text-ouro-claro">
                      {plano.nota}
                    </p>
                    <BotaoContato
                      origem="diagnostico"
                      mensagem={plano.mensagem}
                      className="botao-ouro mt-7"
                      icone
                    >
                      Mandar isso no WhatsApp
                    </BotaoContato>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
