import { Link } from 'react-router'
import Collage from '../../components/Collage'
import { Eyebrow, Reveal, SectionTitle } from '../../components/ui'
import { ateliers } from '../../data/ateliers'
import arrowLong from '../../assets/common/arrow-long.svg'

/** 05 · Nos ateliers (Figma 253:2) */
export default function Workshops() {
  return (
    <section className="bg-lin py-20 xl:pt-20 xl:pb-[110px]">
      <div className="container-site">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <Reveal className="flex flex-col items-start gap-[18px]">
            <Eyebrow>Nos ateliers</Eyebrow>
            <SectionTitle>
              Apprendre, expérimenter,
              <br />
              transmettre
            </SectionTitle>
          </Reveal>
          <Reveal
            as="p"
            delay={100}
            className="max-w-[440px] text-[17px] leading-[1.4] text-encre/70 lg:mt-12 lg:mr-[62px] xl:text-[19px]"
          >
            Des ateliers pour toucher l’histoire du bout des doigts : filer, tisser, teindre et
            broder comme autrefois, guidé·es par des passionnées d’archéologie.
          </Reveal>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-x-[45px] gap-y-12 sm:grid-cols-2 lg:grid-cols-4 xl:mt-[78px]">
          {ateliers.map((a, i) => (
            <Reveal as="li" key={a.id} delay={i * 100}>
              <Link to={`/ateliers#${a.id}`} className="group block text-center">
                <div className="mx-auto max-w-[287px] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:rotate-[-1.5deg]">
                  <Collage
                    width={287.13}
                    height={266.601}
                    items={[
                      { x: 0, y: 0, w: 287.13, h: 266.601, iw: 261.172, ih: 282.112, rotate: -91.11, src: a.image },
                    ]}
                  />
                </div>
                <h3 className="mt-3 text-[18px] font-medium text-black">{a.titre}</h3>
                <p className="mx-auto mt-2 max-w-[200px] text-[14.5px] font-light text-black/70">
                  {a.accroche}
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>

        <div className="mt-14 flex justify-center xl:mt-[85px]">
          <Link
            to="/ateliers"
            className="group inline-flex h-14 w-full max-w-[451px] items-center justify-center gap-9 rounded-[40px] bg-terre-fonce text-[20px] font-bold text-white transition-colors hover:bg-terre"
          >
            Voir tous nos ateliers
            <img
              src={arrowLong}
              alt=""
              width="27"
              height="11"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
