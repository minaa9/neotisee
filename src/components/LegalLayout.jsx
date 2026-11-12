import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Eyebrow } from './ui'
import ThreadDivider from './ThreadDivider'
import { MOTION_OK, gsap, useGSAP } from '../motion/gsap'

/** Information que l'association doit encore fournir : bien visible pour ne pas l'oublier. */
export function ACompleter({ children }) {
  return (
    <span className="rounded-md border border-dashed border-terre-cuite/60 bg-lin px-1.5 py-0.5 text-[0.92em] text-terre-cuite">
      À compléter : {children}
    </span>
  )
}

/** Paragraphe de page légale. */
export const P = ({ children }) => <p className="mt-4 text-courant text-brun-doux">{children}</p>

/** Liste à puces « nœud de fil ». */
export function Liste({ items }) {
  return (
    <ul className="mt-4 flex flex-col gap-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 text-courant text-brun-doux">
          <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-terre-cuite" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

const others = [
  { to: '/mentions-legales', label: 'Mentions légales' },
  { to: '/confidentialite', label: 'Confidentialité' },
  { to: '/cookies', label: 'Gestion des cookies' },
]

/**
 * Gabarit des pages légales : grand titre, sommaire collé à gauche qui suit
 * la lecture (un fil se remplit), sections numérotées à droite.
 * sections = [{ id, titre, contenu }]
 */
export default function LegalLayout({ title, intro, maj, sections, current }) {
  const ref = useRef(null)
  const [active, setActive] = useState(sections[0].id)

  // Section en cours de lecture.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -60% 0px' },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [sections])

  // Le fil du sommaire se remplit pendant la lecture ; les numéros glissent.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          '[data-legal-fil]',
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-legal-body]', start: 'top 40%', end: 'bottom 60%', scrub: true } },
        )
        gsap.utils.toArray('[data-legal-num]').forEach((n) =>
          gsap.from(n, { xPercent: -60, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: n, start: 'top 85%' } }),
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="bg-creme">
      <header className="container-site pt-36 pb-6 xl:pt-44">
        <Eyebrow>Informations</Eyebrow>
        <h1 className="mt-5 font-serif text-[52px] leading-[1.02] font-light tracking-[-0.01em] text-brun md:text-[80px]">{title}</h1>
        <p className="mt-6 max-w-[620px] text-chapo text-brun-doux">{intro}</p>
        <p className="mt-4 text-label text-brique">Dernière mise à jour : {maj}</p>
      </header>

      <ThreadDivider />

      <div className="container-site grid gap-12 pt-6 pb-24 lg:grid-cols-[260px_1fr] lg:gap-20 xl:pb-[120px]">
        {/* Sommaire */}
        <nav aria-label="Sommaire" className="lg:sticky lg:top-[110px] lg:self-start">
          <p className="text-label text-brique">Sommaire</p>
          <div className="relative mt-5 pl-5">
            <span aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px bg-brun/15" />
            <span data-legal-fil aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px origin-top bg-terre-cuite" />
            <ol className="flex flex-col gap-3">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`block text-[14px] leading-snug transition-[color,transform] duration-300 hover:translate-x-1 ${
                      active === s.id ? 'translate-x-1 text-terre-cuite' : 'text-brun-doux hover:text-brun'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')} · {s.titre}
                  </a>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-10 text-label text-brique">Voir aussi</p>
          <ul className="mt-4 flex flex-col gap-2">
            {others
              .filter((o) => o.to !== current)
              .map((o) => (
                <li key={o.to}>
                  <Link to={o.to} className="link-fil text-[14px] text-brun">
                    {o.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        {/* Contenu */}
        <div data-legal-body className="flex min-w-0 max-w-[760px] flex-col gap-14">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="scroll-mt-28">
              <div className="flex items-baseline gap-4">
                <span data-legal-num aria-hidden="true" className="font-serif text-[22px] text-terre-cuite italic">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 id={`${s.id}-t`} className="font-serif text-[32px] leading-[1.1] text-brun md:text-[40px]">
                  {s.titre}
                </h2>
              </div>
              {s.contenu}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
