import { Eyebrow, Reveal } from './ui'
import gergovie from '../assets/partners/gergovie.webp'
import tautavel from '../assets/partners/tautavel.webp'
import festivalLin from '../assets/partners/festival-lin.webp'
import lozere from '../assets/partners/lozere.webp'
import cerac from '../assets/partners/cerac.webp'

const partners = [
  { name: 'Musée de Gergovie', logo: gergovie },
  { name: 'Musée de Préhistoire de Tautavel', logo: tautavel },
  { name: 'Festival du lin et de la fibre artistique', logo: festivalLin },
  { name: 'Lozère Tourisme', logo: lozere },
  { name: 'CERAC', logo: cerac },
]

/**
 * Bandeau « Ils nous font confiance »
 * (Figma : utilisé sur l'accueil et la page L'association).
 */
export default function PartnersBand() {
  return (
    <section className="bg-lin py-16 xl:py-[90px]" aria-labelledby="partenaires-titre">
      <div className="container-site">
        <Reveal className="flex flex-col items-center gap-3.5 text-center">
          <Eyebrow centered>Partenaires</Eyebrow>
          <h2 id="partenaires-titre" className="font-serif text-[32px] text-encre/90 md:text-[40px]">
            Ils nous font confiance
          </h2>
          <p className="text-[17px] text-encre/65">
            Musées, festivals et acteurs du territoire soutiennent nos projets de médiation.
          </p>
        </Reveal>

        <ul className="mt-11 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:gap-6">
          {partners.map((p, i) => (
            <Reveal
              as="li"
              key={p.name}
              delay={i * 80}
              className="flex h-[110px] items-center justify-center rounded-[20px] border border-sable/50 bg-white/75 px-6 xl:h-[132px]"
            >
              <img
                src={p.logo}
                alt={p.name}
                loading="lazy"
                className="h-[70px] w-full max-w-[170px] object-contain xl:h-[86px]"
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
