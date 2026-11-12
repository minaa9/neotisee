import { useRef, useState } from 'react'
import { MOTION_OK, gsap, useGSAP } from '../motion/gsap'

/** Plantes tinctoriales citées dans nos ateliers, et la teinte qu'on leur associe. */
const PLANTES = [
  { id: 'ecru', nom: 'Écru', teinte: 'Laine non teinte', couleur: '#EFE3D3' },
  { id: 'garance', nom: 'Garance', teinte: 'Rouges', couleur: '#A9432F' },
  { id: 'gaude', nom: 'Gaude', teinte: 'Jaunes', couleur: '#D6A23A' },
  { id: 'pastel', nom: 'Pastel', teinte: 'Bleus', couleur: '#4F6E8F' },
]

const N = 34 // nombre de fibres
const fibre = (i) => {
  const x = 60 + i * 14
  const sway = (i % 2 ? 1 : -1) * (6 + (i % 5))
  return `M${x} 20 C ${x + sway} 110, ${x - sway} 200, ${x + sway * 0.6} 300`
}

/**
 * Le bain de teinture : un écheveau suspendu. On choisit une plante et la
 * couleur monte le long des fibres, du bas vers le haut, comme quand on plonge
 * la laine dans le bain. Au survol, les fibres se balancent.
 */
export default function DyeBath() {
  const rootRef = useRef(null)
  const stopsRef = useRef(null)
  const [plante, setPlante] = useState('ecru')
  const prev = useRef('#EFE3D3')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`${MOTION_OK} and (hover: hover)`, () => {
        const svg = rootRef.current.querySelector('svg')
        const paths = gsap.utils.toArray(rootRef.current.querySelectorAll('[data-fibre]'))
        const rot = paths.map((p) => gsap.quickTo(p, 'rotation', { duration: 0.8, ease: 'power3.out' }))
        gsap.set(paths, { transformOrigin: '50% 0%' })
        const move = (e) => {
          const r = svg.getBoundingClientRect()
          const mx = ((e.clientX - r.left) / r.width) * 600
          paths.forEach((_, i) => {
            const d = mx - (60 + i * 14)
            rot[i](Math.abs(d) < 80 ? -Math.sign(d) * (1 - Math.abs(d) / 80) * 4 : 0)
          })
        }
        const leave = () => paths.forEach((_, i) => rot[i](0))
        svg.addEventListener('mousemove', move)
        svg.addEventListener('mouseleave', leave)
        return () => {
          svg.removeEventListener('mousemove', move)
          svg.removeEventListener('mouseleave', leave)
        }
      })
      return () => mm.revert()
    },
    { scope: rootRef },
  )

  const tremper = (p) => {
    if (p.id === plante) return
    setPlante(p.id)
    const [s0, s1, s2, s3] = stopsRef.current.querySelectorAll('stop')
    const old = prev.current
    prev.current = p.couleur
    const reduce = !window.matchMedia(MOTION_OK).matches
    s0.setAttribute('stop-color', old)
    s1.setAttribute('stop-color', old)
    s2.setAttribute('stop-color', p.couleur)
    s3.setAttribute('stop-color', p.couleur)
    const o = { v: 1 }
    gsap.to(o, {
      v: 0,
      duration: reduce ? 0 : 2.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        s1.setAttribute('offset', o.v)
        s2.setAttribute('offset', o.v)
      },
    })
    if (!reduce) gsap.fromTo(rootRef.current.querySelector('[data-bain]'), { scaleY: 0.6 }, { scaleY: 1, duration: 0.8, ease: 'elastic.out(1, 0.4)', transformOrigin: '50% 100%' })
  }

  const current = PLANTES.find((p) => p.id === plante)

  return (
    <div ref={rootRef} className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
      <div>
        <p className="text-label text-brique">Le bain de teinture</p>
        <h2 className="mt-3 font-serif text-[36px] leading-[1.08] text-brun md:text-[48px]">
          Plongez la laine,
          <br />
          <em className="font-light">voyez la couleur monter</em>
        </h2>
        <p className="mt-5 max-w-[440px] text-courant text-brun-doux">
          Garance pour les rouges, gaude pour les jaunes, pastel pour les bleus. Choisissez une plante :
          la teinte remonte le long des fibres. En atelier, la même plante change de nuance selon le
          mordant utilisé.
        </p>
        <div role="radiogroup" aria-label="Choisir une plante" className="mt-7 flex flex-wrap gap-2.5">
          {PLANTES.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={plante === p.id}
              onClick={() => tremper(p)}
              className={`group flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-petit transition-colors ${
                plante === p.id ? 'border-brun bg-brun text-lin' : 'border-brun/20 bg-lin text-brun hover:border-brun/50'
              }`}
            >
              <span aria-hidden="true" className="icone-anim size-3.5 rounded-full border border-brun/20" style={{ backgroundColor: p.couleur }} />
              {p.nom}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="mt-4 text-petit text-brun-doux">
          {current.nom} · {current.teinte}
        </p>
      </div>

      <svg viewBox="0 0 600 360" className="w-full overflow-visible" data-cursor="Effleurer" role="img" aria-label={`Écheveau de laine, teinte : ${current.teinte.toLowerCase()}`}>
        <defs>
          <linearGradient id="teinte" ref={stopsRef} gradientUnits="userSpaceOnUse" x1="0" y1="20" x2="0" y2="300">
            <stop offset="0" stopColor="#EFE3D3" />
            <stop offset="1" stopColor="#EFE3D3" />
            <stop offset="1" stopColor="#EFE3D3" />
            <stop offset="1" stopColor="#EFE3D3" />
          </linearGradient>
        </defs>
        {/* Bâton auquel l'écheveau est suspendu */}
        <rect x="30" y="10" width="540" height="12" rx="6" fill="#6E5348" />
        {Array.from({ length: N }, (_, i) => (
          <path key={i} data-fibre d={fibre(i)} fill="none" stroke="url(#teinte)" strokeWidth="7" strokeLinecap="round" />
        ))}
        {/* Le bain */}
        <g data-bain>
          <path d="M20 300 Q 300 280 580 300 L 560 350 Q 300 362 40 350 Z" fill="#B4583D" fillOpacity="0.12" />
          <path d="M20 300 Q 300 280 580 300" fill="none" stroke="#B4583D" strokeOpacity="0.4" />
        </g>
      </svg>
    </div>
  )
}
