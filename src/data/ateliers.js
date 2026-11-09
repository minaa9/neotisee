import filage from '../assets/home/atelier-filage.webp'
import tissage from '../assets/home/atelier-tissage.webp'
import teinture from '../assets/home/atelier-teinture.webp'
import broderie from '../assets/home/atelier-broderie.webp'
import photoFilage from '../assets/ateliers/hero.webp'
import photoTissage from '../assets/ateliers/tissage.webp'
import photoTeinture from '../assets/events/teinture.webp'
import photoBroderie from '../assets/ateliers/broderie.webp'

/**
 * Les quatre ateliers.
 * `image` : photo détourée des cartes de l'accueil (Figma 260:262).
 * `photo` + `description` : page Nos ateliers (Figma 302:362).
 */
export const ateliers = [
  {
    id: 'filage',
    titre: 'Filage de la laine',
    accroche: 'Découvrez le geste ancestral du filage',
    image: filage,
    photo: photoFilage,
    description:
      'Du fuseau à la quenouille, découvrez le geste ancestral qui transforme la fibre en fil. Après une présentation des outils retrouvés en fouille, chacun·e s’essaie au filage de la laine brute.',
  },
  {
    id: 'tissage',
    titre: 'Tissage traditionnel',
    accroche: 'Initiez-vous au tissage sur métier à tisser',
    image: tissage,
    photo: photoTissage,
    description:
      'Initiez-vous au tissage sur métier, comme on le pratiquait du Néolithique au Moyen Âge. Chaîne, trame, motifs : on apprend à lire un tissu ancien avant de tisser sa propre bande.',
  },
  {
    id: 'teinture',
    titre: 'Teinture végétale',
    accroche: 'Explorez les couleurs naturelles du passé',
    image: teinture,
    photo: photoTeinture,
    description:
      'Garance, gaude, pastel… Explorez les couleurs naturelles du passé et découvrez comment les plantes permettent de teindre les fibres textiles.',
  },
  {
    id: 'broderie',
    titre: 'Broderie historique',
    accroche: 'Redécouvrez les motifs d’antan',
    image: broderie,
    photo: photoBroderie,
    description:
      'Redécouvrez les motifs d’antan et les points utilisés sur les textiles anciens, puis brodez votre propre motif inspiré des pièces archéologiques.',
  },
]
