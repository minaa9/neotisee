/** Suivi Google Analytics 4 : n'envoie rien si le script gtag n'est pas chargé. */
export function track(name, params) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params)
  }
}

/** Écoute les clics sur les liens mailto: et tel: de toute la page. */
export function trackContactLinks() {
  const onClick = (e) => {
    const link = e.target.closest?.('a[href]')
    if (!link) return
    const href = link.getAttribute('href').trim().toLowerCase()
    if (href.startsWith('mailto:')) track('click_contact', { contact_type: 'email' })
    else if (href.startsWith('tel:')) track('click_contact', { contact_type: 'phone' })
  }
  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}
