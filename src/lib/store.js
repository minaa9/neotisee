/**
 * Couche de données du site et du back-office.
 *
 * Deux modes :
 * - EN LIGNE : si VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définies
 *   (fichier .env.local en local, variables d'environnement sur Netlify),
 *   tout est lu et écrit dans la base Supabase de l'association.
 * - DÉMO : sinon, les données sont gardées dans ce navigateur (localStorage),
 *   à partir des contenus actuels du site. Pratique pour essayer le
 *   back-office avant de brancher Supabase.
 *
 * Voir docs/BACKOFFICE.md pour la mise en place.
 */
import { events as staticEvents } from '../data/events'
import { news as staticNews } from '../data/news'
import { temoignages as staticTemoignages } from '../data/temoignages'
import { ateliers as staticAteliers } from '../data/ateliers'

const SB_URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isLive = Boolean(SB_URL && KEY)

export const TABLES = ['evenements', 'actualites', 'temoignages', 'messages', 'ateliers', 'reglages']

// ---------------------------------------------------------------- Supabase
let clientPromise
function client() {
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(SB_URL, KEY))
  return clientPromise
}

// ---------------------------------------------------------------- Démo
const DEMO_KEY = 'neotisse-backoffice-demo'
const DEMO_SESSION = 'neotisse-backoffice-demo-session'
const now = () => new Date().toISOString()
const hier = () => new Date(Date.now() - 864e5).toISOString()
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()))

function seed() {
  return {
    evenements: staticEvents.map((e) => ({ ...e, created_at: now() })),
    actualites: staticNews.map((n, i) => ({ ...n, publie: true, created_at: new Date(Date.now() - i * 864e5).toISOString() })),
    temoignages: [
      ...staticTemoignages.map((t, i) => ({ id: `t${i}`, prenom: '', ...t, statut: 'publie', created_at: now() })),
      {
        id: 'exemple-attente',
        prenom: 'Exemple',
        texte: 'Ceci est un témoignage d’exemple en attente de relecture : publiez-le ou refusez-le pour essayer.',
        atelier: 'Atelier tissage traditionnel',
        date: '2026',
        note: 5,
        statut: 'en_attente',
        created_at: hier(),
      },
    ],
    ateliers: staticAteliers.map(({ id, titre, accroche, description, image }, i) => ({ id, titre, accroche, description, image, ordre: i + 1, created_at: now() })),
    reglages: [],
    messages: [
      {
        id: 'exemple-message',
        nom: 'Message d’exemple',
        email: 'exemple@exemple.fr',
        profil: 'Particulier',
        objet: 'Question',
        message: 'Bonjour, ceci est un message d’exemple pour découvrir la boîte de réception du back-office.',
        rdv: '',
        lu: false,
        created_at: hier(),
      },
    ],
  }
}

function readDemo() {
  try {
    const saved = JSON.parse(localStorage.getItem(DEMO_KEY))
    if (saved && typeof saved === 'object') {
      // Une démo créée avant l'ajout d'une rubrique reçoit son contenu d'origine.
      const base = seed()
      TABLES.forEach((t) => {
        if (!Array.isArray(saved[t])) saved[t] = base[t]
      })
      return saved
    }
  } catch {
    // ignore
  }
  return seed()
}
function writeDemo(db) {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(db))
  } catch {
    // stockage plein ou bloqué : les changements valent pour cette visite
  }
  window.dispatchEvent(new Event('neotisse:data'))
}
/** Remet les données de démonstration à zéro. */
export const resetDemo = () => {
  try {
    localStorage.removeItem(DEMO_KEY)
  } catch {
    // ignore
  }
  window.dispatchEvent(new Event('neotisse:data'))
}

// ---------------------------------------------------------------- Lecture / écriture (back-office)
const ORDER = {
  evenements: ['date', true],
  actualites: ['created_at', false],
  temoignages: ['created_at', false],
  messages: ['created_at', false],
  ateliers: ['ordre', true],
  reglages: ['id', true],
}

function sortRows(table, rows) {
  const [col, asc] = ORDER[table]
  const cmp = (a, b) => (typeof a[col] === 'number' ? a[col] - b[col] : String(a[col] ?? '').localeCompare(String(b[col] ?? '')))
  return [...rows].sort((a, b) => cmp(a, b) * (asc ? 1 : -1))
}

export async function list(table) {
  if (!isLive) return sortRows(table, readDemo()[table])
  const sb = await client()
  const [col, asc] = ORDER[table]
  const { data, error } = await sb.from(table).select('*').order(col, { ascending: asc })
  if (error) throw error
  return data
}

export async function create(table, row) {
  if (!isLive) {
    const db = readDemo()
    const full = { id: uid(), created_at: now(), ...row }
    db[table].push(full)
    writeDemo(db)
    return full
  }
  const sb = await client()
  const { data, error } = await sb.from(table).insert(row).select().single()
  if (error) throw error
  return data
}

