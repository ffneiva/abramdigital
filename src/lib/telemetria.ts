/**
 * O que a cena 3D mede de si mesma, para o painel ao vivo ler.
 *
 * Um objeto mutável e não estado do React: a cena escreve 60 vezes por
 * segundo, e o painel lê quando quer (a cada meio segundo). Passar isso por
 * `setState` re-renderizaria a página inteira a cada quadro.
 */
export const telemetria = {
  /** A cena está desenhando? */
  ativa: false,
  fps: 0,
  particulas: 0,
}
