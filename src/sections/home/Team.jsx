import Collage from '../../components/Collage'
import { cq } from '../../components/cq'
import { ArrowLink, Eyebrow, Reveal, SectionTitle } from '../../components/ui'
import fleurViolette from '../../assets/home/fleur-violette.webp'
import traitCourbe from '../../assets/home/trait-rouge-courbe.svg'
import marie from '../../assets/home/equipe-marie.webp'
import emilie from '../../assets/home/equipe-emilie.webp'

// Citation manuscrite (Figma 254:73 → 254:75), origine x=100 y=330.
const QW = 565
const QH = 300
const quote = [
  {
    x: 20, y: 85, w: 322, h: 129,
    node: (
      <p className="absolute inset-0 font-script leading-[normal] text-black/72" style={{ fontSize: cq(20, QW) }}>
        Le textile est un lien entre les époques , les peuples et les savoirs !
      </p>
    ),
  },
  { x: 3, y: 234, w: 478, h: 59, src: traitCourbe },
  { x: 313, y: 11.35, w: 249.144, h: 252.002, iw: 202.589, ih: 206.631, rotate: 14.99, src: fleurViolette, cover: true },
]

const members = [
  {
    name: 'Marie-Salomé',
    role: 'Master en égyptologie',
    photo: marie,
    box: { w: 239.085, h: 242.658, iw: 226.12, ih: 229.92 },
  },
  {
    name: 'Émilie Roma',
    role: 'Doctorante en archéologie',
    photo: emilie,
    box: { w: 219.871, h: 277.825, iw: 204.753, ih: 266.389 },
  },
]

/** 04 · L'équipe & citation (Figma 254:71) */
export default function Team() {
  return (
    <section className="overflow-hidden bg-creme py-20 xl:pt-[70px] xl:pb-[60px]">
      <div className="container-site flex flex-col-reverse gap-12 lg:flex-row lg:items-end lg:justify-between">
        <Reveal className="mx-auto w-full max-w-[565px] lg:mx-0 lg:mb-[90px] lg:-ml-[22px] lg:w-[44%]">
          <Collage width={QW} height={QH} items={quote} />
        </Reveal>

        <div className="lg:w-[48%] lg:max-w-[602px]">
          <Reveal className="flex flex-col items-start gap-[22px]">
            <Eyebrow>L’équipe</Eyebrow>
            <SectionTitle className="xl:text-[44px]">
              Deux chercheuses,
              <br />
              une même passion
            </SectionTitle>
            <p className="max-w-[520px] text-[17px] leading-[1.4] text-encre/70">
              Archéologie, égyptologie, gestes de tisserands : Néotisse est née de la rencontre
              entre la recherche et l’envie de transmettre.
            </p>
          </Reveal>

          <ul className="mt-10 grid grid-cols-[239fr_220fr] gap-6 sm:gap-[51px] xl:mt-[54px]">
            {members.map((m, i) => (
              <Reveal as="li" key={m.name} delay={i * 120} className="flex flex-col">
                <div>
                  <Collage
                    width={m.box.w}
                    height={m.box.h}
                    className="w-full"
                    items={[{ x: 0, y: 0, ...m.box, rotate: -3.33, src: m.photo }]}
                  />
                </div>
                <p className="mt-auto pt-3.5 pl-2.5 font-serif text-[20px] text-encre sm:text-[24px]">{m.name}</p>
                <p className="mt-1 pl-2.5 text-sm text-encre/70">{m.role}</p>
              </Reveal>
            ))}
          </ul>

          <ArrowLink to="/equipe" className="mt-8">
            Rencontrer l’équipe
          </ArrowLink>
        </div>
      </div>
    </section>
  )
}