export async function update(table, id, patch) {
  if (!isLive) {
    const db = readDemo()
    db[table] = db[table].map((r) => (r.id === id ? { ...r, ...patch } : r))
    writeDemo(db)
    return
  }
  const sb = await client()
  const { error } = await sb.from(table).update(patch).eq('id', id)
  if (error) throw error
}

export async function remove(table, id) {
  if (!isLive) {
    const db = readDemo()
    db[table] = db[table].filter((r) => r.id !== id)
    writeDemo(db)
    return
  }
  const sb = await client()
  const { error } = await sb.from(table).delete().eq('id', id)
  if (error) throw error
}

/** Enregistre un réglage du site (coordonnées, photos, bandeau…). */
export async function saveSetting(id, valeur) {
  if (!isLive) {
    const db = readDemo()
    const row = { id, valeur, updated_at: now() }
    db.reglages = db.reglages.some((r) => r.id === id) ? db.reglages.map((r) => (r.id === id ? row : r)) : [...db.reglages, row]
    writeDemo(db)
    return
  }
  const sb = await client()
  const { error } = await sb.from('reglages').upsert({ id, valeur, updated_at: now() })
  if (error) throw error
}

/**
 * Change le mot de passe du compte connecté (mode en ligne).
 * Le mot de passe actuel est vérifié d'abord : quelqu'un qui trouverait une
 * session ouverte ne peut pas le changer sans le connaître.
 */
export async function changePassword(actuel, nouveau) {
  if (!isLive) throw new Error('En mode démo, il n’y a pas de mot de passe à changer.')
  const sb = await client()
  const email = (await sb.auth.getUser()).data.user?.email
  const verif = await sb.auth.signInWithPassword({ email, password: actuel })
  if (verif.error) throw new Error('Le mot de passe actuel est incorrect.')
  const { error } = await sb.auth.updateUser({ password: nouveau })
  if (error) throw new Error(error.message.includes('different') ? 'Choisissez un mot de passe différent de l’actuel.' : 'Le changement n’a pas fonctionné. Réessayez.')
}

/** Envoie une photo et renvoie son adresse publique. */
export async function uploadImage(file) {
  if (!isLive) {
    // Démo : l'image est gardée dans le navigateur (réduite pour ne pas saturer le stockage).
    return await shrink(file, 1200)
  }
  const sb = await client()
  const ext = file.name.split('.').pop().toLowerCase()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await sb.storage.from('images').upload(path, file, { cacheControl: '31536000', upsert: false })
  if (error) throw error
  return sb.storage.from('images').getPublicUrl(path).data.publicUrl
}

function shrink(file, max) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * k)
      c.height = Math.round(img.height * k)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(img.src)
      resolve(c.toDataURL('image/webp', 0.8))
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

// ---------------------------------------------------------------- Connexion
/**
 * Mode démo : seulement sur l'ordinateur du développeur (localhost), ou si
 * VITE_ADMIN_DEMO=true est défini. Sur le site en ligne sans Supabase,
 * personne ne peut entrer dans le back-office.
 */
export const demoAllowed =
  !isLive &&
  (import.meta.env.DEV ||
    import.meta.env.VITE_ADMIN_DEMO === 'true' ||
    (typeof location !== 'undefined' && ['localhost', '127.0.0.1'].includes(location.hostname)))

export async function getSession() {
  if (!isLive) {
    if (!demoAllowed) return null
    try {
      return sessionStorage.getItem(DEMO_SESSION) ? { user: { email: sessionStorage.getItem(DEMO_SESSION) } } : null
    } catch {
      return null
    }
  }
  const sb = await client()
  return (await sb.auth.getSession()).data.session
}

// Anti-force brute : après 5 essais ratés, la connexion est bloquée 2 minutes
// sur ce navigateur (Supabase limite aussi le nombre d'essais de son côté).
const ESSAIS = 'neotisse-admin-essais'
const MAX_ESSAIS = 5
const BLOCAGE = 2 * 60 * 1000
function lireEssais() {
  try {
    return JSON.parse(localStorage.getItem(ESSAIS)) || { n: 0, jusqua: 0 }
  } catch {
    return { n: 0, jusqua: 0 }
  }
}
function ecrireEssais(v) {
  try {
    localStorage.setItem(ESSAIS, JSON.stringify(v))
  } catch {
    // ignore
  }
}
/** Secondes restantes avant de pouvoir réessayer (0 si rien ne bloque). */
export function attenteConnexion() {
  return Math.max(0, Math.ceil((lireEssais().jusqua - Date.now()) / 1000))
}

