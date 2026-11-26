/**
 * Netlify Function · /.netlify/functions/ga4-statistiques?jours=28
 *
 * Va chercher les chiffres de Google Analytics 4 (API Google Analytics Data)
 * pour la page « Statistiques » du back-office. Réservée aux membres connectés :
 * le jeton Supabase envoyé par le back-office est vérifié à chaque appel.
 *
 * Variables d'environnement Netlify (voir docs/STATISTIQUES.md) :
 *   GA4_PROPERTY_ID      identifiant numérique de la propriété GA4 (ex. 512345678)
 *   GA4_SERVICE_ACCOUNT  contenu complet du fichier JSON du compte de service Google
 *   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY  (déjà présentes pour le site)
 */
import { createSign } from 'node:crypto'

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, max-age=300' },
  })

const env = (...names) => names.map((n) => process.env[n]).find(Boolean)

/** Le visiteur est-il connecté au back-office ? (jeton Supabase valide) */
async function estConnecte(req) {
  const url = env('VITE_SUPABASE_URL', 'SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL')
  const cle = env('VITE_SUPABASE_ANON_KEY', 'VITE_SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
  const jeton = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  if (!url || !cle || !jeton) return false
  const r = await fetch(`${url.replace(/\/$/, '')}/auth/v1/user`, { headers: { apikey: cle, authorization: `Bearer ${jeton}` } })
  return r.ok
}

/** Compte de service Google → jeton d'accès (lecture seule Analytics). */
async function jetonGoogle() {
  let email = process.env.GA4_CLIENT_EMAIL
  let cle = process.env.GA4_PRIVATE_KEY
  if (process.env.GA4_SERVICE_ACCOUNT) {
    const sa = JSON.parse(process.env.GA4_SERVICE_ACCOUNT)
    email = sa.client_email
    cle = sa.private_key
  }
  if (!email || !cle) throw new Error('compte de service manquant')
  cle = cle.replace(/\\n/g, '\n')

  const now = Math.floor(Date.now() / 1000)
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
  const entete = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({
    iss: email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  })}`
  const signature = createSign('RSA-SHA256').update(entete).sign(cle).toString('base64url')
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${entete}.${signature}` }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error_description || data.error || 'connexion Google refusée')
  return data.access_token
}

export default async (req) => {
  const propriete = process.env.GA4_PROPERTY_ID
  if (!propriete || !(process.env.GA4_SERVICE_ACCOUNT || (process.env.GA4_CLIENT_EMAIL && process.env.GA4_PRIVATE_KEY))) {
    return json(200, { configure: false })
  }
  if (!(await estConnecte(req))) return json(401, { erreur: 'Connexion au back-office requise.' })

  const jours = [7, 28, 90].includes(Number(new URL(req.url).searchParams.get('jours'))) ? Number(new URL(req.url).searchParams.get('jours')) : 28
  const actuel = { startDate: `${jours - 1}daysAgo`, endDate: 'today', name: 'actuel' }
  const precedent = { startDate: `${jours * 2 - 1}daysAgo`, endDate: `${jours}daysAgo`, name: 'precedent' }

  let token
  try {
    token = await jetonGoogle()
  } catch (e) {
    return json(500, { erreur: `Google Analytics : ${e.message}` })
  }

  const rapport = async (corps) => {
    const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propriete}:runReport`, {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify(corps),
    })
    const data = await r.json()
    if (!r.ok) throw new Error(data.error?.message || 'rapport impossible')
    return data
  }
  const lignes = (data) =>
    (data.rows || []).map((row) => ({
      d: (row.dimensionValues || []).map((x) => x.value),
      m: (row.metricValues || []).map((x) => Number(x.value)),
    }))

  const METRIQUES = ['activeUsers', 'newUsers', 'sessions', 'engagedSessions', 'engagementRate', 'userEngagementDuration', 'screenPageViews', 'keyEvents']
  const SUIVIS = ['generate_lead', 'click_contact', 'click_event', 'form_start', 'file_download']

  try {
    const [totaux, jour, sources, appareils, pages, evenements, villes, fidelite] = await Promise.all([
      rapport({ dateRanges: [actuel, precedent], metrics: METRIQUES.map((name) => ({ name })) }),
      rapport({ dateRanges: [actuel], dimensions: [{ name: 'date' }], metrics: [{ name: 'activeUsers' }, { name: 'sessions' }], orderBys: [{ dimension: { dimensionName: 'date' } }] }),
      rapport({ dateRanges: [actuel], dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'sessions' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 10 }),
      rapport({ dateRanges: [actuel], dimensions: [{ name: 'deviceCategory' }], metrics: [{ name: 'activeUsers' }] }),
      rapport({ dateRanges: [actuel], dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }], orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 8 }),
      rapport({
        dateRanges: [actuel, precedent],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: { filter: { fieldName: 'eventName', inListFilter: { values: SUIVIS } } },
      }),
      rapport({ dateRanges: [actuel], dimensions: [{ name: 'city' }], metrics: [{ name: 'activeUsers' }], orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }], limit: 6 }),
      rapport({ dateRanges: [actuel], dimensions: [{ name: 'newVsReturning' }], metrics: [{ name: 'activeUsers' }] }),
    ])

    // Plusieurs périodes : GA4 ajoute la dimension « dateRange » en dernier.
    const parPeriode = (rows, nom) => rows.filter((r) => r.d[r.d.length - 1] === nom)
    const totauxDe = (nom) => {
      const r = parPeriode(lignes(totaux), nom)[0]
      return Object.fromEntries(METRIQUES.map((k, i) => [k, r ? r.m[i] : 0]))
    }
    const ev = lignes(evenements)
    const evenementsDe = (nom) => Object.fromEntries(SUIVIS.map((s) => [s, parPeriode(ev, nom).find((r) => r.d[0] === s)?.m[0] || 0]))

    return json(200, {
      configure: true,
      jours,
      maj: new Date().toISOString(),
      totaux: { actuel: totauxDe('actuel'), precedent: totauxDe('precedent') },
      parJour: lignes(jour).map((r) => ({ date: `${r.d[0].slice(0, 4)}-${r.d[0].slice(4, 6)}-${r.d[0].slice(6, 8)}`, visiteurs: r.m[0], sessions: r.m[1] })),
      sources: lignes(sources).map((r) => ({ nom: r.d[0], valeur: r.m[0] })),
      appareils: lignes(appareils).map((r) => ({ nom: r.d[0], valeur: r.m[0] })),
      pages: lignes(pages).map((r) => ({ nom: r.d[0], valeur: r.m[0] })),
      villes: lignes(villes).filter((r) => r.d[0] && r.d[0] !== '(not set)').map((r) => ({ nom: r.d[0], valeur: r.m[0] })),
      fidelite: lignes(fidelite).filter((r) => r.d[0]).map((r) => ({ nom: r.d[0], valeur: r.m[0] })),
      evenements: { actuel: evenementsDe('actuel'), precedent: evenementsDe('precedent') },
    })
  } catch (e) {
    return json(502, { erreur: `Google Analytics : ${e.message}` })
  }
}
