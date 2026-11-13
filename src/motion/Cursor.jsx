import { useRef, useState } from 'react'
import { MOTION_OK, gsap, useGSAP } from './gsap'

// Tout ce qui se clique : le curseur système « main » prend le relais.
const CLICKABLE = 'a[href], button:not(:disabled), [role="button"], [role="tab"], label:has(input[type="checkbox"], input[type="radio"]), select, summary, input[type="checkbox"], input[type="radio"]'
const FIELD = 'input, textarea, select, [contenteditable="true"]'
const TERRE = { ring: 'rgba(180,88,61,0.7)', dot: '#B4583D' }
const LIN = { ring: 'rgba(255,250,245,0.95)', dot: '#FFFAF5' }

/** Le point sous la souris est-il sur une photo (pas une icône ni un décor dessiné) ? */
function overPhoto(x, y) {
  for (const el of document.elementsFromPoint(x, y)) {
    if (el.tagName === 'IMG' || el.tagName === 'VIDEO') {
      const r = el.getBoundingClientRect()
      const decor = el.getAttribute('aria-hidden') === 'true' || /\.svg($|\?)/.test(el.currentSrc || el.src || '')
      if (!decor && r.width >= 140 && r.height >= 100) return true
      continue
    }
    if (el.tagName === 'MAIN' || el.tagName === 'FOOTER' || el.tagName === 'BODY') return false
    // Un fond opaque (carte, barre de navigation, bannière) recouvre ce qui est dessous.
    const bg = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)
    if (bg && (bg.length === 3 || Number(bg[3]) >= 0.85)) return false
  }
  return false
}

/**
 * Curseur personnalisé (ordinateur uniquement) : une petite pelote terre cuite
 * suivie d'un anneau de fil.
 * - Sur une photo, il passe en blanc pour rester visible.
 * - Sur un lien ou un bouton, il laisse la place à la main du système.
 * - Dans un champ de saisie, il laisse la place au curseur texte.
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

      let state = '' // « main », « champ », « photo », « libellé » ou normal
      let curText = ''
      let frame = 0
      let last = null

      const apply = (next, text = '') => {
        if (next === state && text === curText) return
        state = next
        curText = text
        setLabel(text)
        const hidden = next === 'main' || next === 'champ'
        const c = next === 'photo' ? LIN : TERRE
        gsap.to([ringRef.current, dotRef.current], { autoAlpha: hidden ? 0 : 1, duration: 0.2, overwrite: 'auto' })
        gsap.to(ringRef.current, {
          scale: text ? 2.6 : 1,
          borderColor: c.ring,
          backgroundColor: text ? 'rgba(180,88,61,0.92)' : 'rgba(180,88,61,0)',
          duration: 0.35,
          ease: 'power3.out',
        })
        gsap.to(dotRef.current, { backgroundColor: c.dot, scale: text ? 0 : 1, duration: 0.3 })
      }

      const check = () => {
        frame = 0
        const e = last
        const t = e.target
        if (t.closest?.(CLICKABLE)) return apply('main')
        if (t.closest?.(FIELD)) return apply('champ')
        const lab = t.closest?.('[data-cursor]')?.dataset.cursor
        if (lab) return apply('libelle', lab)
        apply(overPhoto(e.clientX, e.clientY) ? 'photo' : '')
      }

      const onMove = (e) => {
        dx(e.clientX)
        dy(e.clientY)
        rx(e.clientX)
        ry(e.clientY)
        last = e
        if (!frame) frame = requestAnimationFrame(check)
      }
      const onDown = () => gsap.to(ringRef.current, { scale: '-=0.25', duration: 0.15, yoyo: true, repeat: 1 })
      const onLeave = () => gsap.to([dotRef.current, ringRef.current], { autoAlpha: 0, duration: 0.2 })
      const onEnter = () => {
        state = 'x' // force la remise à jour au prochain mouvement
      }
      window.addEventListener('mousemove', onMove, { passive: true })
      window.addEventListener('mousedown', onDown)
      document.addEventListener('mouseleave', onLeave)
      document.addEventListener('mouseenter', onEnter)
      return () => {
        cancelAnimationFrame(frame)
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
