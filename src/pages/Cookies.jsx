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
            <span className="block text-petit text-brun-doux">Google Analytics : compter les visites et les pages vues, pour améliorer le site.</span>
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
  { nom: 'neotisse-cookies', qui: 'Tous les visiteurs', role: 'Retenir votre choix sur les cookies, pour ne pas vous reposer la question à chaque visite.', duree: '12 mois' },
  { nom: 'neotisse-annonce-fermee', qui: 'Tous les visiteurs', role: 'Ne plus afficher le bandeau d’annonce une fois que vous l’avez fermé.', duree: 'Jusqu’à la fermeture de l’onglet' },
  { nom: 'sb-…-auth-token', qui: 'Équipe uniquement', role: 'Garder les membres de l’association connectés à l’espace de gestion. Jamais déposé pour les visiteurs.', duree: 'Jusqu’à la déconnexion' },
  { nom: '_ga', qui: 'Avec votre accord', role: 'Google Analytics : reconnaître un navigateur d’une visite à l’autre, pour compter les visiteurs sans connaître leur identité.', duree: '13 mois' },
  { nom: '_ga_G6EEVQB8N4', qui: 'Avec votre accord', role: 'Google Analytics : suivre le déroulé de votre visite (pages vues, durée).', duree: '13 mois' },
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
          Le site Néotisse est volontairement léger : aucun cookie publicitaire, aucun bouton de réseau social qui vous
          suit. Seule la mesure d’audience (Google Analytics) dépose des cookies, et uniquement si vous l’acceptez. Voici
          tout ce qui peut être enregistré dans votre navigateur :
        </P>
        <ul className="mt-6 flex flex-col gap-3">
          {TRACEURS.map((t) => (
            <li key={t.nom} className="grid gap-3 rounded-[22px] border border-brun/10 bg-lin p-5 sm:grid-cols-[1fr_150px] sm:items-start sm:gap-6">
              <div>
                <p className="flex flex-wrap items-center gap-2">
                  <code className="rounded-md bg-creme px-2 py-0.5 text-[13px] text-brun">{t.nom}</code>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[12px] ${
                      t.qui === 'Équipe uniquement' ? 'bg-brun/8 text-brun-doux' : t.qui === 'Avec votre accord' ? 'bg-[#D6A23A]/18 text-[#8a6418]' : 'bg-terre-cuite/12 text-terre-cuite'
                    }`}
                  >
                    {t.qui}
                  </span>
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
          Les trois premiers éléments sont strictement nécessaires au fonctionnement du site : la loi n’exige pas votre
          accord pour eux. Ils ne contiennent aucune donnée permettant de vous identifier et ne sont lus par aucun autre
          site. Les cookies <code className="text-[13px]">_ga</code> ne sont déposés que si vous acceptez la mesure
          d’audience.
        </P>
      </>
    ),
  },
  {
    id: 'audience',
    titre: 'La mesure d’audience',
    contenu: (
      <>
        <P>
          Avec votre accord, Google Analytics 4 nous indique comment le site est utilisé, sous forme de statistiques :
        </P>
        <Liste
          items={[
            'les pages consultées et le temps passé ;',
            'la provenance de la visite (moteur de recherche, réseau social, lien direct…) ;',
            'le type d’appareil (ordinateur, téléphone, tablette) et la ville approximative ;',
            'les actions utiles : envoi du formulaire de contact, clic sur l’adresse e-mail ou le téléphone, clic sur un événement du calendrier.',
          ]}
        />
        <P>
          Ces chiffres sont anonymes : ils ne contiennent ni votre nom, ni votre adresse e-mail, ni le contenu de vos
          messages, et Google Analytics n’enregistre pas votre adresse IP. Ils servent uniquement à l’équipe, depuis son
          espace de gestion, pour améliorer le site. Le détail des visites est conservé 2 mois par Google Analytics,
          ensuite il ne reste que des chiffres globaux.
        </P>
        <P>
          Sans votre accord, aucun cookie n’est déposé : Google reçoit seulement un signal anonyme indiquant qu’une page
          a été vue, sans rien qui permette de vous reconnaître.
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
          La mesure d’audience ne fonctionne qu’avec votre accord. Vous pouvez changer d’avis à tout moment, ici même :
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
      intro="Pas de publicité ici : de quoi retenir votre choix et, si vous l’acceptez, mesurer l’audience du site. Voici le détail, et de quoi le modifier."
      maj="26 novembre 2026"
      essentiel={[
        { titre: 'Publicité', texte: 'Aucun cookie' },
        { titre: 'Mesure d’audience', texte: 'Google Analytics, avec votre accord' },
        { titre: 'Stocké chez vous', texte: 'Votre choix, 12 mois' },
        { titre: 'Partagé', texte: 'Avec Google, si vous acceptez' },
      ]}
      sections={sections}
    />
  )
}
