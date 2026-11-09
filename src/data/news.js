import festival from '../assets/news/festival.webp'
import teinture from '../assets/events/teinture.webp'
import patrimoine from '../assets/events/patrimoine.webp'

/** Articles d'actualité. Le premier de la liste est mis « à la une ». */
export const news = [
  {
    id: 'festival-archeologie-experimentale-occitanie',
    titre: 'Festival d’Archéologie Expérimentale d’Occitanie',
    resume:
      'Néotisse participera au Festival d’Archéologie Expérimentale d’Occitanie, organisé avec le Musée de l’Aurignacien : démonstrations et ateliers participatifs pour découvrir les techniques textiles anciennes.',
    image: festival,
  },
  {
    id: 'plantes-au-service-des-couleurs',
    titre: 'Les plantes au service des couleurs',
    resume: '',
    image: teinture,
  },
  {
    id: 'textile-une-histoire-a-explorer',
    titre: 'Le textile, une histoire à explorer',
    resume: '',
    image: patrimoine,
  },
]
