/**
 * Consentement aux cookies.
 * Le choix est gardé dans le navigateur (localStorage) pendant 6 mois,
 * comme le recommande la CNIL, puis la bannière réapparaît.
 *
 * Aujourd'hui le site n'installe AUCUN cookie de mesure d'audience ni de
 * publicité. La catégorie « audience » est prête au cas où l'association
 * ajouterait un outil plus tard : il faudra alors le charger seulement si
 * getConsent()?.audience est vrai.
 */
const KEY = 'neotisse-cookies'
const SIX_MOIS = 1000 * 60 * 60 * 24 * 182
export const OPEN_EVENT = 'neotisse:cookies-open'
export const CHANGE_EVENT = 'neotisse:cookies-change'

export function getConsent() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (!saved || Date.now() - saved.date > SIX_MOIS) return null
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
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: value }))
  return value
}

/** Rouvre la bannière (lien « Gestion des cookies »). */
export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_EVENT))
