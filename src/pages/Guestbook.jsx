import Collage from '../components/Collage'
import { Eyebrow, Reveal } from '../components/ui'
import { temoignages } from '../data/temoignages'
import photo1 from '../assets/events/teinture.webp'
import photo2 from '../assets/ateliers/hero.webp'
import fleurViolette from '../assets/home/fleur-violette.webp'
import etoiles from '../assets/common/etoiles.svg'

function Polaroid({ src, w, h, pw, ph }) {
  const pad = (v, total) => `${(v / total) * 100}%`
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[6px] bg-[#fbf6ec] shadow-[0_18px_40px_rgba(31,26,23,0.14)]">
      <img
        src={src}
        alt=""
        className="absolute rounded-[3px] object-cover"
        style={{ left: pad(14, w), top: pad(14, h), width: pad(pw, w), height: pad(ph, h) }}
      />
    </div>
  )
}

// Tirages photo + fleur (Figma 306:645 → 306:518), origine x=740 y=130.
const PW = 670
const PH = 555
const photos = [
  { x: 0, y: 45, w: 386.984, h: 451.93, iw: 358, ih: 428, rotate: -4, node: <Polaroid src={photo1} w={358} h={428} pw={330} ph={400} /> },
  { x: 256.18, y: 140.18, w: 360.568, h: 415.111, iw: 328, ih: 388, rotate: 5, node: <Polaroid src={photo2} w={328} h={388} pw={300} ph={360} /> },
  { x: 510, y: 0, w: 159.152, h: 161.688, iw: 140, ih: 143, rotate: -8.29, src: fleurViolette, cover: true },
]

/** Page Livre d'or (Figma 306:486) */
export default function GuestbookPage() {
  return (
    <div className="overflow-hidden bg-[#f7eddd] pb-16">
      <section className="container-site relative flex flex-col gap-12 pt-14 lg:flex-row lg:justify-between xl:pt-[98px]">
        <Reveal as="header" className="lg:pt-0">
          <Eyebrow>Livre d’or</Eyebrow>
          <h1 className="mt-6 font-serif text-[52px] leading-[1.05] text-encre xl:text-[72px]">
            Ils ont tissé
            <br />
            avec nous
          </h1>
          <span aria-hidden="true" className="mt-8 block h-[2px] w-[119px] bg-terre" />
          <p className="mt-8 max-w-[560px] text-[18px] leading-[1.55] text-encre/78 xl:text-[20px]">
            Les mots laissés par celles et ceux qui ont partagé un atelier, une démonstration ou une
            rencontre.
          </p>
        </Reveal>

        <Reveal delay={150} className="mx-auto w-full max-w-[620px] lg:mx-0 lg:-mt-[49px] lg:w-[47%] xl:mr-[-47px] xl:max-w-[670px]">
          <Collage width={PW} height={PH} items={photos} />
        </Reveal>
      </section>

      <section aria-label="Témoignages" className="container-site mt-16 xl:mt-[130px]">
        <ol className="border-t border-terre/35">
          {temoignages.map((t, i) => (
            <Reveal
              as="li"
              key={i}
              className="grid gap-6 border-b border-sable/70 py-12 md:grid-cols-[368px_1fr] md:gap-0 xl:py-[70px]"
            >
              <div>
                <p className="font-serif text-[20px] text-terre">{String(i + 1).padStart(2, '0')}</p>
                <img src={etoiles} alt="5 étoiles sur 5" width="106" height="18" className="mt-5" />
                <p className="mt-6 text-sm leading-[1.6] text-encre/60">
                  {t.atelier}
                  <br />
                  {t.date}
                </p>
              </div>
              <blockquote className="relative pl-12 xl:pl-14">
                <span
                  aria-hidden="true"
                  className="absolute top-[22px] left-0 font-serif text-[90px] leading-[0.5] text-terre xl:text-[120px]"
                >
                  “
                </span>
                <p className="font-serif text-[24px] leading-[1.38] text-encre md:text-[28px] xl:text-[34px]">
                  {t.texte}
                </p>
              </blockquote>
            </Reveal>
          ))}
        </ol>
      </section>
    </div>
  )
}
