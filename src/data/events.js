import filage from '../assets/events/filage.webp'
import egypte from '../assets/events/egypte.webp'
import tissage from '../assets/ateliers/hero.webp'
import patrimoine from '../assets/events/patrimoine.webp'
import dotAtelier from '../assets/v3/calendrier/dot-atelier.svg'
import dotEvenement from '../assets/v3/calendrier/dot-evenement.svg'
import dotConference from '../assets/v3/calendrier/dot-conference.svg'
import dotExposition from '../assets/v3/calendrier/dot-exposition.svg'

/**
 * Rendez-vous du calendrier.
 * Pour ajouter un rendez-vous : copier un bloc et modifier les champs.
 * - `date` au format AAAA-MM-JJ
 * - `debut` / `fin` au format HH:MM
 * - `categorie` : atelier | evenement | conference | exposition
 */
export const events = [
  {
    id: 'initiation-filage',
    date: '2026-11-08',
    debut: '10:00',
    fin: '16:00',
    categorie: 'atelier',
    titre: 'Initiation au filage de la laine',
    court: 'Initiation au filage',
    description:
      'Découvrez les gestes du filage traditionnel et apprenez à transformer la laine en fil, comme autrefois.',
    lieu: 'Montpellier',
    image: filage,
  },
  {
    id: 'teinture-vegetale',
    date: '2026-11-19',
    debut: '10:00',
    fin: '16:00',
    categorie: 'evenement',
    titre: 'Teinture végétale : les couleurs du vivant',
    court: 'Teinture végétale',
    description:
      'Explorez les pigments naturels et découvrez comment les plantes permettent de teindre les fibres textiles.',
    lieu: 'Montpellier',
    image: egypte,
  },
  {
    id: 'textile-egypte',
    date: '2026-11-28',
    debut: '14:00',
    fin: '16:00',
    categorie: 'conference',
    titre: 'Le textile dans l’Égypte ancienne',
    court: 'Le textile dans l’Égypte ancienne',
    description:
      'Des sources écrites aux vestiges : la place du textile dans les sociétés de l’Égypte ancienne.',
    lieu: 'Montpellier',
    image: tissage,
  },
  {
    id: 'journee-patrimoine',
    date: '2026-12-05',
    debut: '10:00',
    fin: '17:00',
    categorie: 'exposition',
    titre: 'Journée spéciale patrimoine textile',
    court: 'Patrimoine textile',
    description:
      'Tissus, outils et reconstitutions : une journée pour découvrir le patrimoine textile, du Néolithique au Moyen Âge.',
    lieu: 'Montpellier',
    image: patrimoine,
  },
]

/** Couleurs des navettes et pastilles par type de rendez-vous (Figma V3). */
export const categories = {
  atelier: { label: 'Atelier', dot: dotAtelier, bg: 'bg-terre-cuite', text: 'text-lin' },
  evenement: { label: 'Événement', dot: dotEvenement, bg: 'bg-poudre', text: 'text-brun' },
  conference: { label: 'Conférence', dot: dotConference, bg: 'bg-[#8c98a5]', text: 'text-lin' },
  exposition: { label: 'Exposition', dot: dotExposition, bg: 'bg-brun-doux', text: 'text-lin' },
}

export const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]
export const MOIS_COURT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
export const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']

export const toDate = (iso) => new Date(`${iso}T12:00:00`)
export const todayIso = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export const horaires = (e) => `${e.debut.replace(':00', 'h').replace(':', 'h')}–${e.fin.replace(':00', 'h').replace(':', 'h')}`
export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

/** Fichier .ics pour « Ajouter à mon agenda ». */
export function icsFor(e) {
  const d = e.date.replaceAll('-', '')
  const t = (h) => h.replace(':', '') + '00'
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Neotisse//Calendrier//FR',
    'BEGIN:VEVENT',
    `UID:${e.id}@neotisse`,
    `DTSTART;TZID=Europe/Paris:${d}T${t(e.debut)}`,
    `DTEND;TZID=Europe/Paris:${d}T${t(e.fin)}`,
    `SUMMARY:${e.titre} (Néotisse)`,
    `LOCATION:${e.lieu}`,
    `DESCRIPTION:${e.description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
