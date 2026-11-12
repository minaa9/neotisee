import { useRef, useState } from 'react'
import TestimonialCard from './TestimonialCard'
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '../motion/gsap'
import { horizontalLoop } from '../motion/horizontalLoop'
import pointActif from '../assets/v3/ui/point-actif.svg'
import point from '../assets/v3/ui/point.svg'
import flecheContour from '../assets/v3/ui/fleche-contour.svg'

/**
 * Carrousel infini de témoignages :
 *  - défile tout seul, doucement ;
 *  - accélère avec la vitesse du défilement de la page (ScrollTrigger) ;
 *  - se fait glisser à la souris ou au doigt, avec élan, et s'aimante sur une carte ;
 *  - flèches et points pour naviguer au clavier.
 */
export default function InfiniteCards({ items }) {
  const wrapRef = useRef(null)
  const loopRef = useRef(null)
  const [active, setActive] = useState(0)
  // Assez de cartes pour que la boucle ne laisse jamais de vide.
  const cards = items.length < 6 ? [...items, ...items, ...items].slice(0, Math.max(6, items.length)) : items

  useGSAP(
    () => {
      const wrap = wrapRef.current
      const els = wrap.querySelectorAll('[data-card]')
      const reduce = !window.matchMedia(MOTION_OK).matches
      const loop = horizontalLoop(els, {
        paused: reduce,
        draggable: true,
        center: true,
        speed: 0.35,
        repeat: -1,
        paddingRight: 30,
        onChange: (_, i) => setActive(i % items.length),
      })
      loopRef.current = loop

      // Le défilement de la page donne de l'élan au carrousel.
      let slow
      const st = reduce
        ? null
        : ScrollTrigger.create({
            trigger: wrap,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
              if (loop.draggable?.isPressed) return
              slow && slow.kill()
              const boost = gsap.utils.clamp(-6, 6, self.getVelocity() / 250)
              loop.timeScale(1 + Math.abs(boost))
              slow = gsap.to(loop, { timeScale: 1, duration: 1.2, ease: 'power2.out' })
            },
          })

      const pause = () => !reduce && loop.pause()
      const play = () => !reduce && !loop.draggable?.isPressed && loop.play()
      wrap.addEventListener('mouseenter', pause)
      wrap.addEventListener('mouseleave', play)
      return () => {
        wrap.removeEventListener('mouseenter', pause)
        wrap.removeEventListener('mouseleave', play)
        st && st.kill()
        loop.cleanup()
        loop.kill()
      }
    },
    { scope: wrapRef, dependencies: [items], revertOnUpdate: true },
  )

  const go = (fn) => loopRef.current && fn(loopRef.current)

  return (
    <div>
      <div ref={wrapRef} className="relative -mx-5 cursor-grab overflow-hidden py-4 active:cursor-grabbing md:-mx-12 xl:-mx-[120px]">
        <ul className="flex gap-[30px] pl-5" aria-label="Témoignages">
          {cards.map((t, i) => (
            <li
              key={i}
              data-card
              aria-hidden={i >= items.length}
              className="w-[82vw] shrink-0 sm:w-[380px]"
            >
              <TestimonialCard temoignage={t} className="h-full min-h-[330px] select-none" />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <button type="button" onClick={() => go((l) => l.previous({ duration: 0.8, ease: 'power3.inOut' }))} aria-label="Témoignage précédent" className="flex size-10 items-center justify-center rounded-full border border-brun/40 transition-colors hover:bg-brun/5">
          <img src={flecheContour} alt="" width="16" height="16" className="rotate-180" />
        </button>
        <div className="flex gap-[11px]">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go((l) => l.toIndex(i, { duration: 0.8, ease: 'power3.inOut' }))}
              aria-label={`Témoignage ${i + 1}`}
              aria-current={active === i}
              className="p-0.5"
            >
              <img src={active === i ? pointActif : point} alt="" width="7" height="7" />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go((l) => l.next({ duration: 0.8, ease: 'power3.inOut' }))} aria-label="Témoignage suivant" className="flex size-10 items-center justify-center rounded-full border border-brun/40 transition-colors hover:bg-brun/5">
          <img src={flecheContour} alt="" width="16" height="16" />
        </button>
      </div>
    </div>
  )
}
