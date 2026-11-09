import Collage from '../components/Collage'
import { cq } from '../components/cq'
import PartnersBand from '../components/PartnersBand'
import { Eyebrow, Reveal, SectionTitle } from '../components/ui'
import { AssociationCollage } from '../sections/home/Association'
import silex from '../assets/association/silex.webp'
import fuseau from '../assets/association/fuseau.webp'
import fragmentTissu from '../assets/association/fragment-tissu.webp'
import fleurViolette from '../assets/home/fleur-violette.webp'
import tacheRose from '../assets/association/tache-rose.svg'
import tacheOcre from '../assets/association/tache-ocre.svg'
import tacheVerte from '../assets/association/tache-verte.svg'
import tacheSable from '../assets/association/tache-sable.svg'
import fil1 from '../assets/association/fil-1.svg'
import fil2 from '../assets/association/fil-2.svg'
import fil3 from '../assets/association/fil-3.svg'
import fil4 from '../assets/association/fil-4.svg'
import fil5 from '../assets/association/fil-5.svg'

// « Fil » des étapes (Figma 257:86 → 257:123), origine x=0 y=821.
const W = 1440
const H = 262

function Label({ children, className, size = 15 }) {
  return (
    <p
      className={`absolute inset-0 flex items-center justify-center whitespace-nowrap ${className}`}
      style={{ fontSize: cq(size, W) }}
    >
      {children}
    </p>
  )
}

const timeline = [
  { x: -137, y: 0, w: 274.24, h: 236.397, iw: 155.97, ih: 230.727, rotate: 65.97, src: fil1 },
  { x: 226, y: 101, w: 224.836, h: 195.089, iw: 116.883, ih: 192.313, rotate: -118.81, src: fil2 },
  { x: 538, y: 43.53, w: 242, h: 212.935, iw: 130.635, ih: 204.339, rotate: -118.81, src: fil3 },
  { x: 897, y: 80.52, w: 243, h: 156.97, iw: 83.585, ih: 228.172, rotate: 69.88, src: fil4 },
  { x: 1253, y: 124, w: 187, h: 70, src: fil5 },
  { x: 123, y: 94, w: 132.132, h: 137.035, iw: 104.227, ih: 111.582, rotate: 16.88, src: tacheSable },
  { x: 429, y: 105, w: 109, h: 105, src: tacheVerte },
  { x: 760, y: 90, w: 157.205, h: 156.206, iw: 117, ih: 105, rotate: -41.62, src: tacheRose },
  { x: 1140, y: 94, w: 117, h: 105, src: tacheOcre },
  { x: 146, y: 116, w: 86, h: 67, src: silex, cover: true },
  { x: 467, y: 97, w: 33, h: 121, src: fuseau, cover: true },
  { x: 783, y: 101, w: 100.36, h: 101.849, iw: 88.3, ih: 90.061, rotate: -8.29, src: fleurViolette, cover: true },
  { x: 1152, y: 100, w: 94, h: 83, src: fragmentTissu, cover: true },
  { x: 183, y: 60, w: 67, h: 40, rotate: 18.14, node: <Label className="font-medium text-[rgba(205,151,78,0.85)]">Le déclic</Label> },
  { x: 759.5, y: 62, w: 191, h: 34, rotate: 3.97, node: <Label className="font-bold text-[#b47faf]">Faire vivre les savoir-faire</Label> },
  { x: 380, y: 190, w: 223.5, h: 40, rotate: -8.72, node: <Label className="font-bold text-olive/65">Remonter le fil des techniques</Label> },
  { x: 1111, y: 209, w: 180.5, h: 30, rotate: -1.84, node: <Label className="font-bold text-[#ae8147]">Tisser de nouveaux liens</Label> },
]

const steps = [
  'Le déclic',
  'Remonter le fil des techniques',
  'Faire vivre les savoir-faire',
  'Tisser de nouveaux liens',
]

/** Page L'association (Figma 257:76) */
export default function About() {
  return (
    <>
      <section className="overflow-hidden bg-creme pt-16 pb-10 xl:pt-[99px]">
        <div className="container-site flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <Reveal className="flex max-w-[600px] flex-col items-start lg:w-[46%] lg:shrink-0">
            <Eyebrow>L’association</Eyebrow>
            <SectionTitle as="h1" className="mt-11 text-black/73">
              Un fil ancien, une histoire bien actuelle.
            </SectionTitle>
            <div className="mt-8 flex flex-col gap-4 text-[17px] leading-[1.55] text-black/67 xl:mt-[42px] xl:text-[18px]">
              <p>
                Fondée en mai 2024 à Montpellier, Néotisse est une association loi 1901 née d’une
                conviction : les textiles anciens ont beaucoup à nous raconter. Portée par Émilie
                Roma, doctorante en archéologie spécialiste des systèmes de tissage, et
                Marie-Salomé, diplômée d’un master en égyptologie, elle fait revivre les
                savoir-faire textiles du Néolithique au Moyen Âge.
              </p>
              <p>
                Par l’archéologie expérimentale, nous reconstituons les gestes oubliés – filage,
                tissage, teinture végétale, broderie – pour mieux comprendre comment vivaient et
                créaient les sociétés anciennes. Par la médiation scientifique, nous partageons ces
                découvertes avec tous les publics : écoles, musées, festivals et curieux de tout âge.
              </p>
            </div>
          </Reveal>

          <Reveal delay={150} className="w-full max-w-[725px] self-center lg:-mt-[54px] lg:self-start xl:-mr-[103px]">
            <AssociationCollage />
          </Reveal>
        </div>
      </section>

      {/* Le fil de notre histoire */}
      <section className="bg-creme pb-16 xl:pb-[80px]" aria-labelledby="fil-titre">
        <h2 id="fil-titre" className="sr-only">
          Le fil de notre histoire
        </h2>
        <ol className="sr-only">
          {steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <Reveal className="overflow-x-auto overflow-y-hidden [scrollbar-width:none]">
          <div className="min-w-[1100px]">
            <Collage width={W} height={H} items={timeline} />
          </div>
        </Reveal>
      </section>

      <PartnersBand />
    </>
  )
}
