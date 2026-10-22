import { BotaoContato } from '@/components/Contato'
import { IconeWhatsApp } from '@/components/Icones'
import { Magnetic } from '@/components/Magnetic'
import { Perguntas } from '@/components/Perguntas'
import { Reveal } from '@/components/Reveal'
import { Titulo } from '@/components/Titulo'
import { EMPRESA, FAQ, NAO_FAZEMOS } from '@/lib/business'
import { estado } from '@/lib/estados'

/**
 * O que a Abram NÃO faz — a seção mais corajosa. Cada promessa do mercado
 * aparece riscada por um fio de ouro, que corre quando ela entra na tela.
 */
export function NaoFazemos() {
  return (
    <section id="nao-fazemos" data-s={estado('nao-fazemos')} className="relative py-28 sm:py-36">
      <div className="container-x">
        <div className="max-w-[44rem]">
          <Titulo
            rotulo="O que a gente não faz"
            titulo="Algumas promessas"
            enfase="a gente recusa."
            apoio="Se alguém prometer isso a você, desconfie. Inclusive se formos nós."
          />
          <ul className="mt-14 grid gap-2">
            {NAO_FAZEMOS.map((n, i) => (
              <Reveal
                as="li"
                key={n.titulo}
                delay={i * 0.06}
                className="riscado border-b border-borda py-7"
              >
                <h3 className="relative inline-block font-display text-[clamp(1.4rem,2.8vw,2.2rem)] leading-tight font-bold tracking-[-0.03em] text-marfim">
                  {n.titulo}
                  <span
                    aria-hidden
                    className="risco"
                    style={{ transitionDelay: `${0.35 + i * 0.06}s` }}
                  />
                </h3>
                <p className="mt-3 max-w-[54ch] text-[1rem] leading-relaxed text-creme legivel">
                  {n.texto}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export function Duvidas() {
  return (
    <section id="duvidas" data-s={estado('duvidas')} className="relative py-28 sm:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <Titulo rotulo="Dúvidas" titulo="O que perguntam" enfase="antes de começar." />
        <div className="vidro rounded-[1.75rem] px-6 sm:px-9">
          <Perguntas itens={FAQ} />
        </div>
      </div>
    </section>
  )
}

/**
 * O fecho: a constelação volta a ser o "A", inteiro, no centro — e embaixo
 * dele, a frase e o botão.
 */
export function Fecho() {
  return (
    <section
      id="contato"
      data-s={estado('fecho')}
      className="relative flex min-h-[100svh] items-end pt-[55svh] pb-24"
    >
      <div className="container-x text-center">
        <p className="rotulo text-ouro">Próximo passo</p>
        <h2 className="titulo mx-auto mt-5 max-w-[16ch] text-[clamp(2.6rem,7vw,6.4rem)] text-marfim legivel">
          Toda constelação começa com <span className="enfase">um ponto.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-[40ch] text-[1.08rem] leading-relaxed text-creme legivel">
          O seu começa com uma mensagem. Conta o que você vende, a gente responde com o caminho.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <Magnetic>
            <BotaoContato
              origem="fecho"
              className="botao-ouro min-h-[3.75rem] px-9 text-base"
              icone
            />
          </Magnetic>
          <a
            href={`https://wa.me/${EMPRESA.whatsapp}`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 font-mono text-sm text-areia hover:text-ouro"
          >
            <IconeWhatsApp className="h-4 w-4" />
            <span className="tabular">{EMPRESA.telefone}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
