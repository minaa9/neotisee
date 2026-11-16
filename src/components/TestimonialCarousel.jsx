import { useEffect, useRef, useState } from 'react'
import { MOTION_OK } from '../motion/gsap'
import etoileNote from '../assets/v3/ui/etoile-note.svg'
import flecheContour from '../assets/v3/ui/fleche-contour.svg'

const capitale = (s = '') => s.charAt(0).toUpperCase() + s.slice(1)
const AUTO = 6500 // temps de lecture d'un témoignage (ms)

function Etoiles({ note = 5, className = '' }) {
  return (
    <span className={`flex gap-1 ${className}`} aria-label={`${note} étoiles sur 5`}>
      {Array.from({ length: note }, (_, i) => (
        <img key={i} src={etoileNote} alt="" width="13" height="12" className="h-3 w-[13px] brightness-0 invert" />
      ))}
    </span>
  )
}

/**
 * Carrousel de témoignages « en éventail » : la carte du milieu est mise en
 * avant (plus grande, au premier plan, avec le texte du témoignage), ses
 * voisines s'effacent en retrait. Les cartes glissent en douceur d'une place
 * à l'autre. Navigation : flèches, points, clic sur une carte, glisser au
 * doigt ou à la souris, flèches du clavier. Défilement automatique, mis en
 * pause au survol (et désactivé si l'on réduit les animations).
 */
