/**
 * Vercel Function · /api/ga4-statistiques?jours=28
 * Même code que la version Netlify (chiffres GA4 pour le back-office).
 * Variables d'environnement : voir docs/STATISTIQUES.md.
 */
import statistiques from '../netlify/functions/ga4-statistiques.mjs'

export function GET(request) {
  return statistiques(request)
}
