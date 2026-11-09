import filage from '../assets/home/atelier-filage.webp'
import tissage from '../assets/home/atelier-tissage.webp'
import teinture from '../assets/home/atelier-teinture.webp'
import broderie from '../assets/home/atelier-broderie.webp'

/** Les quatre ateliers (cartes de l'accueil, Figma 260:262). */
export const ateliers = [
  {
    id: 'filage',
    titre: 'Filage de la laine',
    accroche: 'Découvrez le geste ancestral du filage',
    image: filage,
  },
  {
    id: 'tissage',
    titre: 'Tissage traditionnel',
    accroche: 'Initiez-vous au tissage sur métier à tisser',
    image: tissage,
  },
  {
    id: 'teinture',
    titre: 'Teinture végétale',
    accroche: 'Explorez les couleurs naturelles du passé',
    image: teinture,
  },
  {
    id: 'broderie',
    titre: 'Broderie historique',
    accroche: 'Redécouvrez les motifs d’antan',
    image: broderie,
  },
]
