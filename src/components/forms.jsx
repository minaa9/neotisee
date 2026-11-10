/** Éléments de formulaire V3 (champs crème arrondis, libellés en capitales). */

export function Field({ id, label, error, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2.5 block text-label text-brun">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-erreur`} className="mt-1.5 text-petit text-terre-cuite">
          {error}
        </p>
      )}
    </div>
  )
}

/** Choix sous forme de pilules (ex. « Vous êtes »). */
export function PillChoice({ name, options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const active = value === o
        return (
          <label
            key={o}
            className={`cursor-pointer rounded-full border px-[18px] py-2.5 text-petit transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-terre-cuite ${
              active ? 'border-brun bg-brun text-lin' : 'border-brun/15 bg-creme text-brun hover:border-brun/40'
            }`}
          >
            <input type="radio" name={name} value={o} checked={active} onChange={() => onChange(o)} className="sr-only" />
            {o}
          </label>
        )
      })}
    </div>
  )
}
