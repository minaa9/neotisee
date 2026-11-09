import Collage from '../../components/Collage'
import { cq } from '../../components/cq'
import { Button, Eyebrow, Reveal, SectionTitle } from '../../components/ui'
import photo1 from '../../assets/home/asso-photo-1.webp'
import photo2 from '../../assets/home/asso-photo-2.webp'
import photo3 from '../../assets/home/asso-photo-3.webp'
import planteSombre from '../../assets/home/plante-sombre.webp'
import fleurSeche from '../../assets/home/fleur-seche.webp'
import feuille from '../../assets/home/feuille.webp'
import pelote from '../../assets/home/pelote.webp'
import planteGravure from '../../assets/home/plante-gravure.webp'
import blob from '../../assets/home/asso-blob.svg'
import arrow1 from '../../assets/home/asso-arrow-1.svg'
import arrow2 from '../../assets/home/asso-arrow-2.svg'

const stats = [
  { value: '2024', label: 'Fondée à Montpellier' },
  { value: '4', label: 'ateliers de savoir-faire' },
  { value: '5', label: 'partenaires culturels' },
]

// Composition de droite (Figma 252:67 → 252:78), origine x=740 y=55.
const W = 725
const H = 610
const collage = [
  { x: 84, y: 32, w: 217.77, h: 200.364, iw: 191.679, ih: 209.869, rotate: 92.42, src: photo1 },
  { x: 292, y: 39, w: 130.671, h: 154.051, iw: 102.244, ih: 133.883, rotate: -166.5, flipY: true, src: planteSombre, cover: true },
  { x: 58, y: 122, w: 510.204, h: 485.038, iw: 401.043, ih: 350.186, rotate: -24.52, src: photo2 },
  { x: 503, y: 276, w: 104, h: 102, src: blob },
  { x: 511, y: 274, w: 91.59, h: 101.775, iw: 57.744, ih: 84.307, rotate: 29.27, src: fleurSeche, cover: true },
  { x: 443, y: 313, w: 217.64, h: 233.403, iw: 165.924, ih: 190.807, rotate: 18.39, src: photo3 },
  { x: 580, y: 26, w: 29, h: 45, src: feuille, cover: true },
  {
    x: 423, y: 6, w: 302.191, h: 263.657, iw: 278.529, ih: 128.338, rotate: -34.55,
    node: (
      <p
        className="absolute inset-0 text-center font-script leading-[normal] text-black/55"
        style={{ fontSize: cq(15, W) }}
      >
        Des fibres
        <br />
        des gestes
        <br />
        des époques
        <br />
        et une même histoire
      </p>
    ),
  },
  { x: 449.81, y: 158.58, w: 42.491, h: 19.214, src: arrow1 },
  { x: 448.75, y: 172.5, w: 10.717, h: 7.148, src: arrow2 },
  { x: 124, y: 266, w: 105.899, h: 75.615, iw: 101.205, ih: 68.462, rotate: -175.85, flipY: true, src: pelote, cover: true },
  { x: 9, y: 319, w: 90, h: 175, src: planteGravure, cover: true },
]

/** Composition photos + gravures, partagée avec la page L'association. */
export function AssociationCollage() {
  return <Collage width={W} height={H} items={collage} />
}

/** 02 · L'association (Figma 252:46) */
export default function Association() {
  return (
    <section id="association" className="overflow-hidden bg-creme py-20 xl:pt-[110px] xl:pb-[90px]">
      <div className="container-site flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between">
        <Reveal className="flex max-w-[600px] flex-col items-start gap-7 lg:w-[46%] lg:shrink-0">
          <Eyebrow>L’association</Eyebrow>
          <SectionTitle className="text-encre/85 lg:leading-[1.22]">
            Un fil ancien, une histoire bien actuelle.
          </SectionTitle>
          <p className="max-w-[500px] text-[17px] leading-[1.4] text-encre/70 xl:text-[19px]">
            Néotisse fait revivre les savoir-faire textiles anciens à travers l’archéologie
            expérimentale et la médiation scientifique. Fondée en 2024 à Montpellier, l’association
            fait découvrir l’histoire du textile, du filage au tissage, en passant par la teinture
            végétale.
          </p>
          <dl className="flex flex-wrap gap-x-11 gap-y-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-0.5">
                <dt className="text-sm text-encre/65">{s.label}</dt>
                <dd className="font-serif text-[34px] text-terre">{s.value}</dd>
              </div>
            ))}
          </dl>
          <Button to="/association" arrow>
            Découvrir l’association
          </Button>
        </Reveal>

        <Reveal delay={150} className="w-full max-w-[725px] self-center lg:-mt-[55px] lg:self-start xl:-mr-[103px]">
          <AssociationCollage />
        </Reveal>
      </div>
    </section>
  )
}
