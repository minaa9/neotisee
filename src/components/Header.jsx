import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { mainNav } from '../data/navigation'
import { Button, Logo } from './ui'

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
  const onPhoto = variant === 'photo'

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const text = onPhoto && !open ? 'text-lin' : 'text-brun'

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="container-site flex h-[84px] items-center justify-between xl:h-24">
        <Link to="/" aria-label="Néotisse, retour à l’accueil" className="relative z-50">
          <Logo />
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
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
          <Button to="/contact" variant={onPhoto ? 'clair' : 'plein'} className="hidden sm:inline-flex">
            Contact
          </Button>
          <button
            type="button"
            className={`relative z-50 flex size-11 items-center justify-center lg:hidden ${text}`}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            <span className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-current transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-px w-6 bg-current transition-all duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        className={`fixed inset-0 z-40 overflow-y-auto bg-creme px-5 pt-28 pb-12 transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <nav aria-label="Navigation mobile">
          <ul>
            {mainNav.map((item) => (
              <li key={item.to} className="border-b border-brun/10">
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `block py-4 font-serif text-[30px] leading-tight ${isActive ? 'text-terre-cuite italic' : 'text-brun'}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Button to="/contact" variant="plein" className="mt-8">
            Contact
          </Button>
        </nav>
      </div>
    </header>
  )
}
