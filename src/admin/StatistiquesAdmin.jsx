import { PageTitle } from './kit'

// Rapport Looker Studio branché sur Google Analytics 4 (propriété « Néotisse vibecoding »).
// Pour changer de rapport : Looker Studio › Fichier › Intégrer le rapport › Intégrer l'URL.
const RAPPORT_LOOKER = 'https://lookerstudio.google.com/embed/reporting/a9e3cf6b-5139-43d4-be53-f52fba197da7/page/X8LEG'
const RAPPORT_LIEN = RAPPORT_LOOKER.replace('/embed/', '/')

/** Statistiques du site : le tableau de bord Looker Studio, mis à jour par GA4. */
export default function StatistiquesAdmin() {
  return (
    <>
      <PageTitle eyebrow="Audience" title="Statistiques du site">
        <a
          href={RAPPORT_LIEN}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-brun/25 px-5 py-2.5 text-[14px] text-brun transition-colors duration-300 hover:border-brun hover:bg-lin"
        >
          Ouvrir dans Looker Studio ↗
        </a>
      </PageTitle>

      <p className="mb-6 max-w-[640px] text-[15px] text-brun-doux">
        Données Google Analytics 4, mises à jour automatiquement. Seuls les visiteurs qui ont accepté les cookies de mesure
        d’audience sont comptés.
      </p>

      <div className="overflow-hidden rounded-[20px] border border-brun/10 bg-lin">
        <iframe
          title="Statistiques du site Néotisse (Looker Studio)"
          src={RAPPORT_LOOKER}
          className="block h-[1200px] w-full border-0"
          allowFullScreen
          loading="lazy"
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        />
      </div>

      <p className="mt-4 text-[13px] text-brun-doux">
        Le rapport ne s’affiche pas ? Connectez-vous à Google avec un compte qui a accès au rapport, ou ouvrez-le dans Looker
        Studio avec le bouton ci-dessus.
      </p>
    </>
  )
}
