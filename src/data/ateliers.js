import filage from '../assets/events/filage.webp'
import tissage from '../assets/ateliers/hero.webp'
import teinture from '../assets/events/egypte.webp'
import broderie from '../assets/ateliers/broderie.webp'
import fuseau from '../assets/association/fuseau.webp'
import fragmentTissu from '../assets/association/fragment-tissu.webp'
import planteGravee from '../assets/v3/ui/plante-gravee.webp'
import feuille from '../assets/home/feuille.webp'

/**
 * Les quatre ateliers (arches de l'accueil V3, Figma 348:71).
 * Pour modifier un texte, il suffit de changer la valeur entre guillemets.
 */
export const ateliers = [
  {
    id: 'filage',
    titre: 'Filage de la laine',
    accroche: 'Le geste ancestral du filage',
    image: filage,
    objet: fuseau, // petit objet détouré de la page Nos ateliers
    description:
      'Du fuseau à la quenouille, découvrez le geste ancestral qui transforme la fibre en fil. Après une présentation des outils retrouvés en fouille, chacun·e s’essaie au filage de la laine brute.',
  },
  {
    id: 'tissage',
    titre: 'Tissage traditionnel',
    accroche: 'Le tissage sur métier',
    image: tissage,
    objet: fragmentTissu, // petit objet détouré de la page Nos ateliers
    description:
      'Initiez-vous au tissage sur métier, comme on le pratiquait du Néolithique au Moyen Âge. Chaîne, trame, motifs : on apprend à lire un tissu ancien avant de tisser sa propre bande.',
  },
  {
    id: 'teinture',
    titre: 'Teinture végétale',
    accroche: 'Les couleurs naturelles du passé',
    image: teinture,
    objet: planteGravee, // petit objet détouré de la page Nos ateliers
    description:
      'Garance, gaude, pastel… Explorez les couleurs naturelles du passé et découvrez comment les plantes permettent de teindre les fibres textiles.',
  },
  {
    id: 'broderie',
    titre: 'Broderie historique',
    accroche: 'Les motifs d’antan',
    image: broderie,
    objet: feuille, // petit objet détouré de la page Nos ateliers
    description:
      'Redécouvrez les motifs d’antan et les points utilisés sur les textiles anciens, puis brodez votre propre motif inspiré des pièces archéologiques.',
  },
]
