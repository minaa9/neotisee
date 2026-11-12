import { useEffect, useRef, useState } from 'react'
import { MOTION_OK, gsap, useGSAP } from '../motion/gsap'
import flecheClair from '../assets/v3/ui/fleche-clair.svg'

// Composition asymétrique (12 colonnes sur ordinateur).
const LAYOUT = [
  'lg:col-span-5 lg:row-span-2 aspect-[4/5] rounded-t-[220px] rounded-b-[24px]',
  'lg:col-span-4 aspect-[4/3] rounded-[24px] lg:mt-16',
  'lg:col-span-3 aspect-[3/4] rounded-[24px] rounded-tr-[120px]',
  'lg:col-span-3 aspect-square rounded-full',
  'lg:col-span-4 aspect-[4/3] rounded-[24px] rounded-bl-[140px] lg:-mt-10',
  'lg:col-span-4 aspect-[16/10] rounded-[24px]',
  'lg:col-span-5 aspect-[16/10] rounded-l-[200px] rounded-r-[24px] lg:-mt-14',
  'lg:col-span-3 aspect-[3/4] rounded-t-[160px] rounded-b-[24px]',
]

/**
 * Galerie photographique : composition asymétrique, zoom et léger
 * déplacement de l'image sous la souris, ouverture en grand au clic (l'image
 * s'envole depuis sa vignette), navigation au clavier et au glisser.
 */
export default function Gallery({ items }) {
  const rootRef = useRef(null)
  const boxRef = useRef(null)
  const [open, setOpen] = useState(null)
  const fromRect = useRef(null)
  const touch = useRef(null)

  // Zoom + déplacement au survol.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`${MOTION_OK} and (hover: hover)`, () => {
        const cleanups = []
        rootRef.current.querySelectorAll('[data-g-item]').forEach((item) => {
          const img = item.querySelector('img')
          const x = gsap.quickTo(img, 'xPercent', { duration: 0.8, ease: 'power3.out' })
          const y = gsap.quickTo(img, 'yPercent', { duration: 0.8, ease: 'power3.out' })
          const enter = () => gsap.to(img, { scale: 1.12, duration: 0.8, ease: 'power3.out' })
          const move = (e) => {
            const r = item.getBoundingClientRect()
            x(-((e.clientX - r.left) / r.width - 0.5) * 6)
            y(-((e.clientY - r.top) / r.height - 0.5) * 6)
          }
          const leave = () => {
            gsap.to(img, { scale: 1, duration: 0.8, ease: 'power3.out' })
            x(0)
            y(0)
          }
          item.addEventListener('mouseenter', enter)
          item.addEventListener('mousemove', move)
          item.addEventListener('mouseleave', leave)
          cleanups.push(() => {
            item.removeEventListener('mouseenter', enter)
            item.removeEventListener('mousemove', move)
            item.removeEventListener('mouseleave', leave)
          })
        })
        return () => cleanups.forEach((f) => f())
      })
      return () => mm.revert()
    },
    { scope: rootRef },
  )

  // Image suivante / précédente : glissement + fondu.
  const step = (dir) => {
    const big = boxRef.current?.querySelector('[data-big] img')
    const next = (i) => (i + dir + items.length) % items.length
    if (!big || !window.matchMedia(MOTION_OK).matches) return setOpen((i) => (i === null ? i : next(i)))
    gsap.to(big, {
      xPercent: -8 * dir,
      autoAlpha: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setOpen((i) => next(i))
        gsap.fromTo(big, { xPercent: 8 * dir, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' })
      },
    })
  }

  // Ouverture : l'image grandit depuis la vignette cliquée.
  useEffect(() => {
    if (open === null) return
    document.body.style.overflow = 'hidden'
    const box = boxRef.current
    const reduce = !window.matchMedia(MOTION_OK).matches
    box.querySelector('[data-close]')?.focus()
    if (fromRect.current && !reduce) {
      const to = box.querySelector('[data-big]').getBoundingClientRect()
      const f = fromRect.current
      fromRect.current = null
      gsap.fromTo(
        box.querySelector('[data-big]'),
        { x: f.left - to.left, y: f.top - to.top, scaleX: f.width / to.width, scaleY: f.height / to.height, transformOrigin: '0 0', borderRadius: 24 },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 18, duration: 0.8, ease: 'expo.out' },
      )
      gsap.fromTo(box, { backgroundColor: 'rgba(61,42,35,0)' }, { backgroundColor: 'rgba(61,42,35,0.94)', duration: 0.5 })
      gsap.from(box.querySelectorAll('[data-ui]'), { autoAlpha: 0, y: 12, duration: 0.5, delay: 0.3, stagger: 0.05 })
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open === null])

  const show = (i, e) => {
    fromRect.current = e.currentTarget.getBoundingClientRect()
    setOpen(i)
  }

  const current = open !== null ? items[open] : null

  return (
    <>
      <ul ref={rootRef} className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
        {items.map((it, i) => (
          <li key={it.src} className={`${i === 0 ? 'col-span-2' : ''} ${LAYOUT[i % LAYOUT.length].split(' ').filter((c) => c.startsWith('lg:col') || c.startsWith('lg:row') || c.startsWith('lg:mt') || c.startsWith('lg:-mt')).join(' ')}`}>
            <button
              type="button"
              data-g-item
              data-no-motion
              data-cursor="Agrandir"
              onClick={(e) => show(i, e)}
              aria-label={`Agrandir : ${it.alt}`}
              className={`group relative block w-full overflow-hidden ${LAYOUT[i % LAYOUT.length].split(' ').filter((c) => !c.startsWith('lg:')).join(' ')}`}
            >
              <img src={it.src} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
              <span className="absolute inset-x-3 bottom-3 translate-y-3 rounded-full bg-lin/90 px-3 py-1.5 text-left text-[12px] text-brun opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {it.alt}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div
          ref={boxRef}
          role="dialog"
          aria-modal="true"
          aria-label="Photo en grand"
          onClick={(e) => e.target === e.currentTarget && setOpen(null)}
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - (touch.current ?? 0)
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
          }}
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-brun/94 p-4 sm:p-10"
        >
          <figure data-big className="relative max-h-[78svh] max-w-[1100px] overflow-hidden rounded-[18px]">
            <img src={current.src} alt={current.alt} className="max-h-[78svh] w-auto object-contain" />
          </figure>
          <p data-ui className="mt-4 max-w-[720px] text-center text-petit text-lin/80">
            {current.alt} · {open + 1} / {items.length}
          </p>
          <div data-ui className="mt-5 flex items-center gap-4">
            <button type="button" onClick={() => step(-1)} aria-label="Photo précédente" className="flex size-12 items-center justify-center rounded-full border border-lin/40 hover:bg-lin/10">
              <img src={flecheClair} alt="" width="16" height="16" className="rotate-180" />
            </button>
            <button type="button" data-close onClick={() => setOpen(null)} className="rounded-full border border-lin/40 px-5 py-3 text-petit text-lin hover:bg-lin/10">
              Fermer
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Photo suivante" className="flex size-12 items-center justify-center rounded-full border border-lin/40 hover:bg-lin/10">
              <img src={flecheClair} alt="" width="16" height="16" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
