import { Link } from 'react-router'
import { CenteredHeading, Reveal } from '../../components/ui'
import { ateliers } from '../../data/ateliers'
import vague from '../../assets/v3/home/vague-ateliers.svg'

/** 05 · Nos ateliers (Figma 348:71) */
export default function Workshops() {
  return (
    <section className="relative bg-creme pt-24 pb-16 xl:pt-[160px] xl:pb-[90px]">
      <img src={vague} alt="" aria-hidden="true" className="absolute inset-x-0 top-[-1px] h-[70px] w-full md:h-[141px]" />
      <div className="container-site relative">
        <CenteredHeading
          title={
            <>
              Apprendre, <em>expérimenter,</em> transmettre
            </>
          }
          subtitle="Des ateliers pour toucher l’histoire du bout des doigts, guidé·es par des passionnées d’archéologie."
        />

        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-10 lg:grid-cols-4 xl:mt-[50px]">
          {ateliers.map((a, i) => (
            <Reveal as="li" key={a.id} delay={i * 100} className={i % 2 === 1 ? 'mt-8 lg:mt-[36px]' : ''}>
              <Link to={`/ateliers#${a.id}`} className="group block">
                <div className="overflow-hidden rounded-t-[135px] rounded-b-[20px]">
                  <img
                    src={a.image}
                    alt=""
                    loading="lazy"
                    className="aspect-[270/320] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-label text-brique sm:mt-[22px]">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-1 font-serif text-[22px] leading-[1.18] sm:text-[28px] text-brun transition-colors group-hover:text-terre-cuite">
                  {a.titre}
                </h3>
                <p className="mt-1 font-serif text-[16px] leading-[1.15] sm:text-[19px] font-light text-brun-doux italic">{a.accroche}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
