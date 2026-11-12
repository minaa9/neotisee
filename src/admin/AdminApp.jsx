import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router'
import { Logo } from '../components/ui'
import { getSession, isLive, resetDemo, signIn, signOut } from '../lib/store'
import { MOTION_OK, gsap, useGSAP } from '../motion/gsap'
import { Btn, Champ } from './kit'
import { useTable } from './hooks'
import { fieldCls } from './format'
import Dashboard from './Dashboard'
import EventsAdmin from './EventsAdmin'
import NewsAdmin from './NewsAdmin'
import GuestbookAdmin from './GuestbookAdmin'
import MessagesAdmin from './MessagesAdmin'

const NAV = [
  { to: '/admin', label: 'Tableau de bord', end: true, icon: 'M3 12h7V3H3v9Zm11 9h7v-9h-7v9ZM3 21h7v-5H3v5Zm11-12h7V3h-7v6Z' },
  { to: '/admin/evenements', label: 'Événements', icon: 'M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z' },
  { to: '/admin/actualites', label: 'Actualités', icon: 'M5 4h11l3 3v13H5V4Zm3 6h8M8 14h8M8 18h5' },
  { to: '/admin/livre-d-or', label: 'Livre d’or', icon: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z', badge: 'temoignages' },
  { to: '/admin/messages', label: 'Messages', icon: 'M4 6h16v12H4V6Zm0 0 8 7 8-7', badge: 'messages' },
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
                <li key={item.to} data-nav-item>
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

function Login({ onDone }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-login]', { y: 30, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.08 })
        gsap.from('[data-login-fil]', { drawSVG: 0, duration: 2.2, ease: 'power2.inOut' })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(email.trim(), password)
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div ref={ref} className="relative flex min-h-svh items-center justify-center overflow-hidden bg-creme px-5">
      <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full">
        <path data-login-fil d="M-20 640 C 260 520, 420 760, 700 640 C 820 590, 860 560, 900 600 C 930 630, 880 670, 860 640 C 840 610, 920 560, 1000 580 C 1180 620, 1300 520, 1460 560" fill="none" stroke="#B4583D" strokeOpacity="0.5" strokeWidth="1.4" />
      </svg>
      <form onSubmit={submit} className="relative w-full max-w-[440px] rounded-[32px] bg-lin p-8 shadow-[0_30px_80px_-40px_rgba(61,42,35,0.5)] sm:p-10">
        <div data-login className="flex items-center gap-3">
          <Logo />
          <span className="text-label text-brique">Back-office</span>
        </div>
        <h1 data-login className="mt-6 font-serif text-[44px] leading-[1.02] font-light">
          Bon retour <em>parmi nous</em>
        </h1>
        <p data-login className="mt-3 text-petit text-brun-doux">
          {isLive ? 'Connectez-vous avec le compte de l’association.' : 'Mode démo : saisissez n’importe quelle adresse pour entrer.'}
        </p>
        <div data-login className="mt-8 flex flex-col gap-5">
          <Champ label="Adresse e-mail">
            <input type="email" required={isLive} autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldCls} placeholder="asso.neotisse@gmail.com" />
          </Champ>
          <Champ label="Mot de passe">
            <input type="password" required={isLive} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldCls} />
          </Champ>
        </div>
        {error && (
          <p role="alert" className="mt-4 text-petit text-terre-cuite">
            {error}
          </p>
        )}
        <div data-login className="mt-8 flex items-center justify-between gap-4">
          <a href="/" className="link-fil text-[14px] text-brun-doux">
            ← Retour au site
          </a>
          <Btn type="submit" disabled={busy}>
            {busy ? 'Connexion…' : 'Se connecter'}
          </Btn>
        </div>
      </form>
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
    getSession().then(setSession)
  }, [pathname])

  if (session === undefined) return <div className="min-h-svh bg-creme" />

  if (pathname === '/admin/connexion') {
    if (session) return <Navigate to="/admin" replace />
    return <Login onDone={() => getSession().then((s) => (setSession(s), navigate('/admin')))} />
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
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Shell>
  )
}
