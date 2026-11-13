import festival from '../assets/news/festival.webp'
import patrimoine from '../assets/events/patrimoine.webp'
import tissage from '../assets/ateliers/hero.webp'
import teinture from '../assets/events/teinture.webp'

/**
 * Articles d'actualité. Le premier de la liste est mis « à la une ».
 * `paragraphes` : chaque élément de la liste devient un paragraphe.
 */
export const news = [
  {
    id: 'festival-archeologie-experimentale-occitanie',
    rubrique: '9–10 octobre 2027',
    titre: 'Festival d’Archéologie Expérimentale d’Occitanie',
    paragraphes: [
      'Les 9 et 10 octobre 2027, Néotisse participera au festival organisé avec le Musée de l’Aurignacien : démonstrations et ateliers participatifs pour découvrir les techniques textiles anciennes.',
      'Au programme : démonstrations de filage au fuseau, tissage sur métier et teinture végétale. Petits et grands pourront mettre la main à la fibre et repartir avec leur propre échantillon tissé.',
    ],
    image: festival,
    alt: 'Participantes et participants autour d’une table pendant un atelier textile',
  },
  {
    id: 'plantes-au-service-des-couleurs',
    rubrique: '',
    titre: 'Les plantes au service des couleurs',
    paragraphes: [
      'Explorez les pigments naturels et découvrez comment les plantes permettent de teindre les fibres.',
      'Garance pour les rouges, gaude pour les jaunes, pastel pour les bleus : en atelier, nous préparons les bains de teinture et observons comment une même plante change de teinte selon le mordant utilisé.',
    ],
    image: patrimoine,
    alt: 'Des mains tissent avec des fils rouges et jaunes sur un petit métier en carton',
  },
  {
    id: 'textile-une-histoire-a-explorer',
    rubrique: '',
    titre: 'Le textile, une histoire à explorer',
    paragraphes: [
      'Les recherches et expérimentations qui nous aident à comprendre les textiles anciens.',
      'Chaque atelier s’appuie sur des découvertes archéologiques : nous reconstituons les gestes à partir des vestiges et des outils retrouvés, les testons nous-mêmes, puis les transmettons au public.',
    ],
    image: tissage,
    alt: 'Tissage d’une bande à chevrons sur un métier',
  },
  {
    id: 'journee-patrimoine-textile',
    rubrique: '',
    titre: 'Journée spéciale patrimoine textile',
    paragraphes: [
      'Tissus, outils et reconstitutions : une journée pour découvrir le patrimoine textile, du Néolithique au Moyen Âge.',
      'Le 5 décembre à Montpellier, venez manipuler des reproductions d’outils, observer des tissages reconstitués et échanger avec nos chercheuses sur l’histoire du textile.',
    ],
    image: teinture,
    alt: 'Une animatrice prépare un bain de teinture végétale dans une jarre',
  },
]
