import { useRef } from 'react'
import { MOTION_OK, SplitText, gsap, useGSAP } from '../../motion/gsap'
import { photos } from '../../data/photos'

/**
 * Section plein écran pour le rythme : la photo part d'une petite arche au
 * centre et s'ouvre jusqu'à remplir l'écran pendant qu'on défile (section
 * épinglée), puis la citation s'écrit mot à mot.
 */
export default function QuoteFullscreen() {
  const ref = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const words = SplitText.create('[data-quote]', { type: 'words', mask: 'words' })
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=120%', pin: true, scrub: 0.8 } })
          .fromTo('[data-quote-frame]', { clipPath: 'inset(24% 36% 24% 36% round 400px 400px 24px 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'power2.inOut', duration: 1 })
          .fromTo('[data-quote-img]', { scale: 1.4 }, { scale: 1, ease: 'none', duration: 1.6 }, 0)
          .from(words.words, { yPercent: 110, duration: 0.5, stagger: 0.05, ease: 'power3.out' }, 0.7)
          .from('[data-quote-sign]', { autoAlpha: 0, y: 20, duration: 0.3 }, 1.2)
        return () => words.revert()
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} data-no-motion className="relative h-[100svh] min-h-[560px] overflow-hidden bg-creme">
      <div data-quote-frame className="absolute inset-0 overflow-hidden bg-brun">
        <img data-quote-img src={photos.bandesChevrons.src} alt="" loading="lazy" className="size-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-brun/55" />
      </div>
      <div className="container-site relative flex h-full flex-col items-center justify-center text-center">
        <blockquote>
          <p data-quote className="max-w-[980px] font-serif text-[38px] leading-[1.12] font-light text-lin italic md:text-[64px] xl:text-[76px]">
            « Le textile est un lien entre les époques, les peuples et les savoirs. »
          </p>
        </blockquote>
        <p data-quote-sign className="mt-8 text-label text-poudre">Néotisse</p>
      </div>
    </section>
  )
}
