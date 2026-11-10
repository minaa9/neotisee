import { Link } from 'react-router'
import { useReveal } from '../hooks/useReveal'
import logoPastille from '../assets/v3/ui/logo-pastille.svg'
import logoN from '../assets/v3/ui/logo-n.webp'
import flecheContour from '../assets/v3/ui/fleche-contour.svg'
import flechePlein from '../assets/v3/ui/fleche-plein.svg'
import flecheClair from '../assets/v3/ui/fleche-clair.svg'

/** Logo : le « N » blanc dans une pastille terre cuite (Figma « V3 Logo »). */
export function Logo({ className = '' }) {
  return (
    <span className={`relative block size-[46px] shrink-0 ${className}`}>
      <img src={logoPastille} alt="" width="46" height="46" className="absolute inset-0 size-full" />
      <img
        src={logoN}
        alt=""
        className="absolute top-[10.5px] left-[9px] h-[25px] w-[28px] object-contain"
      />
    </span>
  )
}

/** Sur-titre : libellé en capitales brique (Figma « V3 Sur-titre »). */
export function Eyebrow({ children, className = '' }) {
  return <p className={`text-label text-brique ${className}`}>{children}</p>
}

/**
 * Titre de section centré : titre (partie en italique via <em>),
 * chapô en italique. Utilisé sur l'accueil et les pages intérieures.
 */
export function CenteredHeading({ title, subtitle, as: Tag = 'h2', className = '' }) {
  return (
    <Reveal className={`flex flex-col items-center text-center ${className}`}>
      <Tag className="font-serif text-[40px] leading-[1.08] font-normal tracking-[-0.005em] text-brun md:text-[56px] [&_em]:font-light">
        {title}
      </Tag>
      {subtitle && <p className="mt-4 max-w-[900px] text-chapo text-brun-doux">{subtitle}</p>}
    </Reveal>
  )
}

const pill = {
  contour: 'border border-brun/55 text-brun group-hover:bg-brun group-hover:text-lin',
  plein: 'bg-terre-cuite text-lin group-hover:bg-brique',
  clair: 'border border-lin/55 text-lin group-hover:bg-lin group-hover:text-brun',
}
const circle = {
  contour: 'border-brun/55 group-hover:bg-brun',
  plein: 'border-terre-cuite/55 group-hover:bg-terre-cuite',
  clair: 'border-lin/55 group-hover:bg-lin',
}
const arrows = { contour: flecheContour, plein: flechePlein, clair: flecheClair }
// Couleur de la flèche quand le cercle se remplit au survol.
const arrowHover = {
  contour: 'group-hover:invert',
  plein: 'group-hover:brightness-0 group-hover:invert',
  clair: 'group-hover:invert',
}

/**
 * Bouton V3 : pilule + cercle flèche.
 * Survol : la flèche glisse de 4 px et le cercle se remplit.
 * Rend un <Link> (to), un <a> (href) ou un <button>.
 */
export function Button({ to, href, variant = 'contour', className = '', children, ...props }) {
  const content = (
    <>
      <span
        className={`rounded-full px-6 py-[13px] text-[15px] leading-none tracking-[0.02em] whitespace-nowrap transition-colors duration-300 ${pill[variant]}`}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className={`flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${circle[variant]}`}
      >
        <img
          src={arrows[variant]}
          alt=""
          width="16"
          height="16"
          className={`size-4 transition-transform duration-300 group-hover:translate-x-1 ${arrowHover[variant]}`}
        />
      </span>
    </>
  )
  const cls = `group inline-flex items-center gap-3.5 ${className}`

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className={cls} {...props}>
      {content}
    </button>
  )
}

/** Conteneur qui apparaît en fondu au défilement. */
export function Reveal({ as: Tag = 'div', delay = 0, effect = 'reveal', className = '', style, children, ...props }) {
  const ref = useReveal()
  return (
    <Tag
      ref={ref}
      className={`${effect} ${className}`}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      {...props}
    >
      {children}
    </Tag>
  )
}
