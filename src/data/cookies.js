/**
 * Consentement aux cookies.
 * Le choix est gardé dans le navigateur (localStorage) pendant 12 mois
 * (la CNIL fixe un maximum de 13 mois), puis la bannière réapparaît.
 *
 * Google Analytics 4 (snippet Netlify) fonctionne en mode consentement :
 * index.html pose analytics_storage « denied » par défaut, et le choix
 * « audience » est transmis à gtag à chaque enregistrement.
 */
const KEY = 'neotisse-cookies'
const DUREE = 1000 * 60 * 60 * 24 * 365 // 12 mois
export const OPEN_EVENT = 'neotisse:cookies-open'
export const CHANGE_EVENT = 'neotisse:cookies-change'

export function getConsent() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (!saved || Date.now() - saved.date > DUREE) return null
    return saved
  } catch {
    return null
  }
}

export function saveConsent({ audience }) {
  const value = { necessaires: true, audience: !!audience, date: Date.now() }
  try {
    localStorage.setItem(KEY, JSON.stringify(value))
  } catch {
    // navigation privée : le choix vaut pour cette visite seulement
  }
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', { analytics_storage: value.audience ? 'granted' : 'denied' })
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: value }))
  return value
}

/** Rouvre la bannière (lien « Gestion des cookies »). */
export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_EVENT))
