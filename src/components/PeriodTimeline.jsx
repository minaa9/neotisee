import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { periodes } from '../data/periodes'
import { MOTION_OK, gsap } from '../motion/gsap'

/**
 * Frise chronologique interactive : un fil horizontal avec un nœud par
 * période. Choisir une période fait glisser une navette jusqu'au nœud,
 * révèle la nouvelle photo en volet et remplace le texte en fondu.
 * Navigation au clavier avec les flèches gauche / droite.
 */
export default function PeriodTimeline() {
  const rootRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState(0) // période affichée (après la transition)
  const busy = useRef(false)

  const go = (next) => {
    next = (next + periodes.length) % periodes.length
    if (next === index || busy.current) return
    setIndex(next)
    if (!window.matchMedia(MOTION_OK).matches) {
      setShown(next)
      return
    }
    busy.current = true
    const q = gsap.utils.selector(rootRef)
    const dir = next > index ? 1 : -1
    gsap
      .timeline({ onComplete: () => (busy.current = false) })
      .to(q('[data-period-text] > *'), { y: -24 * dir, autoAlpha: 0, duration: 0.35, stagger: 0.04, ease: 'power2.in' })
      .to(q('[data-period-photo-next]'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' }, 0)
      .add(() => setShown(next))
      .set(q('[data-period-photo-next]'), { clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' })
      .fromTo(q('[data-period-text] > *'), { y: 24 * dir, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out' })
  }

  const onKey = (e) => {
    if (e.key === 'ArrowRight') go(index + 1)
    if (e.key === 'ArrowLeft') go(index - 1)
  }

  const p = periodes[shown]
  const nextPhoto = periodes[index].photo

  return (
    <div ref={rootRef}>
      {/* Le fil et ses nœuds */}
      <div role="tablist" aria-label="Périodes" onKeyDown={onKey} className="relative mx-8 max-w-[900px] sm:mx-auto">
        <svg aria-hidden="true" viewBox="0 0 900 40" preserveAspectRatio="none" className="absolute inset-x-0 top-[18px] h-10 w-full">
          <path d="M0 20 C 150 0, 300 40, 450 20 S 750 0, 900 20" fill="none" stroke="#B4583D" strokeOpacity="0.45" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* Navette qui glisse vers la période choisie */}
        <span
          aria-hidden="true"
          className="absolute top-[30px] h-3 w-14 -translate-x-1/2 rounded-full bg-terre-cuite transition-[left] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ left: `${(index / (periodes.length - 1)) * 100}%` }}
        />
        <div className="relative flex justify-between">
          {periodes.map((per, i) => (
            <button
              key={per.id}
              type="button"
              role="tab"
              aria-selected={index === i}
              aria-controls="periode-contenu"
              tabIndex={index === i ? 0 : -1}
              onClick={() => go(i)}
              data-cursor="Voir"
              className={`group flex w-[100px] flex-col items-center gap-3 first:-ml-[50px] last:-mr-[50px] sm:w-[120px] sm:first:-ml-[60px] sm:last:-mr-[60px] ${index === i ? 'text-terre-cuite' : 'text-brun-doux hover:text-brun'}`}
            >
              <span className="text-label">{String(i + 1).padStart(2, '0')}</span>
              <span className={`size-4 rounded-full border-2 transition-all duration-500 ${index === i ? 'scale-125 border-terre-cuite bg-terre-cuite' : 'border-terre-cuite/50 bg-creme group-hover:scale-110'}`} />
              <span className="font-serif text-[20px] leading-tight sm:text-[24px]">{per.nom}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenu de la période */}
      <div id="periode-contenu" role="tabpanel" aria-live="polite" className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-tl-[200px] rounded-tr-[24px] rounded-br-[200px] rounded-bl-[24px]">
          <img src={p.photo.src} alt={p.photo.alt} loading="lazy" className="absolute inset-0 size-full object-cover" />
          <img
            data-period-photo-next
            src={nextPhoto.src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
            style={{ clipPath: 'inset(0% 0% 0% 100%)' }}
          />
          <p className="absolute bottom-4 left-6 rounded-full bg-lin/85 px-3 py-1 text-[12px] text-brun-doux">Photo d’atelier Néotisse</p>
        </div>

        <div data-period-text>
          <p className="text-label text-brique">{p.nom}</p>
          <h3 className="mt-3 font-serif text-[36px] leading-[1.08] text-brun md:text-[48px]">
            <em className="font-light">{p.accroche}</em>
          </h3>
          {p.aRediger && (
            <p className="mt-6 max-w-[480px] rounded-[18px] border border-dashed border-terre-cuite/50 bg-lin/60 px-5 py-4 text-petit text-brun-doux">
              <span className="mb-1 block text-label text-terre-cuite">Emplacement à compléter</span>
              {p.aRediger}
            </p>
          )}
          <ul className="mt-6 flex flex-col gap-2">
            {p.liens.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="group inline-flex items-center gap-2 text-courant text-brun">
                  <span aria-hidden="true" className="h-px w-6 bg-terre-cuite transition-[width] duration-300 group-hover:w-10" />
                  <span className="link-fil">{l.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
