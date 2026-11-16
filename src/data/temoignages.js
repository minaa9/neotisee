import filage from '../assets/events/filage.webp'
import tissage from '../assets/ateliers/hero.webp'
import teinture from '../assets/events/egypte.webp'
import broderie from '../assets/ateliers/broderie.webp'
import patrimoine from '../assets/events/patrimoine.webp'

/**
 * Témoignages (accueil et Livre d'or).
 * Pour en ajouter un : copier un bloc et modifier les champs.
 * Les deux derniers sont des exemples de mise en page : à remplacer par de
 * vrais avis de participants avant la mise en ligne.
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
  },  {
    texte:
      'On a brodé un petit motif inspiré d’un tissu ancien. Le temps file sans qu’on s’en rende compte : un vrai moment de calme, et de belles explications sur les points d’autrefois.',
    atelier: 'Atelier broderie historique',
    date: '2026',
    note: 5,
    vignette: broderie,
  },
  {
    texte:
      'Une intervention dans la classe de ma fille : les élèves ont tissé sur des métiers en carton et posé mille questions sur le Moyen Âge. Ils en parlent encore !',
    atelier: 'Atelier en milieu scolaire',
    date: '2026',
    note: 5,
    vignette: patrimoine,
  },
]
