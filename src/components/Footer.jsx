import { Link } from 'react-router'
import { contact, footerNav, socials } from '../data/navigation'
import { Logo } from './ui'
import vague from '../assets/v3/ui/vague.svg'
import planteGravee from '../assets/v3/ui/plante-gravee.webp'
import instagram from '../assets/v3/ui/instagram.svg'
import facebook from '../assets/v3/ui/facebook.svg'

const socialIcons = { Instagram: instagram, Facebook: facebook }

/** Pied de page V3, commun à toutes les pages (Figma « V3 Pied de page »). */
export default function Footer({ afterPeach = false }) {
  const titleCls = 'text-label text-brique'
  const linkCls = 'text-[14px] leading-[2] text-brun transition-colors hover:text-terre-cuite'

  return (
    <footer className={`relative overflow-hidden ${afterPeach ? 'bg-peche' : 'bg-creme'}`}>
      {/* Vague pêche (le fond du pied de page) */}
      {/* Après une section pêche, pas de vague : le fond pêche continue. */}
      <img
        hidden={afterPeach}
        src={vague}
        alt=""
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-full w-full object-cover object-top"
      />
      <img
        src={planteGravee}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[120px] right-[15px] hidden h-[240px] w-[124px] object-contain opacity-70 xl:block"
      />

      <div className="container-site relative pt-24 pb-8 xl:pt-[115px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-[460px]">
            <Logo />
            <p className="mt-4 font-serif text-[42px] leading-[1.15] font-light text-brun italic md:text-[52px]">
              Ne perdez pas le fil !
            </p>
            <p className="mt-3 max-w-[380px] text-petit text-brun-doux">
              Association de médiation scientifique autour des savoir-faire textiles anciens, fondée
              en 2024 à Montpellier.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-[200px_200px_auto] sm:gap-0 lg:mr-[80px] lg:pt-2.5">
            {footerNav.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className={titleCls}>{col.title}</p>
                <ul className="mt-4">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className={linkCls}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div className="col-span-2 sm:col-span-1">
              <p className={titleCls}>Nous écrire</p>
              <ul className="mt-4">
                <li>
                  <a href={`mailto:${contact.email}`} className={linkCls}>
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a href={contact.phoneHref} className={linkCls}>
                    {contact.phone}
                  </a>
                </li>
                <li className="text-[14px] leading-[2]">{contact.city}</li>
              </ul>
              <ul className="mt-5 flex flex-wrap gap-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-full border border-brique/45 py-2 pr-4 pl-3 text-[14px] text-brun transition-colors hover:bg-lin"
                    >
                      <img src={socialIcons[s.label]} alt="" width="18" height="18" />
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-brun/15 pt-5 text-petit text-brun-doux sm:flex-row sm:justify-between xl:mt-[44px]">
          <p>© {new Date().getFullYear()} Néotisse — association loi 1901</p>
          <p>
            <Link to="/mentions-legales" className="hover:text-brun">
              Mentions légales
            </Link>
            {'  ·  '}
            <Link to="/confidentialite" className="hover:text-brun">
              Confidentialité
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
