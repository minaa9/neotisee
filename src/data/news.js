import festival from '../assets/news/festival.webp'
import teinture from '../assets/events/teinture.webp'
import patrimoine from '../assets/events/patrimoine.webp'

/**
 * Articles d'actualité. Le premier de la liste est mis « à la une » sur l'accueil.
 * - `resume` : texte court de l'accueil
 * - `texte`  : texte de la page Actualités
 */
export const news = [
  {
    id: 'festival-archeologie-experimentale-occitanie',
    rubrique: 'Événement · 9–10 octobre 2027',
    titre: 'Festival d’Archéologie Expérimentale d’Occitanie',
    resume:
      'Néotisse participera au Festival d’Archéologie Expérimentale d’Occitanie, organisé avec le Musée de l’Aurignacien : démonstrations et ateliers participatifs pour découvrir les techniques textiles anciennes.',
    texte:
      'Les 9 et 10 octobre 2027, Néotisse participera au Festival d’Archéologie Expérimentale d’Occitanie, organisé avec le Musée de l’Aurignacien. Une occasion de faire découvrir les techniques textiles anciennes à travers des démonstrations et des ateliers participatifs.',
    image: festival,
    alt: 'Participantes et participants autour d’une table pendant un atelier textile',
  },
  {
    id: 'plantes-au-service-des-couleurs',
    rubrique: 'Atelier · Teinture végétale',
    titre: 'Les plantes au service des couleurs',
    texte:
      'Explorez les pigments naturels et découvrez comment les plantes permettent de teindre les fibres textiles.',
    image: teinture,
    alt: 'Une animatrice prépare un bain de teinture végétale dans une jarre',
  },
  {
    id: 'textile-une-histoire-a-explorer',
    rubrique: 'Recherche · Archéologie expérimentale',
    titre: 'Le textile, une histoire à explorer',
    texte:
      'Plongez dans les recherches et les expérimentations qui nous aident à mieux comprendre les textiles anciens.',
    image: patrimoine,
    alt: 'Des mains tissent avec des fils rouges sur un petit métier à tisser en carton',
  },
]
