import { useRef, useState } from 'react'
import { MOTION_OK, gsap, useGSAP } from './gsap'

/**
 * Curseur personnalisé (ordinateur uniquement) : une petite pelote terre cuite
 * suivie d'un anneau de fil. Sur un élément portant data-cursor="Explorer",
 * l'anneau s'agrandit et affiche le mot. Sur les liens et boutons, il grossit.
 * Désactivé sur écran tactile et si l'on réduit les animations.
 */
export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [label, setLabel] = useState('')
  const [active, setActive] = useState(false)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
      setActive(true)
      document.documentElement.classList.add('has-cursor')
      const dx = gsap.quickTo(dotRef.current, 'x', { duration: 0.12, ease: 'power3.out' })
      const dy = gsap.quickTo(dotRef.current, 'y', { duration: 0.12, ease: 'power3.out' })
      const rx = gsap.quickTo(ringRef.current, 'x', { duration: 0.55, ease: 'power3.out' })
      const ry = gsap.quickTo(ringRef.current, 'y', { duration: 0.55, ease: 'power3.out' })

      let current = null
      const onMove = (e) => {
        dx(e.clientX)
        dy(e.clientY)
        rx(e.clientX)
        ry(e.clientY)
        const target = e.target.closest?.('[data-cursor], a, button, [role="button"], input, textarea, select, label')
        if (target === current) return
        current = target
        const text = target?.dataset?.cursor || ''
        const isField = target && /INPUT|TEXTAREA|SELECT/.test(target.tagName)
        setLabel(text)
        gsap.to(ringRef.current, {
          scale: text ? 2.6 : target && !isField ? 1.6 : 1,
          opacity: isField ? 0 : 1,
          backgroundColor: text ? 'rgba(180,88,61,0.92)' : 'rgba(180,88,61,0)',
          duration: 0.4,
          ease: 'power3.out',
        })
        gsap.to(dotRef.current, { scale: text || isField ? 0 : 1, duration: 0.3 })
      }
      const onDown = () => gsap.to(ringRef.current, { scale: '-=0.25', duration: 0.15, yoyo: true, repeat: 1 })
      const onLeave = () => gsap.to([dotRef.current, ringRef.current], { opacity: 0, duration: 0.2 })
      const onEnter = () => gsap.to([dotRef.current, ringRef.current], { opacity: 1, duration: 0.2 })
      window.addEventListener('mousemove', onMove, { passive: true })
      window.addEventListener('mousedown', onDown)
      document.addEventListener('mouseleave', onLeave)
      document.addEventListener('mouseenter', onEnter)
      return () => {
        setActive(false)
        document.documentElement.classList.remove('has-cursor')
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mousedown', onDown)
        document.removeEventListener('mouseleave', onLeave)
        document.removeEventListener('mouseenter', onEnter)
      }
    })
    return () => mm.revert()
  })

  return (
    <div aria-hidden="true" className={active ? '' : 'hidden'}>
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[100] -mt-5 -ml-5 flex size-10 items-center justify-center rounded-full border border-terre-cuite/70"
      >
        <span className="scale-[0.385] text-[11px] font-medium tracking-[0.18em] whitespace-nowrap text-lin uppercase">{label}</span>
      </div>
      <div ref={dotRef} className="pointer-events-none fixed top-0 left-0 z-[100] -mt-1 -ml-1 size-2 rounded-full bg-terre-cuite" />
    </div>
  )
}
