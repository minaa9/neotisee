/**
 * Force d'un mot de passe, de 0 (très faible) à 4 (excellent), avec les
 * conseils pour l'améliorer. 10 caractères minimum pour le back-office.
 */
export const MIN_MDP = 10

export function forceMotDePasse(mdp = '') {
  const conseils = []
  if (mdp.length < MIN_MDP) conseils.push(`au moins ${MIN_MDP} caractères`)
  if (!/[a-z]/.test(mdp) || !/[A-Z]/.test(mdp)) conseils.push('des minuscules et des majuscules')
  if (!/\d/.test(mdp)) conseils.push('un chiffre')
  if (!/[^A-Za-z0-9]/.test(mdp)) conseils.push('un caractère spécial (! ? # …)')
  let score = 4 - conseils.length
  if (mdp.length >= 16 && score < 4) score++
  if (/^(.)\1+$/.test(mdp) || /(azerty|qwerty|123456|motdepasse|password|neotisse)/i.test(mdp)) score = 0
  if (!mdp) score = 0
  const libelles = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Excellent']
  return { score, libelle: libelles[score], conseils, valide: mdp.length >= MIN_MDP && score >= 3 }
}

/** Déconnexion automatique après ce temps sans activité. */
export const INACTIVITE_MS = 30 * 60 * 1000
