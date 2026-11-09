import { Link } from 'react-router'
import { useReveal } from '../hooks/useReveal'
import flecheBlanche from '../assets/common/fleche-blanche.svg'
import flecheRouge from '../assets/common/fleche-rouge.svg'
import flecheNoire from '../assets/common/fleche-noire.svg'

const arrows = { white: flecheBlanche, red: flecheRouge, dark: flecheNoire }

/** Flèche horizontale des maquettes (27 × 12). */
export function Arrow({ color = 'red', className = '' }) {
  return (
    <img
      src={arrows[color]}
      alt=""
      width="27"
      height="12"
      className={`h-3 w-[27px] shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${className}`}
    />
  )
}

/** Sur-titre en capitales rouges avec trait(s). */
export function Eyebrow({ children, centered = false, light = false, className = '' }) {
  const line = <span aria-hidden="true" className="h-[1.5px] w-7 shrink-0 bg-current" />
  return (
    <p
      className={`flex items-center gap-3 text-[13px] font-semibold tracking-[0.14em] uppercase ${
        light ? 'text-sable' : 'text-terre'
      } ${className}`}
    >
      {centered && line}
      <span>{children}</span>
      {line}
    </p>
  )
}

/** Titre de section en Hedvig Letters Serif. */
export function SectionTitle({ as: Tag = 'h2', children, className = '' }) {
  return (
    <Tag
      className={`font-serif text-[34px] leading-[1.2] font-normal text-encre/90 md:text-[44px] xl:text-[48px] ${className}`}
    >
      {children}
    </Tag>
  )
}

const buttonStyles = {
  primary: 'bg-terre-fonce text-white hover:bg-terre',
  outline: 'border-[1.2px] border-encre text-encre hover:bg-encre hover:text-creme',
  'outline-light': 'border-[1.5px] border-ivoire text-white hover:bg-ivoire hover:text-encre',
}

/**
 * Bouton arrondi. Rend un <Link> si `to` est fourni, un <a> si `href`,
 * sinon un <button>.
 */
export function Button({
  to,
  href,
  variant = 'primary',
  arrow = false,
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const sizes = {
    sm: 'px-[18px] py-3 text-[15px]',
    md: 'px-8 py-4 text-[17px]',
    lg: 'px-8 py-5 text-[19px]',
  }
  const cls = `group inline-flex items-center justify-center gap-3.5 rounded-full transition-colors duration-300 ${sizes[size]} ${buttonStyles[variant]} ${className}`
  const content = (
    <>
      {children}
      {arrow && (
        <Arrow
          color={variant === 'primary' ? 'white' : 'dark'}
          className={variant === 'primary' ? '' : 'group-hover:invert'}
        />
      )}
    </>
  )

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

/** Lien texte rouge suivi d'une flèche. */
export function ArrowLink({ to, children, className = '', size = 'text-base' }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2.5 font-medium text-terre-fonce transition-colors hover:text-terre ${size} ${className}`}
    >
      {children}
      <Arrow color="red" />
    </Link>
  )
}

/** Conteneur qui apparaît en fondu au défilement. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...props }) {
  const ref = useReveal()
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      {...props}
    >
      {children}
    </Tag>
  )
}
