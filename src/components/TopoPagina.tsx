import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Simbolo } from './Logo'
import { SplitHeading } from './Reveal'

type Props = {
  rotulo: string
  titulo: string
  apoio?: ReactNode
  children?: ReactNode
  className?: string
}

/** O topo das páginas internas: a noite, um brilho de ouro e o símbolo na borda. */
export function TopoPagina({ rotulo, titulo, apoio, children, className }: Props) {
  return (
    <section
      className={cn(
        'relative overflow-hidden bg-noite pt-32 pb-14 text-marfim sm:pt-40 sm:pb-18',
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(40% 60% at 85% 20%, rgba(214,180,106,0.12), transparent 70%)',
        }}
      />
      <Simbolo className="absolute top-24 -right-16 w-[clamp(12rem,26vw,24rem)] opacity-[0.16] sm:right-6" />
      <div className="container-x relative">
        <p className="rotulo mb-6 flex items-center gap-3 text-ouro">
          <span aria-hidden className="h-px w-8 bg-current" />
          {rotulo}
        </p>
        <h1 className="titulo max-w-[18ch] text-[clamp(2.4rem,7vw,5.6rem)]">
          <SplitHeading text={titulo} />
        </h1>
        {apoio && (
          <div className="mt-7 max-w-[58ch] text-[1.06rem] leading-relaxed text-areia">{apoio}</div>
        )}
        {children}
      </div>
    </section>
  )
}
