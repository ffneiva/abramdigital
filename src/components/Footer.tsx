import { registrar } from '@/lib/analytics'
import { EMPRESA, linkContato, SERVICOS } from '@/lib/business'
import { BotaoContato } from './Contato'
import { IconeEmail, IconeGithub, IconeInstagram, IconeMapa, IconeWhatsApp } from './Icones'
import { Nome, Simbolo } from './Logo'

/**
 * O rodapé: tudo o que se precisa para começar uma conversa, sem abrir mais
 * nada. Instagram, e-mail, cidade e CNPJ só aparecem quando existirem em
 * business.ts — o rodapé não guarda lugar para dado que não há.
 */
export function Footer() {
  const ano = new Date().getFullYear()
  return (
    <footer className="relative z-10 overflow-hidden border-t border-marfim/8 bg-noite pt-24 pb-10 text-areia">
      {/* O nome gigante, cortado na borda: assinatura, não informação. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-[3.2vw] text-center font-display text-[19vw] leading-none font-black tracking-[-0.05em] text-marfim/[0.03] uppercase select-none"
      >
        Abram
      </div>

      <div className="container-x relative">
        <div className="flex flex-col gap-10 border-b border-borda pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-5">
            <Simbolo className="w-16 shrink-0 sm:w-20" escala={1.4} titulo={EMPRESA.nome} />
            <div>
              <Nome className="text-[clamp(1.4rem,3vw,2rem)] text-marfim" />
              <p className="mt-2 max-w-[38ch] text-sm leading-relaxed">{EMPRESA.lema}</p>
            </div>
          </div>
          <BotaoContato origem="rodape" className="botao-ouro w-fit" icone />
        </div>

        <div className="grid gap-10 py-14 text-sm leading-relaxed sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="rotulo mb-3 text-ouro">Contato</p>
            <a
              href={linkContato()}
              target="_blank"
              rel="noopener"
              onClick={() => registrar('contato_clique', { origem: 'rodape-contato' })}
              className="inline-flex items-center gap-2 text-marfim hover:text-ouro"
            >
              <IconeWhatsApp className="h-4 w-4" />
              <span className="tabular">{EMPRESA.telefone}</span>
            </a>
            {EMPRESA.email && (
              <a
                href={`mailto:${EMPRESA.email}`}
                className="mt-2 flex items-center gap-2 text-marfim hover:text-ouro"
              >
                <IconeEmail className="h-4 w-4" />
                {EMPRESA.email}
              </a>
            )}
            <p className="mt-2">Atendimento por WhatsApp e videochamada.</p>
          </div>
          <div>
            <p className="rotulo mb-3 text-ouro">Serviços</p>
            <ul className="flex flex-col gap-1">
              {SERVICOS.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.pagina ? `/servicos/${s.pagina}/` : '/#servicos'}
                    className="hover:text-marfim"
                  >
                    {s.nome}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="rotulo mb-3 text-ouro">Explore</p>
            <ul className="flex flex-col gap-1">
              <li>
                <a href="/#trabalhos" className="hover:text-marfim">
                  Trabalhos
                </a>
              </li>
              <li>
                <a href="/#ao-vivo" className="hover:text-marfim">
                  Esta página, medida ao vivo
                </a>
              </li>
              <li>
                <a href="/#diagnostico" className="hover:text-marfim">
                  Diagnóstico em 30 segundos
                </a>
              </li>
              <li>
                <a href="/#duvidas" className="hover:text-marfim">
                  Dúvidas
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="rotulo mb-3 text-ouro">Onde</p>
            {EMPRESA.cidade && (
              <p className="text-marfim">
                {EMPRESA.cidade} – {EMPRESA.uf}
              </p>
            )}
            <p className="mt-1">Atendemos negócios de qualquer cidade do Brasil.</p>
            {EMPRESA.google && (
              <a
                href={EMPRESA.google}
                target="_blank"
                rel="noopener"
                className="mt-2 inline-flex items-center gap-2 hover:text-marfim"
              >
                <IconeMapa className="h-4 w-4" />
                Google Maps
              </a>
            )}
            {EMPRESA.instagram && (
              <a
                href={`https://www.instagram.com/${EMPRESA.instagram}/`}
                target="_blank"
                rel="noopener"
                onClick={() => registrar('instagram_clique', { origem: 'rodape' })}
                className="mt-2 flex items-center gap-2 hover:text-marfim"
              >
                <IconeInstagram className="h-4 w-4" />@{EMPRESA.instagram}
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-borda pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {ano} {EMPRESA.nome} · {EMPRESA.dominio}
            {EMPRESA.cnpj && ` · CNPJ ${EMPRESA.cnpj}`}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="/politica-de-privacidade/" className="hover:text-marfim">
              Política de privacidade
            </a>
            <a
              href="https://github.com/ffneiva"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 hover:text-marfim"
            >
              <IconeGithub className="h-3.5 w-3.5" />
              Desenvolvido por Felipe Neiva
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
