/** Champ de saisie du back-office. */
export const fieldCls =
  'w-full rounded-[14px] border border-brun/15 bg-creme px-4 py-3 text-[14px] text-brun placeholder:text-brun-doux/70 transition-colors focus:border-terre-cuite focus:outline-none'

export const formatDate = (iso, opts = { day: 'numeric', month: 'long', year: 'numeric' }) =>
  iso ? new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString('fr-FR', opts) : ''
