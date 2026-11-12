import { useEffect, useState } from 'react'
import { publicList } from './store'
import { events as staticEvents } from '../data/events'
import { news as staticNews } from '../data/news'
import { temoignages as staticTemoignages } from '../data/temoignages'
import filage from '../assets/events/filage.webp'
import tissage from '../assets/ateliers/hero.webp'
import teinture from '../assets/events/egypte.webp'
import broderie from '../assets/ateliers/broderie.webp'

// Photo par défaut quand un contenu ajouté depuis le back-office n'en a pas.
const PHOTO_PAR_DEFAUT = tissage
function vignettePour(atelier = '') {
  const a = atelier.toLowerCase()
  if (a.includes('fil')) return filage
  if (a.includes('teint')) return teinture
  if (a.includes('brod')) return broderie
  return tissage
}

const FALLBACK = { evenements: staticEvents, actualites: staticNews, temoignages: staticTemoignages }

const NORMALISE = {
  evenements: (e) => ({ ...e, court: e.court || e.titre, image: e.image || PHOTO_PAR_DEFAUT }),
  actualites: (n) => ({ ...n, paragraphes: n.paragraphes || [], image: n.image || PHOTO_PAR_DEFAUT, alt: n.alt || '' }),
  temoignages: (t) => ({
    ...t,
    note: t.note || 5,
    date: t.date || (t.created_at ? String(new Date(t.created_at).getFullYear()) : ''),
    vignette: t.vignette || vignettePour(t.atelier),
  }),
}

/**
 * Contenus publics d'une table (évènements, actualités, témoignages).
 * Affiche tout de suite les contenus d'origine, puis ceux du back-office
 * dès qu'ils sont chargés. Si la base est injoignable (ou vide, pour les
 * actualités et témoignages), le site garde ses contenus d'origine.
 */
export function usePublic(table) {
  const [rows, setRows] = useState(FALLBACK[table])
  useEffect(() => {
    let alive = true
    const load = () =>
      publicList(table)
        .then((data) => {
          if (!alive || !data) return
          // Actualités et témoignages : jamais de page vide, on garde ceux d'origine.
          if (!data.length && table !== 'evenements') return
          setRows(data.map(NORMALISE[table]))
        })
        .catch(() => {})
    load()
    // Back-office ouvert dans un autre onglet (mode démo) : mise à jour en direct.
    const onStorage = (e) => e.key === 'neotisse-backoffice-demo' && load()
    window.addEventListener('storage', onStorage)
    return () => {
      alive = false
      window.removeEventListener('storage', onStorage)
    }
  }, [table])
  return rows
}
