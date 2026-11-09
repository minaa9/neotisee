import filage from '../assets/events/filage.webp'
import teinture from '../assets/events/teinture.webp'
import egypte from '../assets/events/egypte.webp'
import patrimoine from '../assets/events/patrimoine.webp'
import dotAtelier from '../assets/common/pastille-atelier.svg'
import dotEvenement from '../assets/common/pastille-evenement.svg'
import dotConference from '../assets/common/pastille-conference.svg'
import dotExposition from '../assets/common/pastille-exposition.svg'

/**
 * Rendez-vous du calendrier.
 * Pour ajouter un événement : copier un bloc et modifier les champs.
 * `date` au format AAAA-MM-JJ ; `categorie` : atelier | evenement | conference | exposition.
 */
export const events = [
  {
    id: 'initiation-filage',
    date: '2026-11-08',
    categorie: 'atelier',
    titre: 'Initiation au filage de la laine',
    lieu: 'Montpellier',
    horaires: '10h–16h',
    image: filage,
  },
  {
    id: 'teinture-vegetale',
    date: '2026-11-19',
    categorie: 'evenement',
    titre: 'Teinture végétale : les couleurs du vivant',
    lieu: 'Montpellier',
    horaires: '10h–16h',
    image: teinture,
  },
  {
    id: 'textile-egypte',
    date: '2026-11-28',
    categorie: 'conference',
    titre: 'Le textile dans l’Égypte ancienne',
    lieu: 'Montpellier',
    horaires: '14h–16h',
    image: egypte,
  },
  {
    id: 'journee-patrimoine',
    date: '2026-12-05',
    categorie: 'exposition',
    titre: 'Journée spéciale patrimoine textile',
    lieu: 'Montpellier',
    horaires: '10h–17h',
    image: patrimoine,
  },
]

export const categories = {
  atelier: { label: 'Atelier', dot: dotAtelier },
  evenement: { label: 'Événement', dot: dotEvenement },
  conference: { label: 'Conférence', dot: dotConference },
  exposition: { label: 'Exposition', dot: dotExposition },
}

const mois = ['JANV.', 'FÉVR.', 'MARS', 'AVR.', 'MAI', 'JUIN', 'JUIL.', 'AOÛT', 'SEPT.', 'OCT.', 'NOV.', 'DÉC.']
const jours = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.']

export function formatEventDate(iso) {
  const d = new Date(`${iso}T12:00:00`)
  return { jour: d.getDate(), mois: mois[d.getMonth()], jourSemaine: jours[d.getDay()] }
}
