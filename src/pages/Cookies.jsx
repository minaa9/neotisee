import { useEffect, useState } from 'react'
import LegalLayout, { Liste, P } from '../components/LegalLayout'
import { Toggle } from '../components/CookieBanner'
import { CHANGE_EVENT, getConsent, saveConsent } from '../data/cookies'
import { useContact } from '../lib/reglages'

/** Réglages directement dans la page, synchronisés avec la bannière. */
function Reglages() {
  const [consent, setConsent] = useState(() => getConsent())
  useEffect(() => {
    const onChange = (e) => setConsent(e.detail)
    window.addEventListener(CHANGE_EVENT, onChange)
    return () => window.removeEventListener(CHANGE_EVENT, onChange)
  }, [])
  const [saved, setSaved] = useState(false)

  return (
    <div className="mt-6 rounded-[28px] bg-lin p-6 sm:p-8">
      <ul className="flex flex-col gap-5">
        <li className="flex items-center justify-between gap-6">
          <span>
            <span className="block font-serif text-[22px] text-brun">Nécessaires</span>
            <span className="block text-petit text-brun-doux">Retenir votre choix sur les cookies. Toujours actifs.</span>
          </span>
          <Toggle checked disabled onChange={() => {}} label="Cookies nécessaires, toujours actifs" />
        </li>
        <li className="flex items-center justify-between gap-6 border-t border-brun/10 pt-5">
          <span>
            <span className="block font-serif text-[22px] text-brun">Mesure d’audience</span>
            <span className="block text-petit text-brun-doux">Aucun outil n’est installé pour l’instant ; votre choix sera respecté si nous en ajoutons un.</span>
          </span>
          <Toggle
            checked={!!consent?.audience}
            label="Cookies de mesure d’audience"
            onChange={(v) => {
              setConsent(saveConsent({ audience: v }))
              setSaved(true)
            }}
          />
        </li>
      </ul>
      <p role="status" className="mt-5 min-h-[1.5em] text-petit text-terre-cuite">
        {saved ? 'Votre choix est enregistré.' : consent ? '' : 'Vous n’avez pas encore fait de choix.'}
      </p>
    </div>
  )
}

function Mail() {
  const { email } = useContact()
  return (
    <a href={`mailto:${email}`} className="link-fil text-terre-cuite">
      {email}
    </a>
  )
}

const TRACEURS = [
  { nom: 'neotisse-cookies', qui: 'Tous les visiteurs', role: 'Retenir votre choix sur les cookies, pour ne pas vous reposer la question à chaque visite.', duree: '6 mois' },
  { nom: 'neotisse-annonce-fermee', qui: 'Tous les visiteurs', role: 'Ne plus afficher le bandeau d’annonce une fois que vous l’avez fermé.', duree: 'Jusqu’à la fermeture de l’onglet' },
  { nom: 'sb-…-auth-token', qui: 'Équipe uniquement', role: 'Garder les membres de l’association connectés à l’espace de gestion. Jamais déposé pour les visiteurs.', duree: 'Jusqu’à la déconnexion' },
]

const sections = [
  {
    id: 'definition',
    titre: 'Un cookie, c’est quoi ?',
    contenu: (
      <P>
        Un cookie (ou traceur) est un petit fichier ou une petite information enregistrée par votre
        navigateur lorsque vous visitez un site. Il permet par exemple de se souvenir de vos
        préférences d’une visite à l’autre.
      </P>
    ),
  },
  {
    id: 'utilises',
    titre: 'Ce que ce site enregistre',
    contenu: (
      <>
        <P>
          Le site Néotisse est volontairement léger : aucun cookie publicitaire, aucun outil de mesure d’audience, aucun
          bouton de réseau social qui vous suit. Voici tout ce qui peut être enregistré dans votre navigateur :
        </P>
        <ul className="mt-6 flex flex-col gap-3">
          {TRACEURS.map((t) => (
            <li key={t.nom} className="grid gap-3 rounded-[22px] border border-brun/10 bg-lin p-5 sm:grid-cols-[1fr_150px] sm:items-start sm:gap-6">
              <div>
                <p className="flex flex-wrap items-center gap-2">
                  <code className="rounded-md bg-creme px-2 py-0.5 text-[13px] text-brun">{t.nom}</code>
                  <span className={`rounded-full px-2.5 py-0.5 text-[12px] ${t.qui === 'Équipe uniquement' ? 'bg-brun/8 text-brun-doux' : 'bg-terre-cuite/12 text-terre-cuite'}`}>{t.qui}</span>
                </p>
                <p className="mt-2 text-petit text-brun-doux">{t.role}</p>
              </div>
              <p className="text-petit text-brun sm:text-right">
                <span className="block text-label text-brique">Durée</span>
                {t.duree}
              </p>
            </li>
          ))}
        </ul>
        <P>
          Ces éléments sont strictement nécessaires au fonctionnement du site : la loi n’exige pas votre accord pour
          eux. Ils ne contiennent aucune donnée permettant de vous identifier et ne sont lus par aucun autre site.
        </P>
      </>
    ),
  },
  {
    id: 'reglages',
    titre: 'Vos réglages',
    contenu: (
      <>
        <P>
          Si nous ajoutons un jour un outil de mesure d’audience, il ne fonctionnera qu’avec votre accord. Vous pouvez
          changer d’avis à tout moment, ici même :
        </P>
        <Reglages />
      </>
    ),
  },
  {
    id: 'navigateur',
    titre: 'Depuis votre navigateur',
    contenu: (
      <>
        <P>Vous pouvez aussi effacer ou bloquer les cookies dans les réglages de votre navigateur :</P>
        <Liste
          items={[
            'Chrome : Paramètres › Confidentialité et sécurité › Cookies',
            'Firefox : Paramètres › Vie privée et sécurité',
            'Safari : Réglages › Confidentialité',
            'Edge : Paramètres › Cookies et autorisations de site',
          ]}
        />
        <P>
          Une question ?{' '}
          <Mail />
        </P>
      </>
    ),
  },
]

export default function CookiesPage() {
  return (
    <LegalLayout
      current="/cookies"
      title="Gestion des cookies"
      intro="Pas de pistage ici : seulement de quoi retenir votre choix. Voici le détail, et de quoi le modifier."
      maj="16 novembre 2026"
      essentiel={[
        { titre: 'Publicité', texte: 'Aucun cookie' },
        { titre: 'Mesure d’audience', texte: 'Aucune, sans votre accord' },
        { titre: 'Stocké chez vous', texte: 'Votre choix, 6 mois' },
        { titre: 'Partagé', texte: 'Avec personne' },
      ]}
      sections={sections}
    />
  )
}
