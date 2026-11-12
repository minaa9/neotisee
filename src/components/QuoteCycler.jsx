import { useEffect, useRef, useState } from 'react'
import { MOTION_OK, SplitText, gsap } from '../motion/gsap'

/**
 * Grande citation qui change toute seule : les mots de l'ancienne citation
 * s'envolent, ceux de la nouvelle se posent un à un. Un fil sous la citation
 * se remplit pendant le temps de lecture. Pause au survol.
 */
export default function QuoteCycler({ items, every = 7 }) {
  const [i, setI] = useState(0)
  const textRef = useRef(null)
  const barRef = useRef(null)
  const t = items[i]

  // Mots qui se posent + fil de lecture
  useEffect(() => {
    const reduce = !window.matchMedia(MOTION_OK).matches
    const split = SplitText.create(textRef.current, { type: 'words', mask: 'words' })
    if (!reduce) gsap.from(split.words, { yPercent: 110, duration: 0.9, stagger: 0.025, ease: 'expo.out' })
    const bar = reduce
      ? null
      : gsap.fromTo(barRef.current, { scaleX: 0 }, {
          scaleX: 1,
          duration: every,
          ease: 'none',
          onComplete: () => {
            gsap.to(split.words, {
              yPercent: -110,
              duration: 0.45,
              stagger: 0.01,
              ease: 'power2.in',
              onComplete: () => setI((n) => (n + 1) % items.length),
            })
          },
        })
    const host = textRef.current.closest('[data-cycler]')
    const pause = () => bar && bar.pause()
    const play = () => bar && bar.play()
    host.addEventListener('mouseenter', pause)
    host.addEventListener('mouseleave', play)
    return () => {
      host.removeEventListener('mouseenter', pause)
      host.removeEventListener('mouseleave', play)
      bar && bar.kill()
      split.revert()
    }
  }, [i, every, items.length])

  return (
    <figure data-cycler data-no-motion className="mx-auto max-w-[980px] text-center">
      <span aria-hidden="true" className="block font-serif text-[120px] leading-[0.6] font-light text-terre-cuite">“</span>
      <blockquote aria-live="polite">
        <p ref={textRef} key={i} className="mt-4 font-serif text-[30px] leading-[1.2] font-light text-brun italic md:text-[44px]">
          {t.texte}
        </p>
      </blockquote>
      <figcaption className="mt-6 text-label text-brique">
        {t.atelier} · {t.date}
      </figcaption>
      <div className="mx-auto mt-6 flex max-w-[260px] items-center gap-3">
        {items.map((_, n) => (
          <button
            key={n}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Citation ${n + 1}`}
            aria-current={n === i}
            className="relative h-6 flex-1"
          >
            <span className="absolute inset-x-0 top-1/2 h-px bg-brun/15" />
            {n === i && <span ref={barRef} className="absolute inset-x-0 top-1/2 h-px origin-left bg-terre-cuite" />}
            {n < i && <span className="absolute inset-x-0 top-1/2 h-px bg-terre-cuite/50" />}
          </button>
        ))}
      </div>
    </figure>
  )
}
