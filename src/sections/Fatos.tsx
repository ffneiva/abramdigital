import { useEffect, useRef, useState } from 'react'
import { IconeSetaDiagonal } from '@/components/Icones'
import { Reveal, useEntrou } from '@/components/Reveal'
import { Titulo } from '@/components/Titulo'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { FATOS } from '@/lib/business'
import { estado } from '@/lib/estados'

/** Conta de 0 até o número quando entra na tela (sem motor: já nasce no valor). */
function Contador({ valor }: { valor: number }) {
  const reduzido = useReducedMotion()
  const { ref, visivel } = useEntrou(reduzido)
  const [n, setN] = useState(reduzido ? valor : 0)
  const feito = useRef(false)
  useEffect(() => {
    if (!visivel || feito.current) return
    feito.current = true
    if (reduzido) return setN(valor)
    const inicio = performance.now()
    let f = 0
    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / 1400)
      setN(Math.round(valor * (1 - (1 - t) ** 4)))
      if (t < 1) f = requestAnimationFrame(passo)
    }
    f = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(f)
  }, [visivel, valor, reduzido])
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>} className="tabular">
      {n}
    </span>
  )
}

/**
 * Por que as duas metades têm de andar juntas — dito pelo próprio Google,
 * com o link de cada fonte na tela.
 */
export function Fatos() {
  return (
    <section id="por-que" data-s={estado('fatos')} className="relative py-28 sm:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-2">
        <div className="grid gap-12">
          <Titulo
            rotulo="Por que juntas"
            titulo="O Google cobra"
            enfase="pela sua página."
            apoio="Não é opinião nossa. A página que recebe o clique entra na conta do anúncio — e na paciência de quem chega pelo celular."
          />
          <ol className="grid gap-5">
            {FATOS.map((f, i) => (
              <Reveal as="li" key={f.url} delay={i * 0.08} className="vidro rounded-3xl p-6 sm:p-8">
                <p className="flex items-baseline gap-3">
                  <span className="metal font-display text-[clamp(3.4rem,6vw,5rem)] leading-none font-extrabold tracking-[-0.06em]">
                    <Contador valor={Number(f.numero)} />
                  </span>
                  {f.unidade && <span className="rotulo text-ouro">{f.unidade}</span>}
                </p>
                <p className="mt-3 max-w-[46ch] text-[1.02rem] leading-relaxed text-creme">
                  {f.texto}
                </p>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener"
                  className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.72rem] tracking-[0.06em] text-areia underline-offset-4 hover:text-ouro hover:underline"
                >
                  Fonte: {f.fonte}
                  <IconeSetaDiagonal className="h-3.5 w-3.5" />
                </a>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
