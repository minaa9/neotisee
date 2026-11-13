import { useEffect, useState } from 'react'
import { publicList } from './store'
import { contact, socials } from '../data/navigation'
import heroAccueil from '../assets/home/hero.webp'
import chevrons from '../assets/ateliers/tissage.webp'
import festival from '../assets/news/festival.webp'
import emilie from '../assets/v3/equipe/emilie.webp'
import patrimoine from '../assets/events/patrimoine.webp'
import metier from '../assets/ateliers/hero.webp'
import teinture from '../assets/events/teinture.webp'
import broderie from '../assets/ateliers/broderie.webp'

/**
 * Réglages du site modifiables depuis le back-office (rubrique « Réglages ») :
 * coordonnées, réseaux sociaux, photos des pages et bandeau d'annonce.
 * Tant que rien n'a été changé, le site garde ses valeurs d'origine.
 */
export const DEFAUTS = {
  coordonnees: { email: contact.email, telephone: contact.phone, ville: contact.city },
  reseaux: {
    instagram: socials.find((s) => s.label === 'Instagram')?.href || '',
    facebook: socials.find((s) => s.label === 'Facebook')?.href || '',
  },
  photos: {},
  annonce: { actif: false, texte: '', lien: '', libelle: '' },
}

/** Emplacements de photos que l'équipe peut remplacer (avec la photo d'origine). */
export const EMPLACEMENTS = [
  { id: 'accueil', page: 'Accueil', label: 'Grande photo d’ouverture', format: 'Paysage, au moins 1920 px de large', origine: heroAccueil },
  { id: 'accueilAsso', page: 'Accueil', label: 'Section « L’association »', format: 'Portrait ou carré', origine: chevrons },
  { id: 'association', page: 'L’association', label: 'Photo d’en-tête', format: 'Paysage', origine: festival },
  { id: 'equipe', page: 'L’équipe', label: 'Photo d’en-tête', format: 'Paysage', origine: emilie },
  { id: 'ateliers', page: 'Nos ateliers', label: 'Photo d’en-tête', format: 'Paysage', origine: patrimoine },
  { id: 'actualites', page: 'Actualités', label: 'Photo d’en-tête', format: 'Paysage', origine: chevrons },
  { id: 'calendrier', page: 'Calendrier', label: 'Photo d’en-tête', format: 'Paysage', origine: metier },
  { id: 'livre', page: 'Livre d’or', label: 'Photo d’en-tête', format: 'Paysage', origine: teinture },
  { id: 'contact', page: 'Contact', label: 'Photo d’en-tête', format: 'Paysage', origine: broderie },
]

/** « 06 48 65 58 16 » → « tel:+33648655816 » */
export function telHref(tel = '') {
  const digits = tel.replace(/[^\d+]/g, '')
  return `tel:${digits.startsWith('0') ? `+33${digits.slice(1)}` : digits}`
}

function fusion(rows) {
  const out = structuredClone(DEFAUTS)
  ;(rows || []).forEach((r) => {
    if (r?.id in out && r.valeur && typeof r.valeur === 'object') out[r.id] = { ...out[r.id], ...r.valeur }
  })
  return out
}

// Un seul chargement partagé par toutes les pages.
let cache = fusion([])
let promise = null
const abonnes = new Set()

function charger(force = false) {
  if (promise && !force) return promise
  promise = publicList('reglages')
    .then((rows) => {
      if (rows) cache = fusion(rows)
      abonnes.forEach((f) => f(cache))
    })
    .catch(() => {})
  return promise
}

/** Réglages actuels du site (se mettent à jour quand le back-office les change). */
export function useReglages() {
  const [r, setR] = useState(cache)
  useEffect(() => {
    abonnes.add(setR)
    charger()
    const recharger = () => charger(true)
    const onStorage = (e) => e.key === 'neotisse-backoffice-demo' && recharger()
    window.addEventListener('neotisse:data', recharger)
    window.addEventListener('storage', onStorage)
    return () => {
      abonnes.delete(setR)
      window.removeEventListener('neotisse:data', recharger)
      window.removeEventListener('storage', onStorage)
    }
  }, [])
  return r
}

/** Coordonnées prêtes à l'emploi (même forme que `contact` dans data/navigation). */
export function useContact() {
  const { coordonnees: c } = useReglages()
  return { email: c.email, phone: c.telephone, phoneHref: telHref(c.telephone), city: c.ville }
}

/** Réseaux sociaux renseignés (ceux laissés vides ne s'affichent pas). */
export function useSocials() {
  const { reseaux } = useReglages()
  return [
    { label: 'Instagram', href: reseaux.instagram },
    { label: 'Facebook', href: reseaux.facebook },
  ].filter((s) => s.href)
}

/** Photo d'un emplacement : celle choisie dans le back-office, sinon celle d'origine. */
export function usePhoto(id, origine) {
  return useReglages().photos[id] || origine
}