export default function TestimonialCarousel({ items }) {
  const n = items.length
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [wide, setWide] = useState(true)
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
    const on = () => setWide(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  if (!n) return null
  const gap = wide ? 305 : 150 // centre → voisine
  const gap2 = wide ? 230 : 120 // voisine → carte suivante
  const reach = n >= 5 ? 2 : 1 // nombre de cartes visibles de chaque côté

  return (
    <div
      className="select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
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
        className="relative h-[470px] touch-pan-y overflow-hidden rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-terre-cuite/40 md:h-[500px]"
      >
        {items.map((t, i) => {
          // Distance circulaire à la carte active (-2, -1, 0, 1, 2…)
          let d = i - current
          if (d > n / 2) d -= n
          if (d < -n / 2) d += n
          const centre = d === 0
          const visible = Math.abs(d) <= reach
          const scale = centre ? 1 : Math.abs(d) === 1 ? 0.8 : 0.66
          return (
            <button
              key={i}
              type="button"
              tabIndex={centre ? -1 : visible ? 0 : -1}
              aria-hidden={!centre}
              onClick={() => !centre && go(i)}
              className={`absolute top-1/2 left-1/2 h-[420px] w-[280px] overflow-hidden rounded-[22px] text-left transition-[transform,opacity,box-shadow,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:h-[450px] md:w-[320px] ${
                centre ? 'shadow-[0_30px_60px_-20px_rgba(61,42,35,0.55)]' : 'shadow-[0_16px_30px_-16px_rgba(61,42,35,0.45)] brightness-[0.92]'
              }`}
              style={{
                transform: `translate(-50%, -50%) translateX(${Math.sign(d) * (Math.abs(d) >= 1 ? gap + (Math.abs(d) - 1) * gap2 : 0)}px) scale(${scale})`,
                zIndex: 10 - Math.abs(d),
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? 'auto' : 'none',
              }}
            >
              <img src={t.vignette} alt="" draggable="false" className={`absolute inset-0 size-full object-cover transition-transform duration-[1400ms] ease-out ${centre ? 'scale-100' : 'scale-110'}`} />
              <span aria-hidden="true" className={`absolute inset-0 transition-opacity duration-700 ${centre ? 'bg-[linear-gradient(180deg,rgba(61,42,35,0.15)_0%,rgba(61,42,35,0.55)_38%,rgba(61,42,35,0.94)_100%)]' : 'bg-[linear-gradient(180deg,rgba(61,42,35,0.05)_30%,rgba(61,42,35,0.82)_100%)]'}`} />

              {/* Carte en retrait : l'atelier et la note, comme une étiquette */}
              <span className={`absolute inset-x-6 bottom-6 text-lin transition-[opacity,transform] duration-500 ${centre ? 'translate-y-4 opacity-0' : 'opacity-100'}`}>
                <span className="block font-serif text-[26px] leading-[1.1] tracking-[0.01em]">{capitale(t.atelier?.replace(/^Atelier\s+/i, '')) || 'Atelier'}</span>
                <Etoiles note={t.note} className="mt-2" />
              </span>

              {/* Carte du milieu : le témoignage */}
              <span className={`absolute inset-0 flex flex-col justify-end p-7 text-lin transition-[opacity,transform] delay-150 duration-700 ${centre ? 'opacity-100' : 'translate-y-6 opacity-0'}`}>
                <span aria-hidden="true" className="font-serif text-[80px] leading-[0.5] font-light text-poudre">“</span>
                <span className="mt-5 line-clamp-6 font-serif text-[21px] leading-[1.25] font-light italic md:text-[23px]">{t.texte}</span>
                <span className="mt-5 flex items-center justify-between gap-3 border-t border-lin/25 pt-4">
                  <span className="min-w-0">
                    <span className="block truncate text-[14px]">{t.prenom || t.atelier}</span>
                    <span className="block truncate text-[12px] text-lin/70">{t.prenom ? `${t.atelier} · ${t.date}` : t.date}</span>
                  </span>
                  <Etoiles note={t.note} />
                </span>
              </span>
            </button>
          )
        })}
        {/* Annonce pour les lecteurs d'écran */}
        <p className="sr-only" aria-live="polite">
          Témoignage {current + 1} sur {n} : {items[current].texte} — {items[current].atelier}
        </p>
      </div>

      {/* Navigation : flèches et points (le point actif devient un anneau) */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <button type="button" onClick={() => go(current - 1)} aria-label="Témoignage précédent" className="flex size-11 items-center justify-center rounded-full border border-brun/30 transition-colors hover:border-brun hover:bg-brun/5">
          <img src={flecheContour} alt="" width="16" height="16" className="rotate-180" />
        </button>
        <div className="flex items-center gap-3">
          {items.map((_, i) => (
            <button key={i} type="button" onClick={() => go(i)} aria-label={`Témoignage ${i + 1}`} aria-current={i === current} className="flex size-5 items-center justify-center">
              <span
                className={`block rounded-full transition-all duration-500 ${
                  i === current ? 'size-[18px] border-2 border-terre-cuite bg-transparent' : 'size-2 bg-brun/25 hover:bg-brun/50'
                }`}
              />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(current + 1)} aria-label="Témoignage suivant" className="flex size-11 items-center justify-center rounded-full border border-brun/30 transition-colors hover:border-brun hover:bg-brun/5">
          <img src={flecheContour} alt="" width="16" height="16" />
        </button>
      </div>
    </div>
  )
}

/**
 * Panneau clair qui accueille le carrousel (accueil et Livre d'or) :
 * titre à gauche, note moyenne à droite, puis l'éventail de cartes.
 */
export function TemoignagesPanel({ items, eyebrow, title, subtitle }) {
  const moyenne = items.length ? items.reduce((s, t) => s + (t.note || 5), 0) / items.length : 0
  return (
    <div className="rounded-[36px] border border-brun/6 bg-lin px-5 pt-8 pb-8 shadow-[0_40px_80px_-50px_rgba(61,42,35,0.45)] sm:px-10 sm:pt-10 xl:px-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          {eyebrow && <p className="text-label text-brique">{eyebrow}</p>}
          <h2 className="mt-3 font-serif text-[36px] leading-[1.05] tracking-[-0.005em] text-brun md:text-[48px] [&_em]:font-light">{title}</h2>
          {subtitle && <p className="mt-3 max-w-[520px] text-petit text-brun-doux">{subtitle}</p>}
        </div>
        {items.length > 0 && (
          <div className="flex items-center gap-4 rounded-full border border-brun/10 bg-creme py-2 pr-5 pl-2">
            <span className="flex size-12 items-center justify-center rounded-full bg-terre-cuite font-serif text-[20px] text-lin">{moyenne.toFixed(1).replace('.', ',')}</span>
            <span className="text-[13px] leading-tight text-brun-doux">
              <span className="block text-brun">Note moyenne</span>
              {items.length} avis publiés
            </span>
          </div>
        )}
      </div>
      <div className="mt-8 md:mt-10">
        <TestimonialCarousel items={items} />
      </div>
    </div>
  )
}
