import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import TeamPage from './pages/Team'
import WorkshopsPage from './pages/Workshops'
import NewsPage from './pages/News'
import CalendarPage from './pages/Calendar'
import GuestbookPage from './pages/Guestbook'
import ContactPage from './pages/Contact'
import Placeholder from './pages/Placeholder'
import LegalNoticePage from './pages/LegalNotice'
import PrivacyPage from './pages/Privacy'
import CookiesPage from './pages/Cookies'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="association" element={<About />} />
          <Route path="equipe" element={<TeamPage />} />
          <Route path="ateliers" element={<WorkshopsPage />} />
          <Route path="actualites" element={<NewsPage />} />
          <Route path="calendrier" element={<CalendarPage />} />
          <Route path="livre-d-or" element={<GuestbookPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="mentions-legales" element={<LegalNoticePage />} />
          <Route path="confidentialite" element={<PrivacyPage />} />
          <Route path="cookies" element={<CookiesPage />} />
          <Route path="*" element={<Placeholder eyebrow="Erreur 404" title="Page introuvable" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
