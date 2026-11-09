import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const { pathname, hash } = useLocation()
  const isHome = pathname === '/'

  // Revient en haut de page à chaque navigation (sauf ancre).
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-encre focus:px-4 focus:py-2 focus:text-creme"
      >
        Aller au contenu
      </a>
      <Header variant={isHome ? 'overlay' : 'solid'} />
      <main id="contenu">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
