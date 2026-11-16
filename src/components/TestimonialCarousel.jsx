import { useEffect, useRef, useState } from 'react'
import TestimonialCard from './TestimonialCard'
import { MOTION_OK } from '../motion/gsap'
import flecheContour from '../assets/v3/ui/fleche-contour.svg'

const AUTO = 6500 // temps de lecture d'un témoignage (ms)

/**
 * Témoignages « en éventail », avec les cartes d'origine du site :
 * la carte du milieu est mise en avant (pleine taille, au premier plan),
 * ses voisines reculent, plus petites et estompées. Les cartes glissent en
 * douceur d'une place à l'autre. Flèches, points, clic sur une carte,
 * glisser au doigt ou à la souris, flèches du clavier ; défilement
 * automatique, en pause au survol.
 */
export default function TestimonialCarousel({ items }) {
  const n = items.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [large, setLarge] = useState(true)
  const drag = useRef(null)
  const current = n ? active % n : 0
  const go = (i) => setActive(((i % n) + n) % n)

  // Lecture automatique
  useEffect(() => {
    if (paused || n < 2 || !window.matchMedia(MOTION_OK).matches) return
    const t = setTimeout(() => setActive((a) => (a + 1) % n), AUTO)
    return () => clearTimeout(t)
  }, [active, paused, n])

  // Écart entre les cartes selon la largeur de l'écran
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const on = () => setLarge(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  if (!n) return null
  const gap = large ? 360 : 200 // centre → voisine
  const gap2 = large ? 270 : 150 // voisine → carte suivante
  const reach = n >= 5 ? 2 : 1

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div
        role="region"
        aria-roledescription="carrousel"
        aria-label="Témoignages"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(current + 1)
          if (e.key === 'ArrowLeft') go(current - 1)
        }}
        onPointerDown={(e) => (drag.current = e.clientX)}
        onPointerUp={(e) => {
          if (drag.current == null) return
          const dx = e.clientX - drag.current
          drag.current = null
          if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1))
        }}
        className="relative -mx-5 h-[500px] touch-pan-y overflow-hidden outline-none select-none focus-visible:ring-2 focus-visible:ring-terre-cuite/40 md:-mx-12 md:h-[520px] xl:-mx-[120px]"
      >
        {items.map((t, i) => {
          let d = i - current
          if (d > n / 2) d -= n
          if (d < -n / 2) d += n
          const centre = d === 0
          const a = Math.abs(d)
          const visible = a <= reach
          const x = a === 0 ? 0 : Math.sign(d) * (gap + (a - 1) * gap2)
          return (
            <div
              key={i}
              aria-hidden={!centre}
              onClick={() => !centre && go(i)}
              className={`absolute top-1/2 left-1/2 w-[78vw] max-w-[380px] transition-[transform,opacity,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${centre ? '' : 'cursor-pointer'}`}
              style={{
                transform: `translate(-50%, -50%) translateX(${x}px) scale(${centre ? 1 : a === 1 ? 0.84 : 0.7})`,
                zIndex: 10 - a,
                opacity: visible ? (centre ? 1 : a === 1 ? 0.55 : 0.3) : 0,
                filter: centre ? 'none' : 'saturate(0.6)',
                pointerEvents: visible ? 'auto' : 'none',
              }}
            >
              <TestimonialCard
                temoignage={t}
                className={`min-h-[360px] transition-shadow duration-700 ${centre ? 'shadow-[0_30px_60px_-30px_rgba(61,42,35,0.45)]' : ''}`}
              />
            </div>
          )
        })}
        <p className="sr-only" aria-live="polite">
          Témoignage {current + 1} sur {n} : {items[current].texte} — {items[current].atelier}
        </p>
      </div>

      {/* Flèches et points (le point actif devient un anneau) */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <button type="button" onClick={() => go(current - 1)} aria-label="Témoignage précédent" className="flex size-10 items-center justify-center rounded-full border border-brun/40 transition-colors hover:bg-brun/5">
          <img src={flecheContour} alt="" width="16" height="16" className="rotate-180" />
        </button>
        <div className="flex items-center gap-3">
          {items.map((_, i) => (
            <button key={i} type="button" onClick={() => go(i)} aria-label={`Témoignage ${i + 1}`} aria-current={i === current} className="flex size-5 items-center justify-center">
              <span className={`block rounded-full transition-all duration-500 ${i === current ? 'size-[16px] border-2 border-terre-cuite' : 'size-[7px] bg-brun/30 hover:bg-brun/55'}`} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(current + 1)} aria-label="Témoignage suivant" className="flex size-10 items-center justify-center rounded-full border border-brun/40 transition-colors hover:bg-brun/5">
          <img src={flecheContour} alt="" width="16" height="16" />
        </button>
      </div>
    </div>
  )
}
