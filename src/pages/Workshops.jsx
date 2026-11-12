import { useRef } from 'react'
import PageHeader from '../components/PageHeader'
import Hotspots from '../components/Hotspots'
import DyeBath from '../components/DyeBath'
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '../motion/gsap'
import { Button, Reveal } from '../components/ui'
import { ateliers } from '../data/ateliers'
import hero from '../assets/events/patrimoine.webp'
import pastille from '../assets/v3/ateliers/pastille.svg'
import iconeParticipatifs from '../assets/v3/ateliers/icone-participatifs.svg'
import iconeDemonstrations from '../assets/v3/ateliers/icone-demonstrations.svg'
import iconePresentations from '../assets/v3/ateliers/icone-presentations.svg'

const formats = [
  { label: 'Ateliers participatifs', icon: iconeParticipatifs },
  { label: 'Démonstrations', icon: iconeDemonstrations },
  { label: 'Présentations', icon: iconePresentations },
]

/**
 * Les ateliers s'empilent comme des feuillets : chaque section reste épinglée
 * pendant que la suivante glisse par-dessus, puis s'efface doucement.
 * Si une section est plus haute que l'écran (« overscroll »), elle n'est
 * épinglée qu'une fois son bas atteint, pour qu'on puisse tout lire.
 */
function useStackedSlides(ref) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const slides = gsap.utils.toArray(ref.current.querySelectorAll('[data-slide]'))
        slides.forEach((slide, i) => {
          if (i === slides.length - 1) return
          const inner = slide.querySelector('[data-slide-inner]')
          ScrollTrigger.create({
            trigger: slide,
            start: () => (slide.offsetHeight <= window.innerHeight ? 'top top' : 'bottom bottom'),
            endTrigger: slides[i + 1],
            end: 'top top',
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
          })
          gsap.to(inner, {
            scale: 0.92,
            autoAlpha: 0.35,
            ease: 'none',
            scrollTrigger: { trigger: slides[i + 1], start: 'top bottom', end: 'top top', scrub: true },
          })
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
}

/** Page Nos ateliers V3 (Figma 352:195) */
export default function WorkshopsPage() {
  const slidesRef = useRef(null)
  useStackedSlides(slidesRef)
  return (
    <>
      <PageHeader
        title="Nos ateliers"
        subtitle={
          <>
            Apprendre, expérimenter,
            <br />
            transmettre
          </>
        }
        text="Des ateliers participatifs, adaptés à tous, pour découvrir les gestes anciens et explorer les matières."
        image={hero}
        imageAlt="Des mains tissent avec des fils sur un petit métier en carton"
      />

      {/* Formats */}
      <section className="bg-creme pt-2 pb-14 xl:pt-4 xl:pb-[70px]">
        <Reveal className="container-site text-center">
          <h2 className="font-serif text-[40px] leading-[1.08] tracking-[-0.005em] text-brun md:text-[48px]">
            Filage, tissage, <em className="font-light">teinture…</em>
          </h2>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-6 sm:gap-x-[154px] xl:mt-10">
            {formats.map((f) => (
              <li key={f.label} className="flex w-[100px] flex-col items-center sm:w-[176px]">
                <span className="relative flex size-[72px] items-center justify-center sm:size-24">
                  <img src={pastille} alt="" className="absolute inset-0 size-full" />
                  <img src={f.icon} alt="" width="30" height="30" className="relative" />
                </span>
                <span className="mt-[22px] text-petit text-brun">{f.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Les quatre ateliers, en alternance */}
      <div ref={slidesRef}>
      {ateliers.map((a, i) => {
        const reversed = i % 2 === 1
        return (
          <section
            key={a.id}
            id={a.id}
            data-slide
            className={`relative scroll-mt-24 overflow-hidden py-12 lg:flex lg:min-h-svh lg:items-center xl:py-[50px] ${reversed ? 'bg-peche' : 'bg-creme'} ${
              i > 0 ? 'lg:rounded-t-[56px] lg:shadow-[0_-24px_50px_rgba(61,42,35,0.10)]' : ''
            }`}
          >
            <div
              data-slide-inner
              className={`container-site flex w-full origin-top flex-col gap-10 lg:items-start lg:gap-10 ${
                reversed ? 'lg:flex-row-reverse lg:justify-between' : 'lg:flex-row'
              }`}
            >
              <Reveal data-no-motion className="relative lg:w-[440px] lg:shrink-0">
                <div className={`overflow-hidden ${reversed ? 'rounded-t-[250px] rounded-b-[24px]' : 'rounded-l-[24px] rounded-r-[250px]'}`}>
                  <img src={a.image} alt="" loading="lazy" className="aspect-[540/400] w-full object-cover" />
                </div>
                <Hotspots points={a.points} />
              </Reveal>

              <Reveal delay={120} className={`relative lg:pt-[30px] ${reversed ? 'lg:pl-10' : ''}`}>
                <p className="font-serif text-[56px] leading-[0.9] font-light tracking-[-0.02em] text-terre-cuite/90 xl:text-[72px]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2 className="mt-4 max-w-[520px] font-serif text-[34px] leading-[1.08] tracking-[-0.005em] text-brun md:text-[44px] xl:mt-6">
                  {a.titre}
                </h2>
                <p className="mt-5 max-w-[460px] text-courant text-brun-doux xl:mt-6">{a.description}</p>
              </Reveal>
            </div>
            <img
              src={a.objet}
              alt=""
              aria-hidden="true"
              className={`pointer-events-none absolute top-[300px] hidden h-[140px] w-[70px] object-contain opacity-85 xl:block ${
                reversed ? 'left-[520px]' : 'left-[1240px]'
              }`}
            />
          </section>
        )
      })}
      </div>

      <section className="bg-creme pt-20 pb-6 xl:pt-28">
        <div className="container-site">
          <DyeBath />
        </div>
      </section>

      <section className="bg-creme py-14 xl:py-16">
        <Reveal className="container-site flex flex-col items-center gap-6 text-center">
          <p className="text-chapo text-brun-doux">Un atelier pour votre école, votre musée ou votre festival ?</p>
          <Button to="/contact?objet=prestation" variant="plein">
            Demander une prestation
          </Button>
        </Reveal>
      </section>
    </>
  )
}
