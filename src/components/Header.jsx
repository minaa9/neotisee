import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { mainNav } from '../data/navigation'
import logo from '../assets/common/logo-neotisse.webp'

/**
 * En-tête du site (Figma « navbar »).
 * - variant="overlay" : posé sur la photo du hero de l'accueil, textes blancs.
 * - variant="solid"   : pages intérieures, textes foncés.
 */
export default function Header({ variant = 'solid' }) {
  const { pathname } = useLocation()
  // Le menu mobile est lié à la page où il a été ouvert : il se ferme
  // automatiquement quand on change de page.
  const [openOn, setOpenOn] = useState(null)
  const open = openOn === pathname
  const setOpen = (fn) => setOpenOn(fn(open) ? pathname : null)
  const overlay = variant === 'overlay'

  // Bloque le défilement de la page quand le menu mobile est ouvert.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const textColor = overlay ? 'text-white' : 'text-encre'

  return (
    <header
      className={`${
        overlay ? 'absolute inset-x-0 top-0' : 'relative'
      } z-40 h-[84px] bg-sable/18 xl:h-[102px]`}
    >
      <div className="mx-auto flex h-full max-w-site items-center justify-between px-5 md:px-[22px]">
        <Link to="/" className="shrink-0" aria-label="Néotisse, retour à l’accueil">
          <img
            src={logo}
            alt="Néotisse"
            width="56"
            height="50"
            className={`h-[44px] w-auto object-contain xl:h-[50px] ${overlay ? '' : 'invert-[.85]'}`}
          />
        </Link>

        {/* Navigation ordinateur */}
        <nav aria-label="Navigation principale" className="hidden xl:block">
          <ul className="flex items-start gap-8 min-[1400px]:gap-14">
            {mainNav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={`group flex flex-col gap-1.5 font-serif text-[15px] ${textColor}`}
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.label}</span>
                      <span
                        aria-hidden="true"
                        className={`h-[3px] w-full origin-left rounded-[2px] bg-terre transition-transform duration-300 ${
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden rounded-full bg-terre-fonce px-[18px] py-3 font-serif text-[15px] text-white transition-colors hover:bg-terre sm:inline-flex"
          >
            Nous contacter
          </Link>

          {/* Bouton menu mobile */}
          <button
            type="button"
            className={`flex size-11 items-center justify-center rounded-full xl:hidden ${textColor}`}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3.5 w-6">
              <span
                className={`absolute left-0 h-[1.5px] w-6 bg-current transition-all duration-300 ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-[1.5px] w-6 bg-current transition-opacity duration-300 ${
                  open ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-6 bg-current transition-all duration-300 ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        className={`fixed inset-x-0 top-[84px] bottom-0 z-40 overflow-y-auto bg-creme px-5 pt-8 pb-12 transition-[opacity,visibility] duration-300 xl:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav aria-label="Navigation mobile">
          <ul className="flex flex-col">
            {mainNav.map((item) => (
              <li key={item.to} className="border-b border-terre/15">
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `block py-4 font-serif text-[26px] ${isActive ? 'text-terre' : 'text-encre'}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            className="mt-8 inline-flex rounded-full bg-terre-fonce px-8 py-4 font-serif text-[17px] text-white"
          >
            Nous contacter
          </Link>
        </nav>
      </div>
    </header>
  )
}
