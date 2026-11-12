import filage from '../assets/events/filage.webp'
import tissage from '../assets/ateliers/hero.webp'
import teinture from '../assets/events/egypte.webp'
import broderie from '../assets/ateliers/broderie.webp'
import fuseau from '../assets/association/fuseau.webp'
import fragmentTissu from '../assets/association/fragment-tissu.webp'
import planteGravee from '../assets/v3/ui/plante-gravee.webp'
import feuille from '../assets/home/feuille.webp'

/**
 * Points interactifs posés sur les photos de la page Nos ateliers.
 * x / y : position en % sur la photo. « À compléter » = information à fournir
 * par l'association (rien n'est inventé).
 */
const A_COMPLETER = 'À compléter par Néotisse'

/**
 * Les quatre ateliers (arches de l'accueil V3, Figma 348:71).
 * Pour modifier un texte, il suffit de changer la valeur entre guillemets.
 */
export const ateliers = [
  {
    id: 'filage',
    points: [
      { x: 47, y: 56, nom: 'Écheveau de laine', matiere: 'Laine', technique: 'Filage', infos: A_COMPLETER },
    ],
    titre: 'Filage de la laine',
    accroche: 'Le geste ancestral du filage',
    image: filage,
    objet: fuseau, // petit objet détouré de la page Nos ateliers
    description:
      'Du fuseau à la quenouille, découvrez le geste ancestral qui transforme la fibre en fil. Après une présentation des outils retrouvés en fouille, chacun·e s’essaie au filage de la laine brute.',
  },
  {
    id: 'tissage',
    points: [
      { x: 45, y: 40, nom: 'Bande tissée à chevrons', matiere: A_COMPLETER, technique: 'Tissage sur métier', infos: A_COMPLETER },
      { x: 56, y: 60, nom: 'Pelote de fil', matiere: A_COMPLETER, technique: 'Fil de trame', infos: A_COMPLETER },
    ],
    titre: 'Tissage traditionnel',
    accroche: 'Le tissage sur métier',
    image: tissage,
    objet: fragmentTissu, // petit objet détouré de la page Nos ateliers
    description:
      'Initiez-vous au tissage sur métier, comme on le pratiquait du Néolithique au Moyen Âge. Chaîne, trame, motifs : on apprend à lire un tissu ancien avant de tisser sa propre bande.',
  },
  {
    id: 'teinture',
    points: [
      { x: 55, y: 50, nom: 'Échantillons teints', matiere: A_COMPLETER, technique: 'Teinture végétale', infos: 'Garance, gaude, pastel… plantes présentées en atelier.' },
      { x: 70, y: 70, nom: 'Petit tissage coloré', matiere: A_COMPLETER, technique: 'Tissage et teinture végétale', infos: A_COMPLETER },
    ],
    titre: 'Teinture végétale',
    accroche: 'Les couleurs naturelles du passé',
    image: teinture,
    objet: planteGravee, // petit objet détouré de la page Nos ateliers
    description:
      'Garance, gaude, pastel… Explorez les couleurs naturelles du passé et découvrez comment les plantes permettent de teindre les fibres textiles.',
  },
  {
    id: 'broderie',
    points: [
      { x: 72, y: 38, nom: 'Point vert en relief', matiere: A_COMPLETER, technique: 'Broderie', infos: A_COMPLETER },
      { x: 30, y: 72, nom: 'Fils beiges couchés', matiere: A_COMPLETER, technique: 'Broderie', infos: A_COMPLETER },
    ],
    titre: 'Broderie historique',
    accroche: 'Les motifs d’antan',
    image: broderie,
    objet: feuille, // petit objet détouré de la page Nos ateliers
    description:
      'Redécouvrez les motifs d’antan et les points utilisés sur les textiles anciens, puis brodez votre propre motif inspiré des pièces archéologiques.',
  },
]
