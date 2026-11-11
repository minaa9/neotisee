import { useRef } from 'react'
import { Reveal } from './ui'
import { MOTION_OK, gsap, useGSAP } from '../motion/gsap'
import { horizontalLoop } from '../motion/horizontalLoop'
import vaguePeche from '../assets/v3/home/vague-peche.svg'
import gergovie from '../assets/v3/partners/gergovie.webp'
import tautavel from '../assets/v3/partners/tautavel.webp'
import festivalLin from '../assets/v3/partners/festival-lin.webp'
import lozere from '../assets/v3/partners/lozere.webp'
import cerac from '../assets/v3/partners/cerac.webp'

const partners = [
  { name: 'Musée de Gergovie', logo: gergovie },
  { name: 'Musée de Préhistoire de Tautavel', logo: tautavel },
  { name: 'Festival du lin et de la fibre artistique', logo: festivalLin },
  { name: 'Lozère Tourisme', logo: lozere },
  { name: 'CERAC', logo: cerac },
]

/**
 * Bandeau « Ils nous font confiance » (Figma 347:80).
 * Les logos sont suspendus à un fil qui défile lentement, comme une
 * guirlande d'étiquettes. Le fil se creuse sous le curseur et rebondit
 * quand on le lâche ; les étiquettes se balancent avec le mouvement.
 */
export default function PartnersBand() {
  const rowRef = useRef(null)
  const pathRef = useRef(null)
  // Deux fois la liste, pour une boucle sans trou.
  const garland = [...partners, ...partners]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const row = rowRef.current
        const path = pathRef.current
        const tags = row.querySelectorAll('[data-tag]')
        const loop = horizontalLoop(tags, { repeat: -1, speed: 0.4, paddingRight: 24 })

        // Le fil : courbe dont le point de contrôle suit le curseur.
        const ctrl = { x: 50, y: 6 }
        const draw = () => path.setAttribute('d', `M0 6 Q ${ctrl.x} ${ctrl.y} 100 6`)
        draw()
        const toX = gsap.quickTo(ctrl, 'x', { duration: 0.6, ease: 'power3.out', onUpdate: draw })
        const toY = gsap.quickTo(ctrl, 'y', { duration: 0.6, ease: 'power3.out', onUpdate: draw })

        let lastX = 0
        const onMove = (e) => {
          const r = row.getBoundingClientRect()
          toX(((e.clientX - r.left) / r.width) * 100)
          toY(6 + Math.min(14, Math.max(0, (e.clientY - r.top) / 6)))
          const v = gsap.utils.clamp(-8, 8, (e.clientX - lastX) / 4)
          lastX = e.clientX
          gsap.to(tags, { rotation: v, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
          loop.timeScale(0.25)
        }
        const onLeave = () => {
          gsap.to(ctrl, { y: 6, duration: 1.6, ease: 'elastic.out(1.2, 0.25)', onUpdate: draw, overwrite: true })
          gsap.to(tags, { rotation: 0, duration: 1.4, ease: 'elastic.out(1, 0.3)', overwrite: 'auto' })
          gsap.to(loop, { timeScale: 1, duration: 0.8 })
        }
        row.addEventListener('mousemove', onMove)
        row.addEventListener('mouseleave', onLeave)
        return () => {
          row.removeEventListener('mousemove', onMove)
          row.removeEventListener('mouseleave', onLeave)
          loop.cleanup()
          loop.kill()
        }
      })
      return () => mm.revert()
    },
    { scope: rowRef },
  )

  return (    <section aria-labelledby="partenaires-titre" className="relative bg-creme pt-20 pb-12 xl:pt-[80px] xl:pb-[36px]">
      <img
        src={vaguePeche}
        alt=""
        aria-hidden="true"
        className="absolute inset-x-0 top-3 bottom-0 h-[calc(100%-12px)] w-full"
      />
      <div className="container-site relative">
        <Reveal className="flex flex-col items-center text-center">
          <h2 id="partenaires-titre" className="font-serif text-[36px] leading-[1.08] text-brun md:text-[44px]">
            Ils nous font confiance
          </h2>
          <p className="mt-4 text-chapo text-brun-doux">
            Musées, festivals et acteurs du territoire soutiennent nos projets de médiation.
          </p>
        </Reveal>
        <div ref={rowRef} className="relative -mx-5 mt-8 overflow-hidden pt-1 pb-6 md:-mx-12 xl:mt-[30px] xl:-mx-[120px]">
          {/* Le fil */}
          <svg aria-hidden="true" viewBox="0 0 100 24" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 h-6 w-full overflow-visible">
            <path ref={pathRef} d="M0 6 Q 50 6 100 6" fill="none" stroke="#B4583D" strokeOpacity="0.55" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          </svg>
          <ul className="flex gap-6 pl-6">
            {garland.map((p, i) => (
              <li key={i} data-tag aria-hidden={i >= partners.length} className="flex shrink-0 origin-top flex-col items-center">
                {/* attache */}
                <span aria-hidden="true" className="h-5 w-px bg-terre-cuite/50" />
                <span aria-hidden="true" className="-mt-0.5 size-2 rounded-full border border-terre-cuite/60 bg-lin" />
                <span className="flex h-[84px] w-[170px] items-center justify-center rounded-[24px] bg-lin px-6 py-3 transition-transform duration-300 hover:-translate-y-1 sm:h-[100px] sm:w-[200px]">
                  <img src={p.logo} alt={i < partners.length ? p.name : ''} loading="lazy" className="h-[56px] w-[120px] object-contain sm:h-[64px]" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
