import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { MOTION_OK, ScrollTrigger, gsap } from './gsap'
import { Logo } from '../components/ui'

const NAMES = {
  '/': 'Accueil',
  '/association': 'L’association',
  '/equipe': 'L’équipe',
  '/ateliers': 'Nos ateliers',
  '/actualites': 'Actualités',
  '/calendrier': 'Calendrier',
  '/livre-d-or': 'Livre d’or',
  '/contact': 'Contact',
}

/**
 * Transition entre les pages : quand on clique sur un lien interne, un rideau
 * crème monte en ondulant, un fil le traverse et le nom de la page s'affiche ;
 * la nouvelle page est chargée derrière, puis le rideau repart vers le haut.
 */
export default function PageTransition() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const panelRef = useRef(null)
  const pathRef = useRef(null)
  const labelRef = useRef(null)
  const busy = useRef(false)
  const pending = useRef(false)

  // Sortie : on intercepte les clics sur les liens internes.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest('a[href]')
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname) return // ancre ou même page
      if (!window.matchMedia(MOTION_OK).matches) return
      e.preventDefault()
      if (busy.current) return
      busy.current = true
      if (labelRef.current) labelRef.current.textContent = NAMES[url.pathname] || ''
      gsap
        .timeline({
          onComplete: () => {
            pending.current = true
            navigate(url.pathname + url.search + url.hash)
          },
        })
        .set(panelRef.current, { yPercent: 100, autoAlpha: 1 })
        .to(panelRef.current, { yPercent: 0, duration: 0.7, ease: 'power3.inOut' })
        .fromTo(pathRef.current, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.6, ease: 'power2.inOut' }, 0.25)
        .fromTo(labelRef.current, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }, 0.35)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [navigate])

  // Entrée : la nouvelle page est affichée, le rideau repart.
  useEffect(() => {
    if (!pending.current) return
    pending.current = false
    window.scrollTo(0, 0)
    gsap
      .timeline({
        delay: 0.15,
        onComplete: () => {
          busy.current = false
          gsap.set(panelRef.current, { autoAlpha: 0 })
          ScrollTrigger.refresh()
        },
      })
      .to(labelRef.current, { yPercent: -100, autoAlpha: 0, duration: 0.4, ease: 'power3.in' })
      .to(pathRef.current, { drawSVG: '100% 100%', duration: 0.5, ease: 'power2.in' }, 0)
      .to(panelRef.current, { yPercent: -100, duration: 0.8, ease: 'power3.inOut' }, 0.2)
  }, [pathname])

  return (
    <div
      ref={panelRef}
      aria-hidden="true"
      className="invisible fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden bg-creme"
      style={{ borderRadius: '0 0 50% 50% / 0 0 6% 6%' }}
    >
      <Logo />
      <p className="mt-6 overflow-hidden">
        <span ref={labelRef} className="block font-serif text-[48px] leading-none font-light text-brun italic md:text-[72px]" />
      </p>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="absolute inset-x-0 top-[62%] h-24 w-full">
        <path
          ref={pathRef}
          d="M0 80 C 240 10, 480 110, 720 60 S 1200 10, 1440 70"
          fill="none"
          stroke="#B4583D"
          strokeWidth="1.5"
          strokeOpacity="0.7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}
