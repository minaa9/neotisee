import { Link } from 'react-router'
import LegalLayout, { Fiche, Lien, Liste, P } from '../components/LegalLayout'
import { useContact } from '../lib/reglages'

function Mail() {
  const { email } = useContact()
  return <Lien href={`mailto:${email}`}>{email}</Lien>
}
function Tel() {
  const { phone, phoneHref } = useContact()
  return <Lien href={phoneHref}>{phone}</Lien>
}

const sections = [
  {
    id: 'editeur',
    titre: 'Éditeur du site',
    contenu: (
      <>
        <P>
          Ce site est édité par l’association <strong className="font-normal text-brun">Néotisse</strong>, association régie par
          la loi du 1er juillet 1901, dédiée à la médiation scientifique autour des savoir-faire textiles anciens.
        </P>
        <Fiche
          lignes={[
            ['Nom', 'Néotisse'],
            ['Forme', 'Association loi 1901, sans but lucratif'],
            ['Création', '2024'],
            ['Siège', 'Montpellier (Hérault), France'],
            ['E-mail', <Mail key="m" />],
            ['Téléphone', <Tel key="t" />],
          ]}
        />
      </>
    ),
  },
  {
    id: 'publication',
    titre: 'Direction de la publication',
    contenu: (
      <P>
        La direction de la publication est assurée par la présidence de l’association Néotisse, en sa qualité de
        représentante légale. Pour la joindre : <Mail />.
      </P>
    ),
  },
  {
    id: 'hebergement',
    titre: 'Hébergement',
    contenu: (
      <>
        <P>Le site et ses données sont hébergés par :</P>
        <Fiche
          lignes={[
            [
              'Site',
              <>
                Netlify, Inc. · 101 2nd Street, San Francisco, CA 94105, États-Unis ·{' '}
                <Lien href="https://www.netlify.com">netlify.com</Lien>
              </>,
            ],
            [
              'Base de données',
              <>
                Supabase, Inc. (messages, témoignages et contenus gérés par l’équipe) ·{' '}
                <Lien href="https://supabase.com">supabase.com</Lien>
              </>,
            ],
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
        Design et développement : agence ÉTHER. Textes et photographies : association Néotisse. Polices de caractères :
        Cormorant Garamond et Jost, sous licence libre (SIL Open Font License), servies par Google Fonts.
      </P>
    ),
  },
  {
    id: 'propriete',
    titre: 'Propriété intellectuelle',
    contenu: (
      <>
        <P>
          L’ensemble des contenus de ce site (textes, photographies, illustrations, logo et charte graphique) est protégé
          par le droit d’auteur et appartient à l’association Néotisse ou à leurs auteurs respectifs.
        </P>
        <P>
          Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable est
          interdite. Pour utiliser un contenu (article, exposé, presse…), écrivez-nous à <Mail /> : nous répondons
          volontiers.
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
          L’association veille à publier des informations exactes et à jour, notamment les dates des ateliers et des
          événements. Une erreur reste toutefois possible : en cas de doute, contactez-nous avant de vous déplacer.
        </P>
        <P>
          Le site contient des liens vers d’autres sites (réseaux sociaux, partenaires). L’association n’est pas
          responsable de leur contenu ni de leurs pratiques.
        </P>
      </>
    ),
  },
  {
    id: 'donnees',
    titre: 'Données personnelles et cookies',
    contenu: (
      <Liste
        items={[
          <>
            Ce que nous faisons de vos données :{' '}
            <Link to="/confidentialite" className="link-fil text-terre-cuite">
              politique de confidentialité
            </Link>
            .
          </>,
          <>
            Les cookies et vos réglages :{' '}
            <Link to="/cookies" className="link-fil text-terre-cuite">
              gestion des cookies
            </Link>
            .
          </>,
        ]}
      />
    ),
  },
  {
    id: 'droit',
    titre: 'Droit applicable',
    contenu: (
      <P>
        Les présentes mentions sont régies par le droit français. En cas de litige, et à défaut d’accord amiable, les
        tribunaux français sont seuls compétents.
      </P>
    ),
  },
]

export default function LegalNoticePage() {
  return (
    <LegalLayout
      current="/mentions-legales"
      title="Mentions légales"
      intro="Qui édite ce site, qui l’héberge et comment nous joindre."
      maj="16 novembre 2026"
      essentiel={[
        { titre: 'Éditeur', texte: 'Association Néotisse, loi 1901' },
        { titre: 'Siège', texte: 'Montpellier, France' },
        { titre: 'Hébergeur', texte: 'Netlify, Inc.' },
        { titre: 'Réalisation', texte: 'Agence ÉTHER' },
      ]}
      sections={sections}
    />
  )
}
