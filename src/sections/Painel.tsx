import { useEffect, useState } from 'react'
import { Titulo } from '@/components/Titulo'
import { PAINEL } from '@/lib/business'
import { estado } from '@/lib/estados'
import { telemetria } from '@/lib/telemetria'

/**
 * O painel ao vivo: esta página medindo a si mesma, no aparelho de quem lê.
 *
 * Nenhum número aqui é escrito à mão. Saem da Navigation Timing e da
 * Resource Timing (o tempo de carregamento e o que foi transferido), do
 * `document.cookie` e da própria cena 3D (quadros por segundo e partículas).
 * É a prova social que dá para conferir na hora — e que não envelhece.
 */
type Medida = { id: string; valor: string; unidade: string; rotulo: string; nota: string }

function kb(bytes: number) {
  return bytes >= 1e6
    ? (bytes / 1e6).toFixed(2).replace('.', ',')
    : Math.round(bytes / 1000).toString()
}

function medir(): Medida[] {
  const nav = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined
  const recursos = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  const pronta = nav ? nav.domContentLoadedEventEnd : 0
  // transferSize 0 = veio do cache (ou de outra origem sem Timing-Allow-Origin).
  const total = (nav?.transferSize ?? 0) + recursos.reduce((s, r) => s + (r.transferSize || 0), 0)
  const origens = new Set(
    recursos.map((r) => new URL(r.name, location.href).origin).filter((o) => o !== location.origin),
  )
  const cookies = document.cookie ? document.cookie.split(';').filter(Boolean).length : 0
  const pesado = total >= 1e6

  return [
    {
      id: 'tempo',
      valor: pronta ? (pronta / 1000).toFixed(2).replace('.', ',') : '...',
      unidade: 's',
      rotulo: 'Página pronta',
      nota: 'Do clique até o conteúdo interativo, neste aparelho e nesta rede.',
    },
    {
      id: 'peso',
      valor: kb(total),
      unidade: pesado ? 'MB' : 'kB',
      rotulo: 'Transferido até agora',
      nota: 'Inclui o 3D, que só é baixado depois que a página já está de pé. Zero se veio do cache.',
    },
    {
      id: 'pedidos',
      valor: String(recursos.length + 1),
      unidade: 'arquivos',
      rotulo: 'Pedidos ao servidor',
      nota: 'Tudo o que a página precisou buscar até agora, fontes, código, imagens e o próprio HTML.',
    },
    {
      id: 'fps',
      valor: telemetria.ativa ? Math.round(telemetria.fps).toString() : '...',
      unidade: 'fps',
      rotulo: 'Quadros por segundo',
      nota: telemetria.ativa
        ? `${telemetria.particulas.toLocaleString('pt-BR')} partículas desenhadas pelo seu processador gráfico.`
        : 'O 3D está desligado aqui (movimento reduzido ou sem WebGL), e o site funciona igual.',
    },
    {
      id: 'terceiros',
      valor: String(origens.size),
      unidade: origens.size === 1 ? 'domínio' : 'domínios',
      rotulo: 'De terceiros',
      nota: origens.size
        ? `Pedidos feitos a: ${[...origens].map((o) => new URL(o).host).join(', ')}.`
        : 'Nenhuma fonte, script ou imagem de outra empresa foi pedida para montar esta página.',
    },
    {
      id: 'cookies',
      valor: String(cookies),
      unidade: 'cookies',
      rotulo: 'Gravados em você',
      nota: cookies
        ? 'Cookies que este navegador guarda para este endereço.'
        : 'Nada de rastreador para aparecer aqui. Nem banner pedindo licença.',
    },
  ]
}

export function Painel() {
  const [medidas, setMedidas] = useState<Medida[] | null>(null)

  useEffect(() => {
    const atualizar = () => setMedidas(medir())
    atualizar()
    const t = window.setInterval(atualizar, 700)
    return () => window.clearInterval(t)
  }, [])

  return (
    <section id="ao-vivo" data-s={estado('painel')} className="relative py-28 sm:py-36">
      <div className="container-x grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="lg:col-start-2">
          <Titulo
            rotulo="Ao vivo · medido agora"
            titulo={PAINEL.titulo}
            enfase={PAINEL.enfase}
            apoio={PAINEL.texto}
          />
          <dl className="vidro mt-12 grid overflow-hidden rounded-[1.75rem] sm:grid-cols-2">
            {(medidas ?? []).map((m, i) => (
              <div
                key={m.id}
                className={`border-borda p-6 sm:p-7 ${i < 5 ? 'border-b' : ''} ${i === 4 ? 'sm:border-b-0' : ''} ${i % 2 === 0 ? 'sm:border-r' : ''}`}
              >
                <dt className="rotulo flex items-center gap-2 text-areia">
                  <span className="pulso relative h-1.5 w-1.5 rounded-full bg-ouro text-ouro" />
                  {m.rotulo}
                </dt>
                <dd className="mt-3">
                  <span className="metal font-display text-[clamp(2.6rem,4.4vw,3.6rem)] leading-none font-extrabold tracking-[-0.05em] tabular">
                    {m.valor}
                  </span>{' '}
                  <span className="font-mono text-sm text-ouro">{m.unidade}</span>
                  <span className="mt-3 block max-w-[38ch] text-[0.88rem] leading-relaxed text-areia">
                    {m.nota}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
