import { useRef } from 'react'
import PageHeader from '../components/PageHeader'
import { MOTION_OK, gsap, useGSAP } from '../motion/gsap'
import { Eyebrow, Reveal } from '../components/ui'
import { usePublic } from '../lib/usePublic'
import heroImage from '../assets/ateliers/tissage.webp'
import vague from '../assets/v3/home/vague-avis.svg'

/** Page Actualités V3 (Figma 352:280) */
export default function NewsPage() {
  const news = usePublic('actualites')
  const listRef = useRef(null)

  /*
   * « Les derniers fils » : chaque carte arrive en plusieurs temps (keyframes),
   * chacun avec sa propre courbe (easeEach) : elle monte, dépasse un peu en
   * tournant comme une étiquette qu'on accroche, puis se pose.
   */
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray(listRef.current.querySelectorAll('[data-news]'))
        cards.forEach((card, i) => {
          gsap.to(card, {
            keyframes: {
              '0%': { y: 120, rotation: i % 2 ? 6 : -6, autoAlpha: 0 },
              '45%': { y: -18, rotation: i % 2 ? -2.5 : 2.5, autoAlpha: 1, ease: 'power3.out' },
              '75%': { y: 6, rotation: i % 2 ? 1 : -1, ease: 'sine.inOut' },
              '100%': { y: 0, rotation: 0, ease: 'sine.out' },
              easeEach: 'none',
            },
            duration: 1.5,
            delay: i * 0.15,
            immediateRender: true,
            scrollTrigger: { trigger: listRef.current, start: 'top 80%', once: true },
          })
          // Au survol, la carte « respire » en trois temps.
          const hover = gsap.to(card, {
            keyframes: { y: [0, -10, -6], easeEach: 'sine.inOut' },
            duration: 0.5,
            paused: true,
          })
          card.addEventListener('mouseenter', () => hover.play())
          card.addEventListener('mouseleave', () => hover.reverse())
        })
      })
      return () => mm.revert()
    },
    { scope: listRef, dependencies: [news], revertOnUpdate: true },
  )

  const [featured, ...others] = news

  return (
    <>
      <PageHeader
        title="Actualités"
        subtitle={
          <>
            Les fils de
            <br />
            nos découvertes
          </>
        }
        text="Événements, ateliers, rencontres et nouvelles collaborations : suivez la vie de Néotisse."
        image={heroImage}
        imageAlt="Bandes tissées à chevrons sur des cadres en bois"
      />

      {/* À la une */}
      <article id={featured.id} className="scroll-mt-24 bg-creme pb-16 xl:pt-4 xl:pb-[90px]">
        <div className="container-site flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-[60px]">
          <Reveal className="overflow-hidden rounded-l-[220px] rounded-r-[24px] lg:w-[540px] lg:shrink-0">
            <img src={featured.image} alt={featured.alt} loading="lazy" className="aspect-[640/460] w-full object-cover" />
          </Reveal>
          <Reveal delay={120} className="lg:pt-[20px]">
            <Eyebrow>À la une · {featured.rubrique}</Eyebrow>
            <h2 className="mt-5 max-w-[500px] font-serif text-[34px] leading-[1.08] tracking-[-0.005em] text-brun md:text-[44px] xl:-ml-0.5">
              {featured.titre}
            </h2>
            <div className="mt-3 max-w-[460px] space-y-[1.65em] text-courant text-brun-doux">
              {featured.paragraphes.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </article>

      {/* Autres actualités */}
      <section aria-labelledby="derniers-fils" className="relative bg-peche pt-24 pb-16 xl:pt-[120px] xl:pb-[70px]">
        <img src={vague} alt="" aria-hidden="true" className="absolute inset-x-0 top-[-1px] h-[50px] w-full md:h-[101px]" />
        <div className="container-site relative">
          <Reveal as="h2" id="derniers-fils" className="font-serif text-[40px] leading-[1.08] tracking-[-0.005em] text-brun md:text-[48px]">
            Les derniers fils
          </Reveal>
          <ul ref={listRef} className="mt-8 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:gap-[30px] md:overflow-visible md:px-0 md:grid-cols-2 lg:grid-cols-3 xl:mt-[38px]">
            {others.map((a) => (
              <li key={a.id} id={a.id} data-news className="w-[85%] shrink-0 scroll-mt-24 snap-center md:w-auto">
                <article className="h-full overflow-hidden rounded-[24px] bg-lin">
                  <img src={a.image} alt={a.alt} loading="lazy" className="aspect-[380/200] w-full object-cover" />
                  <div className="px-7 pt-6 pb-8">
                    <p className="text-label text-brique">{a.rubrique}</p>
                    <h3 className="mt-2.5 font-serif text-[28px] leading-[1.18] text-brun">{a.titre}</h3>
                    <div className="mt-2 space-y-[1.55em] text-petit text-brun-doux">
                      {a.paragraphes.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
