/** Utilitaires des formulaires V3. */

export const inputCls = (error) =>
  `w-full rounded-[14px] border bg-creme px-4 text-[14px] leading-[1.55] text-brun placeholder:text-brun-doux/80 transition-colors focus:border-[1.5px] focus:border-terre-cuite focus:outline-none ${
    error ? 'border-[1.5px] border-terre-cuite' : 'border-brun/15'
  }`

/** Flèche du menu déroulant, en image de fond. */
export const selectArrow =
  "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%227%22><path d=%22M1 1l5 5 5-5%22 fill=%22none%22 stroke=%22%236e5348%22 stroke-width=%221.3%22/></svg>')] bg-[position:right_18px_center] bg-no-repeat pr-10"

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Pas encore de serveur d'envoi : on ouvre la messagerie de l'internaute
 * avec le message pré-rempli. À remplacer par un service de formulaire
 * (Formspree, Netlify Forms…) au moment de la mise en ligne.
 */
export function openMail(to, subject, body) {
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
