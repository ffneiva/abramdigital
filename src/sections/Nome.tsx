import { Reveal } from '@/components/Reveal'
import { NOME_SIGNIFICADO as N } from '@/lib/business'
import { estado } from '@/lib/estados'

/**
 * O nome. Uma seção curta e centrada, sobre a galáxia: o que "Abram"
 * significa para os sócios e o versículo que resume o jeito de trabalhar.
 * Vem logo depois do que a gente não faz — é a razão daquela lista.
 */
export function Nome() {
  return (
    <section
      id="o-nome"
      data-s={estado('nome')}
      className="relative flex min-h-[90svh] items-center py-28"
    >
      <div className="container-x text-center">
        <Reveal>
          <p className="rotulo text-ouro">{N.rotulo}</p>
          <h2 className="titulo mx-auto mt-5 max-w-[18ch] text-[clamp(2.4rem,6vw,5.2rem)] text-marfim legivel">
            {N.titulo} <span className="enfase">{N.enfase}</span>
          </h2>
          <p className="mx-auto mt-7 max-w-[52ch] text-[1.08rem] leading-relaxed text-creme legivel">
            {N.texto}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <figure className="mx-auto mt-14 max-w-[40rem]">
            <span
              aria-hidden
              className="mx-auto mb-7 block h-px w-24 bg-gradient-to-r from-transparent via-ouro to-transparent"
            />
            <blockquote className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] leading-snug text-ouro-claro italic legivel">
              “{N.versiculo}”
            </blockquote>
            <figcaption className="rotulo mt-5 text-areia">{N.referencia}</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
