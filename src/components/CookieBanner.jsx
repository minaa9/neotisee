import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { OPEN_EVENT, getConsent, saveConsent } from '../data/cookies'
import { MOTION_OK, gsap } from '../motion/gsap'

/** Petit interrupteur dans la charte (fil terre cuite). */
export function Toggle({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
        checked ? 'border-terre-cuite bg-terre-cuite' : 'border-brun/25 bg-creme'
      }`}
    >
      <span
        className={`absolute top-1/2 left-1 size-5 -translate-y-1/2 rounded-full shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          checked ? 'translate-x-5 bg-lin' : 'bg-terre-cuite/70'
        }`}
      />
    </button>
  )
}

/**
 * Bannière cookies : une petite carte crème qui monte en bas de l'écran,
 * avec une pelote qui roule. « Tout refuser » est aussi simple que
 * « Tout accepter », comme l'exige la CNIL.
 */
export default function CookieBanner() {
  const [open, setOpen] = useState(false)
  const [details, setDetails] = useState(false)
  const [audience, setAudience] = useState(false)
  const ref = useRef(null)

  // Première visite (ou choix de plus de 6 mois) : on attend la fin de l'intro pelote.
  useEffect(() => {
    if (getConsent()) return
    const t = setTimeout(() => setOpen(true), 4200)
    return () => clearTimeout(t)
  }, [])

  // Le lien « Gestion des cookies » rouvre la bannière avec le détail.
  useEffect(() => {
    const reopen = () => {
      setAudience(!!getConsent()?.audience)
      setDetails(true)
      setOpen(true)
    }
    window.addEventListener(OPEN_EVENT, reopen)
    return () => window.removeEventListener(OPEN_EVENT, reopen)
  }, [])

  useEffect(() => {
    if (!open || !ref.current) return
    if (window.matchMedia(MOTION_OK).matches) {
      gsap.fromTo(ref.current, { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out' })
      gsap.fromTo('[data-cookie-pelote]', { x: -40, rotate: -200 }, { x: 0, rotate: 0, duration: 1.2, ease: 'expo.out', delay: 0.15 })
    }
  }, [open])

  const close = (value) => {
    saveConsent({ audience: value })
    const done = () => {
      setOpen(false)
      setDetails(false)
    }
    if (ref.current && window.matchMedia(MOTION_OK).matches) {
      gsap.to(ref.current, { yPercent: 120, autoAlpha: 0, duration: 0.5, ease: 'power2.in', onComplete: done })
    } else done()
  }

  if (!open) return null

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookies-titre"
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-[560px] rounded-[28px] border border-brun/10 bg-lin p-6 shadow-[0_24px_60px_-20px_rgba(61,42,35,0.45)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:p-7"
    >
      <div className="flex items-start gap-4">
        {/* Pelote */}
        <svg data-cookie-pelote aria-hidden="true" viewBox="0 0 40 40" className="mt-1 size-10 shrink-0">
          <circle cx="20" cy="20" r="18" fill="#B4583D" />
          <g fill="none" stroke="#7A2C21" strokeWidth="1.3">
            <ellipse cx="20" cy="20" rx="18" ry="6" transform="rotate(25 20 20)" />
            <ellipse cx="20" cy="20" rx="18" ry="11" transform="rotate(-40 20 20)" />
            <ellipse cx="20" cy="20" rx="18" ry="15" transform="rotate(80 20 20)" />
          </g>
        </svg>
        <div>
          <p id="cookies-titre" className="font-serif text-[26px] leading-tight text-brun">
            Un petit fil <em>de cookies</em>
          </p>
          <p className="mt-2 text-petit text-brun-doux">
            Ce site n’utilise que les cookies nécessaires à son fonctionnement. Aucun cookie
            publicitaire, aucun suivi.{' '}
            <Link to="/cookies" onClick={() => setOpen(false)} className="link-fil text-terre-cuite">
              En savoir plus
            </Link>
          </p>
        </div>
      </div>

      {details && (
        <ul className="mt-5 flex flex-col gap-3 border-t border-brun/10 pt-5">
          <li className="flex items-center justify-between gap-4">
            <span>
              <span className="block text-[15px] text-brun">Nécessaires</span>
              <span className="block text-[13px] text-brun-doux">Retenir votre choix. Toujours actifs.</span>
            </span>
            <Toggle checked disabled onChange={() => {}} label="Cookies nécessaires, toujours actifs" />
          </li>
          <li className="flex items-center justify-between gap-4">
            <span>
              <span className="block text-[15px] text-brun">Mesure d’audience</span>
              <span className="block text-[13px] text-brun-doux">Aucun outil installé pour l’instant.</span>
            </span>
            <Toggle checked={audience} onChange={setAudience} label="Cookies de mesure d’audience" />
          </li>
        </ul>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => close(false)} className="rounded-full border border-brun/30 px-5 py-2.5 text-[14px] text-brun transition-colors hover:border-brun hover:bg-creme">
          Tout refuser
        </button>
        {details ? (
          <button type="button" onClick={() => close(audience)} className="rounded-full border border-brun/30 px-5 py-2.5 text-[14px] text-brun transition-colors hover:border-brun hover:bg-creme">
            Enregistrer
          </button>
        ) : (
          <button type="button" onClick={() => setDetails(true)} className="link-fil px-1 py-2.5 text-[14px] text-brun">
            Personnaliser
          </button>
        )}
        <button type="button" onClick={() => close(true)} className="ml-auto rounded-full bg-terre-cuite px-5 py-2.5 text-[14px] text-lin transition-colors hover:bg-brique">
          Tout accepter
        </button>
      </div>
    </div>
  )
}
