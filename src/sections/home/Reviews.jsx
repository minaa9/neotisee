import { useEffect, useRef, useState } from 'react'
import TestimonialCard from '../../components/TestimonialCard'
import { CenteredHeading } from '../../components/ui'
import { temoignages } from '../../data/temoignages'
import vague from '../../assets/v3/home/vague-avis.svg'
import pointActif from '../../assets/v3/ui/point-actif.svg'
import point from '../../assets/v3/ui/point.svg'

// Décalages verticaux des cartes (Figma : 340, 460, 360).
const offsets = ['lg:mt-0', 'lg:mt-[70px]', 'lg:mt-3']

/** 06 · Avis (Figma 368:458) */
export default function Reviews() {
  const listRef = useRef(null)
  const [active, setActive] = useState(0)

  // Sur mobile, les cartes défilent horizontalement : les points suivent la carte visible.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const onScroll = () => {
      const w = list.firstElementChild?.offsetWidth || 1
      setActive(Math.round(list.scrollLeft / w))
    }
    list.addEventListener('scroll', onScroll, { passive: true })
    return () => list.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (i) => {
    const list = listRef.current
    const card = list?.children[i]
    if (card) list.scrollTo({ left: card.offsetLeft - list.offsetLeft, behavior: 'smooth' })
  }

  return (
    <section className="relative bg-peche pt-24 pb-14 xl:pt-[120px] xl:pb-[70px]">
      <img src={vague} alt="" aria-hidden="true" className="absolute inset-x-0 top-[-1px] h-[50px] w-full md:h-[101px]" />
      <div className="container-site relative">
        <CenteredHeading
          title={
            <>
              Ils ont tissé <em>avec nous</em>
            </>
          }
          subtitle="Les mots de celles et ceux qui ont filé, tissé et teint à nos côtés."
        />

        <ul
          ref={listRef}
          className="-mx-5 mt-12 flex snap-x snap-mandatory gap-[30px] overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:items-start lg:overflow-visible lg:px-0 xl:mt-[40px]"
        >
          {temoignages.map((t, i) => (
            <li key={i} className={`w-[85%] shrink-0 snap-center sm:w-[380px] lg:w-auto ${offsets[i % 3]}`}>
              <TestimonialCard temoignage={t} className="min-h-[330px]" />
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center gap-[11px] xl:mt-10">
          {temoignages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Témoignage ${i + 1}`}
              aria-current={active === i}
              className="p-0.5 lg:pointer-events-none"
            >
              <img src={active === i ? pointActif : point} alt="" width="7" height="7" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
