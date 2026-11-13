import { useRef } from 'react'
import { Link } from 'react-router'
import { MOTION_OK, gsap, useGSAP } from '../../motion/gsap'
import { CenteredHeading, Reveal } from '../../components/ui'
import { usePublic } from '../../lib/usePublic'
import vague from '../../assets/v3/home/vague-ateliers.svg'

/**
 * Effet « dock macOS » : sur ordinateur, les arches grossissent selon la
 * distance au curseur (la plus proche le plus), puis reviennent en place.
 */
function useDock(listRef, deps) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`${MOTION_OK} and (hover: hover) and (min-width: 1024px)`, () => {
        const list = listRef.current
        const items = [...list.querySelectorAll('[data-dock]')]
        const setters = items.map((el) => gsap.quickTo(el, 'scale', { duration: 0.45, ease: 'power3.out' }))
        const lifts = items.map((el) => gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' }))
        const RANGE = 360
        const onMove = (e) => {
          items.forEach((el, i) => {
            const r = el.getBoundingClientRect()
            const d = Math.abs(e.clientX - (r.left + r.width / 2))
            const f = Math.max(0, 1 - d / RANGE)
            const k = Math.sin((f * Math.PI) / 2) // courbe douce
            setters[i](1 + 0.18 * k)
            lifts[i](-26 * k)
          })
        }
        const onLeave = () => items.forEach((_, i) => (setters[i](1), lifts[i](0)))
        list.addEventListener('mousemove', onMove)
        list.addEventListener('mouseleave', onLeave)
        return () => {
          list.removeEventListener('mousemove', onMove)
          list.removeEventListener('mouseleave', onLeave)
        }
      })
      return () => mm.revert()
    },
    { scope: listRef, dependencies: deps, revertOnUpdate: true },
  )
}

/** 05 · Nos ateliers (Figma 348:71) */
export default function Workshops() {
  const listRef = useRef(null)
  const ateliers = usePublic('ateliers')
  useDock(listRef, [ateliers])
  return (
    <section className="relative bg-creme pt-24 pb-16 xl:pt-[160px] xl:pb-[90px]">
      <img src={vague} alt="" aria-hidden="true" className="absolute inset-x-0 top-[-1px] h-[70px] w-full md:h-[141px]" />
      <div className="container-site relative">
        <CenteredHeading
          title={
            <>
              Apprendre, <em>expérimenter,</em> transmettre
            </>
          }
          subtitle="Des ateliers pour toucher l’histoire du bout des doigts, guidé·es par des passionnées d’archéologie."
        />

        <ul ref={listRef} className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-10 lg:grid-cols-4 xl:mt-[50px]">
          {ateliers.map((a, i) => (
            <Reveal as="li" key={a.id} delay={i * 100} className={i % 2 === 1 ? 'mt-8 lg:mt-[36px]' : ''}>
              <Link to={`/ateliers#${a.id}`} data-dock className="group block origin-bottom will-change-transform">
                <div className="overflow-hidden rounded-t-[135px] rounded-b-[20px]">
                  <img
                    src={a.image}
                    alt=""
                    loading="lazy"
                    className="aspect-[270/320] w-full object-cover "
                  />
                </div>
                <p className="mt-4 text-label text-brique sm:mt-[22px]">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-1 font-serif text-[22px] leading-[1.18] sm:text-[28px] text-brun transition-colors group-hover:text-terre-cuite">
                  {a.titre}
                </h3>
                <p className="mt-1 font-serif text-[16px] leading-[1.15] sm:text-[19px] font-light text-brun-doux italic">{a.accroche}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
