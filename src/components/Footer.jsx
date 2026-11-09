import { Link } from 'react-router'
import { contact, footerNav } from '../data/navigation'
import logo from '../assets/common/logo-neotisse.webp'

/** Pied de page commun à toutes les pages (Figma « footer »). */
export default function Footer() {
  const linkCls = 'text-[15px] text-ivoire transition-colors hover:text-sable'
  const titleCls = 'text-xs font-semibold tracking-[0.16em] text-sable uppercase'

  return (
    <footer className="bg-nuit text-ivoire">
      <div className="container-site pt-16 pb-8 xl:pt-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-[340px]">
            <img src={logo} alt="Néotisse" width="66" height="58" className="h-[58px] w-auto" />
            <p className="mt-5 font-script text-[19px] text-white">Ne perdez pas le fil !</p>
            <p className="mt-6 text-[15px] leading-normal text-ivoire/80">
              Association de médiation scientifique autour des savoir-faire textiles anciens, fondée
              en 2024 à Montpellier.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 lg:grid-cols-[220px_220px_auto] lg:gap-x-0 xl:mr-[90px]">
            {footerNav.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className={titleCls}>{col.title}</p>
                <ul className="mt-3 flex flex-col gap-3">
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
              <ul className="mt-3 flex flex-col gap-3">
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
                <li className="text-[15px]">{contact.city}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ivoire/15 pt-6 text-[13px] text-ivoire/55 sm:flex-row sm:justify-between xl:mt-[62px]">
          <p>© {new Date().getFullYear()} Néotisse — association loi 1901</p>
          <p>
            <Link to="/mentions-legales" className="hover:text-ivoire">
              Mentions légales
            </Link>
            {' · '}
            <Link to="/confidentialite" className="hover:text-ivoire">
              Confidentialité
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
