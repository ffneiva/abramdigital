import { useId } from 'react'
import { DEGRADE_OURO, FIOS, NOME, NOS, PONTOS, QUADRO, TRACO } from '@/lib/marca'
import { cn } from '@/lib/utils'

/**
 * A marca em SVG, desenhada a partir do grafo de lib/marca.ts.
 *
 * O símbolo sai em ouro (degradê) ou numa cor só (`cor`). `escala` engrossa
 * os fios para tamanhos pequenos — a 32 px, o fio fino de 2,6 unidades
 * some. `tracar` liga a animação da abertura: cada fio se desenha e cada nó
 * acende, em sequência (ver index.css, `.tracar`).
 */
type PropsSimbolo = {
  className?: string
  titulo?: string
  cor?: string
  escala?: number
  tracar?: boolean
}

export function Simbolo({ className, titulo, cor, escala = 1, tracar = false }: PropsSimbolo) {
  const id = useId().replace(/:/g, '')
  const tinta = cor ?? `url(#o${id})`
  const m = 12
  return (
    <svg
      viewBox={`${-m} ${-m} ${QUADRO.w + m * 2} ${QUADRO.h + m * 2}`}
      className={cn(tracar && 'tracar', className)}
      role={titulo ? 'img' : undefined}
      aria-hidden={titulo ? undefined : true}
      aria-label={titulo}
    >
      {!cor && (
        <defs>
          <linearGradient id={`o${id}`} x1="0" y1="0" x2="1" y2="1">
            {DEGRADE_OURO.map(([o, c]) => (
              <stop key={o} offset={o} stopColor={c} />
            ))}
          </linearGradient>
        </defs>
      )}
      <g stroke={tinta} strokeLinecap="round" fill="none">
        {FIOS.map(([a, b, g], i) => {
          const [x1, y1] = PONTOS[a]
          const [x2, y2] = PONTOS[b]
          return (
            <line
              key={`${a}-${b}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth={(g ? TRACO.grosso : TRACO.fino) * escala}
              pathLength={1}
              style={tracar ? { ['--i' as string]: i } : undefined}
            />
          )
        })}
      </g>
      <g fill={tinta}>
        {NOS.map(([p, r], i) => {
          const [x, y] = PONTOS[p]
          return (
            <circle
              key={p}
              cx={x}
              cy={y}
              r={r * Math.min(1.4, 0.75 + escala * 0.25)}
              style={tracar ? { ['--i' as string]: i } : undefined}
            />
          )
        })}
      </g>
    </svg>
  )
}

/** "ABRAM" pesado, "DIGITAL" leve — o logotipo original, em texto de verdade. */
export function Nome({ className }: { className?: string }) {
  return (
    <span className={cn('font-display uppercase tracking-[0.02em]', className)}>
      <span className="font-bold">{NOME.forte}</span>{' '}
      <span className="font-light">{NOME.leve}</span>
    </span>
  )
}

/** Símbolo + nome, em linha: o cabeçalho e o rodapé. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <Simbolo className="h-8 w-auto" escala={1.6} />
      <Nome className="text-[1.02rem] leading-none text-marfim" />
    </span>
  )
}
