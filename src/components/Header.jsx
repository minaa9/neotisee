import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { mainNav } from '../data/navigation'
import { Button, Logo } from './ui'
import FullscreenMenu from './FullscreenMenu'
import { useReglages } from '../lib/reglages'

const FERME = 'neotisse-annonce-fermee'

/**
 * Bandeau d'annonce (Réglages › Bandeau d'annonce dans le back-office).
 * Le visiteur peut le fermer ; il revient si le texte change.
 */
function Annonce({ hidden }) {
  const { annonce } = useReglages()
  const [ferme, setFerme] = useState(() => {
    try {
      return sessionStorage.getItem(FERME)
    } catch {
      return null
    }
  })
  if (!annonce.actif || !annonce.texte || ferme === annonce.texte || hidden) return null
  const fermer = () => {
    try {
      sessionStorage.setItem(FERME, annonce.texte)
    } catch {
      // ignore
    }
    setFerme(annonce.texte)
  }
  const externe = /^https?:/.test(annonce.lien)
  return (
    <div className="relative bg-brun text-lin">
      <div className="container-site flex min-h-9 items-center justify-center gap-3 py-2 pr-10 text-center text-[13px] leading-snug">
        <span aria-hidden="true" className="hidden size-1.5 shrink-0 rounded-full bg-poudre sm:block" />
        <p>
          {annonce.texte}
          {annonce.lien && (
            <>
              {' '}
              {externe ? (
                <a href={annonce.lien} target="_blank" rel="noreferrer" className="link-fil ml-1 text-poudre">
                  {annonce.libelle || 'En savoir plus'} ↗
                </a>
              ) : (
                <Link to={annonce.lien} className="link-fil ml-1 text-poudre">
                  {annonce.libelle || 'En savoir plus'} →
                </Link>
              )}
            </>
          )}
        </p>
        <button type="button" onClick={fermer} aria-label="Fermer l’annonce" className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-lin/70 transition-colors hover:bg-lin/10 hover:text-lin">
          ✕
        </button>
      </div>
    </div>
  )
}

/**
 * Navigation V3 (Figma « V3 Navigation »).
 * - variant="photo" : posée sur une photo, textes clairs, bouton « Clair ».
 * - variant="creme" : sur fond crème, textes bruns, bouton « Plein ».
 */
export default function Header({ variant = 'creme' }) {
  const { pathname } = useLocation()
  // Le menu mobile se ferme tout seul quand on change de page.
  const [openOn, setOpenOn] = useState(null)
  const open = openOn === pathname
  // Une fois qu'on a défilé, la barre prend un fond crème (elle reste collée en haut).
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const onPhoto = variant === 'photo' && !scrolled

  const close = useCallback(() => setOpenOn(null), [])

  const text = onPhoto || open ? 'text-lin' : 'text-brun'

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        open ? '' : scrolled ? 'bg-creme/92 shadow-[0_1px_0_rgba(61,42,35,0.08)] backdrop-blur-md' : ''
      }`}
    >
      <Annonce hidden={open} />
      <div
        className={`container-site flex items-center justify-between transition-[height] duration-300 ${
          scrolled ? 'h-[68px] xl:h-[76px]' : 'h-[84px] xl:h-24'
        }`}
      >
        <div className="flex items-center gap-3 sm:gap-5">
          <Link to="/" aria-label="Néotisse, retour à l’accueil" className="relative z-50">
            <Logo />
          </Link>
          <span aria-hidden="true" className={`h-6 w-px transition-colors ${onPhoto || open ? 'bg-lin/40' : 'bg-brun/20'}`} />
          <button
            type="button"
            data-cursor={open ? 'Fermer' : 'Menu'}
            className={`relative z-50 flex h-11 items-center gap-3 rounded-full px-2 transition-colors ${text}`}
            aria-expanded={open}
            aria-controls="menu-plein-ecran"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            <span className="hidden text-[14px] tracking-[0.06em] sm:inline">{open ? 'Fermer' : 'Menu'}</span>
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-all duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>

        <nav aria-label="Navigation principale" className={`hidden transition-opacity duration-300 lg:block ${open ? 'pointer-events-none opacity-0' : ''}`}>
          <ul className={`flex gap-7 text-[15px] leading-none tracking-[0.013em] xl:gap-10 ${text}`}>
            {mainNav
              .filter((item) => item.to !== '/')
              .map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `relative pb-1.5 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                        isActive ? (onPhoto ? 'text-lin' : 'text-terre-cuite') : ''
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button to="/contact" variant={onPhoto ? 'clair' : 'plein'} className={`hidden sm:inline-flex ${open ? 'invisible' : ''}`}>
            Contact
          </Button>
        </div>
      </div>

    </header>
    <FullscreenMenu open={open} onClose={close} />
    </>
  )
}
