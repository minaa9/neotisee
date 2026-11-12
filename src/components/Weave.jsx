import { useMemo, useRef, useState } from 'react'
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '../motion/gsap'

const C = 44 // fils de chaîne (verticaux)
const R = 14 // fils de trame (horizontaux)
const S = 20 // taille d'une case en unités SVG
const W = C * S
const H = R * S

/**
 * Armures (manières d'entrecroiser les fils). Pour chaque croisement, renvoie
 * true si c'est le fil de chaîne qui passe dessus.
 */
const ARMURES = {
  toile: {
    nom: 'Toile',
    texte: 'Un fil dessus, un fil dessous : l’entrecroisement le plus simple.',
    dessus: (r, c) => (r + c) % 2 === 0,
  },
  serge: {
    nom: 'Sergé',
    texte: 'Le croisement se décale d’un fil à chaque passage : une diagonale apparaît.',
    dessus: (r, c) => (((c - r) % 4) + 4) % 4 < 2,
  },
  chevron: {
    nom: 'Chevron',
    texte: 'La diagonale change de sens à intervalles réguliers et dessine des zigzags.',
    dessus: (r, c) => {
      const k = c % 12 < 6 ? c % 12 : 11 - (c % 12)
      return (((k - r) % 4) + 4) % 4 < 2
    },
  },
  losange: {
    nom: 'Losange',
    texte: 'En inversant aussi la diagonale en hauteur, des losanges se forment.',
    dessus: (r, c) => {
      const k = c % 12 < 6 ? c % 12 : 11 - (c % 12)
      const l = r % 12 < 6 ? r % 12 : 11 - (r % 12)
      return (((k - l) % 4) + 4) % 4 < 2
    },
  },
}

// Couleurs de trame : rayures dans la palette Néotisse.
const TRAME = ['#B4583D', '#B4583D', '#9A4A33', '#E7C6B3', '#B4583D', '#6E5348']

/**
 * Métier à tisser interactif, signature visuelle de Néotisse :
 *  - les fils de trame passent un à un, en navette, quand on arrive dessus ;
 *  - sous la souris, les fils s'écartent comme si on les effleurait ;
 *  - quatre armures à choisir, l'étoffe se re-tisse en vague.
 */
