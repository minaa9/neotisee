import { useRef } from 'react'
import { Link } from 'react-router'
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '../motion/gsap'
import { contact, footerNav, socials } from '../data/navigation'
import { Logo } from './ui'
import planteGravee from '../assets/v3/ui/plante-gravee.webp'
import instagram from '../assets/v3/ui/instagram.svg'
import facebook from '../assets/v3/ui/facebook.svg'

const socialIcons = { Instagram: instagram, Facebook: facebook }

// Bord supérieur du pied de page : une vague dont le creux dépend de `b`.
const wave = (b) => `M0 ${50 + b * 0.25} C 360 ${-12 + b} 1000 ${96 + b} 1440 ${18 + b * 0.25} V 140 H 0 Z`

/**
 * Pied de page V3, commun à toutes les pages (Figma « V3 Pied de page »).
 * Son bord en vague rebondit selon la vitesse à laquelle on arrive en bas.
 */
export default function Footer({ afterPeach = false }) {
  const footerRef = useRef(null)
  const pathRef = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const state = { b: 0 }
        const draw = () => pathRef.current?.setAttribute('d', wave(state.b))
        let bounce
        const st = ScrollTrigger.create({
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const target = gsap.utils.clamp(-70, 70, self.getVelocity() / 35)
            if (Math.abs(target) < Math.abs(state.b) * 0.6) return
            bounce && bounce.kill()
            bounce = gsap
              .timeline({ onUpdate: draw })
              .to(state, { b: target, duration: 0.18, ease: 'power2.out' })
              .to(state, { b: 0, duration: 1.6, ease: 'elastic.out(1.1, 0.25)' })
          },
        })
        return () => {
          st.kill()
          bounce && bounce.kill()
        }
      })
      return () => mm.revert()
    },
    { scope: footerRef },
  )

  const titleCls = 'text-label text-brique'
  const linkCls = 'text-[14px] leading-[2] text-brun transition-colors hover:text-terre-cuite'

  return (
    <footer ref={footerRef} className={`relative overflow-hidden ${afterPeach ? 'bg-peche' : 'bg-creme'}`}>
      {/* Fond pêche avec un bord en vague (après une section pêche, le fond continue sans vague). */}
      <div aria-hidden="true" className="absolute inset-x-0 top-[60px] bottom-0 bg-peche md:top-[120px]" />
      <svg
        hidden={afterPeach}
        aria-hidden="true"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-[70px] w-full overflow-visible md:h-[140px]"
      >
        <path ref={pathRef} d={wave(0)} fill="#F1DDCF" />
      </svg>
      <img
        src={planteGravee}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[120px] right-[15px] hidden h-[240px] w-[124px] object-contain opacity-70 xl:block"
      />

      <div className="container-site relative pt-24 pb-8 xl:pt-[115px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-[460px]">
            <Logo />
            <p className="mt-4 font-serif text-[42px] leading-[1.15] font-light text-brun italic md:text-[52px]">
              Ne perdez pas le fil !
            </p>
            <p className="mt-3 max-w-[380px] text-petit text-brun-doux">
              Association de médiation scientifique autour des savoir-faire textiles anciens, fondée
              en 2024 à Montpellier.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-[200px_200px_auto] sm:gap-0 lg:mr-[80px] lg:pt-2.5">
            {footerNav.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className={titleCls}>{col.title}</p>
                <ul className="mt-4">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className={linkCls}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div className="col-span-2 sm:col-span-1">
              <p className={titleCls}>Nous écrire</p>
              <ul className="mt-4">
                <li>
                  <a href={`mailto:${contact.email}`} className={linkCls}>
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a href={contact.phoneHref} className={linkCls}>
                    {contact.phone}
                  </a>
                </li>
                <li className="text-[14px] leading-[2]">{contact.city}</li>
              </ul>
              <ul className="mt-5 flex flex-wrap gap-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-full border border-brique/45 py-2 pr-4 pl-3 text-[14px] text-brun transition-colors hover:bg-lin"
                    >
                      <img src={socialIcons[s.label]} alt="" width="18" height="18" />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-brun/15 pt-5 text-petit text-brun-doux sm:flex-row sm:justify-between xl:mt-[44px]">
          <p>© {new Date().getFullYear()} Néotisse — association loi 1901</p>
          <p>
            <Link to="/mentions-legales" className="hover:text-brun">
              Mentions légales
            </Link>
            {'  ·  '}
            <Link to="/confidentialite" className="hover:text-brun">
              Confidentialité
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
