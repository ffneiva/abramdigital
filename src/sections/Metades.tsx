import { IconeCheck } from '@/components/Icones'
import { Reveal } from '@/components/Reveal'
import { METADES } from '@/lib/business'
import { estado } from '@/lib/estados'

/**
 * As duas metades — o site e o tráfego —, cada uma com uma tela inteira.
 * Do lado direito, a constelação vira a janela de um site e, depois, o
 * redemoinho do funil. O texto fica à esquerda, em vidro.
 */
export function Metades() {
  return (
    <div id="o-que-fazemos">
      {METADES.map((m) => (
        <section
          key={m.id}
          data-s={estado(m.id)}
          aria-labelledby={`metade-${m.id}`}
          className="relative flex min-h-[105svh] items-center py-24"
        >
          <div className="container-x">
            <Reveal className="vidro max-w-[36rem] rounded-[1.75rem] p-7 sm:p-10">
              <p className="rotulo flex items-center gap-4 text-areia">
                <span className="font-display text-[2.6rem] leading-none font-extralight tracking-[-0.04em] text-ouro">
                  {m.numero}
                </span>
                A metade {m.numero === '01' ? 'que recebe' : 'que leva'}
              </p>
              <h2
                id={`metade-${m.id}`}
                className="titulo mt-6 text-[clamp(2.4rem,5vw,4.2rem)] text-marfim"
              >
                {m.titulo} <span className="enfase">{m.enfase}</span>
              </h2>
              <p className="mt-6 text-[1.05rem] leading-relaxed text-creme">{m.texto}</p>
              <ul className="mt-8 grid gap-3 border-t border-borda pt-7">
                {m.itens.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.98rem] text-marfim">
                    <IconeCheck className="mt-0.5 h-5 w-5 shrink-0 text-ouro" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      ))}
    </div>
  )
}
