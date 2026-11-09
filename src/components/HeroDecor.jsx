import Collage from './Collage'
import photoTissage from '../assets/actualites/photo-tissage.webp'
import tache1 from '../assets/actualites/tache-1.svg'
import tache2 from '../assets/actualites/tache-2.svg'
import tache3 from '../assets/actualites/tache-3.svg'
import fil from '../assets/actualites/fil.svg'
import fleurViolette from '../assets/home/fleur-violette.webp'
import planteGravure from '../assets/home/plante-gravure.webp'


// Décor de l'en-tête (Figma 257:325 → 257:348), origine x=0 y=106.
const W = 1440
const H = 450
const blob = { w: 191.71, h: 192.641, iw: 130.54, ih: 141.71, rotate: -41.62 }
const decor = [
  { x: 1269, y: 0, ...blob, src: tache1 },
  { x: 1278, y: 124, ...blob, src: tache2 },
  { x: 1256, y: 235, ...blob, src: tache3 },
  { x: 933, y: 34, w: 442.641, h: 334.763, iw: 441.312, ih: 333, rotate: 0.23, src: photoTissage },
  { x: 15.53, y: 232.59, w: 951.739, h: 216.674, src: fil },
  { x: 809, y: 126, w: 117.324, h: 119.065, iw: 103.225, ih: 105.284, rotate: -8.29, src: fleurViolette, cover: true },
  { x: 1265, y: 22, w: 231.704, h: 341.137, iw: 160.426, ih: 311.357, rotate: 14.16, src: planteGravure, cover: true },
]

// Variante de la page Contact (Figma 257:536 → 257:562) : une seule tache, pas de gravure.
const contactDecor = [
  { x: 1278, y: 49, ...blob, src: tache3 },
  ...decor.filter((d) => ![tache1, tache2, tache3, planteGravure].includes(d.src)),
]

/**
 * Décor des en-têtes Actualités et Calendrier (photo détourée, taches,
 * gravures et fil rouge). Affiché à partir de 1280 px.
 */
export default function HeroDecor({ variant = 'default' }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[4px] hidden xl:block">
      <Collage width={W} height={H} items={variant === 'contact' ? contactDecor : decor} />
    </div>
  )
}
