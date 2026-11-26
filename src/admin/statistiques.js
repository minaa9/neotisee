import { getSession, isLive } from '../lib/store'

/** 1234 → « 1 234 » */
export const nombre = (n) => Math.round(n).toLocaleString('fr-FR')

/** Premier jour (AAAA-MM-JJ) d'une période de `jours` jours finissant aujourd'hui. */
export function debutPeriode(jours) {
  return new Date(Date.now() - (jours - 1) * 864e5).toISOString().slice(0, 10)
}

/** Noms GA4 → libellés de l'équipe. */
export const SOURCES = {
  'Organic Search': 'Recherche Google',
  Direct: 'Accès direct',
  'Organic Social': 'Réseaux sociaux',
  Referral: 'Sites partenaires',
  Unassigned: 'Non attribué',
  Email: 'E-mail',
  'Paid Search': 'Annonces',
  'Organic Video': 'Vidéo',
}
export const APPAREILS = { desktop: 'Ordinateur', mobile: 'Téléphone', tablet: 'Tablette', 'smart tv': 'Télévision' }
export const FIDELITE = { new: 'Nouveaux visiteurs', returning: 'Visiteurs fidèles' }
export const PAGES = {
  '/': 'Accueil',
  '/association': 'L’association',
  '/equipe': 'L’équipe',
  '/ateliers': 'Nos ateliers',
  '/actualites': 'Actualités',
  '/calendrier': 'Calendrier',
  '/livre-d-or': 'Livre d’or',
  '/contact': 'Contact',
  '/mentions-legales': 'Mentions légales',
  '/confidentialite': 'Confidentialité',
  '/cookies': 'Cookies',
}

/**
 * Chiffres de GA4 pour la période (7, 28 ou 90 jours).
 * Renvoie { etat: 'reel' | 'exemple' | 'erreur', donnees, message }.
 */
export async function chargerStatistiques(jours) {
  try {
    const session = isLive ? await getSession() : null
    const r = await fetch(`/.netlify/functions/ga4-statistiques?jours=${jours}`, {
      headers: session?.access_token ? { authorization: `Bearer ${session.access_token}` } : {},
    })
    const type = r.headers.get('content-type') || ''
    // En local (sans Netlify), la fonction n'existe pas : données d'exemple.
    if (!type.includes('application/json')) return { etat: 'exemple', raison: 'local', donnees: exemple(jours) }
    const data = await r.json()
    if (r.ok && data.configure === false) return { etat: 'exemple', raison: 'non-relie', donnees: exemple(jours) }
    if (!r.ok) return { etat: 'erreur', message: data.erreur || 'Statistiques indisponibles.', donnees: null }
    return { etat: 'reel', donnees: data }
  } catch {
    return { etat: 'exemple', raison: 'local', donnees: exemple(jours) }
  }
}

/**
 * Jeu de données d'EXEMPLE (affiché avec un bandeau « exemple ») tant que
 * GA4 n'est pas relié : il montre à quoi ressemblera la page, rien de plus.
 */
export function exemple(jours) {
  let graine = jours * 7919
  const hasard = () => ((graine = (graine * 16807) % 2147483647) / 2147483647)
  const auj = new Date()
  const parJour = Array.from({ length: jours }, (_, i) => {
    const d = new Date(auj)
    d.setDate(auj.getDate() - (jours - 1 - i))
    const weekend = d.getDay() === 0 || d.getDay() === 6
    const v = Math.round(8 + hasard() * 10 + (weekend ? 6 : 0) + i * 0.08)
    return { date: d.toISOString().slice(0, 10), visiteurs: v, sessions: Math.round(v * 1.25) }
  })
  const visiteurs = Math.round(parJour.reduce((s, x) => s + x.visiteurs, 0) * 0.72)
  const sessions = parJour.reduce((s, x) => s + x.sessions, 0)
  const k = jours / 28
  const tot = (f) => ({
    activeUsers: Math.round(visiteurs * f),
    newUsers: Math.round(visiteurs * 0.78 * f),
    sessions: Math.round(sessions * f),
    engagedSessions: Math.round(sessions * 0.61 * f),
    engagementRate: 0.61 - (1 - f) * 0.05,
    userEngagementDuration: Math.round(visiteurs * 96 * f),
    screenPageViews: Math.round(sessions * 2.6 * f),
    keyEvents: Math.round(5 * k * f),
  })
  return {
    configure: true,
    jours,
    maj: new Date().toISOString(),
    totaux: { actuel: tot(1), precedent: tot(0.86) },
    parJour,
    sources: [
      { nom: 'Organic Search', valeur: Math.round(sessions * 0.41) },
      { nom: 'Direct', valeur: Math.round(sessions * 0.27) },
      { nom: 'Organic Social', valeur: Math.round(sessions * 0.19) },
      { nom: 'Referral', valeur: Math.round(sessions * 0.09) },
      { nom: 'Unassigned', valeur: Math.round(sessions * 0.04) },
    ],
    appareils: [
      { nom: 'mobile', valeur: Math.round(visiteurs * 0.63) },
      { nom: 'desktop', valeur: Math.round(visiteurs * 0.33) },
      { nom: 'tablet', valeur: Math.round(visiteurs * 0.04) },
    ],
    fidelite: [
      { nom: 'new', valeur: Math.round(visiteurs * 0.78) },
      { nom: 'returning', valeur: Math.round(visiteurs * 0.22) },
    ],
    pages: [
      ['/', 0.34],
      ['/ateliers', 0.17],
      ['/calendrier', 0.14],
      ['/association', 0.1],
      ['/contact', 0.09],
      ['/actualites', 0.07],
      ['/equipe', 0.05],
    ].map(([nom, p]) => ({ nom, valeur: Math.round(sessions * 2.6 * p) })),
    villes: [
      ['Montpellier', 0.38],
      ['Paris', 0.14],
      ['Nîmes', 0.07],
      ['Toulouse', 0.06],
      ['Lyon', 0.05],
    ].map(([nom, p]) => ({ nom, valeur: Math.round(visiteurs * p) })),
    evenements: {
      actuel: { generate_lead: Math.round(4 * k), click_contact: Math.round(7 * k), click_event: Math.round(12 * k), form_start: Math.round(9 * k), file_download: Math.round(2 * k) },
      precedent: { generate_lead: Math.round(3 * k), click_contact: Math.round(6 * k), click_event: Math.round(9 * k), form_start: Math.round(7 * k), file_download: Math.round(1 * k) },
    },
  }
}
