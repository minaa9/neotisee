import { useState } from 'react'
import { nombre } from './statistiques'

/** Palette des graphiques (vérifiée : lisible, y compris en cas de daltonisme). L'ordre ne change jamais. */
const COULEURS = ['#B4583D', '#3A78B5', '#D29A1C', '#4E8F45', '#9457B0']
const COULEUR_AUTRES = '#B8A89E'

/**
 * Courbe de fréquentation (une seule série) : aire douce, ligne de 2 px,
 * repère et bulle au survol, tableau caché pour les lecteurs d'écran.
 */
export function Courbe({ points, unite = 'visiteurs' }) {
  const [survol, setSurvol] = useState(null)
  const W = 720
  const H = 220
  const bas = 190
  const haut = 14
  const max = Math.max(4, ...points.map((p) => p.valeur))
  const pas = Math.pow(10, Math.floor(Math.log10(max)))
  const plafond = Math.ceil(max / pas) * pas
  const x = (i) => (points.length < 2 ? W / 2 : (i / (points.length - 1)) * W)
  const y = (v) => bas - (v / plafond) * (bas - haut)
  const ligne = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.valeur).toFixed(1)}`).join(' ')
  const aire = `${ligne} L${W},${bas} L0,${bas} Z`
  const graduations = [0, plafond / 2, plafond]
  const etiquettes = points.length <= 7 ? points.map((_, i) => i) : [0, Math.round((points.length - 1) / 3), Math.round(((points.length - 1) * 2) / 3), points.length - 1]
  const court = (d) => new Date(`${d}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  const p = survol !== null ? points[survol] : null

  const bouge = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const i = Math.round(((e.clientX - r.left) / r.width) * (points.length - 1))
    setSurvol(Math.max(0, Math.min(points.length - 1, i)))
  }

  return (
    <figure>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-[220px] w-full overflow-visible" preserveAspectRatio="none" onMouseMove={bouge} onMouseLeave={() => setSurvol(null)} role="img" aria-label={`Évolution des ${unite} par jour`}>
          {graduations.map((g) => (
            <line key={g} x1="0" x2={W} y1={y(g)} y2={y(g)} stroke="#3d2a23" strokeOpacity={g ? 0.08 : 0.15} strokeDasharray={g ? '3 4' : undefined} vectorEffect="non-scaling-stroke" />
          ))}
          <path d={aire} fill="#B4583D" fillOpacity="0.12" />
          <path d={ligne} fill="none" stroke="#B4583D" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {p && <line x1={x(survol)} x2={x(survol)} y1={haut} y2={bas} stroke="#3d2a23" strokeOpacity="0.25" vectorEffect="non-scaling-stroke" />}
        </svg>
        {/* Graduations (en HTML pour garder des lettres nettes) */}
        {graduations.slice(1).map((g) => (
          <span key={g} className="pointer-events-none absolute left-0 -translate-y-full pb-0.5 text-[11px] text-brun-doux tabular-nums" style={{ top: `${(y(g) / H) * 100}%` }}>
            {nombre(g)}
          </span>
        ))}
        {p && (
          <>
            <span className="pointer-events-none absolute size-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-terre-cuite ring-2 ring-lin" style={{ left: `${(x(survol) / W) * 100}%`, top: `${(y(p.valeur) / H) * 100}%` }} />
            <span
              className="pointer-events-none absolute z-10 rounded-[10px] bg-brun px-3 py-1.5 text-[12px] whitespace-nowrap text-lin shadow-md"
              style={{ left: `${(x(survol) / W) * 100}%`, top: `${(y(p.valeur) / H) * 100}%`, transform: `translate(${survol > points.length * 0.7 ? '-100%' : survol < points.length * 0.3 ? '0' : '-50%'}, calc(-100% - 12px))` }}
            >
              <span className="block text-lin/70 capitalize">{new Date(`${p.date}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              <span className="font-medium">
                {nombre(p.valeur)} {unite}
              </span>
            </span>
          </>
        )}
      </div>
      <div aria-hidden="true" className="relative mt-2 h-4 text-[12px] text-brun-doux">
        {etiquettes.map((i) => (
          <span key={i} className="absolute whitespace-nowrap" style={{ left: `${(x(i) / W) * 100}%`, transform: `translateX(${i === 0 ? '0' : i === points.length - 1 ? '-100%' : '-50%'})` }}>
            {court(points[i].date)}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>{unite} par jour</caption>
        <tbody>
          {points.map((pt) => (
            <tr key={pt.date}>
              <th scope="row">{pt.date}</th>
              <td>{pt.valeur}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

/** Regroupe au-delà de 5 parts dans « Autres » (jamais de 6e couleur inventée). */
function regrouper(items) {
  const tri = [...items].filter((i) => i.valeur > 0).sort((a, b) => b.valeur - a.valeur)
  if (tri.length <= 5) return tri.map((it, i) => ({ ...it, couleur: COULEURS[i] }))
  const garde = tri.slice(0, 4).map((it, i) => ({ ...it, couleur: COULEURS[i] }))
  return [...garde, { label: 'Autres', valeur: tri.slice(4).reduce((s, i) => s + i.valeur, 0), couleur: COULEUR_AUTRES }]
}

/** Camembert en anneau, avec total au centre et légende chiffrée. */
export function Anneau({ items, centre }) {
  const [survol, setSurvol] = useState(null)
  const parts = regrouper(items)
  const total = parts.reduce((s, p) => s + p.valeur, 0)
  const R = 80
  const r = 52
  const c = 90
  // Angle de départ de chaque part (cumul des parts précédentes).
  const departs = parts.map((_, i) => -Math.PI / 2 + (total ? (parts.slice(0, i).reduce((s, x) => s + x.valeur, 0) / total) * Math.PI * 2 : 0))
  const arcs = parts.map((p, i) => {
    const a0 = departs[i]
    const a1 = a0 + (total ? (p.valeur / total) * Math.PI * 2 : 0)
    const grand = a1 - a0 > Math.PI ? 1 : 0
    const pt = (rad, a) => `${(c + rad * Math.cos(a)).toFixed(2)},${(c + rad * Math.sin(a)).toFixed(2)}`
    // Une seule part = cercle complet (un arc de 360° ne se dessine pas).
    const d =
      parts.length === 1
        ? `M${c - R},${c} a${R},${R} 0 1,0 ${R * 2},0 a${R},${R} 0 1,0 ${-R * 2},0 M${c - r},${c} a${r},${r} 0 1,1 ${r * 2},0 a${r},${r} 0 1,1 ${-r * 2},0`
        : `M${pt(R, a0)} A${R},${R} 0 ${grand} 1 ${pt(R, a1)} L${pt(r, a1)} A${r},${r} 0 ${grand} 0 ${pt(r, a0)} Z`
    return { ...p, d }
  })

  if (!total) return <p className="py-10 text-center text-[14px] text-brun-doux">Pas encore de données sur cette période.</p>

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <svg viewBox="0 0 180 180" className="size-[170px] shrink-0" role="img" aria-label={parts.map((p) => `${p.label} ${Math.round((p.valeur / total) * 100)} %`).join(', ')}>
        {arcs.map((a, i) => (
          <path key={a.label} d={a.d} fill={a.couleur} fillRule="evenodd" stroke="#fffaf5" strokeWidth="2" opacity={survol === null || survol === i ? 1 : 0.35} className="transition-opacity duration-300" onMouseEnter={() => setSurvol(i)} onMouseLeave={() => setSurvol(null)} />
        ))}
        <text x={c} y={c - 2} textAnchor="middle" className="fill-brun font-serif" fontSize="26">
          {survol === null ? nombre(total) : `${Math.round((parts[survol].valeur / total) * 100)} %`}
        </text>
        <text x={c} y={c + 16} textAnchor="middle" className="fill-brun-doux" fontSize="10">
          {survol === null ? centre : parts[survol].label}
        </text>
      </svg>
      <ul className="w-full flex-1 space-y-2.5">
        {parts.map((p, i) => (
          <li key={p.label} className="grid grid-cols-[12px_1fr_auto_44px] items-center gap-3 text-[13px]" onMouseEnter={() => setSurvol(i)} onMouseLeave={() => setSurvol(null)}>
            <span className="size-3 rounded-[3px]" style={{ background: p.couleur }} />
            <span className="truncate text-brun">{p.label}</span>
            <span className="text-brun-doux tabular-nums">{nombre(p.valeur)}</span>
            <span className="text-right font-medium text-brun tabular-nums">{Math.round((p.valeur / total) * 100)} %</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Classement en barres horizontales (pages, villes…). */
export function Classement({ items, unite }) {
  const max = Math.max(1, ...items.map((i) => i.valeur))
  if (!items.length) return <p className="py-6 text-[14px] text-brun-doux">Pas encore de données sur cette période.</p>
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.label} className="text-[13px]">
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate text-brun">{it.label}</span>
            <span className="shrink-0 text-brun-doux tabular-nums">
              {nombre(it.valeur)} {unite}
            </span>
          </div>
          <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-brun/8">
            <span className="block h-full rounded-full bg-terre-cuite/70 transition-[width] duration-700" style={{ width: `${(it.valeur / max) * 100}%` }} />
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Jauge d'un objectif mensuel : zone d'alerte (sous le seuil bas), zone normale,
 * zone d'alerte positive (au-dessus du seuil haut), et le repère du mois.
 */
export function Jauge({ valeur, seuilBas, seuilHaut }) {
  const max = Math.max(seuilHaut * 1.5, valeur * 1.1, 1)
  const pc = (v) => `${Math.min(100, (v / max) * 100)}%`
  return (
    <div aria-hidden="true" className="relative mt-4 h-2">
      <span className="absolute inset-y-0 left-0 rounded-l-full bg-terre-cuite/25" style={{ width: pc(seuilBas) }} />
      <span className="absolute inset-y-0 bg-brun/10" style={{ left: pc(seuilBas), width: `calc(${pc(seuilHaut)} - ${pc(seuilBas)})` }} />
      <span className="absolute inset-y-0 right-0 rounded-r-full bg-[#4E8F45]/25" style={{ left: pc(seuilHaut) }} />
      <span className="absolute top-1/2 size-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brun ring-[3px] ring-lin transition-[left] duration-700" style={{ left: pc(valeur) }} />
    </div>
  )
}
