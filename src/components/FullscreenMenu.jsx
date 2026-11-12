import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { contact, mainNav, socials } from '../data/navigation'
import { menuPhotos } from '../data/photos'
import { MOTION_OK, gsap, useGSAP } from '../motion/gsap'

/**
 * Menu plein écran : grands liens en serif numérotés à gauche, photographie
 * qui change (fondu + léger zoom) au survol de chaque lien à droite, fil
 * qui se dessine, coordonnées en bas.
 */
export default function FullscreenMenu({ open, onClose }) {
  const { pathname } = useLocation()
  const rootRef = useRef(null)
  const tlRef = useRef(null)
  const [hovered, setHovered] = useState(null)
  const [mounted, setMounted] = useState(false)

  useGSAP(
    () => {
      const reduce = !window.matchMedia(MOTION_OK).matches
      tlRef.current = gsap
        .timeline({ paused: true, defaults: { ease: 'power4.out' } })
        .set(rootRef.current, { autoAlpha: 1 })
        .fromTo(rootRef.current, { clipPath: 'circle(0% at 96% 4%)' }, { clipPath: 'circle(150% at 96% 4%)', duration: reduce ? 0 : 1, ease: 'power3.inOut' })
        .from('[data-menu-link]', { yPercent: 110, duration: reduce ? 0 : 0.9, stagger: 0.05 }, reduce ? 0 : 0.35)
        .from('[data-menu-thread]', { drawSVG: 0, duration: reduce ? 0 : 1.4, ease: 'power2.inOut' }, 0.4)
        .from('[data-menu-foot]', { autoAlpha: 0, y: 20, duration: reduce ? 0 : 0.6, stagger: 0.08 }, reduce ? 0 : 0.6)
      setMounted(true)
    },
    { scope: rootRef },
  )

  useEffect(() => {
    if (!mounted) return
    const tl = tlRef.current
    if (open) tl.timeScale(1).play()
    else tl.timeScale(1.8).reverse()
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && onClose()
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, mounted, onClose])

  const shown = menuPhotos[hovered] || menuPhotos['/']

  return (
    <div
      ref={rootRef}
      id="menu-plein-ecran"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      className="invisible fixed inset-0 z-40 overflow-y-auto bg-brun text-lin"
    >
      <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full">
        <path data-menu-thread d="M-20 760 C 300 620, 520 860, 820 700 S 1260 520, 1460 640" fill="none" stroke="#B4583D" strokeOpacity="0.55" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="container-site relative grid min-h-full gap-10 pt-28 pb-10 lg:grid-cols-[1fr_420px] lg:items-center xl:grid-cols-[1fr_480px]">
        <nav aria-label="Menu principal">
          <ol>
            {mainNav.concat([{ to: '/contact', label: 'Contact' }]).map((item, i) => (
              <li key={item.to} className="overflow-hidden">
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  // Vers une autre page : le menu se ferme derrière la transition.
                  onClick={() => item.to === pathname && onClose()}
                  onMouseEnter={() => setHovered(item.to)}
                  onFocus={() => setHovered(item.to)}
                  data-cursor="Ouvrir"
                  data-menu-link
                  className={({ isActive }) =>
                    `group flex items-baseline gap-5 py-1 font-serif text-[40px] leading-[1.1] font-light transition-colors sm:text-[56px] xl:text-[68px] ${
                      isActive ? 'text-poudre italic' : 'text-lin hover:text-poudre'
                    }`
                  }
                >
                  <span className="text-label text-poudre/60">{String(i + 1).padStart(2, '0')}</span>
                  <span className="relative">
                    {item.label}
                    <span aria-hidden="true" className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-poudre transition-transform duration-500 group-hover:scale-x-100" />
                  </span>
                </NavLink>
              </li>
            ))}
          </ol>
        </nav>

        {/* Photo qui suit le survol */}
        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-t-[240px] rounded-b-[28px] lg:block">
          {Object.entries(menuPhotos).map(([to, p]) => (
            <img
              key={to}
              src={p.src}
              alt=""
              loading="lazy"
              className={`absolute inset-0 size-full object-cover transition-[opacity,transform] duration-700 ease-out ${
                p === shown ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3 text-petit text-lin/70 sm:flex-row sm:gap-10 lg:col-span-2">
          <a data-menu-foot href={`mailto:${contact.email}`} className="hover:text-lin">
            {contact.email}
          </a>
          <a data-menu-foot href={contact.phoneHref} className="hover:text-lin">
            {contact.phone}
          </a>
          <span data-menu-foot>{contact.city}</span>
          {socials.map((s) => (
            <a data-menu-foot key={s.label} href={s.href} target="_blank" rel="noreferrer" className="hover:text-lin">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
