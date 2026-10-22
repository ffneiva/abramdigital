import { useRef } from 'react'
import { Titulo } from '@/components/Titulo'
import { useCena } from '@/hooks/useCena'
import { ETAPAS } from '@/lib/business'
import { estado } from '@/lib/estados'
import { cn } from '@/lib/utils'

/**
 * O método, como uma constelação vertical: um fio de ouro desce pelo meio
 * conforme a rolagem e cada etapa acende quando ele chega nela. No desktop,
 * as etapas se alternam dos dois lados do fio.
 *
 * Sem o motor, o fio nasce inteiro e todas as etapas acesas.
 */
export function Metodo() {
  const ref = useRef<HTMLElement>(null)

  useCena(ref, ({ gsap, ScrollTrigger }, el) => {
    const lista = el.querySelector('[data-etapas]')
    gsap.fromTo(
      el.querySelector('[data-fio]'),
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: lista, start: 'top 60%', end: 'bottom 60%', scrub: true },
      },
    )
    for (const etapa of el.querySelectorAll<HTMLElement>('[data-etapa]')) {
      ScrollTrigger.create({
        trigger: etapa,
        start: 'top 62%',
        onEnter: () => etapa.setAttribute('data-acesa', ''),
        onLeaveBack: () => etapa.removeAttribute('data-acesa'),
      })
    }
    return undefined
  })

  return (
    <section ref={ref} id="metodo" data-s={estado('metodo')} className="relative py-28 sm:py-36">
      <div className="container-x">
        <Titulo
          centro
          rotulo="Método"
          titulo="Seis pontos."
          enfase="Uma linha só."
          apoio="Do primeiro café ao ajuste da campanha, a mesma equipe segura o fio, e ninguém culpa o outro lado."
          className="mx-auto max-w-[46rem]"
        />
        <ol data-etapas className="relative mx-auto mt-20 max-w-[64rem]">
          <span
            aria-hidden
            className="absolute top-0 bottom-0 left-[0.7rem] w-px bg-borda lg:left-1/2"
          />
          <span
            aria-hidden
            data-fio
            className="absolute top-0 bottom-0 left-[0.7rem] w-px origin-top bg-gradient-to-b from-ouro-claro via-ouro to-ouro-escuro shadow-[0_0_14px_rgba(214,180,106,0.7)] lg:left-1/2"
          />
          {ETAPAS.map((e, i) => (
            <li
              key={e.numero}
              data-etapa
              className={cn(
                'etapa relative pb-16 pl-12 last:pb-0 lg:w-1/2 lg:pl-0',
                i % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:ml-auto lg:pl-16',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'no-etapa absolute top-1 left-0 grid h-[1.45rem] w-[1.45rem] place-items-center rounded-full border border-ouro bg-noite',
                  i % 2 === 0 ? 'lg:right-[-0.725rem] lg:left-auto' : 'lg:left-[-0.725rem]',
                )}
              >
                <span className="h-2 w-2 rounded-full bg-ouro" />
              </span>
              <p className="font-mono text-xs tracking-[0.14em] text-ouro">{e.numero}</p>
              <h3 className="titulo mt-2 text-[clamp(1.7rem,3vw,2.6rem)] text-marfim">
                {e.titulo}
              </h3>
              <p
                className={cn(
                  'mt-3 max-w-[42ch] text-[1.02rem] leading-relaxed text-creme legivel',
                  i % 2 === 0 && 'lg:ml-auto',
                )}
              >
                {e.texto}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