export async function signIn(email, password) {
  if (!isLive) {
    if (!demoAllowed) throw new Error('Le back-office n’est pas encore activé sur ce site.')
    try {
      sessionStorage.setItem(DEMO_SESSION, email || 'demo@neotisse')
    } catch {
      // ignore
    }
    return
  }
  const attente = attenteConnexion()
  if (attente) throw new Error(`Trop d’essais. Réessayez dans ${attente} s.`)
  const sb = await client()
  const { error } = await sb.auth.signInWithPassword({ email, password })
  if (error) {
    const e = lireEssais()
    const n = e.n + 1
    if (n >= MAX_ESSAIS) {
      ecrireEssais({ n: 0, jusqua: Date.now() + BLOCAGE })
      throw new Error('Trop d’essais ratés : la connexion est bloquée 2 minutes.')
    }
    ecrireEssais({ n, jusqua: 0 })
    throw new Error(`Adresse e-mail ou mot de passe incorrect (${MAX_ESSAIS - n} essai${MAX_ESSAIS - n > 1 ? 's' : ''} restant${MAX_ESSAIS - n > 1 ? 's' : ''}).`)
  }
  ecrireEssais({ n: 0, jusqua: 0 })
}

/** Déconnexion. partout = déconnecter aussi les autres appareils. */
export async function signOut(partout = false) {
  if (!isLive) {
    try {
      sessionStorage.removeItem(DEMO_SESSION)
    } catch {
      // ignore
    }
    return
  }
  const sb = await client()
  await sb.auth.signOut({ scope: partout ? 'global' : 'local' })
}

/** Mot de passe oublié : Supabase envoie un lien de réinitialisation par e-mail. */
export async function resetPassword(email) {
  if (!isLive) throw new Error('Disponible une fois Supabase branché.')
  const sb = await client()
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/admin/nouveau-mot-de-passe` })
  if (error) throw new Error('L’envoi n’a pas fonctionné. Réessayez dans quelques minutes.')
}

/**
 * Arrivée depuis le lien reçu par e-mail : ouvre la session de récupération
 * (lien « ?code=… » ou « #access_token=… », selon la configuration Supabase).
 */
export async function ouvrirLienRecuperation() {
  if (!isLive) return null
  const sb = await client()
  const code = new URLSearchParams(location.search).get('code')
  if (code) {
    const { error } = await sb.auth.exchangeCodeForSession(code)
    if (error) throw new Error('Ce lien a expiré ou a déjà servi. Demandez-en un nouveau.')
  }
  const { data } = await sb.auth.getSession()
  if (!data.session) throw new Error('Ce lien a expiré ou a déjà servi. Demandez-en un nouveau.')
  return data.session
}

/** Nouveau mot de passe, après le lien de réinitialisation (sans l'ancien). */
export async function definirMotDePasse(password) {
  const sb = await client()
  const { error } = await sb.auth.updateUser({ password })
  if (error) throw new Error(error.message.includes('different') ? 'Choisissez un mot de passe différent de l’ancien.' : 'Le changement n’a pas fonctionné.')
}

/** Changer l'adresse e-mail du compte : Supabase demande une confirmation par e-mail. */
export async function changeEmail(email) {
  if (!isLive) throw new Error('Disponible une fois Supabase branché.')
  const sb = await client()
  const { error } = await sb.auth.updateUser({ email }, { emailRedirectTo: `${location.origin}/admin` })
  if (error) throw new Error('Le changement n’a pas fonctionné. Vérifiez l’adresse.')
}

// ---------------------------------------------------------------- Site public
/**
 * Contenus publiés, pour les pages du site.
 * En ligne : la base Supabase. En démo : les données modifiées dans ce
 * navigateur si elles existent, sinon les contenus d'origine.
 */
export async function publicList(table) {
  if (!isLive) {
    let saved = null
    try {
      saved = JSON.parse(localStorage.getItem(DEMO_KEY))
    } catch {
      // ignore
    }
    if (!saved) return null // pas de démo : la page garde ses contenus d'origine
    const rows = sortRows(table, saved[table] || [])
    if (table === 'temoignages') return rows.filter((t) => t.statut === 'publie')
    if (table === 'actualites') return rows.filter((n) => n.publie !== false)
    return rows
  }
  const sb = await client()
  const [col, asc] = ORDER[table]
  let q = sb.from(table).select('*').order(col, { ascending: asc })
  if (table === 'temoignages') q = q.eq('statut', 'publie')
  if (table === 'actualites') q = q.eq('publie', true)
  const { data, error } = await q
  if (error) throw error
  return data
}

/** Formulaire de contact et livre d'or : enregistre la demande. */
export async function submit(table, row) {
  if (table === 'temoignages') row = { ...row, statut: 'en_attente' }
  if (table === 'messages') row = { ...row, lu: false }
  if (!isLive) {
    const db = readDemo()
    db[table].push({ id: uid(), created_at: now(), ...row })
    writeDemo(db)
    return
  }
  const sb = await client()
  const { error } = await sb.from(table).insert(row)
  if (error) throw error
}
