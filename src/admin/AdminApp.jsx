import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router'
import { Logo } from '../components/ui'
import { demoAllowed, getSession, isLive, resetDemo, signOut } from '../lib/store'
import { MOTION_OK, gsap, useGSAP } from '../motion/gsap'
import { useTable } from './hooks'
import { Connexion, NonActive, NouveauMotDePasse } from './Auth'
import { INACTIVITE_MS } from './securite'
import Dashboard from './Dashboard'
import EventsAdmin from './EventsAdmin'
import NewsAdmin from './NewsAdmin'
import GuestbookAdmin from './GuestbookAdmin'
import MessagesAdmin from './MessagesAdmin'
import AteliersAdmin from './AteliersAdmin'
import ReglagesAdmin from './ReglagesAdmin'

const NAV = [
  { to: '/admin', label: 'Tableau de bord', end: true, icon: 'M3 12h7V3H3v9Zm11 9h7v-9h-7v9ZM3 21h7v-5H3v5Zm11-12h7V3h-7v6Z' },
  { to: '/admin/evenements', label: 'Événements', icon: 'M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z' },
  { to: '/admin/actualites', label: 'Actualités', icon: 'M5 4h11l3 3v13H5V4Zm3 6h8M8 14h8M8 18h5' },
  { to: '/admin/ateliers', label: 'Ateliers', icon: 'M4 20V10a8 8 0 0 1 16 0v10M4 20h16M9 20v-6a3 3 0 0 1 6 0v6' },
  { to: '/admin/livre-d-or', label: 'Livre d’or', icon: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z', badge: 'temoignages' },
  { to: '/admin/messages', label: 'Messages', icon: 'M4 6h16v12H4V6Zm0 0 8 7 8-7', badge: 'messages' },
  {
    to: '/admin/reglages',
    label: 'Réglages',
    separe: true,
    icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.3l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2.2-1.3L14.3 3h-4l-.4 2.4a7.5 7.5 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.6l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 2.2 1.3l.4 2.4h4l.4-2.4a7.5 7.5 0 0 0 2.2-1.3l2.4 1 2-3.4-2-1.6c.1-.4.1-.9.1-1.3Z',
  },
]

function Icon({ d }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

/** Compteurs dans la navigation : témoignages en attente, messages non lus. */
function useCounts() {
  const t = useTable('temoignages')
  const m = useTable('messages')
  return {
    temoignages: t.rows?.filter((r) => r.statut === 'en_attente').length || 0,
    messages: m.rows?.filter((r) => !r.lu).length || 0,
  }
}

function DemoBanner() {
  if (isLive) return null
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-[#D6A23A]/18 px-5 py-2.5 text-[13px] text-[#6d4f12]">
      <p>
        <strong className="font-medium">Mode démo</strong> · Supabase n’est pas encore branché : vos changements restent dans ce
        navigateur. Voir <code className="rounded bg-lin/70 px-1">docs/BACKOFFICE.md</code>.
      </p>
      <button type="button" onClick={resetDemo} className="underline underline-offset-2">
        Réinitialiser la démo
      </button>
    </div>
  )
}

function Shell({ email, children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const counts = useCounts()
  // Menu mobile : se ferme tout seul quand on change de page.
  const [menuOn, setMenuOn] = useState(null)
  const menu = menuOn === pathname
  const setMenu = (v) => setMenuOn(v ? pathname : null)
  const navRef = useRef(null)

  // Entrée : les liens de la barre latérale glissent un à un.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => gsap.from('[data-nav-item]', { x: -24, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06 }))
      return () => mm.revert()
    },
    { scope: navRef },
  )

  const logout = async () => {
    await signOut()
    navigate('/admin/connexion')
  }

  // Sécurité : sans activité pendant 30 minutes, la session se ferme seule.
  useEffect(() => {
    let t
    const relancer = () => {
      clearTimeout(t)
      t = setTimeout(async () => {
        await signOut()
        navigate('/admin/connexion?raison=inactivite')
      }, INACTIVITE_MS)
    }
    const evts = ['pointerdown', 'keydown', 'scroll', 'mousemove']
    evts.forEach((e) => window.addEventListener(e, relancer, { passive: true }))
    relancer()
    return () => {
      clearTimeout(t)
      evts.forEach((e) => window.removeEventListener(e, relancer))
    }
  }, [navigate])

  return (
    <div className="min-h-svh bg-creme text-brun">
      <div className="flex">
        {/* Barre latérale */}
        <aside
          ref={navRef}
          className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-brun/10 bg-lin px-5 py-7 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] lg:sticky lg:top-0 lg:h-svh lg:translate-x-0 ${
            menu ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Link to="/admin" className="flex items-center gap-3 px-2">
            <Logo />
            <span>
              <span className="block font-serif text-[24px] leading-none">Néotisse</span>
              <span className="text-label text-brique">Back-office</span>
            </span>
          </Link>

          <nav aria-label="Back-office" className="mt-10 flex-1">
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => (
                <li key={item.to} data-nav-item className={item.separe ? 'mt-4 border-t border-brun/10 pt-4' : ''}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-full px-4 py-3 text-[15px] transition-colors duration-300 ${
                        isActive ? 'bg-terre-cuite text-lin' : 'text-brun hover:bg-creme'
                      }`
                    }
                  >
                    <Icon d={item.icon} />
                    <span className="flex-1 transition-transform duration-300 group-hover:translate-x-1">{item.label}</span>
                    {item.badge && counts[item.badge] > 0 && (
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brun px-2 text-[12px] text-lin">
                        {counts[item.badge]}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-brun/10 pt-5">
            <p className="truncate px-2 text-[13px] text-brun-doux">{email}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="/" target="_blank" rel="noreferrer" className="rounded-full border border-brun/20 px-4 py-2 text-[13px] transition-colors hover:bg-creme">
                Voir le site ↗
              </a>
              <button type="button" onClick={logout} className="rounded-full px-4 py-2 text-[13px] text-terre-cuite transition-colors hover:bg-creme">
                Déconnexion
              </button>
            </div>
          </div>
        </aside>
        {menu && <div className="fixed inset-0 z-30 bg-brun/30 lg:hidden" onClick={() => setMenu(false)} />}

        <main className="min-w-0 flex-1">
          <DemoBanner />
          {/* Barre du haut (mobile) */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-brun/10 bg-creme/90 px-5 py-3 backdrop-blur lg:hidden">
            <Link to="/admin" className="flex items-center gap-2">
              <Logo className="scale-75" />
              <span className="font-serif text-[20px]">Back-office</span>
            </Link>
            <button type="button" onClick={() => setMenu(true)} aria-label="Ouvrir le menu" className="flex h-10 items-center gap-2 rounded-full border border-brun/20 px-4 text-[14px]">
              Menu
            </button>
          </div>
          <div className="mx-auto max-w-[1180px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">{children}</div>
        </main>
      </div>
    </div>
  )
}

/** Application du back-office (/admin). Accessible seulement une fois connecté. */
export default function AdminApp() {
  const [session, setSession] = useState(undefined)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = 'Back-office · Néotisse'
    // Jamais référencé par les moteurs de recherche.
    let meta = document.querySelector('meta[name="robots"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'robots'
      document.head.appendChild(meta)
    }
    meta.content = 'noindex, nofollow'
    getSession().then(setSession)
  }, [pathname])

  // Lien reçu par e-mail (mot de passe oublié) : géré avant tout le reste.
  if (pathname === '/admin/nouveau-mot-de-passe') return <NouveauMotDePasse />
  // Site en ligne sans base de données : le back-office reste fermé.
  if (!isLive && !demoAllowed) return <NonActive />
  if (session === undefined) return <div className="min-h-svh bg-creme" />

  if (pathname === '/admin/connexion') {
    if (session) return <Navigate to="/admin" replace />
    return <Connexion onDone={() => getSession().then((s) => (setSession(s), navigate('/admin')))} />
  }
  if (!session) return <Navigate to="/admin/connexion" replace />

  return (
    <Shell email={session.user?.email}>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="evenements" element={<EventsAdmin />} />
        <Route path="actualites" element={<NewsAdmin />} />
        <Route path="livre-d-or" element={<GuestbookAdmin />} />
        <Route path="messages" element={<MessagesAdmin />} />
        <Route path="ateliers" element={<AteliersAdmin />} />
        <Route path="reglages" element={<ReglagesAdmin />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Shell>
  )
}
