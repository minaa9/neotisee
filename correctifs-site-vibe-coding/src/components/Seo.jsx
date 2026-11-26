import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Titre et description de chaque page (référencement).
 * Pour modifier un texte : changer la ligne de la page concernée.
 * Titre : 50 à 60 caractères. Description : 140 à 155 caractères.
 */
const PAGES = {
  '/': {
    title: 'Néotisse · Ateliers textiles anciens à Montpellier',
    description:
      'Association d’archéologie expérimentale à Montpellier : ateliers de filage, tissage, teinture végétale et broderie, du Néolithique au Moyen Âge.',
  },
  '/association': {
    title: 'Archéologie expérimentale textile · L’association Néotisse',
    description:
      'Créée en 2024 à Montpellier, Néotisse fait revivre les savoir-faire textiles anciens avec rigueur scientifique et des ateliers adaptés à chaque public.',
  },
  '/equipe': {
    title: 'L’équipe · Archéologues spécialistes du textile | Néotisse',
    description:
      'Découvrez les fondatrices de Néotisse, leur parcours en archéologie et leur expertise des techniques textiles du Néolithique au Moyen Âge.',
  },
  '/ateliers': {
    title: 'Ateliers filage, tissage et teinture végétale · Néotisse',
    description:
      'Ateliers et démonstrations sur mesure pour musées, festivals, écoles et collectivités : filage, tissage, teinture végétale et broderie historique.',
  },
  '/calendrier': {
    title: 'Calendrier des ateliers et événements · Néotisse',
    description:
      'Retrouvez les prochaines dates de Néotisse : festivals, démonstrations et ateliers textiles à Montpellier et en Occitanie. Lieux et infos pratiques.',
  },
  '/actualites': {
    title: 'Actualités : festivals et projets textiles · Néotisse',
    description:
      'Les dernières nouvelles de Néotisse : participations aux festivals, collaborations, projets de recherche et coulisses des ateliers textiles.',
  },
  '/livre-d-or': {
    title: 'Livre d’or · Avis sur nos ateliers textiles | Néotisse',
    description:
      'Ce que les participants, structures et partenaires disent des ateliers Néotisse. Laissez à votre tour un témoignage sur votre expérience.',
  },
  '/contact': {
    title: 'Contact et demande de prestation · Néotisse',
    description:
      'Un projet d’atelier, de démonstration ou d’intervention ? Présentez votre événement à Néotisse et recevez une proposition personnalisée.',
  },
  '/mentions-legales': {
    title: 'Mentions légales · Néotisse',
    description: 'Mentions légales du site de l’association Néotisse : éditeur, hébergement et propriété des contenus.',
  },
  '/confidentialite': {
    title: 'Politique de confidentialité · Néotisse',
    description:
      'Comment l’association Néotisse collecte, utilise et protège les données envoyées par le formulaire de contact et le livre d’or.',
  },
  '/cookies': {
    title: 'Gestion des cookies · Néotisse',
    description: 'Les cookies utilisés sur le site de l’association Néotisse et la façon de gérer vos préférences.',
  },
}

const NOT_FOUND = {
  title: 'Page introuvable · Néotisse',
  description: 'Cette page n’existe pas ou a été déplacée. Retrouvez les ateliers, le calendrier et le contact de Néotisse depuis l’accueil.',
}

function setMeta(selector, attr, name, content) {
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export default function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
    const page = PAGES[path] || NOT_FOUND
    document.title = page.title
    setMeta('meta[name="description"]', 'name', 'description', page.description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', page.title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', page.description)
    // Les pages inconnues ne doivent pas apparaître dans Google.
    setMeta('meta[name="robots"]', 'name', 'robots', PAGES[path] ? 'index, follow' : 'noindex')
  }, [pathname])

  return null
}
