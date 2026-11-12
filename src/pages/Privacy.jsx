import { Link } from 'react-router'
import LegalLayout, { ACompleter, Liste, P } from '../components/LegalLayout'
import { contact } from '../data/navigation'

const mail = (
  <a href={`mailto:${contact.email}`} className="link-fil text-terre-cuite">
    {contact.email}
  </a>
)

const sections = [
  {
    id: 'responsable',
    titre: 'Qui est responsable de vos données ?',
    contenu: (
      <P>
        L’association Néotisse, dont le siège est à Montpellier, est responsable des données
        collectées sur ce site. Pour toute question : {mail}.
      </P>
    ),
  },
  {
    id: 'collecte',
    titre: 'Quelles données et pourquoi ?',
    contenu: (
      <>
        <P>Nous ne collectons que ce dont nous avons besoin pour vous répondre :</P>
        <Liste
          items={[
            <>
              <strong className="font-normal text-brun">Formulaire de contact</strong> (nom, adresse
              e-mail, objet, message, éventuellement le rendez-vous choisi) : pour répondre à vos
              questions, gérer les inscriptions aux ateliers et les demandes de prestation.
            </>,
            <>
              <strong className="font-normal text-brun">Livre d’or</strong> (prénom, atelier suivi,
              note, message) : pour publier votre témoignage sur le site, après relecture, avec votre
              seul prénom.
            </>,
          ]}
        />
        <P>
          Les messages et témoignages envoyés sont enregistrés dans la base de données de
          l’association, hébergée par Supabase, et consultés depuis notre espace de gestion réservé
          à l’équipe. Les témoignages ne sont publiés qu’après relecture.
        </P>
        <P>
          La base légale de ces traitements est votre consentement (vous choisissez de nous écrire)
          et l’intérêt légitime de l’association à organiser ses activités.
        </P>
      </>
    ),
  },
  {
    id: 'destinataires',
    titre: 'Qui peut les voir ?',
    contenu: (
      <P>
        Seuls les membres de l’association chargés de vous répondre ont accès à vos messages. Vos
        données ne sont jamais vendues ni cédées. Les échanges transitent par notre messagerie
        électronique, gérée par <ACompleter>fournisseur de la boîte mail de l’association</ACompleter>.
      </P>
    ),
  },
  {
    id: 'duree',
    titre: 'Combien de temps ?',
    contenu: (
      <Liste
        items={[
          <>Messages et demandes : le temps de traiter votre demande, puis au maximum 3 ans après notre dernier échange.</>,
          <>Témoignages du livre d’or : tant qu’ils sont publiés, ou jusqu’à ce que vous demandiez leur retrait.</>,
        ]}
      />
    ),
  },
  {
    id: 'tiers',
    titre: 'Services extérieurs',
    contenu: (
      <>
        <P>Pour fonctionner, le site s’appuie sur trois services :</P>
        <Liste
          items={[
            <>
              <strong className="font-normal text-brun">Netlify</strong> (hébergement) : comme tout
              hébergeur, il reçoit votre adresse IP pour afficher le site et le protéger des abus.
            </>,
            <>
              <strong className="font-normal text-brun">Supabase</strong> (base de données) : conserve
              les messages, témoignages et contenus du site. Région d’hébergement :{' '}
              <ACompleter>région choisie, par exemple Union européenne (Paris)</ACompleter>.
            </>,
            <>
              <strong className="font-normal text-brun">Google Fonts</strong> (polices d’écriture) :
              les polices sont chargées depuis les serveurs de Google, qui reçoivent ainsi votre
              adresse IP.
            </>,
          ]}
        />
        <P>
          Ces sociétés sont situées aux États-Unis ou y ont leur maison mère. Les transferts sont encadrés par le cadre de
          protection des données UE – États-Unis et les clauses contractuelles types de la
          Commission européenne.
        </P>
        <P>
          Les liens vers Instagram et Facebook ne déposent rien tant que vous ne cliquez pas dessus ;
          une fois sur ces réseaux, ce sont leurs propres règles qui s’appliquent.
        </P>
      </>
    ),
  },
  {
    id: 'droits',
    titre: 'Vos droits',
    contenu: (
      <>
        <P>Conformément au RGPD et à la loi Informatique et Libertés, vous pouvez à tout moment :</P>
        <Liste
          items={[
            'accéder à vos données et en obtenir une copie ;',
            'les faire rectifier ou effacer ;',
            'vous opposer à leur traitement ou en demander la limitation ;',
            'retirer votre consentement, par exemple pour faire retirer un témoignage.',
          ]}
        />
        <P>
          Il suffit d’écrire à {mail}. Nous vous répondrons dans un délai d’un mois. Si vous estimez
          que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (
          <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="link-fil text-terre-cuite">
            www.cnil.fr
          </a>
          ).
        </P>
      </>
    ),
  },
  {
    id: 'cookies',
    titre: 'Cookies',
    contenu: (
      <P>
        Tout est expliqué sur la page{' '}
        <Link to="/cookies" className="link-fil text-terre-cuite">
          gestion des cookies
        </Link>
        .
      </P>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalLayout
      current="/confidentialite"
      title="Confidentialité"
      intro="Quelles données nous recevons, ce que nous en faisons et comment exercer vos droits. En bref : le strict nécessaire."
      maj="12 novembre 2026"
      sections={sections}
    />
  )
}
