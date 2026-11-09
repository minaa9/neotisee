import { Link } from 'react-router'
import { Arrow } from './ui'
import { categories, formatEventDate } from '../data/events'

/** Carte d'un rendez-vous (Figma « Carte du calendrier »). */
export default function EventCard({ event, className = '' }) {
  const { jour, mois, jourSemaine } = formatEventDate(event.date)
  const cat = categories[event.categorie]

  return (
    <article
      className={`group relative flex h-full flex-col gap-3 rounded-[22px] bg-white/70 px-3 pt-3 pb-6 drop-shadow-[0_14px_17px_rgba(69,46,26,0.08)] transition-transform duration-300 hover:-translate-y-1 ${className}`}
    >
      <div className="relative aspect-[276/190] overflow-hidden rounded-[14px]">
        <img
          src={event.image}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <p className="absolute top-3.5 left-3.5 flex flex-col items-center rounded-[14px] bg-creme px-3.5 pt-2 pb-2.5">
          <span className="font-serif text-[28px] leading-none text-terre">{jour}</span>
          <span className="mt-1 text-[11px] font-semibold tracking-[0.1em] text-encre">{mois}</span>
        </p>
      </div>

      <p className="mt-1 flex items-center gap-2 px-1 text-[15px] font-semibold text-terre">
        <img src={cat.dot} alt="" width="10" height="10" className="size-2.5" />
        {cat.label}
      </p>
      <h3 className="px-1 text-[20px] leading-[1.25] font-semibold text-encre">{event.titre}</h3>
      <p className="px-1 text-sm text-encre/70">
        {jourSemaine} · {event.lieu} · {event.horaires}
      </p>
      <Link
        to={`/calendrier#${event.id}`}
        className="mt-auto inline-flex items-center gap-2.5 px-1 text-sm font-medium text-terre-fonce after:absolute after:inset-0 after:content-['']"
      >
        En savoir plus
        <Arrow color="red" />
        <span className="sr-only"> : {event.titre}</span>
      </Link>
    </article>
  )
}
