import { photos } from './photos'

/**
 * Frise « Trois périodes, un même fil » (page L'association).
 *
 * ⚠️ Les textes historiques ne sont PAS encore rédigés : chaque `aRediger`
 * s'affiche sur le site comme un emplacement à compléter. Remplacez-le par le
 * texte validé par l'association, puis mettez `aRediger: null`.
 * Seuls les liens vers les ateliers et rendez-vous existants sont renseignés.
 */
export const periodes = [
  {
    id: 'neolithique',
    nom: 'Néolithique',
    accroche: 'Aux origines du fil',
    aRediger: 'Texte à rédiger par Néotisse : les premières techniques de filage et de tissage de cette période, les fibres utilisées, les vestiges qui les documentent.',
    liens: [
      { label: 'Atelier filage de la laine', to: '/ateliers#filage' },
      { label: 'Atelier tissage traditionnel', to: '/ateliers#tissage' },
    ],
    photo: photos.echeveau,
  },
  {
    id: 'antiquite',
    nom: 'Antiquité',
    accroche: 'Les mots des tisserands',
    aRediger: 'Texte à rédiger par Néotisse : la place du textile dans les sociétés antiques, notamment en Égypte ancienne, à travers les sources écrites étudiées par Marie-Salomé.',
    liens: [
      { label: 'Conférence : le textile dans l’Égypte ancienne', to: '/calendrier#rdv-textile-egypte' },
      { label: 'Rencontrer Marie-Salomé', to: '/equipe' },
    ],
    photo: photos.standTeintures,
  },
  {
    id: 'moyen-age',
    nom: 'Moyen Âge',
    accroche: 'Couleurs et motifs',
    aRediger: 'Texte à rédiger par Néotisse : les techniques de teinture végétale et de broderie de cette période, les plantes tinctoriales et les motifs.',
    liens: [
      { label: 'Atelier teinture végétale', to: '/ateliers#teinture' },
      { label: 'Atelier broderie historique', to: '/ateliers#broderie' },
    ],
    photo: photos.broderie,
  },
]
