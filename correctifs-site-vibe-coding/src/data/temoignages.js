import filage from '../assets/events/filage.webp'
import tissage from '../assets/ateliers/hero.webp'
import teinture from '../assets/events/egypte.webp'

/**
 * Témoignages (accueil et Livre d'or).
 * Pour en ajouter un : copier un bloc et modifier les champs.
 */
export const temoignages = [
  {
    texte:
      'Je n’avais jamais tenu un fuseau de ma vie. En deux heures, j’ai compris tout le chemin qui mène de la toison au fil. Une animatrice passionnée et très pédagogue.',
    atelier: 'Atelier filage de la laine',
    date: '2026',
    note: 5,
    vignette: filage,
  },
  {
    texte:
      'Un atelier passionnant, à la croisée de l’archéologie et du geste. Mes enfants ont adoré tisser leur propre bande… et moi aussi !',
    atelier: 'Atelier tissage traditionnel',
    date: '2026',
    note: 5,
    vignette: tissage,
  },
  {
    texte:
      'Voir la garance donner ce rouge si profond, c’était magique. On repart avec des échantillons et l’envie d’essayer chez soi.',
    atelier: 'Atelier teinture végétale',
    date: '2026',
    note: 5,
    vignette: teinture,
  },
]
