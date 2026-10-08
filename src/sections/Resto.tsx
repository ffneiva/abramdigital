import { Marquee } from '@/components/Marquee'
import { MARQUEE } from '@/lib/business'
import { Diagnostico } from './Diagnostico'
import { Fatos } from './Fatos'
import { Duvidas, Fecho, NaoFazemos } from './Fecho'
import { Manifesto } from './Manifesto'
import { Metades } from './Metades'
import { Metodo } from './Metodo'
import { Nome } from './Nome'
import { Painel } from './Painel'
import { Servicos } from './Servicos'
import { Trabalhos } from './Trabalhos'

/**
 * Tudo o que vem depois do herói, num chunk próprio, pedido em paralelo
 * com o bundle principal.
 *
 * A ordem é o argumento:
 *   Manifesto    — o problema: o dinheiro some entre o anúncio e o site
 *   Metades      — a resposta: as duas, juntas
 *   Fatos        — por quê, nas palavras do Google
 *   Serviços     — o que entra em cada metade
 *   Trabalhos    — a prova que dá para abrir
 *   Painel       — a prova que dá para medir, agora
 *   Método       — como, do começo ao ajuste
 *   Diagnóstico  — por onde começar, já com a mensagem pronta
 *   Não fazemos  — as promessas que a gente recusa
 *   O nome       — por que recusamos: Abram, exaltar a Deus
 *   Dúvidas      — o resto
 *   Fecho        — o "A" de volta, e o botão
 */
export default function Resto() {
  return (
    <>
      <div className="relative border-y border-marfim/8 bg-noite/40 py-6 backdrop-blur-sm">
        <Marquee duracao={40}>
          {MARQUEE.map((m) => (
            <span
              key={m}
              className="flex items-center gap-10 font-display text-[clamp(1.2rem,2.2vw,1.7rem)] font-semibold tracking-[-0.02em] whitespace-nowrap text-marfim/80"
            >
              {m}
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ouro" />
            </span>
          ))}
        </Marquee>
      </div>
      <Manifesto />
      <Metades />
      <Fatos />
      <Servicos />
      <Trabalhos />
      <Painel />
      <Metodo />
      <Diagnostico />
      <NaoFazemos />
      <Nome />
      <Duvidas />
      <Fecho />
    </>
  )
}
