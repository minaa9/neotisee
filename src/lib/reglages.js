import { createElement, useEffect, useState } from 'react'
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
  // Textes des pages : seuls ceux modifiés dans le back-office sont enregistrés.
  textes: {},
  // Objectifs suivis dans « Statistiques » (par mois).
  objectifs: { seuilBas: 3, seuilHaut: 10, objectifDemandes: 3 },
}

/**
 * Textes modifiables depuis le back-office (Réglages › Textes du site), page par page.
 * `defaut` = le texte actuel du site, affiché tant que rien n'a été changé.
 * Un retour à la ligne dans un champ = un retour à la ligne sur le site.
 */
export const TEXTES = [
  {
    id: 'accueil',
    page: 'Accueil',
    bloc: 'Ouverture',
    champs: [
      { cle: 'accroche', label: 'Phrase d’accroche', multi: true, defaut: 'Des gestes oubliés,\ndes histoires à retisser' },
      { cle: 'intro', label: 'Texte sous l’accroche', multi: true, defaut: 'Du Néolithique au Moyen Âge, redécouvrons les savoir-faire textiles qui racontent nos histoires.' },
    ],
  },
  {
    id: 'accueilAsso',
    page: 'Accueil',
    bloc: 'Section « L’association »',
    champs: [
      { cle: 'titre', label: 'Titre (1re ligne)', defaut: 'Un fil ancien,' },
      { cle: 'titreItalique', label: 'Titre (2e ligne, en italique)', defaut: 'une histoire bien actuelle.' },
      { cle: 'texte', label: 'Texte', multi: true, defaut: 'Néotisse fait revivre les savoir-faire textiles anciens à travers l’archéologie expérimentale et la médiation scientifique. Fondée en 2024 à Montpellier, l’association fait découvrir l’histoire du textile, du filage au tissage.' },
      { cle: 'chiffreAteliers', label: 'Chiffre « ateliers de savoir-faire »', court: true, defaut: '4' },
      { cle: 'chiffrePartenaires', label: 'Chiffre « partenaires culturels »', court: true, defaut: '5' },
    ],
  },
  ...[
    ['association', 'L’association', 'L’association', 'Un fil ancien,\nune histoire bien actuelle', 'Fondée en mai 2024 à Montpellier, Néotisse est une association loi 1901 née d’une conviction : les textiles anciens ont beaucoup à nous raconter.'],
    ['equipe', 'L’équipe', 'L’équipe', 'Deux chercheuses,\nune même passion', 'Archéologie, égyptologie, gestes de tisserands : Néotisse est née de la rencontre entre la recherche et l’envie de transmettre.'],
    ['ateliers', 'Nos ateliers', 'Nos ateliers', 'Apprendre, expérimenter,\ntransmettre', 'Des ateliers participatifs, adaptés à tous, pour découvrir les gestes anciens et explorer les matières.'],
    ['actualites', 'Actualités', 'Actualités', 'Les fils de\nnos découvertes', 'Événements, ateliers, rencontres et nouvelles collaborations : suivez la vie de Néotisse.'],
    ['calendrier', 'Calendrier', 'Calendrier', 'Nos prochains\nrendez-vous', 'Ateliers, événements, conférences… choisissez votre fil et venez tisser avec nous.'],
    ['livre', 'Livre d’or', 'Livre d’or', 'Ils ont tissé\navec nous', 'Les mots laissés par celles et ceux qui ont partagé un atelier, une démonstration ou une rencontre.'],
    ['contact', 'Contact', 'Contact', 'Une question ?\nUne envie de projet ?', 'Un atelier pour une école, un musée, un festival ? Écrivez-nous, nous serons ravies d’échanger avec vous.'],
  ].map(([id, page, titre, sousTitre, texte]) => ({
    id,
    page,
    bloc: 'En-tête de la page',
    champs: [
      { cle: 'titre', label: 'Titre', defaut: titre },
      { cle: 'sousTitre', label: 'Sous-titre (en italique)', multi: true, defaut: sousTitre },
      { cle: 'texte', label: 'Texte d’introduction', multi: true, defaut: texte },
    ],
  })),
]

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

/**
 * Textes modifiés d'un bloc (ex. useTexte('contact').titre).
 * Renvoie seulement ce qui a été changé : sinon, la page garde son texte d'origine.
 */
export function useTexte(id) {
  const t = useReglages().textes?.[id] || {}
  return Object.fromEntries(Object.entries(t).filter(([, v]) => typeof v === 'string' && v.trim()))
}

/** « ligne 1\nligne 2 » → ligne 1<br />ligne 2 */
export function lignes(texte) {
  return texte.split('\n').flatMap((l, i) => (i ? [createElement('br', { key: `br${i}` }), l] : [l]))
}

/** Photo d'un emplacement : celle choisie dans le back-office, sinon celle d'origine. */
export function usePhoto(id, origine) {
  return useReglages().photos[id] || origine
}
