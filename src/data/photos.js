import heroTissu from '../assets/home/hero.webp'
import metierBande from '../assets/ateliers/hero.webp'
import bandesChevrons from '../assets/ateliers/tissage.webp'
import broderie from '../assets/ateliers/broderie.webp'
import echeveau from '../assets/events/filage.webp'
import jarreTeinture from '../assets/events/teinture.webp'
import standTeintures from '../assets/events/egypte.webp'
import metierCarton from '../assets/events/patrimoine.webp'
import atelierTable from '../assets/news/festival.webp'
import emilie from '../assets/v3/equipe/emilie.webp'
import marie from '../assets/v3/equipe/marie.webp'

/**
 * Toutes les photos du site, avec leur description (texte alternatif).
 * Utilisé par la galerie, le menu plein écran, la frise…
 */
export const photos = {
  heroTissu: { src: heroTissu, alt: 'Navette en bois posée sur une étoffe rayée, panier de laine en arrière-plan' },
  metierBande: { src: metierBande, alt: 'Mains tissant une bande sur un métier, une pelote de laine au bout' },
  bandesChevrons: { src: bandesChevrons, alt: 'Bandes tissées à motifs de chevrons sur des cadres en bois' },
  broderie: { src: broderie, alt: 'Broderie de fils de laine verte et beige sur toile de lin' },
  echeveau: { src: echeveau, alt: 'Deux mains tenant un écheveau de laine écrue' },
  jarreTeinture: { src: jarreTeinture, alt: 'Une animatrice prépare un bain de teinture végétale dans une jarre' },
  standTeintures: { src: standTeintures, alt: 'Une animatrice présente des échantillons de laine teinte' },
  metierCarton: { src: metierCarton, alt: 'Des mains tissent des fils rouges et jaunes sur un petit métier en carton' },
  atelierTable: { src: atelierTable, alt: 'Participantes et participants autour d’une table pendant un atelier textile' },
  emilie: { src: emilie, alt: 'Émilie Roma file de la laine au fuseau' },
  marie: { src: marie, alt: 'Marie-Salomé lors d’une démonstration' },
}

/** Photo affichée au survol de chaque lien du menu plein écran. */
export const menuPhotos = {
  '/': photos.heroTissu,
  '/association': photos.atelierTable,
  '/equipe': photos.emilie,
  '/ateliers': photos.metierBande,
  '/actualites': photos.standTeintures,
  '/calendrier': photos.bandesChevrons,
  '/livre-d-or': photos.jarreTeinture,
  '/contact': photos.broderie,
}
