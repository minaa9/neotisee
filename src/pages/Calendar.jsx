import { useMemo, useState } from 'react'
import Collage from '../components/Collage'
import { cq } from '../components/cq'
import HeroDecor from '../components/HeroDecor'
import { Eyebrow, Reveal } from '../components/ui'
import { categories, events } from '../data/events'
import traitTitre from '../assets/actualites/trait-titre.svg'
import photoTissage from '../assets/actualites/photo-tissage.webp'
import flecheGauche from '../assets/calendrier/fleche-gauche.svg'
import flecheDroite from '../assets/calendrier/fleche-droite.svg'
import tacheVerte from '../assets/calendrier/tache-verte.svg'
import traitCourbe from '../assets/home/trait-rouge-courbe.svg'
import fleurViolette from '../assets/home/fleur-violette.webp'

const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]
const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const pad = (n) => String(n).padStart(2, '0')
const toIso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`

/** Cases du mois (semaines commençant le lundi). */
function monthGrid(year, month) {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7
  const days = new Date(year, month + 1, 0).getDate()
  return [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
}

// Décor sous le mini-calendrier (Figma 257:455 → 257:458), origine x=886 y=1690.
const QW = 705
const QH = 611
const quote = [
  { x: 0, y: 0, w: 562.945, h: 611.332, iw: 553.742, ih: 602.89, rotate: -0.88, src: tacheVerte },
  {
    x: 60, y: 355, w: 322, h: 129,
    node: (
      <p className="absolute inset-0 font-script leading-[normal] text-black/72" style={{ fontSize: cq(20, QW) }}>
        Le textile est un lien entre les époques , les peuples et les savoirs !
      </p>
    ),
  },
  { x: 43, y: 504, w: 478, h: 59, src: traitCourbe },
  { x: 187, y: 38, w: 518.745, h: 524.697, iw: 421.814, ih: 430.229, rotate: 14.99, src: fleurViolette, cover: true },
]

/** Page Calendrier (Figma 257:387) */
export default function CalendarPage() {
  const sorted = useMemo(() => [...events].sort((a, b) => a.date.localeCompare(b.date)), [])
  const now = new Date()
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const [filter, setFilter] = useState('tous')
  const [day, setDay] = useState(null)

  const list = sorted.filter(
    (e) => (filter === 'tous' || e.categorie === filter) && (!day || e.date === day),
  )

  const byDay = useMemo(() => {
    const map = {}
    sorted.forEach((e) => {
      ;(map[e.date] ??= []).push(e)
    })
    return map
  }, [sorted])

  const changeMonth = (delta) => {
    setDay(null)
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  const filters = [['tous', 'Tous'], ...Object.entries(categories).map(([k, c]) => [k, c.pluriel])]
  const pill =
    'shrink-0 rounded-[40px] border px-6 py-3 text-[18px] transition-colors xl:min-w-[137px] xl:py-[13px] xl:text-[22px]'

  return (
    <div className="overflow-hidden bg-creme">
      {/* En-tête */}
      <section className="relative pt-14 pb-14 xl:min-h-[576px] xl:pt-[56px] xl:pb-0">
        <HeroDecor />
        <Reveal as="header" className="container-site relative">
          <Eyebrow>Calendrier</Eyebrow>
          <h1 className="mt-8 font-serif text-[40px] leading-[normal] text-black/88 xl:text-[48px]">
            Nos prochains
            <br />
            rendez-vous.
          </h1>
          <img src={traitTitre} alt="" width="122" height="4" className="mt-6 -ml-0.5 xl:mt-[45px]" />
          <p className="mt-6 max-w-[569px] text-[19px] leading-[normal] text-black/72 xl:mt-[19px] xl:text-[22px]">
            Ateliers, événements, conférences… Découvrez tous nos rendez-vous pour plonger au cœur
            des savoir-faire textiles anciens et de la recherche
          </p>
        </Reveal>
        <Reveal className="container-site mt-10 xl:hidden">
          <img src={photoTissage} alt="" className="mx-auto w-full max-w-[442px]" />
        </Reveal>
      </section>

      {/* Agenda */}
      <section aria-label="Agenda" className="bg-sable/25 py-10 xl:mx-[17px] xl:pt-[41px] xl:pb-[78px]">
        <div className="mx-auto max-w-[1406px] px-5 md:px-10 xl:px-[36px]">
          <div className="flex items-center justify-between gap-6">
            <div role="group" aria-label="Filtrer par type" className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:px-0 xl:gap-[38px]">
              {filters.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={filter === key}
                  onClick={() => setFilter(key)}
                  className={`${pill} ${
                    filter === key
                      ? 'border-terre-fonce bg-terre-fonce text-white'
                      : 'border-black bg-terre-fonce/5 text-black hover:bg-terre-fonce/15'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <a
              href="#mini-calendrier"
              className={`${pill} hidden border-black bg-terre-fonce/5 text-black hover:bg-terre-fonce/15 md:inline-block xl:min-w-[192px] xl:text-center`}
            >
              Calendrier
            </a>
          </div>

          <div className="mt-10 grid items-start gap-8 lg:grid-cols-[815fr_505fr] lg:gap-5 xl:mt-[143px]">
            {/* Liste des rendez-vous */}
            <div className="rounded-[28px] bg-lin px-5 py-8 md:px-8 xl:pt-[49px] xl:pb-[60px] xl:pr-[30px] xl:pl-[33px]">
              {day && (
                <p className="mb-6 flex flex-wrap items-center gap-3 text-encre/70">
                  Rendez-vous du {Number(day.slice(8))} {MOIS[Number(day.slice(5, 7)) - 1].toLowerCase()}
                  <button type="button" onClick={() => setDay(null)} className="font-medium text-terre-fonce underline">
                    Voir tout
                  </button>
                </p>
              )}
              {list.length === 0 ? (
                <p className="py-10 text-center text-encre/60">Aucun rendez-vous pour ce choix.</p>
              ) : (
                <ul className="flex flex-col gap-14 xl:gap-[80px]">
                  {list.map((e) => {
                    const cat = categories[e.categorie]
                    const d = new Date(`${e.date}T12:00:00`)
                    return (
                      <li key={e.id} id={e.id} className="scroll-mt-28">
                        <article className="grid gap-5 sm:grid-cols-[303px_1fr] sm:gap-[43px]">
                          <img
                            src={e.image}
                            alt=""
                            loading="lazy"
                            className="aspect-[303/216] w-full rounded-[18px] object-cover"
                          />
                          <div className="flex flex-col">
                            <p className="text-[20px] font-semibold text-terre xl:text-[22px]">{cat.pluriel}</p>
                            <h2 className="mt-2 text-[20px] font-semibold text-black xl:mt-5 xl:text-[22px]">
                              {e.titre}
                            </h2>
                            <p className="mt-2 text-[15px] text-black">{e.description}</p>
                            <p className="mt-4 flex justify-between gap-4 text-[15px] text-black sm:mt-auto sm:max-w-[399px]">
                              <span>
                                <time dateTime={e.date}>
                                  {d.getDate()} {MOIS[d.getMonth()].toLowerCase()}
                                </time>{' '}
                                · {e.lieu}, France
                              </span>
                              <span>{e.horaires}</span>
                            </p>
                          </div>
                        </article>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Mini-calendrier + décor */}
            <div>
              <div id="mini-calendrier" className="scroll-mt-28 rounded-[28px] bg-lin px-4 pt-6 pb-10 sm:px-[13px] xl:min-h-[812px]">
                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => changeMonth(-1)} aria-label="Mois précédent" className="p-2">
                    <img src={flecheGauche} alt="" width="45" height="15" className="rotate-180" />
                  </button>
                  <h2 aria-live="polite" className="text-[22px] text-black xl:text-[24px]">
                    {MOIS[view.month]} {view.year}
                  </h2>
                  <button type="button" onClick={() => changeMonth(1)} aria-label="Mois suivant" className="p-2">
                    <img src={flecheDroite} alt="" width="45" height="15" />
                  </button>
                </div>

                <div className="mt-8 grid grid-cols-7 text-center text-[17px] text-black xl:mt-[42px] xl:text-[20px]">
                  {JOURS.map((j) => (
                    <span key={j} className="pb-6 xl:pb-[50px]">
                      {j}
                    </span>
                  ))}
                  {monthGrid(view.year, view.month).map((n, i) => {
                    if (!n) return <span key={`v${i}`} />
                    const iso = toIso(view.year, view.month, n)
                    const evs = byDay[iso]
                    if (!evs) {
                      return (
                        <span key={iso} className="flex h-[52px] items-center justify-center opacity-60 xl:h-[64px]">
                          {n}
                        </span>
                      )
                    }
                    const selected = day === iso
                    return (
                      <span key={iso} className="flex h-[52px] items-center justify-center xl:h-[64px]">
                        <button
                          type="button"
                          onClick={() => setDay(selected ? null : iso)}
                          aria-pressed={selected}
                          aria-label={`${n} ${MOIS[view.month].toLowerCase()} : ${evs.map((e) => e.titre).join(', ')}`}
                          className={`flex size-9 items-center justify-center rounded-full text-white transition-transform hover:scale-110 ${
                            selected ? 'ring-2 ring-encre ring-offset-2 ring-offset-lin' : ''
                          }`}
                          style={{ backgroundColor: categories[evs[0].categorie].color }}
                        >
                          {n}
                        </button>
                      </span>
                    )
                  })}
                </div>

                <ul className="mt-8 flex flex-col gap-[29px] px-4 xl:mt-[20px] xl:px-4">
                  {Object.entries(categories).map(([k, c]) => (
                    <li key={k} className="flex items-center gap-4 text-[20px] text-black xl:text-[24px]">
                      <span aria-hidden="true" className="size-7 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.pluriel}
                    </li>
                  ))}
                </ul>
              </div>

              <Reveal className="mt-14 hidden w-[calc(100%+80px)] lg:block xl:mt-[61px]">
                <Collage width={QW} height={QH} items={quote} />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
