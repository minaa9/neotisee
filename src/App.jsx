import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="association" element={<Placeholder eyebrow="L’association" title="L’association" />} />
          <Route path="equipe" element={<Placeholder eyebrow="L’équipe" title="L’équipe" />} />
          <Route path="ateliers" element={<Placeholder eyebrow="Nos ateliers" title="Nos ateliers" />} />
          <Route path="actualites" element={<Placeholder eyebrow="Actualités" title="Actualités" />} />
          <Route path="calendrier" element={<Placeholder eyebrow="Calendrier" title="Calendrier" />} />
          <Route path="livre-d-or" element={<Placeholder eyebrow="Livre d’or" title="Livre d’or" />} />
          <Route path="contact" element={<Placeholder eyebrow="Contact" title="Contact" />} />
          <Route path="mentions-legales" element={<Placeholder eyebrow="Informations" title="Mentions légales" />} />
          <Route path="confidentialite" element={<Placeholder eyebrow="Informations" title="Politique de confidentialité" />} />
          <Route path="*" element={<Placeholder eyebrow="Erreur 404" title="Page introuvable" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