export default function Weave({ dark = true }) {
  const rootRef = useRef(null)
  const svgRef = useRef(null)
  const [armure, setArmure] = useState('serge')
  const cells = useMemo(() => {
    const list = []
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) list.push({ r, c })
    return list
  }, [])

  // Animation d'entrée + interaction au survol.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const wefts = gsap.utils.toArray('[data-weft]')
        const warps = gsap.utils.toArray('[data-warp]')
        gsap
          .timeline({ scrollTrigger: { trigger: svgRef.current, start: 'top 75%', once: true } })
          .from(warps, { scaleY: 0, transformOrigin: '50% 0%', duration: 0.9, stagger: 0.015, ease: 'power3.out' })
          .from(wefts, {
            scaleX: 0,
            transformOrigin: (i) => (i % 2 ? '100% 50%' : '0% 50%'),
            duration: 0.5,
            stagger: 0.06,
            ease: 'power2.inOut',
          }, 0.4)
          .from('[data-cell]', { scaleY: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: { each: 0.0015, from: 'start' } }, 0.6)

        // Les fils s'écartent autour du curseur.
        const svg = svgRef.current
        const wx = warps.map((el) => gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }))
        const wy = wefts.map((el) => gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }))
        const cellsEls = gsap.utils.toArray('[data-cell]')
        const cx = cellsEls.map((el) => gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }))
        const cy = cellsEls.map((el) => gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }))
        const push = (d, delta) => (Math.abs(delta) < 1 ? 0 : Math.sign(delta) * 7 * Math.exp(-(d * d) / 5000))
        const onMove = (e) => {
          const r = svg.getBoundingClientRect()
          const mx = ((e.clientX - r.left) / r.width) * W
          const my = ((e.clientY - r.top) / r.height) * H
          const offX = []
          const offY = []
          warps.forEach((_, c) => {
            const x = c * S + S / 2
            offX[c] = -push(Math.hypot(x - mx, 0) * 1.4 + Math.abs(my - H / 2) * 0.2, mx - x)
            wx[c](offX[c])
          })
          wefts.forEach((_, i) => {
            const y = i * S + S / 2
            offY[i] = -push(Math.abs(y - my) * 1.4 + Math.abs(mx - W / 2) * 0.05, my - y)
            wy[i](offY[i])
          })
          cellsEls.forEach((_, k) => {
            const { r: row, c: col } = cells[k]
            cx[k](offX[col])
            cy[k](offY[row])
          })
        }
        const onLeave = () => {
          wx.forEach((f) => f(0))
          wy.forEach((f) => f(0))
          cx.forEach((f) => f(0))
          cy.forEach((f) => f(0))
        }
        svg.addEventListener('mousemove', onMove)
        svg.addEventListener('mouseleave', onLeave)
        return () => {
          svg.removeEventListener('mousemove', onMove)
          svg.removeEventListener('mouseleave', onLeave)
        }
      })
      // Les images au-dessus peuvent changer la position : on recalcule.
      ScrollTrigger.refresh()
      return () => mm.revert()
    },
    { scope: rootRef },
  )

  // Changement d'armure : l'étoffe se re-tisse en vague depuis la gauche.
  const choose = (key) => {
    if (key === armure) return
    setArmure(key)
    if (!window.matchMedia(MOTION_OK).matches) return
    requestAnimationFrame(() => {
      gsap.fromTo(
        rootRef.current.querySelectorAll('[data-cell]'),
        { scaleY: 0.2, transformOrigin: '50% 50%' },
        { scaleY: 1, duration: 0.5, ease: 'back.out(2)', stagger: { each: 0.012, grid: [R, C], from: 'start', axis: 'x' } },
      )
    })
  }

  const dessus = ARMURES[armure].dessus

  return (
    <div ref={rootRef}>
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div role="radiogroup" aria-label="Choisir une armure" className="flex flex-wrap gap-2.5">
          {Object.entries(ARMURES).map(([key, a]) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={armure === key}
              onClick={() => choose(key)}
              className={`rounded-full border px-5 py-2.5 text-petit transition-colors ${
                armure === key
                  ? 'border-terre-cuite bg-terre-cuite text-lin'
                  : dark
                    ? 'border-lin/30 text-lin hover:border-lin/70'
                    : 'border-brun/20 text-brun hover:border-brun/50'
              }`}
            >
              {a.nom}
            </button>
          ))}
        </div>
        <p aria-live="polite" className={`max-w-[360px] text-petit ${dark ? 'text-lin/70' : 'text-brun-doux'}`}>
          {ARMURES[armure].texte}
        </p>
      </div>

      <svg
        ref={svgRef}
        data-cursor="Effleurer"
        viewBox={`-10 -10 ${W + 20} ${H + 20}`}
        className="mt-8 w-full touch-pan-y overflow-visible"
        role="img"
        aria-label={`Étoffe tissée en armure ${ARMURES[armure].nom.toLowerCase()}`}
      >
        <defs>
          <linearGradient id="fil-chaine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#E9D8C8" />
            <stop offset="0.5" stopColor="#FFFAF5" />
            <stop offset="1" stopColor="#D9C2B0" />
          </linearGradient>
          <linearGradient id="ombre-trame" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.18" />
            <stop offset="1" stopColor="#000" stopOpacity="0.22" />
          </linearGradient>
        </defs>

        {/* Chaîne (dessous) */}
        {Array.from({ length: C }, (_, c) => (
          <rect key={c} data-warp x={c * S + 2.5} y={-10} width={S - 5} height={H + 20} rx={7} fill="url(#fil-chaine)" opacity="0.92" />
        ))}

        {/* Trame */}
        {Array.from({ length: R }, (_, r) => (
          <g key={r} data-weft>
            <rect x={-10} y={r * S + 2} width={W + 20} height={S - 4} rx={8} fill={TRAME[r % TRAME.length]} />
            <rect x={-10} y={r * S + 2} width={W + 20} height={S - 4} rx={8} fill="url(#ombre-trame)" />
          </g>
        ))}

        {/* Croisements où la chaîne repasse au-dessus */}
        {cells.map(({ r, c }) => (
          <rect
            key={`${r}-${c}`}
            data-cell
            x={c * S + 2.5}
            y={r * S}
            width={S - 5}
            height={S}
            rx={6}
            fill="url(#fil-chaine)"
            style={{ opacity: dessus(r, c) ? 1 : 0, transition: 'opacity 0.35s ease' }}
          />
        ))}
      </svg>
    </div>
  )
}
