import { BotaoContato } from '@/components/Contato'
import { Simbolo } from '@/components/Logo'
import { Magnetic } from '@/components/Magnetic'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { HEROI } from '@/lib/business'
import { estado } from '@/lib/estados'
import { cn } from '@/lib/utils'

/**
 * O herói: duas linhas, um botão — e a constelação se fechando no "A" ao lado.
 *
 * O título sobe linha a linha por trás de uma máscara assim que a cortina
 * da abertura abre (`pronto`). O estado escondido só existe com a classe
 * `heroi-armado`, que só é posta com movimento liberado.
 */
type Props = { pronto: boolean; com3D: boolean }

function Linha({ texto, enfase, i }: { texto: string; enfase: string; i: number }) {
  const antes = texto.slice(0, texto.lastIndexOf(enfase)).trimEnd()
  return (
    <span data-linha className="block overflow-hidden pt-[0.12em] pb-[0.08em]">
      <span className="block" style={{ ['--i' as string]: i }}>
        {antes} <span className="enfase">{enfase}</span>
      </span>
    </span>
  )
}

export function Heroi({ pronto, com3D }: Props) {
  const reduzido = useReducedMotion()
  const armado = !reduzido

  return (
    <section
      id="topo"
      data-s={estado('heroi')}
      className={cn(
        'relative flex min-h-[100svh] items-end pb-14 lg:items-center lg:py-28',
        armado && 'heroi-armado',
        armado && pronto && 'heroi-pronto',
      )}
    >
      <div className="container-x relative grid w-full lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="max-w-[46rem] pt-[42svh] lg:pt-0">
          <p data-surge className="rotulo flex items-center gap-3 text-ouro">
            <span className="relative flex h-2 w-2">
              <span className="pulso relative h-2 w-2 rounded-full bg-ouro text-ouro" />
            </span>
            {HEROI.rotulo}
          </p>

          <h1 className="titulo mt-6 text-[clamp(2.5rem,5.6vw,5.4rem)] whitespace-nowrap max-[380px]:whitespace-normal text-marfim">
            {HEROI.linhas.map((l, i) => (
              <Linha key={l} texto={l} enfase={HEROI.enfase[i]} i={i} />
            ))}
          </h1>

          <p
            data-surge
            style={{ ['--i' as string]: 1 }}
            className="mt-7 max-w-[34rem] text-[1.08rem] leading-relaxed text-creme legivel"
          >
            {HEROI.texto}
          </p>

          <div
            data-surge
            style={{ ['--i' as string]: 2 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <BotaoContato origem="heroi" className="botao-ouro" icone />
            </Magnetic>
            <a href="#trabalhos" className="botao botao-linha" data-cursor="Ver">
              {HEROI.secundario}
            </a>
          </div>
        </div>

        {!com3D && (
          <div className="pointer-events-none absolute inset-x-0 top-24 grid place-items-center lg:static lg:place-items-center">
            <Simbolo className="w-[68vw] max-w-[30rem]" titulo="Símbolo da Abram Digital" />
          </div>
        )}
      </div>

      {/* A leitura do instrumento: o que dá para fazer com a constelação. */}
      {com3D && (
        <div
          data-surge
          style={{ ['--i' as string]: 4 }}
          className="pointer-events-none absolute right-0 bottom-8 left-0 hidden lg:block"
        >
          <div className="container-x flex items-end justify-end font-mono text-[0.68rem] tracking-[0.14em] text-areia uppercase">
            <span className="text-right leading-relaxed">
              Arraste para girar
              <br />
              Clique para soltar uma onda
            </span>
          </div>
        </div>
      )}
    </section>
  )
}
