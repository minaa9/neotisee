import { Link } from 'react-router'
import LegalLayout, { ACompleter, Liste, P } from '../components/LegalLayout'
import { useContact } from '../lib/reglages'

function Tel() {
  const { phone, phoneHref } = useContact()
  return (
    <a href={phoneHref} className="link-fil text-terre-cuite">
      {phone}
    </a>
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
    id: 'editeur',
    titre: 'Éditeur du site',
    contenu: (
      <>
        <P>
          Le site Néotisse est édité par l’association <strong className="font-normal text-brun">Néotisse</strong>,
          association loi 1901 fondée en 2024, dédiée à la médiation scientifique autour des
          savoir-faire textiles anciens.
        </P>
        <Liste
          items={[
            <>Siège social : <ACompleter>adresse du siège</ACompleter>, Montpellier, France</>,
            <>Numéro RNA : <ACompleter>numéro W… de déclaration en préfecture</ACompleter></>,
            <>SIRET (si l’association en possède un) : <ACompleter>numéro SIRET</ACompleter></>,
            <>Courriel : <Mail /></>,
            <>
              Téléphone : <Tel />
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'publication',
    titre: 'Directeur de la publication',
    contenu: (
      <P>
        La directrice ou le directeur de la publication est <ACompleter>nom et prénom</ACompleter>, en
        qualité de <ACompleter>fonction, par exemple présidente de l’association</ACompleter>. Contact :{' '}
        <Mail />.
      </P>
    ),
  },
  {
    id: 'hebergement',
    titre: 'Hébergement',
    contenu: (
      <>
        <P>Le site est hébergé par :</P>
        <Liste
          items={[
            <>Netlify, Inc.</>,
            <>
              Adresse : <ACompleter>adresse postale indiquée sur netlify.com/legal</ACompleter>,
              San Francisco, Californie, États-Unis
            </>,
            <>
              Site :{' '}
              <a href="https://www.netlify.com" target="_blank" rel="noreferrer" className="link-fil text-terre-cuite">
                www.netlify.com
              </a>
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'conception',
    titre: 'Conception et réalisation',
    contenu: (
      <P>
        Le site a été conçu et réalisé par l’agence ÉTHER, avec le framework React. Les textes sont
        rédigés par l’association Néotisse.
      </P>
    ),
  },
  {
    id: 'propriete',
    titre: 'Propriété intellectuelle',
    contenu: (
      <>
        <P>
          L’ensemble des contenus de ce site (textes, photographies, illustrations, logo, charte
          graphique) est la propriété de l’association Néotisse ou de leurs auteurs respectifs, et
          est protégé par le droit d’auteur.
        </P>
        <P>
          Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation
          écrite préalable est interdite. Pour toute demande d’utilisation, écrivez-nous à <Mail />.
        </P>
        <P>
          Crédits photographiques : <ACompleter>noms des photographes, le cas échéant</ACompleter>.
        </P>
      </>
    ),
  },
  {
    id: 'responsabilite',
    titre: 'Responsabilité',
    contenu: (
      <>
        <P>
          L’association s’efforce de publier des informations exactes et à jour, notamment les dates
          des ateliers et événements. Elle ne peut toutefois garantir l’absence d’erreur ou
          d’omission ; en cas de doute, n’hésitez pas à nous contacter avant de vous déplacer.
        </P>
        <P>
          Le site peut contenir des liens vers d’autres sites (réseaux sociaux, partenaires).
          L’association n’est pas responsable de leur contenu.
        </P>
      </>
    ),
  },
  {
    id: 'donnees',
    titre: 'Données personnelles et cookies',
    contenu: (
      <P>
        La façon dont nous traitons vos données est expliquée dans notre{' '}
        <Link to="/confidentialite" className="link-fil text-terre-cuite">
          politique de confidentialité
        </Link>
        , et l’usage des cookies sur la page{' '}
        <Link to="/cookies" className="link-fil text-terre-cuite">
          gestion des cookies
        </Link>
        .
      </P>
    ),
  },
]

export default function LegalNoticePage() {
  return (
    <LegalLayout
      current="/mentions-legales"
      title="Mentions légales"
      intro="Qui se cache derrière ce site, qui l’héberge et comment nous joindre."
      maj="12 novembre 2026"
      sections={sections}
    />
  )
}
