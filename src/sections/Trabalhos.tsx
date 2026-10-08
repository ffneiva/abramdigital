import { type PointerEvent, useEffect, useRef } from 'react'
import { IconeSetaDiagonal } from '@/components/Icones'
import { Titulo } from '@/components/Titulo'
import { useCena } from '@/hooks/useCena'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { TRABALHOS_PUBLICADOS, type Trabalho } from '@/lib/business'
import { estado } from '@/lib/estados'

/**
 * Os trabalhos: a única prova que a Abram mostra é a que dá para abrir.
 *
 * Cada cartão é uma janela de navegador com o site dentro — em vídeo, com
 * os efeitos rodando de verdade (gravado com GPU, rolando a página). O vídeo
 * só é baixado e tocado quando o cartão entra na tela, e pausa quando sai.
 * O cartão inclina em 3D seguindo o ponteiro.
 *
 * No desktop, com o motor, a seção é pinada e a fila corre na horizontal
 * conforme a rolagem — o gesto de folhear um portfólio. Sem o motor, a fila
 * é uma rolagem horizontal nativa, com encaixe.
 */
function inclinar(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse') return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  el.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`)
  el.style.setProperty('--ry', `${(x * 9).toFixed(2)}deg`)
  el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`)
  el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`)
}

function endireitar(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--rx', '0deg')
  e.currentTarget.style.setProperty('--ry', '0deg')
}

/**
 * O vídeo do site, mudo e em laço. `preload="none"` e a capa (o primeiro
 * quadro, em AVIF/WebP) seguram o peso: nada de vídeo chega antes de o
 * cartão aparecer. Com movimento reduzido, fica só a capa.
 */
function Previa({ t }: { t: Trabalho }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduzido = useReducedMotion()

  useEffect(() => {
    const v = ref.current
    if (!v || reduzido) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.35 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [reduzido])

  const capa = `/images/trabalhos/${t.id}-capa`
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-noite">
      <picture>
        <source srcSet={`${capa}.avif`} type="image/avif" />
        <img
          src={`${capa}.webp`}
          width={960}
          height={600}
          loading="lazy"
          decoding="async"
          alt={`O site ${t.nome}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      {!reduzido && (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={`/videos/trabalhos/${t.id}.webm`} type="video/webm" />
          <source src={`/videos/trabalhos/${t.id}.mp4`} type="video/mp4" />
        </video>
      )}
    </div>
  )
}

function Cartao({ t, i }: { t: Trabalho; i: number }) {
  const host = t.url ? new URL(t.url).host : 'domínio em breve'
  return (
    <li className="cartao-trabalho w-[86vw] shrink-0 snap-center sm:w-[64vw] lg:w-[min(40rem,58vh)]">
      <article
        onPointerMove={inclinar}
        onPointerLeave={endireitar}
        className="inclina"
        style={{ ['--cor' as string]: t.cor }}
        data-cursor={t.url ? 'Abrir' : 'Ver'}
      >
        <div className="janela">
          <div className="flex items-center gap-3 border-b border-marfim/10 px-4 py-3">
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-marfim/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-marfim/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-marfim/20" />
            </span>
            <span className="truncate rounded-full bg-marfim/[0.06] px-3 py-1 font-mono text-[0.68rem] text-areia">
              {host}
            </span>
          </div>
          <Previa t={t} />
        </div>
        <div className="mt-6 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2">
          <span className="metal row-span-3 font-display text-[3rem] leading-none font-extralight tracking-[-0.05em]">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="font-display text-[1.6rem] leading-tight font-bold tracking-[-0.03em] text-marfim">
            {t.nome}
          </h3>
          <p className="rotulo text-areia">
            {t.segmento} · {t.cidade} · <span className="text-ouro">{t.feito}</span>
          </p>
          <p className="max-w-[44ch] text-[0.98rem] leading-relaxed text-creme">{t.destaque}</p>
        </div>
        {t.url && (
          <a
            href={t.url}
            target="_blank"
            rel="noopener"
            className="mt-5 ml-[4.6rem] inline-flex items-center gap-2 text-sm font-semibold text-ouro-claro underline-offset-4 hover:underline"
          >
            Abrir {host}
            <IconeSetaDiagonal className="h-4 w-4" />
          </a>
        )}
      </article>
    </li>
  )
}

export function Trabalhos() {
  const ref = useRef<HTMLElement>(null)

  useCena(ref, ({ gsap }, el) => {
    if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches) return undefined
    const fila = el.querySelector<HTMLElement>('[data-fila]')
    if (!fila) return undefined
    const distancia = () => fila.scrollWidth - window.innerWidth + 64
    gsap.to(fila, {
      x: () => -distancia(),
      ease: 'none',
      scrollTrigger: {
        trigger: el.querySelector('[data-pino]'),
        start: 'top top',
        end: () => `+=${distancia()}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    })
    return undefined
  })

  return (
    <section
      ref={ref}
      id="trabalhos"
      data-s={estado('trabalhos')}
      className="relative py-24 lg:py-0"
    >
      <div data-pino className="lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-12">
        <div className="container-x">
          <Titulo
            rotulo="Trabalhos"
            titulo="Não acredite em depoimento."
            enfase="Abra o site."
            apoio="Nada de logo de cliente famoso nem número redondo. Estes são sites que fizemos — os que já têm endereço próprio, é só abrir."
          />
        </div>
        <ul
          data-fila
          className="trilho-trabalhos mt-10 flex snap-x snap-mandatory gap-8 overflow-x-auto px-5 pb-6 sm:px-8 lg:gap-14 lg:px-14"
        >
          {TRABALHOS_PUBLICADOS.map((t, i) => (
            <Cartao key={t.id} t={t} i={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
