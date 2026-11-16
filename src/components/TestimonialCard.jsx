import etoileNote from '../assets/v3/ui/etoile-note.svg'

/** Carte témoignage V3 (Figma « Carte témoignage »). */
export default function TestimonialCard({ temoignage, className = '' }) {
  const { texte, atelier, date, note = 5, vignette } = temoignage
  return (
    <figure
      className={`flex flex-col rounded-[28px] border border-brun/6 bg-lin p-[31px] ${className}`}
    >
      <div className="flex items-center gap-4">
        <img src={vignette} alt="" loading="lazy" className="size-16 rounded-full object-cover" />
        <p className="flex gap-[5px]" aria-label={`${note} étoiles sur 5`}>
          {Array.from({ length: note }, (_, i) => (
            <img key={i} src={etoileNote} alt="" width="14" height="13" className="h-[12.7px] w-[13.3px]" />
          ))}
        </p>
      </div>
      <span
        aria-hidden="true"
        className="mt-1 block h-[50px] font-serif text-[90px] leading-[0.9] font-light text-terre-cuite"
      >
        “
      </span>
      <blockquote className="mt-5 font-serif text-[24px] leading-[1.15] font-light text-brun italic md:text-[26px]">
        {texte}
      </blockquote>
      <figcaption className="mt-auto pt-6 text-petit text-brun-doux">
        {atelier} · {date}
      </figcaption>
    </figure>
  )
}
