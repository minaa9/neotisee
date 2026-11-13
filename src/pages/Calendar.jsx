import { useMemo, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { ScrollTrigger, useGSAP } from '../motion/gsap'
import { usePublic } from '../lib/usePublic'
import { Button, CenteredHeading, Reveal } from '../components/ui'
import {
  JOURS,
  MOIS,
  MOIS_COURT,
  capitalize,
  categories,
  horaires,
  icsFor,
  toDate,
  todayIso,
} from '../data/events'
import heroImage from '../assets/ateliers/hero.webp'
import flecheGauche from '../assets/v3/calendrier/fleche-gauche.svg'
import flecheDroite from '../assets/v3/calendrier/fleche-droite.svg'
import noeud from '../assets/v3/calendrier/noeud.svg'
import flecheContour from '../assets/v3/ui/fleche-contour.svg'

const LETTRES = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
const pad = (n) => String(n).padStart(2, '0')

/* ------------------------------------------------------------------ */
/* Filtres (au-dessus du calendrier)                                   */
/* ------------------------------------------------------------------ */
function Filters({ value, onChange }) {
  const options = [['tous', 'Tous'], ...Object.entries(categories).map(([k, c]) => [k, c.label])]
  return (
    <div role="group" aria-label="Filtrer les rendez-vous" className="flex flex-wrap justify-center gap-2.5">
      {options.map(([key, label]) => {
        const active = value === key
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(key)}
            className={`flex items-center gap-2 rounded-full border px-[18px] py-2.5 text-petit transition-colors ${
              active ? 'border-brun bg-brun text-lin' : 'border-brun/15 bg-lin text-brun hover:border-brun/40'
            }`}
          >
            {key !== 'tous' && <img src={categories[key].dot} alt="" width="8" height="8" />}
            {label}
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Le métier du mois (à droite, reste visible au défilement).          */
/* Chaque fil horizontal est un jour, chaque navette un rendez-vous.   */
/* ------------------------------------------------------------------ */
function Loom({ list, view, onMove, highlight }) {
  const today = todayIso()
  const [hover, setHover] = useState(null)
  const drag = useRef(null)

  const days = new Date(view.y, view.m + 1, 0).getDate()
  const prefix = `${view.y}-${pad(view.m + 1)}-`
  const byDay = {}
  const monthEvents = list.filter((e) => e.date.startsWith(prefix))
  monthEvents.forEach((e) => {
    ;(byDay[Number(e.date.slice(8))] ??= []).push(e)
  })

  // « Glissez le métier pour changer de mois »
  const onPointerDown = (e) => {
    drag.current = e.clientX
  }
  const onPointerUp = (e) => {
    if (drag.current == null) return
    const dx = e.clientX - drag.current
    drag.current = null
    if (Math.abs(dx) > 80) onMove(dx < 0 ? 1 : -1)
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className="touch-pan-y rounded-[32px] border border-brun/8 bg-lin px-5 pt-5 pb-6 select-none sm:px-7"
    >
      {/* Navigation du mois */}
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => onMove(-1)} aria-label="Mois précédent" className="flex size-10 shrink-0 items-center justify-center rounded-full border border-brun/40 transition-colors hover:bg-brun/5">
          <img src={flecheGauche} alt="" width="16" height="16" />
        </button>
        <h3 aria-live="polite" className="font-serif text-[26px] leading-[1.18] text-brun">
          {capitalize(MOIS[view.m])} {view.y}
        </h3>
        <button type="button" onClick={() => onMove(1)} aria-label="Mois suivant" className="flex size-10 shrink-0 items-center justify-center rounded-full border border-brun/40 transition-colors hover:bg-brun/5">
          <img src={flecheDroite} alt="" width="16" height="16" />
        </button>
      </div>

      {/* Légende */}
      <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[13px] text-brun-doux">
        {Object.entries(categories).map(([k, c]) => (
          <li key={k} className="flex items-center gap-1.5">
            <img src={c.dot} alt="" width="8" height="8" className="size-2" />
            {c.label}
          </li>
        ))}
      </ul>

      {/* Fils des jours : les jours sans rendez-vous sont resserrés, ceux qui en
          ont s'élargissent et sont soulignés, pour voir d'un coup d'œil la date. */}
      <ol className="mt-4">
        {Array.from({ length: days }, (_, i) => {
          const d = i + 1
          const iso = prefix + pad(d)
          const wd = new Date(view.y, view.m, d).getDay()
          const isToday = iso === today
          const weekend = wd === 0 || wd === 6
          const evs = byDay[d] || []
          const has = evs.length > 0
          return (
            <li
              key={d}
              className={`relative flex items-center gap-2 transition-[height] duration-500 ${has ? 'my-1 py-1' : 'h-[14px]'}`}
              style={has ? { minHeight: `${evs.length * 26 + 8}px` } : undefined}
            >
              {/* Bande qui met la date en valeur */}
              {has && <span aria-hidden="true" className="absolute inset-y-0 -right-2 -left-2 rounded-[14px] bg-terre-cuite/[0.07]" />}
              <span className={`relative w-3 text-center text-[11px] ${has ? 'text-brique' : 'text-brun-doux/70'}`}>{LETTRES[wd]}</span>
              <span
                title={isToday ? 'Aujourd’hui' : undefined}
                className={`relative flex h-[18px] w-6 shrink-0 items-center justify-center rounded-full text-[12px] tabular-nums ${
                  isToday ? 'bg-terre-cuite font-medium text-lin' : has ? 'font-medium text-brun' : 'text-brun/80'
                }`}
              >
                {d}
                {isToday && <span className="sr-only"> (aujourd’hui)</span>}
              </span>

              {has ? (
                /* Navettes du jour, l'une sous l'autre, accrochées à la date */
                <div className="relative flex min-w-0 flex-1 items-center gap-2">
                  <span aria-hidden="true" className="h-px w-4 shrink-0 bg-terre-cuite/50" />
                  <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
                    {evs.map((e) => {
                      const cat = categories[e.categorie]
                      const past = e.date < today
                      const open = hover === e.id || highlight === e.id
                      return (
                        <div key={e.id} className={`relative flex max-w-full ${open ? 'z-30' : 'z-10'}`} onMouseEnter={() => setHover(e.id)} onMouseLeave={() => setHover(null)}>
                          <a
                            href={`#rdv-${e.id}`}
                            onFocus={() => setHover(e.id)}
                            onBlur={() => setHover(null)}
                            className={`relative flex h-[22px] max-w-full origin-left items-center rounded-full pr-3 pl-6 text-[12.5px] whitespace-nowrap transition-[transform,box-shadow] duration-300 hover:scale-[1.04] ${cat.bg} ${cat.text} ${past ? 'opacity-50' : ''} ${open ? 'scale-[1.06] shadow-[0_0_0_4px_rgba(180,88,61,0.18)]' : ''}`}
                          >
                            <img src={noeud} alt="" aria-hidden="true" className="absolute top-1/2 left-[5px] size-3 -translate-y-1/2" />
                            <span className="truncate">{e.court}</span>
                            <span className="ml-2 shrink-0 opacity-75">{e.debut?.replace(':', 'h')}</span>
                            <span className="sr-only">
                              {' '}
                              — {e.titre}, le {d} {MOIS[view.m]}
                            </span>
                          </a>
                          {/* Infobulle */}
                          <div
                            role="tooltip"
                            className={`pointer-events-none absolute bottom-[calc(100%+8px)] left-0 z-20 w-[240px] rounded-[18px] border border-brun/12 bg-creme p-4 shadow-[0_12px_30px_rgba(61,42,35,0.12)] transition-all duration-200 ${
                              open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0'
                            }`}
                          >
                            <p className="text-label text-brique">
                              {JOURS[wd]} {d} {MOIS[view.m]}
                            </p>
                            <p className="mt-1 font-serif text-[19px] leading-[1.18] text-brun">{e.titre}</p>
                            <p className="mt-1 text-petit text-brun-doux">
                              {horaires(e)} · {e.lieu}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <span aria-hidden="true" className={`ml-1 h-px flex-1 ${isToday ? 'h-0.5 bg-terre-cuite' : weekend ? 'bg-brun/22' : 'bg-brun/12'}`} />
              )}
            </li>
          )
        })}
      </ol>

      <p className="mt-4 text-center text-[13px] text-brun-doux">Survolez une navette · glissez pour changer de mois</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Tous les rendez-vous, regroupés par mois (à gauche)                 */
/* ------------------------------------------------------------------ */
function AllEvents({ list, onHover }) {
  const today = todayIso()
  const groups = useMemo(() => {
    const map = new Map()
    list.forEach((e) => {
      const d = toDate(e.date)
      const key = `${capitalize(MOIS[d.getMonth()])} ${d.getFullYear()}`
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(e)
    })
    return [...map.entries()]
  }, [list])

  return (
    <div>
      <h2 className="font-serif text-[36px] leading-[1.08] tracking-[-0.005em] text-brun md:text-[44px]">Tous les rendez-vous</h2>

      {groups.length === 0 && <p className="mt-8 text-chapo text-brun-doux">Aucun rendez-vous pour ce filtre.</p>}

      <div className="relative mt-8">
        {/* Fil du temps */}
        {groups.length > 0 && <span aria-hidden="true" className="absolute top-2.5 bottom-0 left-[5px] w-px bg-terre-cuite/45" />}
        {groups.map(([month, items]) => (
          <div key={month} className="relative mb-6">
            <p className="pl-8 font-serif text-[24px] leading-[1.15] font-light text-terre-cuite italic">{month}</p>
            <ul data-stagger>
              {items.map((e) => {
                const d = toDate(e.date)
                const past = e.date < today
                const cat = categories[e.categorie]
                return (
                  <li
                    key={e.id}
                    id={`rdv-${e.id}`}
                    onMouseEnter={() => onHover(e.id)}
                    onMouseLeave={() => onHover(null)}
                    className={`group/rdv relative scroll-mt-28 transition-transform duration-500 hover:translate-x-2 ${past ? 'opacity-50' : ''}`}
                  >
                    <img src={cat.dot} alt="" aria-hidden="true" className="absolute top-[42px] left-0 size-[11px]" />
                    <article className="ml-8 grid grid-cols-[64px_1fr_auto] items-start gap-x-4 border-b border-brun/10 py-4">
                      <p className="font-serif leading-[1.08] text-brun">
                        <span className="block text-[44px] tracking-[-0.005em]">{pad(d.getDate())}</span>
                        <span className="ml-1 block text-[18px] leading-[1.15] font-light text-brun-doux italic">{MOIS_COURT[d.getMonth()]}</span>
                      </p>
                      <div className="pt-2.5">
                        <p className="text-label text-brique">
                          {cat.label}
                          {past && ' · passé'}
                        </p>
                        <h3 className="mt-1 font-serif text-[24px] leading-[1.18] text-brun md:text-[26px]">{e.titre}</h3>
                        <p className="mt-1 text-petit text-brun-doux">
                          {capitalize(JOURS[d.getDay()])} · {horaires(e)} · {e.lieu}
                        </p>
                      </div>
                      {!past && (
                        <a
                          href={`/contact?objet=inscription&rdv=${e.id}`}
                          aria-label={`S’inscrire : ${e.titre}`}
                          className="group mt-5 hidden size-11 items-center justify-center rounded-full border border-brun/40 transition-colors hover:bg-brun sm:flex"
                        >
                          <img src={flecheContour} alt="" width="16" height="16" className="transition-transform group-hover:translate-x-1 group-hover:invert" />
                        </a>
                      )}
                    </article>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Page Calendrier V3 (Figma 353:269) */
export default function CalendarPage() {
  const [filter, setFilter] = useState('tous')
  // Survol d'un rendez-vous dans la liste : sa navette s'allume dans le métier.
  const [highlight, setHighlight] = useState(null)
  const events = usePublic('evenements')
  const sorted = useMemo(() => [...events].sort((a, b) => a.date.localeCompare(b.date)), [events])
  const list = sorted.filter((e) => filter === 'tous' || e.categorie === filter)
  const today = todayIso()
  const next = sorted.find((e) => e.date >= today)

  const now = toDate(today)
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() })

  // Sur ordinateur, le calendrier reste fixé à l'écran pendant qu'on parcourt
  // la liste, et s'arrête au début du pied de page.
  const loomRef = useRef(null)
  useGSAP(
    () => {
      const mm = window.matchMedia('(min-width: 1024px)')
      if (!mm.matches) return
      const loom = loomRef.current
      const footer = document.querySelector('footer')
      const top = () => Math.min(96, window.innerHeight - loom.offsetHeight - 24)
      const st = ScrollTrigger.create({
        trigger: loom,
        start: () => `top ${top()}px`,
        // Il s'arrête pile là où commence le pied de page.
        endTrigger: footer,
        end: () => `top ${top() + loom.offsetHeight + 32}px`,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
      })
      return () => st.kill()
    },
    { dependencies: [filter, view, events], revertOnUpdate: true },
  )

  const move = (delta) =>
    setView(({ y, m }) => {
      const d = new Date(y, m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })

  const downloadIcs = () => {
    const blob = new Blob([icsFor(next)], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `neotisse-${next.id}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <PageHeader
        photoId="calendrier"
        title="Calendrier"
        subtitle={
          <>
            Nos prochains
            <br />
            rendez-vous
          </>
        }
        text="Ateliers, événements, conférences… choisissez votre fil et venez tisser avec nous."
        image={heroImage}
        imageAlt="Tissage d’une bande à chevrons sur un métier"
      >
        {next && (
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-4">
            <Button to={`/contact?objet=inscription&rdv=${next.id}`} variant="plein" aria-label={`Je m’inscris : ${next.titre}`}>
              Je m’inscris
            </Button>
            <Button onClick={downloadIcs} aria-label={`Ajouter à mon agenda : ${next.titre}`}>
              Ajouter à mon agenda
            </Button>
          </div>
        )}
      </PageHeader>

      <section aria-label="Agenda" className="bg-creme pt-4 pb-16 xl:pb-[80px]">
        <div className="container-site">
          <CenteredHeading
            title={
              <>
                {capitalize(MOIS[view.m])}, <em>sur le métier</em>
              </>
            }
            subtitle="Chaque fil est un jour, chaque navette un rendez-vous."
          />
          <Reveal className="mt-6">
            <Filters value={filter} onChange={setFilter} />
          </Reveal>

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_440px] lg:gap-12 xl:grid-cols-[1fr_480px]">
            {/* À gauche : la liste */}
            <div className="order-2 lg:order-1">
              <AllEvents list={list} onHover={setHighlight} />
            </div>
            {/* À droite : le calendrier, fixé à l'écran jusqu'au début du pied de page */}
            <div ref={loomRef} className="relative z-30 order-1 lg:order-2">
              <Loom list={list} view={view} onMove={move} highlight={highlight} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
