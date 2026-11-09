import Collage from '../components/Collage'
import { Button, Eyebrow, Reveal } from '../components/ui'
import { ateliers } from '../data/ateliers'
import hero from '../assets/ateliers/hero.webp'
import fleurViolette from '../assets/home/fleur-violette.webp'
import planteGravure from '../assets/home/plante-gravure.webp'

/** Page Nos ateliers (Figma 302:362) */
export default function WorkshopsPage() {
  return (
    <div className="relative overflow-hidden bg-[#f7eddd] pt-14 pb-24 xl:pt-[88px] xl:pb-[200px]">
      <div className="container-site relative">
        {/* Fleur décorative */}
        <div className="pointer-events-none absolute top-[47px] right-[-58px] hidden w-[170px] lg:block">
          <Collage
            width={170.489}
            height={173.025}
            items={[
              { x: 0, y: 0, w: 170.489, h: 173.025, iw: 150, ih: 153, rotate: -8.29, src: fleurViolette, cover: true },
            ]}
          />
        </div>

        <Reveal as="header">
          <Eyebrow>Ateliers</Eyebrow>
          <h1 className="mt-6 max-w-[1100px] font-serif text-[40px] leading-[1.15] text-encre md:text-[52px] xl:text-[64px]">
            Apprendre, expérimenter,
            <br className="hidden md:block" /> transmettre
          </h1>
          <p className="mt-5 max-w-[640px] text-[18px] leading-[1.55] text-encre/78 xl:text-[20px]">
            Découvrez nos ateliers autour du textile ancien,
            <br className="hidden sm:block" /> entre savoir-faire et histoire
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-10 overflow-hidden rounded-[24px] xl:mt-[52px]">
          <img
            src={hero}
            alt="Mains tissant une bande sur un métier à tisser, avec une pelote de laine"
            className="aspect-[4/3] w-full object-cover sm:aspect-[1284/500]"
          />
        </Reveal>

        <hr className="mt-14 border-0 border-t border-terre/35 xl:mt-[120px]" />

        <ol className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4 xl:mt-[72px]">
          {ateliers.map((a, i) => (
            <Reveal
              as="li"
              key={a.id}
              id={a.id}
              delay={i * 100}
              className={`scroll-mt-28 ${i % 2 === 1 ? 'lg:mt-[72px]' : ''}`}
            >
              <img
                src={a.photo}
                alt=""
                loading="lazy"
                className="aspect-[297/420] w-full rounded-t-[148.5px] rounded-b-[12px] object-cover"
              />
              <p className="mt-7 flex items-center gap-3 font-serif text-[20px] text-terre">
                {String(i + 1).padStart(2, '0')}
                <span aria-hidden="true" className="h-px w-10 bg-terre" />
              </p>
              <h2 className="mt-3 font-serif text-[30px] leading-[1.15] text-encre">{a.titre}</h2>
              <p className="mt-3 text-base leading-[1.65] text-encre/78">{a.description}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-16 flex flex-col items-start gap-5 rounded-[24px] bg-lin p-8 sm:flex-row sm:items-center sm:justify-between xl:mt-24 xl:p-12">
          <div>
            <p className="font-serif text-[26px] text-encre xl:text-[30px]">Un atelier sur mesure ?</p>
            <p className="mt-2 max-w-[560px] text-encre/70">
              Écoles, musées, festivals, collectivités : nous adaptons nos ateliers à votre public
              et à votre projet.
            </p>
          </div>
          <Button to="/contact" arrow className="shrink-0">
            Demander un devis
          </Button>
        </Reveal>
      </div>

      <div className="pointer-events-none absolute bottom-[0px] left-[31px] hidden w-[134px] xl:block">
        <Collage
          width={133.892}
          height={191.908}
          items={[
            { x: 0, y: 0, w: 133.892, h: 191.908, iw: 90, ih: 174, rotate: 164.23, flipY: true, src: planteGravure, cover: true },
          ]}
        />
      </div>
    </div>
  )
}
