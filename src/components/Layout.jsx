import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import SiteMotion from '../motion/SiteMotion'
import Cursor from '../motion/Cursor'
import PageTransition from '../motion/PageTransition'
import CookieBanner from './CookieBanner'

// Pages dont l'en-tête est posé sur une photo (navigation claire).
const PHOTO_HEADERS = ['/']
// Pages qui finissent par une section pêche (le pied de page continue sans vague).
const PEACH_ENDINGS = ['/actualites', '/livre-d-or']

export default function Layout() {
  const { pathname, hash } = useLocation()

  // Revient en haut de page à chaque navigation (sauf ancre).
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-brun focus:px-4 focus:py-2 focus:text-lin"
      >
        Aller au contenu
      </a>
      <Header variant={PHOTO_HEADERS.includes(pathname) ? 'photo' : 'creme'} />
      <main id="contenu">
        <Outlet />
      </main>
      <SiteMotion />
      <PageTransition />
      <Cursor />
      <Footer afterPeach={PEACH_ENDINGS.includes(pathname)} besideCalendar={pathname === '/calendrier'} />
      <CookieBanner />
    </>
  )
}
