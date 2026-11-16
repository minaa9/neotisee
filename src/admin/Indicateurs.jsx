import { useState } from 'react'
import { categories, todayIso } from '../data/events'

const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
const cle = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

/** Les 6 derniers mois (le plus ancien d'abord). */
function sixMois() {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    return { cle: cle(d), label: MOIS[d.getMonth()], long: d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) }
  })
}

/**
 * Histogramme d'une seule série (messages reçus par mois) : barres fines aux
 * bouts arrondis, valeur au survol, la barre du mois en cours accentuée.
 * Un tableau caché donne les mêmes chiffres aux lecteurs d'écran.
 */
function Histogramme({ mois, valeurs, unite }) {
  const [survol, setSurvol] = useState(null)
  const max = Math.max(1, ...valeurs)
  return (
    <figure>
      <div className="relative flex h-[170px] items-end gap-3 border-b border-brun/15 sm:gap-5" onMouseLeave={() => setSurvol(null)}>
        {/* Lignes de repère discrètes */}
        {[0.5, 1].map((k) => (
          <span key={k} aria-hidden="true" className="pointer-events-none absolute inset-x-0 border-t border-dashed border-brun/8" style={{ bottom: `${k * 100}%` }} />
        ))}
        {mois.map((m, i) => {
          const v = valeurs[i]
          const actuel = i === mois.length - 1
          return (
            <div
              key={m.cle}
              className="relative flex h-full flex-1 items-end justify-center"
              onMouseEnter={() => setSurvol(i)}
              onFocus={() => setSurvol(i)}
              onBlur={() => setSurvol(null)}
              tabIndex={0}
              aria-label={`${m.long} : ${v} ${unite}`}
            >
              <span
                className={`block w-full max-w-[34px] rounded-t-[4px] transition-[height,background-color] duration-700 ease-out ${actuel ? 'bg-terre-cuite' : survol === i ? 'bg-terre-cuite/70' : 'bg-terre-cuite/35'}`}
                style={{ height: `${Math.max(v ? 4 : 0, (v / max) * 100)}%` }}
              />
              {(survol === i || (actuel && survol === null)) && (
                <span className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 rounded-[10px] bg-brun px-2.5 py-1 text-[12px] whitespace-nowrap text-lin shadow-md" style={{ bottom: `calc(${(v / max) * 100}% + 8px)` }}>
                  {v} {unite}
                </span>
              )}
            </div>
          )
        })}
      </div>
      <div aria-hidden="true" className="mt-2 flex gap-3 sm:gap-5">
        {mois.map((m, i) => (
          <span key={m.cle} className={`flex-1 text-center text-[12px] ${i === mois.length - 1 ? 'text-brun' : 'text-brun-doux'}`}>
            {m.label}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>{unite} par mois</caption>
        <tbody>
          {mois.map((m, i) => (
            <tr key={m.cle}>
              <th scope="row">{m.long}</th>
              <td>{valeurs[i]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

/** Petite tuile chiffrée. */
function Tuile({ label, valeur, detail }) {
  return (
    <div className="rounded-[20px] border border-brun/10 bg-creme p-4">
      <p className="text-label text-brique">{label}</p>
      <p className="mt-2 font-serif text-[34px] leading-none [font-feature-settings:'lnum']">{valeur}</p>
      {detail && <p className="mt-2 text-[12px] text-brun-doux">{detail}</p>}
    </div>
  )
}

/**
 * Indicateurs clés (KPI) du tableau de bord : activité des 6 derniers mois,
 * temps de traitement, satisfaction, programmation.
 */
export default function Indicateurs({ messages, temoignages, evenements }) {
  const mois = sixMois()
  const parMois = mois.map((m) => messages.filter((x) => (x.created_at || '').startsWith(m.cle)).length)
  const ceMois = parMois[5]
  const avant = parMois[4]
  const evolution = avant ? Math.round(((ceMois - avant) / avant) * 100) : null

  const publies = temoignages.filter((t) => t.statut === 'publie')
  const moyenne = publies.length ? publies.reduce((s, t) => s + (t.note || 5), 0) / publies.length : null
  const traites = messages.length ? Math.round((messages.filter((m) => m.lu).length / messages.length) * 100) : null

  const today = todayIso()
  const aVenir = evenements.filter((e) => e.date >= today)
  const parType = Object.entries(categories).map(([k, c]) => ({ k, label: c.label, n: aVenir.filter((e) => e.categorie === k).length }))
  const maxType = Math.max(1, ...parType.map((t) => t.n))

  return (
    <section data-bloc className="mt-8 rounded-[28px] bg-lin p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-serif text-[30px] leading-tight">
          Indicateurs <em>clés</em>
        </h2>
        <p className="text-[13px] text-brun-doux">Calculés en direct à partir de vos données</p>
      </div>

      <div className="mt-6 grid gap-8 xl:grid-cols-[1.3fr_1fr] [&>*]:min-w-0">
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[15px]">Messages reçus · 6 derniers mois</p>
            {evolution !== null && (
              <p className={`text-[13px] ${evolution >= 0 ? 'text-[#56663f]' : 'text-terre-cuite'}`}>
                {evolution >= 0 ? '↗' : '↘'} {evolution > 0 ? '+' : ''}
                {evolution} % par rapport au mois dernier
              </p>
            )}
          </div>
          <div className="mt-8">
            <Histogramme mois={mois} valeurs={parMois} unite={ceMois > 1 ? 'messages' : 'message'} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-3">
            <Tuile label="Satisfaction" valeur={moyenne ? `${moyenne.toFixed(1).replace('.', ',')}/5` : '—'} detail={`${publies.length} avis publiés`} />
            <Tuile label="Messages traités" valeur={traites !== null ? `${traites} %` : '—'} detail="lus au moins une fois" />
          </div>
          <div>
            <p className="text-[15px]">Rendez-vous à venir, par type</p>
            <ul className="mt-4 flex flex-col gap-3">
              {parType.map((t) => (
                <li key={t.k} className="grid grid-cols-[100px_1fr_24px] items-center gap-3 text-[13px]">
                  <span className="flex items-center gap-2 text-brun-doux">
                    <img src={categories[t.k].dot} alt="" className="size-2" />
                    {t.label}
                  </span>
                  <span className="h-2 overflow-hidden rounded-full bg-brun/8">
                    <span className="block h-full rounded-full bg-terre-cuite/70 transition-[width] duration-700" style={{ width: `${(t.n / maxType) * 100}%` }} />
                  </span>
                  <span className="text-right text-brun tabular-nums">{t.n}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
