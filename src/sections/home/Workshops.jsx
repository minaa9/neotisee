import { Link } from 'react-router'
import { CenteredHeading, Reveal } from '../../components/ui'
import { ateliers } from '../../data/ateliers'
import vague from '../../assets/v3/home/vague-ateliers.svg'

/** 05 · Nos ateliers (Figma 348:71) */
export default function Workshops() {
  return (
    <section className="relative bg-creme pt-28 pb-24 xl:pt-[223px] xl:pb-[130px]">
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

        <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 xl:mt-[76px]">
          {ateliers.map((a, i) => (
            <Reveal as="li" key={a.id} delay={i * 100} className={i % 2 === 1 ? 'lg:mt-[50px]' : ''}>
              <Link to={`/ateliers#${a.id}`} className="group block">
                <div className="overflow-hidden rounded-t-[135px] rounded-b-[20px]">
                  <img
                    src={a.image}
                    alt=""
                    loading="lazy"
                    className="aspect-[270/370] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-[26px] text-label text-brique">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-1.5 font-serif text-[30px] leading-[1.18] text-brun transition-colors group-hover:text-terre-cuite">
                  {a.titre}
                </h3>
                <p className="mt-1.5 font-serif text-[19px] leading-[1.15] font-light text-brun-doux italic">{a.accroche}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
