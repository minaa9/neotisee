import { useEffect, useId, useState } from 'react'

/**
 * Points interactifs sur une photo. Chaque point pulse doucement ; au clic,
 * une fiche s'ouvre avec le nom, la matière, la technique et les infos.
 * Échap ou un clic ailleurs referme la fiche.
 */
export default function Hotspots({ points = [] }) {
  const [open, setOpen] = useState(null)
  const base = useId()

  useEffect(() => {
    if (open === null) return
    const close = (e) => {
      if (e.type === 'keydown' && e.key !== 'Escape') return
      if (e.type === 'pointerdown' && e.target.closest('[data-hotspot]')) return
      setOpen(null)
    }
    window.addEventListener('keydown', close)
    window.addEventListener('pointerdown', close)
    return () => {
      window.removeEventListener('keydown', close)
      window.removeEventListener('pointerdown', close)
    }
  }, [open])

  return (
    <div className="absolute inset-0 z-10">
      {points.map((p, i) => {
        const isOpen = open === i
        const right = p.x > 55
        const below = p.y < 45
        return (
          <div key={i} data-hotspot className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <button
              type="button"
              data-cursor="Explorer"
              aria-expanded={isOpen}
              aria-controls={`${base}-${i}`}
              aria-label={`Voir la fiche : ${p.nom}`}
              onClick={() => setOpen(isOpen ? null : i)}
              className="relative -mt-4 -ml-4 flex size-8 items-center justify-center rounded-full"
            >
              <span aria-hidden="true" className={`absolute inset-0 rounded-full bg-lin/60 ${isOpen ? '' : 'animate-ping'}`} />
              <span aria-hidden="true" className={`relative flex size-6 items-center justify-center rounded-full border-2 border-lin bg-terre-cuite text-lin shadow-lg transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                <span className="text-[16px] leading-none">+</span>
              </span>
            </button>
            <div
              id={`${base}-${i}`}
              role="dialog"
              aria-label={p.nom}
              hidden={!isOpen}
              className={`absolute z-20 w-[min(260px,70vw)] rounded-[20px] border border-brun/10 bg-lin p-5 shadow-[0_20px_50px_rgba(61,42,35,0.18)] ${
                right ? 'right-6' : 'left-6'
              } ${below ? 'top-2' : 'bottom-2'} animate-[fiche_0.4s_cubic-bezier(0.22,1,0.36,1)]`}
            >
              <p className="text-label text-brique">Fiche objet</p>
              <p className="mt-1 font-serif text-[24px] leading-[1.1] text-brun">{p.nom}</p>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-petit">
                <dt className="text-brun-doux">Matière</dt>
                <dd className="text-brun">{p.matiere}</dd>
                <dt className="text-brun-doux">Technique</dt>
                <dd className="text-brun">{p.technique}</dd>
                <dt className="text-brun-doux">Infos</dt>
                <dd className="text-brun">{p.infos}</dd>
              </dl>
            </div>
          </div>
        )
      })}
    </div>
  )
}
