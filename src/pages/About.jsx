import { useRef } from 'react'
import PageHeader from '../components/PageHeader'
import PeriodTimeline from '../components/PeriodTimeline'
import ThreadDivider from '../components/ThreadDivider'
import { MOTION_OK, gsap, useGSAP } from '../motion/gsap'
import { CenteredHeading } from '../components/ui'
import festival from '../assets/news/festival.webp'
import filage from '../assets/events/filage.webp'
import marie from '../assets/v3/equipe/marie.webp'
import tissage from '../assets/ateliers/hero.webp'
import teinture from '../assets/events/teinture.webp'
import anneau from '../assets/v3/association/anneau.svg'

const fils = [
  {
    titre: 'Le déclic',
    texte:
      'Les textiles anciens ont beaucoup à nous raconter : c’est de cette conviction qu’est née Néotisse, en mai 2024.',
    image: filage,
  },
  {
    titre: 'Faire vivre les savoir-faire',
    texte:
      'Émilie Roma, doctorante en archéologie, et Marie-Salomé, égyptologue, font revivre les savoir-faire textiles du Néolithique au Moyen Âge.',
    image: marie,
  },
  {
    titre: 'Remonter le fil des techniques',
    texte:
      'Par l’archéologie expérimentale, nous reconstituons les gestes oubliés : filage, tissage, teinture végétale, broderie.',
    image: tissage,
  },
  {
    titre: 'Tisser de nouveaux liens',
    texte:
      'Par la médiation scientifique, nous partageons ces découvertes avec écoles, musées, festivals et curieux de tout âge.',
    image: teinture,
  },
]

/**
 * « Notre histoire en quatre fils » : en arrivant, les quatre cercles sont
 * empilés en un seul. En défilant (section épinglée), ils se déroulent un à
 * un pour s'aligner, reliés par un fil, puis la frise glisse doucement.
 */
function useFourThreads(sectionRef) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const section = sectionRef.current
        const list = section.querySelector('ol')
        const circles = gsap.utils.toArray(section.querySelectorAll('[data-circle]'))
        const texts = section.querySelectorAll('[data-fil-text]')
        const thread = section.querySelector('[data-fil-thread]')
        const lr = list.getBoundingClientRect()
        const cx = lr.left + lr.width / 2
        const cy = lr.top + 125

        const tl = gsap.timeline({
          defaults: { ease: 'power3.inOut' },
          scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.8 },
        })
        tl.from(circles, {
          x: (i, el) => {
            const r = el.getBoundingClientRect()
            return cx - (r.left + r.width / 2)
          },
          y: (i, el) => {
            const r = el.getBoundingClientRect()
            return cy - (r.top + r.height / 2)
          },
          rotation: (i) => (i - 1.5) * 14,
          scale: (i) => 1 - i * 0.04,
          duration: 1,
          stagger: 0.12,
        })
          .from(thread, { drawSVG: 0, duration: 0.8, ease: 'none' }, 0.5)
          .from(texts, { autoAlpha: 0, y: 30, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, 0.75)
          .to(list, { x: -40, duration: 0.6, ease: 'none' }, 1.3)
      })
      return () => mm.revert()
    },
    { scope: sectionRef },
  )
}

/** Page L'association V3 (Figma 351:118) */
export default function About() {
  const filsRef = useRef(null)
  useFourThreads(filsRef)
  return (
    <>
      <PageHeader
        photoId="association"
        title="L’association"
        subtitle={
          <>
            Un fil ancien,
            <br />
            une histoire bien actuelle
          </>
        }
        text="Fondée en mai 2024 à Montpellier, Néotisse est une association loi 1901 née d’une conviction : les textiles anciens ont beaucoup à nous raconter."
        image={festival}
        imageAlt="Participantes et participants autour d’une table pendant un atelier textile"
      />

      <section ref={filsRef} className="overflow-hidden bg-creme pt-4 pb-16 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:pt-[90px] lg:pb-10">
        <div className="container-site">
          <CenteredHeading
            title={
              <>
                Notre histoire <em>en quatre fils</em>
              </>
            }
          />
          <ol className="relative mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-10 lg:grid-cols-4 xl:mt-[50px] xl:gap-x-[40px]">
            {/* Fil qui relie les cercles */}
            <svg aria-hidden="true" viewBox="0 0 100 10" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-[12%] top-[105px] hidden h-12 w-[76%] overflow-visible lg:block">
              <path data-fil-thread d="M0 2 C 16 9, 33 9, 50 5 S 84 1, 100 7" fill="none" stroke="#B4583D" strokeOpacity="0.45" vectorEffect="non-scaling-stroke" />
            </svg>
            {fils.map((f, i) => (
              <li key={f.titre} className={`relative flex flex-col items-center text-center ${i % 2 === 1 ? 'lg:mt-8' : ''}`} style={{ zIndex: 4 - i }}>
                <div data-circle className="relative size-[150px] sm:size-[210px]">
                  <img src={f.image} alt="" loading="lazy" className="absolute top-2 left-2 size-[134px] rounded-full object-cover sm:size-[194px]" />
                  <img src={anneau} alt="" aria-hidden="true" className="absolute inset-0 size-full" />
                </div>
                <div data-fil-text data-no-motion>
                  <p className="mt-5 text-label text-brique">{String(i + 1).padStart(2, '0')}</p>
                  <h2 className="mx-auto mt-1 max-w-[250px] font-serif text-[21px] leading-[1.18] text-brun sm:text-[26px]">{f.titre}</h2>
                  <p className="mx-auto mt-3 max-w-[230px] text-petit text-brun-doux">{f.texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <ThreadDivider className="bg-creme" />

      <section aria-labelledby="periodes-titre" className="bg-creme pt-6 pb-24 xl:pb-[110px]">
        <div className="container-site">
          <CenteredHeading
            title={
              <span id="periodes-titre">
                Trois périodes, <em>un même fil</em>
              </span>
            }
            subtitle="Du Néolithique au Moyen Âge : choisissez une période pour remonter le fil."
          />
          <div className="mt-12 xl:mt-16">
            <PeriodTimeline />
          </div>
        </div>
      </section>
    </>
  )
}
