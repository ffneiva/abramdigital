import { Fragment, useRef } from 'react'
import { useCena } from '@/hooks/useCena'
import { MANIFESTO } from '@/lib/business'
import { estado } from '@/lib/estados'

/**
 * O manifesto, lido palavra a palavra: cada uma acende quando a rolagem
 * passa por ela (scrub), e as marcadas com asterisco acendem em ouro.
 *
 * Sem o motor, o texto nasce inteiro aceso — o apagado só existe dentro da
 * cena (`data-armada`).
 */
const PALAVRAS = MANIFESTO.split(' ').map((p) => ({
  texto: p.replace(/\*/g, ''),
  ouro: p.includes('*'),
}))

export function Manifesto() {
  const ref = useRef<HTMLElement>(null)

  useCena(ref, ({ gsap }, el) => {
    const palavras = el.querySelectorAll('[data-palavra]')
    gsap.fromTo(
      palavras,
      { opacity: 0.14 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 72%', end: 'bottom 62%', scrub: true },
      },
    )
    return undefined
  })

  return (
    <section
      ref={ref}
      id="manifesto"
      data-s={estado('manifesto')}
      aria-label="Manifesto"
      className="relative py-[22vh]"
    >
      <div className="container-x">
        <p className="rotulo mb-10 text-ouro">Por que a Abram existe</p>
        <p className="titulo max-w-[22ch] text-[clamp(2rem,5.2vw,4.6rem)] leading-[1.06] text-marfim legivel">
          {PALAVRAS.map((p, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: a frase é fixa e a posição é a identidade
            <Fragment key={i}>
              <span data-palavra className={p.ouro ? 'enfase' : undefined}>
                {p.texto}
              </span>{' '}
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  )
}
