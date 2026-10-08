import { useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { Nome, Simbolo } from './Logo'

/**
 * A abertura: o "A" se desenha fio a fio, os nós acendem, o nome sobe — e a
 * cortina abre para a constelação, que nesse instante começa a se fechar no
 * mesmo "A", agora em 3D. ~1,9 s; o three.js e os shaders preparam por trás.
 *
 * · **Só na home e só uma vez por sessão.**
 * · **Não espera nada.** Nem fonte, nem 3D: a cortina ouro-claro a troca de fonte,
 *   e a cena chega quando chegar.
 * · **Nunca prende a página.** Com movimento reduzido ela não existe; e um
 *   temporizador libera tudo mesmo que a animação não dispare.
 */
const CHAVE = 'abram:abertura'

function jaViu(): boolean {
  try {
    return sessionStorage.getItem(CHAVE) === '1'
  } catch {
    return false
  }
}

function marcarComoVista() {
  try {
    sessionStorage.setItem(CHAVE, '1')
  } catch {
    /* armazenamento bloqueado: mostrar de novo é o erro menos grave */
  }
}

export function devePreCarregar(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return !jaViu()
}

type Props = { aoTerminar: () => void }

export function Preloader({ aoTerminar }: Props) {
  const reduzido = useReducedMotion()
  const [fase, setFase] = useState<'selo' | 'saindo' | 'fim'>('selo')

  useEffect(() => {
    if (reduzido) {
      setFase('fim')
      aoTerminar()
      return
    }
    marcarComoVista()
    const sair = window.setTimeout(() => setFase('saindo'), 1700)
    const liberar = window.setTimeout(aoTerminar, 1850)
    const fim = window.setTimeout(() => setFase('fim'), 2800)
    return () => {
      window.clearTimeout(sair)
      window.clearTimeout(liberar)
      window.clearTimeout(fim)
    }
  }, [reduzido, aoTerminar])

  if (fase === 'fim') return null

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[500] grid place-items-center overflow-hidden bg-noite ${fase === 'saindo' ? 'abertura-saindo' : ''}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(40% 40% at 50% 50%, rgba(214,180,106,0.13), transparent 70%)',
        }}
      />
      <div className="abertura-selo relative flex flex-col items-center gap-7">
        <Simbolo tracar className="w-40 sm:w-52" escala={1.3} />
        <span className="abertura-sobe block" style={{ animationDelay: '1050ms' }}>
          <Nome className="text-xl tracking-[0.18em] text-marfim sm:text-2xl" />
        </span>
      </div>
    </div>
  )
}
