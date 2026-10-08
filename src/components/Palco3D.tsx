import { type RefObject, useCallback, useEffect, useRef } from 'react'
import { estadoDaRolagem, TOTAL_ESTADOS } from '@/lib/estados'
import { telemetria } from '@/lib/telemetria'
import type { CenaBase } from '@/scene/base'
import type { CenaConstelacao, Leitura } from '@/scene/constelacao'
import { Cena3D } from './Cena3D'
import { Simbolo } from './Logo'

/**
 * O palco da constelação: um canvas fixo atrás da home inteira.
 *
 * A constelação não mora numa seção — ela atravessa a página. Cada seção
 * marca a sua posição com `data-s` (ver lib/estados.ts) e a cena interpola
 * entre as formas. O conteúdo rola por cima; as seções têm fundo
 * transparente (ou quase) para a constelação aparecer no lado livre.
 */
const carregarConstelacao = () =>
  import('@/scene/constelacao').then(
    ({ CenaConstelacao }) =>
      (canvas: HTMLCanvasElement, opcoes: { compacto?: boolean }) =>
        new CenaConstelacao(canvas, {
          ...opcoes,
          calmo: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        }),
  )

/** O que nunca vira arrasto nem onda: o que já tem função ao clicar. */
const INTERATIVO =
  'a, button, input, textarea, select, label, summary, [role="button"], [contenteditable], [data-sem-onda]'

type Props = { palco: RefObject<HTMLElement | null>; pronto: boolean }

export function Palco3D({ palco, pronto }: Props) {
  const cenaRef = useRef<CenaConstelacao | null>(null)
  const prontoRef = useRef(pronto)
  prontoRef.current = pronto

  const progresso = useCallback(() => {
    const raiz = palco.current
    if (!raiz) return 0
    return estadoDaRolagem(raiz, window.innerHeight / 2) / TOTAL_ESTADOS
  }, [palco])

  const aoMontar = useCallback((cena: CenaBase) => {
    const c = cena as CenaConstelacao
    cenaRef.current = c
    // `?foto`: a pose final na hora (para as capturas de tela automáticas).
    if (new URLSearchParams(window.location.search).has('foto')) c.pularAbertura()
    else if (prontoRef.current) c.abrir()
    c.aoQuadro = (l: Leitura) => {
      telemetria.ativa = true
      telemetria.fps = l.fps
      telemetria.particulas = l.particulas
    }
  }, [])

  // A cortina subiu: a galáxia começa a se fechar no "A".
  useEffect(() => {
    if (pronto) cenaRef.current?.abrir()
  }, [pronto])

  useInteracaoPelaPagina(cenaRef)

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(45% 55% at 70% 45%, rgba(214,180,106,0.07), transparent 70%), radial-gradient(60% 50% at 20% 110%, rgba(140,100,40,0.08), transparent 70%)',
        }}
      />
      <Cena3D
        carregar={carregarConstelacao}
        palco={palco}
        progresso={progresso}
        arrastavel
        aoMontar={aoMontar}
        reserva={
          <Simbolo className="w-[70vw] max-w-[34rem] opacity-60 max-lg:-translate-y-[22vh] lg:translate-x-[22vw]" />
        }
        className="h-full w-full"
      />
    </div>
  )
}

/**
 * Mouse e clique de qualquer ponto da página.
 *
 * O canvas fica atrás do conteúdo, que recebe os eventos. Então eles são
 * escutados na janela: arrastar fora de links e botões gira a constelação; um
 * clique simples (sem arrastar) solta uma onda a partir do ponto.
 */
function useInteracaoPelaPagina(cenaRef: RefObject<CenaConstelacao | null>) {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    let ativo = false
    let andou = 0
    let ux = 0
    let uy = 0
    let ut = 0
    const livre = (e: PointerEvent) =>
      !(e.target as Element | null)?.closest(INTERATIVO) && !window.getSelection()?.toString()
    const baixo = (e: PointerEvent) => {
      if (e.button !== 0 || e.target instanceof HTMLCanvasElement || !livre(e)) return
      ativo = true
      andou = 0
      ux = e.clientX
      uy = e.clientY
      ut = performance.now()
    }
    const mover = (e: PointerEvent) => {
      if (!ativo) return
      const agora = performance.now()
      const dx = e.clientX - ux
      const dy = e.clientY - uy
      andou += Math.hypot(dx, dy)
      if (andou > 6) {
        document.documentElement.style.cursor = 'grabbing'
        cenaRef.current?.arrastar(dx, dy, (agora - ut) / 1000)
      }
      ux = e.clientX
      uy = e.clientY
      ut = agora
    }
    const cima = (e: PointerEvent) => {
      if (!ativo) return
      ativo = false
      document.documentElement.style.cursor = ''
      if (andou <= 6) {
        cenaRef.current?.onda(
          (e.clientX / window.innerWidth) * 2 - 1,
          (e.clientY / window.innerHeight) * 2 - 1,
        )
      } else cenaRef.current?.soltar()
    }
    window.addEventListener('pointerdown', baixo)
    window.addEventListener('pointermove', mover, { passive: true })
    window.addEventListener('pointerup', cima)
    window.addEventListener('pointercancel', cima)
    return () => {
      window.removeEventListener('pointerdown', baixo)
      window.removeEventListener('pointermove', mover)
      window.removeEventListener('pointerup', cima)
      window.removeEventListener('pointercancel', cima)
      document.documentElement.style.cursor = ''
    }
  }, [cenaRef])
}
