import { useEffect, useRef, useState } from 'react'
import { MOTION_OK, gsap, useGSAP } from '../motion/gsap'



export function Champ({ label, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-label text-brun">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[12px] text-brun-doux">{hint}</span>}
    </label>
  )
}

/** En-tête d'une page du back-office : titre qui monte, fil qui se dessine. */
export function PageTitle({ eyebrow, title, children }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-pt]', { yPercent: 40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 })
        gsap.from('[data-pt-fil]', { scaleX: 0, transformOrigin: 'left', duration: 1.4, ease: 'expo.inOut', delay: 0.2 })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )
  return (
    <header ref={ref} className="mb-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p data-pt className="text-label text-brique">
            {eyebrow}
          </p>
          <h1 data-pt className="mt-3 font-serif text-[40px] leading-[1.05] font-light text-brun md:text-[54px]">
            {title}
          </h1>
        </div>
        <div data-pt className="flex flex-wrap gap-3">
          {children}
        </div>
      </div>
      <span data-pt-fil aria-hidden="true" className="mt-8 block h-px bg-terre-cuite/40" />
    </header>
  )
}

/** Boutons simples du back-office. */
export function Btn({ variant = 'plein', className = '', ...props }) {
  const styles = {
    plein: 'bg-terre-cuite text-lin hover:bg-brique',
    contour: 'border border-brun/25 text-brun hover:border-brun hover:bg-lin',
    discret: 'text-brun-doux hover:text-terre-cuite',
    danger: 'border border-terre-cuite/40 text-terre-cuite hover:bg-terre-cuite hover:text-lin',
  }
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[14px] transition-[color,background-color,border-color,transform] duration-300 active:scale-[0.97] disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  )
}

/** Pastille de statut. */
export function Badge({ tone = 'neutre', children }) {
  const tones = {
    neutre: 'bg-brun/8 text-brun-doux',
    ok: 'bg-[#7d8f6a]/15 text-[#56663f]',
    attente: 'bg-[#D6A23A]/18 text-[#8a6418]',
    alerte: 'bg-terre-cuite/12 text-terre-cuite',
  }
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] ${tones[tone]}`}>{children}</span>
}

/** Bouton de suppression qui demande confirmation (deux clics). */
export function DeleteButton({ onConfirm, label = 'Supprimer' }) {
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(false), 3000)
    return () => clearTimeout(t)
  }, [armed])
  return (
    <Btn variant={armed ? 'plein' : 'danger'} onClick={() => (armed ? onConfirm() : setArmed(true))}>
      {armed ? 'Confirmer ?' : label}
    </Btn>
  )
}

/** Panneau latéral (formulaire d'ajout / de modification). */
export function Drawer({ open, title, onClose, children }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    ref.current?.querySelector('input, textarea, select')?.focus()
    if (window.matchMedia(MOTION_OK).matches) {
      gsap.fromTo(ref.current, { xPercent: 100 }, { xPercent: 0, duration: 0.7, ease: 'expo.out' })
      gsap.fromTo('[data-drawer-voile]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 })
    }
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div data-drawer-voile className="absolute inset-0 bg-brun/30 backdrop-blur-[2px]" onClick={onClose} />
      <aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-y-0 right-0 flex w-full max-w-[620px] flex-col bg-creme shadow-[-30px_0_60px_-30px_rgba(61,42,35,0.4)]"
      >
        <div className="flex items-center justify-between border-b border-brun/10 px-6 py-5 sm:px-8">
          <p className="font-serif text-[28px] text-brun">{title}</p>
          <button type="button" onClick={onClose} aria-label="Fermer" className="flex size-10 items-center justify-center rounded-full border border-brun/20 text-brun transition-transform duration-300 hover:rotate-90">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">{children}</div>
      </aside>
    </div>
  )
}


/** État vide / chargement / erreur. */
export function Etat({ rows, error, vide }) {
  if (error) return <p className="rounded-[20px] border border-terre-cuite/30 bg-lin p-6 text-terre-cuite">{error}</p>
  if (!rows) return <p className="p-6 text-brun-doux">Chargement…</p>
  if (!rows.length) return <p className="rounded-[20px] border border-dashed border-brun/20 p-10 text-center font-serif text-[22px] text-brun-doux italic">{vide}</p>
  return null
}

