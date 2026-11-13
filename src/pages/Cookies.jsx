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
    titre: 'Ce que ce site utilise',
    contenu: (
      <>
        <P>Le site Néotisse est volontairement léger : aucun cookie publicitaire, aucun réseau social intégré, aucun suivi de navigation.</P>
        <div className="mt-6 overflow-x-auto rounded-[20px] border border-brun/10">
          <table className="w-full min-w-[520px] text-left text-petit">
            <thead className="bg-lin text-label text-brique">
              <tr>
                <th scope="col" className="px-5 py-4 font-normal">Nom</th>
                <th scope="col" className="px-5 py-4 font-normal">À quoi il sert</th>
                <th scope="col" className="px-5 py-4 font-normal">Durée</th>
              </tr>
            </thead>
            <tbody className="text-brun-doux">
              <tr className="border-t border-brun/10">
                <td className="px-5 py-4 text-brun">neotisse-cookies</td>
                <td className="px-5 py-4">Retenir votre choix sur les cookies (stockage local du navigateur)</td>
                <td className="px-5 py-4">6 mois</td>
              </tr>
              <tr className="border-t border-brun/10">
                <td className="px-5 py-4 text-brun">sb-…-auth-token</td>
                <td className="px-5 py-4">Garder connectés les membres de l’association à l’espace de gestion. Jamais déposé pour les visiteurs.</td>
                <td className="px-5 py-4">Jusqu’à la déconnexion</td>
              </tr>
            </tbody>
          </table>
        </div>
        <P>
          Ce stockage est strictement nécessaire : il ne contient aucune donnée personnelle et ne
          quitte jamais votre navigateur.
        </P>
      </>
    ),
  },
  {
    id: 'reglages',
    titre: 'Vos réglages',
    contenu: (
      <>
        <P>Vous pouvez changer d’avis à tout moment, ici même :</P>
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
      maj="12 novembre 2026"
      sections={sections}
    />
  )
}
