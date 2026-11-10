import { Reveal, Star } from './ui'
import vaguePeche from '../assets/v3/home/vague-peche.svg'
import gergovie from '../assets/v3/partners/gergovie.webp'
import tautavel from '../assets/v3/partners/tautavel.webp'
import festivalLin from '../assets/v3/partners/festival-lin.webp'
import lozere from '../assets/v3/partners/lozere.webp'
import cerac from '../assets/v3/partners/cerac.webp'

const partners = [
  { name: 'Musée de Gergovie', logo: gergovie },
  { name: 'Musée de Préhistoire de Tautavel', logo: tautavel },
  { name: 'Festival du lin et de la fibre artistique', logo: festivalLin },
  { name: 'Lozère Tourisme', logo: lozere },
  { name: 'CERAC', logo: cerac },
]

/** Bandeau « Ils nous font confiance » (Figma 347:80). */
export default function PartnersBand() {
  return (
    <section aria-labelledby="partenaires-titre" className="relative bg-creme pt-24 pb-16 xl:pt-[103px] xl:pb-[48px]">
      <img
        src={vaguePeche}
        alt=""
        aria-hidden="true"
        className="absolute inset-x-0 top-3 bottom-0 h-[calc(100%-12px)] w-full"
      />
      <div className="container-site relative">
        <Reveal className="flex flex-col items-center text-center">
          <Star />
          <h2 id="partenaires-titre" className="mt-3.5 font-serif text-[36px] leading-[1.08] text-brun md:text-[44px]">
            Ils nous font confiance
          </h2>
          <p className="mt-4 text-chapo text-brun-doux">
            Musées, festivals et acteurs du territoire soutiennent nos projets de médiation.
          </p>
        </Reveal>
        <ul className="mx-auto mt-10 grid max-w-[1128px] grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:mt-[38px] xl:gap-8">
          {partners.map((p, i) => (
            <Reveal
              as="li"
              key={p.name}
              delay={i * 80}
              className="flex h-[110px] items-center justify-center rounded-[24px] bg-lin px-[30px] py-5"
            >
              <img src={p.logo} alt={p.name} loading="lazy" className="h-[70px] w-[140px] object-contain" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
