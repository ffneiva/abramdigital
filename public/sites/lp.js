/*
 * Landing page de criação de sites (abramdigital.com.br/sites/).
 *
 * Pixel da Meta passado pelo Carmelito em 03/11/2026. É o carregador oficial
 * do snippet, num arquivo próprio e não num <script> inline: a CSP do site
 * não libera 'unsafe-inline'. Eventos: PageView ao abrir e Contact no clique
 * de qualquer botão de WhatsApp (a conversão da campanha).
 */
;(function (f, b, e, v) {
  if (f.fbq) return
  var n = (f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
  })
  if (!f._fbq) f._fbq = n
  n.push = n
  n.loaded = true
  n.version = '2.0'
  n.queue = []
  var t = b.createElement(e)
  t.async = true
  t.src = v
  var s = b.getElementsByTagName(e)[0]
  s.parentNode.insertBefore(t, s)
})(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

window.fbq('init', '2290052041851322')
window.fbq('track', 'PageView')

document.addEventListener('click', function (ev) {
  var link = ev.target.closest && ev.target.closest('a[data-zap]')
  if (link) window.fbq('track', 'Contact', { origem: link.getAttribute('data-zap') })
})
