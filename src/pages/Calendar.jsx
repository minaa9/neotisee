import { useMemo, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { Button, CenteredHeading, Reveal } from '../components/ui'
import {
  JOURS,
  MOIS,
  MOIS_COURT,
  capitalize,
  categories,
  events,
  horaires,
  icsFor,
  toDate,
  todayIso,
} from '../data/events'
import heroImage from '../assets/ateliers/hero.webp'
import flecheGauche from '../assets/v3/calendrier/fleche-gauche.svg'
import flecheDroite from '../assets/v3/calendrier/fleche-droite.svg'
import noeud from '../assets/v3/calendrier/noeud.svg'
import iconeDate from '../assets/v3/calendrier/icone-date.svg'
import iconeHeure from '../assets/v3/calendrier/icone-heure.svg'
import iconeLieu from '../assets/v3/calendrier/icone-lieu.svg'
import flecheContour from '../assets/v3/ui/fleche-contour.svg'
import vague from '../assets/v3/home/vague-avis.svg'
import planteGravee from '../assets/v3/ui/plante-gravee.webp'

const LETTRES = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
const W = 1200 // largeur du métier dans la maquette
const pct = (x) => `${(x / W) * 100}%`
const dayX = (d) => 72 + (d - 1) * 36

/* ------------------------------------------------------------------ */
/* Filtres (dans l'en-tête)                                            */
/* ------------------------------------------------------------------ */
function Filters({ value, onChange }) {
  const options = [['tous', 'Tous'], ...Object.entries(categories).map(([k, c]) => [k, c.label])]
  return (
    <div role="group" aria-label="Filtrer les rendez-vous" className="mt-8 flex flex-wrap gap-2.5 xl:mt-[34px]">
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
/* Le métier du mois : chaque fil vertical est un jour                 */
/* ------------------------------------------------------------------ */
function Loom({ list }) {
  const today = todayIso()
  const now = toDate(today)
  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [hover, setHover] = useState(null)
  const drag = useRef(null)

  const days = new Date(view.y, view.m + 1, 0).getDate()
  const prefix = `${view.y}-${String(view.m + 1).padStart(2, '0')}-`
  const monthEvents = list.filter((e) => e.date.startsWith(prefix))

  const move = (delta) => {
    setHover(null)
    setView(({ y, m }) => {
      const d = new Date(y, m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  }

  // « Glissez le métier pour changer de mois »
  const onPointerDown = (e) => {
    drag.current = e.clientX
  }
  const onPointerUp = (e) => {
    if (drag.current == null) return
    const dx = e.clientX - drag.current
    drag.current = null
    if (Math.abs(dx) > 80) move(dx < 0 ? 1 : -1)
  }

  return (
    <section className="bg-creme pt-4 pb-14 xl:pt-0 xl:pb-[50px]">
      <div className="container-site">
        <CenteredHeading
          title={
            <>
              {capitalize(MOIS[view.m])}, <em>sur le métier</em>
            </>
          }
          subtitle="Chaque fil vertical est un jour, chaque navette un rendez-vous."
        />

        <div className="-mx-5 mt-8 overflow-x-auto px-5 pb-4 [scrollbar-width:thin] md:mx-0 md:px-0 xl:mt-[34px]">
          <div
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            className="relative mx-auto aspect-[1200/500] min-w-[960px] touch-pan-y rounded-[32px] border border-brun/8 bg-lin select-none"
          >
            {/* Navigation du mois */}
            <div className="absolute flex items-center gap-4" style={{ left: pct(47), top: '7%' }}>
              <button type="button" onClick={() => move(-1)} aria-label="Mois précédent" className="flex size-11 items-center justify-center rounded-full border border-brun/40 transition-colors hover:bg-brun/5">
                <img src={flecheGauche} alt="" width="16" height="16" />
              </button>
              <h3 aria-live="polite" className="min-w-[200px] text-center font-serif text-[32px] leading-[1.18] text-brun">
                {capitalize(MOIS[view.m])} {view.y}
              </h3>
              <button type="button" onClick={() => move(1)} aria-label="Mois suivant" className="flex size-11 items-center justify-center rounded-full border border-brun/40 transition-colors hover:bg-brun/5">
                <img src={flecheDroite} alt="" width="16" height="16" />
              </button>
            </div>

            {/* Légende */}
            <ul className="absolute flex gap-6 text-petit text-brun-doux" style={{ right: pct(47), top: '10%' }}>
              {Object.entries(categories).map(([k, c]) => (
                <li key={k} className="flex items-center gap-1.5">
                  <img src={c.dot} alt="" width="10" height="10" className="size-2.5" />
                  {c.label}
                </li>
              ))}
            </ul>

            {/* Fils des jours */}
            {Array.from({ length: days }, (_, i) => {
              const d = i + 1
              const iso = prefix + String(d).padStart(2, '0')
              const wd = new Date(view.y, view.m, d).getDay()
              const isToday = iso === today
              const weekend = wd === 0 || wd === 6
              return (
                <div key={d} className="absolute top-0 h-full" style={{ left: pct(dayX(d)) }} aria-hidden="true">
                  <span className="absolute top-[19.8%] -translate-x-1/2 text-petit text-brun-doux/70">{LETTRES[wd]}</span>
                  <span
                    className={`absolute top-[25.8%] h-1/2 -translate-x-1/2 ${
                      isToday ? 'w-0.5 bg-terre-cuite' : `w-px ${weekend ? 'bg-brun/22' : 'bg-brun/12'}`
                    }`}
                  />
                  <span className={`absolute top-[78.2%] -translate-x-1/2 text-petit ${isToday ? 'text-terre-cuite' : 'text-brun'}`}>{d}</span>
                  {isToday && (
                    <span className="absolute top-[83.8%] -translate-x-1/2 rounded-full bg-terre-cuite px-2.5 py-1 text-label whitespace-nowrap text-lin">
                      Aujourd’hui
                    </span>
                  )}
                </div>
              )
            })}

            {/* Navettes */}
            {monthEvents.map((e, i) => {
              const d = toDate(e.date).getDate()
              const x = dayX(d)
              const cat = categories[e.categorie]
              const knotLeft = i % 2 === 1 && x < 900
              const past = e.date < today
              const top = `${((159 + (i % 3) * 55) / 500) * 100}%`
              const open = hover === e.id
              return (
                <div
                  key={e.id}
                  className="absolute z-10"
                  style={{ left: pct(x), top }}
                  onMouseEnter={() => setHover(e.id)}
                  onMouseLeave={() => setHover(null)}
                >
                  <a
                    href={`#rdv-${e.id}`}
                    onFocus={() => setHover(e.id)}
                    onBlur={() => setHover(null)}
                    className={`absolute top-0 flex items-center rounded-full py-2 text-petit whitespace-nowrap transition-transform hover:scale-[1.03] ${cat.bg} ${cat.text} ${
                      past ? 'opacity-50' : ''
                    } ${knotLeft ? 'left-[-8px] pr-4 pl-[26px]' : 'right-[-8px] pr-[26px] pl-4'}`}
                  >
                    {e.court}
                    <span className="sr-only">
                      {' '}
                      — {e.titre}, le {d} {MOIS[view.m]}
                    </span>
                    {/* Fil de chaîne qui passe par-dessus la navette */}
                    <span aria-hidden="true" className={`absolute top-0 h-full w-px bg-lin/60 ${knotLeft ? 'left-2' : 'right-2'}`} />
                    <img src={noeud} alt="" aria-hidden="true" className={`absolute top-1/2 size-3 -translate-y-1/2 ${knotLeft ? 'left-[2px]' : 'right-[2px]'}`} />
                  </a>

                  {/* Infobulle */}
                  <div
                    role="tooltip"
                    className={`pointer-events-none absolute top-[-10px] z-20 w-[250px] rounded-[18px] border border-brun/12 bg-creme p-4 shadow-[0_12px_30px_rgba(61,42,35,0.12)] transition-all duration-200 ${
                      open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0'
                    } ${knotLeft ? 'right-[calc(100%+12px)]' : 'left-[12px]'}`}
                  >
                    <p className="text-label text-brique">
                      {JOURS[toDate(e.date).getDay()]} {d} {MOIS[view.m]}
                    </p>
                    <p className="mt-1 font-serif text-[20px] leading-[1.18] text-brun">{e.titre}</p>
                    <p className="mt-1 text-petit text-brun-doux">
                      {horaires(e)} · {e.lieu}
                    </p>
                  </div>
                </div>
              )
            })}

            {monthEvents.length === 0 && (
              <p className="absolute inset-x-0 top-[45%] text-center text-chapo text-brun-doux">Aucun rendez-vous ce mois-ci.</p>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-petit text-brun-doux">
          Survolez une navette pour voir le détail  ·  glissez le métier pour changer de mois
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Prochain rendez-vous                                                */
/* ------------------------------------------------------------------ */
function NextEvent({ event }) {
  const d = toDate(event.date)
  const diff = Math.round((d - toDate(todayIso())) / 86400000)
  const when = diff === 0 ? 'aujourd’hui' : diff === 1 ? 'demain' : `dans ${diff} jours`

  const downloadIcs = () => {
    const blob = new Blob([icsFor(event)], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `neotisse-${event.id}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section aria-labelledby="prochain" className="relative bg-peche pt-24 pb-14 xl:pt-[120px] xl:pb-[80px]">
      <img src={vague} alt="" aria-hidden="true" className="absolute inset-x-0 top-[-1px] h-[50px] w-full md:h-[101px]" />
      <div className="container-site relative flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-20">
        <Reveal className="overflow-hidden rounded-tl-[250px] rounded-tr-[24px] rounded-br-[250px] rounded-bl-[24px] lg:w-[440px] lg:shrink-0">
          <img src={event.image} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover sm:aspect-[520/440]" />
        </Reveal>
        <Reveal delay={120} className="lg:pt-2">
          <p className="inline-block rounded-full bg-lin px-4 py-2 text-label text-brique">Prochain rendez-vous · {when}</p>
          <p id="prochain" className="mt-4 font-serif text-[52px] leading-none font-light tracking-[-0.01em] text-brun md:text-[66px] xl:-ml-1">
            {d.getDate()} <em>{MOIS[d.getMonth()]}</em>
          </p>
          <h2 className="mt-4 max-w-[520px] font-serif text-[30px] leading-[1.18] text-brun md:text-[34px]">{event.titre}</h2>
          <p className="mt-4 max-w-[460px] text-courant text-brun-doux">{event.description}</p>
          <ul className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-petit text-brun">
            <li className="flex items-center gap-2">
              <img src={iconeDate} alt="" width="20" height="20" />
              {capitalize(JOURS[d.getDay()])} {d.getDate()} {MOIS[d.getMonth()]} {d.getFullYear()}
            </li>
            <li className="flex items-center gap-2">
              <img src={iconeHeure} alt="" width="20" height="20" />
              {horaires(event).replace('–', ' – ')}
            </li>
            <li className="flex items-center gap-2">
              <img src={iconeLieu} alt="" width="20" height="20" />
              {event.lieu}
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-4 xl:mt-10">
            <Button to={`/contact?objet=inscription&rdv=${event.id}`} variant="plein">
              Je m’inscris
            </Button>
            <Button onClick={downloadIcs}>Ajouter à mon agenda</Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Tous les rendez-vous, regroupés par mois                            */
/* ------------------------------------------------------------------ */
function AllEvents({ list }) {
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
    <section aria-labelledby="tous" className="relative overflow-hidden bg-creme pt-16 pb-16 xl:pt-[70px] xl:pb-[80px]">
      <img src={planteGravee} alt="" aria-hidden="true" className="pointer-events-none absolute top-[60px] right-[70px] hidden h-[250px] w-[130px] object-contain opacity-60 xl:block" />
      <div className="container-site relative">
        <Reveal as="h2" id="tous" className="font-serif text-[40px] leading-[1.08] tracking-[-0.005em] text-brun md:text-[50px]">
          Tous les rendez-vous
        </Reveal>

        {groups.length === 0 && <p className="mt-10 text-chapo text-brun-doux">Aucun rendez-vous pour ce filtre.</p>}

        <div className="relative mt-10 xl:mt-[48px]">
          {/* Fil du temps */}
          <span aria-hidden="true" className="absolute top-2.5 bottom-0 left-[5px] w-px bg-terre-cuite/45 lg:left-[180px]" />
          {groups.map(([month, items]) => (
            <div key={month} className="relative mb-10 lg:mb-0 lg:grid lg:grid-cols-[180px_1fr]">
              <p className="mb-2 pl-8 font-serif text-[26px] leading-[1.15] font-light text-terre-cuite italic lg:mb-0 lg:pl-0">{month}</p>
              <ul className="lg:pt-5">
                {items.map((e) => {
                  const d = toDate(e.date)
                  const past = e.date < today
                  const cat = categories[e.categorie]
                  return (
                    <Reveal as="li" key={e.id} id={`rdv-${e.id}`} className={`relative scroll-mt-28 ${past ? 'opacity-50' : ''}`}>
                      <img src={cat.dot} alt="" aria-hidden="true" className="absolute top-[48px] left-0 size-[11px] lg:left-[-5.5px]" />
                      <article className="ml-8 grid grid-cols-[80px_1fr_auto] items-start gap-x-4 border-b border-brun/10 pt-4 pb-4 lg:ml-12 lg:min-h-[120px] lg:grid-cols-[132px_1fr_auto] lg:gap-x-0">
                        <p className="font-serif leading-[1.08] text-brun">
                          <span className="block text-[48px] tracking-[-0.005em] lg:text-[56px]">{String(d.getDate()).padStart(2, '0')}</span>
                          <span className="ml-1.5 block text-[20px] leading-[1.15] font-light text-brun-doux italic">{MOIS_COURT[d.getMonth()]}</span>
                        </p>
                        <div className="pt-3.5">
                          <p className="text-label text-brique">
                            {cat.label}
                            {past && ' · passé'}
                          </p>
                          <h3 className="mt-1 font-serif text-[26px] leading-[1.18] text-brun md:text-[30px]">{e.titre}</h3>
                          <p className="mt-1 text-petit text-brun-doux">
                            {capitalize(JOURS[d.getDay()])} · {horaires(e)} · {e.lieu}
                          </p>
                        </div>
                        <a
                          href={past ? undefined : `/contact?objet=inscription&rdv=${e.id}`}
                          aria-label={past ? undefined : `S’inscrire : ${e.titre}`}
                          aria-hidden={past || undefined}
                          className="group mt-6 hidden size-11 items-center justify-center rounded-full border border-brun/40 transition-colors hover:bg-brun sm:flex"
                        >
                          <img src={flecheContour} alt="" width="16" height="16" className="transition-transform group-hover:translate-x-1 group-hover:invert" />
                        </a>
                      </article>
                    </Reveal>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Page Calendrier V3 (Figma 353:269) */
export default function CalendarPage() {
  const [filter, setFilter] = useState('tous')
  const sorted = useMemo(() => [...events].sort((a, b) => a.date.localeCompare(b.date)), [])
  const list = sorted.filter((e) => filter === 'tous' || e.categorie === filter)
  const today = todayIso()
  const next = list.find((e) => e.date >= today)

  return (
    <>
      <PageHeader
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
        <Filters value={filter} onChange={setFilter} />
      </PageHeader>
      <Loom list={list} />
      {next && <NextEvent event={next} />}
      <AllEvents list={list} />
    </>
  )
}
