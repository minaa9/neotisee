import PageHeader from '../components/PageHeader'
import { CenteredHeading, Reveal } from '../components/ui'
import festival from '../assets/news/festival.webp'
import filage from '../assets/events/filage.webp'
import marie from '../assets/v3/equipe/marie.webp'
import tissage from '../assets/ateliers/hero.webp'
import teinture from '../assets/events/teinture.webp'
import anneau from '../assets/v3/association/anneau.svg'

const fils = [
  {
    titre: 'Le déclic',
    texte:
      'Les textiles anciens ont beaucoup à nous raconter : c’est de cette conviction qu’est née Néotisse, en mai 2024.',
    image: filage,
  },
  {
    titre: 'Faire vivre les savoir-faire',
    texte:
      'Émilie Roma, doctorante en archéologie, et Marie-Salomé, égyptologue, font revivre les savoir-faire textiles du Néolithique au Moyen Âge.',
    image: marie,
  },
  {
    titre: 'Remonter le fil des techniques',
    texte:
      'Par l’archéologie expérimentale, nous reconstituons les gestes oubliés : filage, tissage, teinture végétale, broderie.',
    image: tissage,
  },
  {
    titre: 'Tisser de nouveaux liens',
    texte:
      'Par la médiation scientifique, nous partageons ces découvertes avec écoles, musées, festivals et curieux de tout âge.',
    image: teinture,
  },
]

/** Page L'association V3 (Figma 351:118) */
export default function About() {
  return (
    <>
      <PageHeader
        title="L’association"
        subtitle={
          <>
            Un fil ancien,
            <br />
            une histoire bien actuelle
          </>
        }
        text="Fondée en mai 2024 à Montpellier, Néotisse est une association loi 1901 née d’une conviction : les textiles anciens ont beaucoup à nous raconter."
        image={festival}
        imageAlt="Participantes et participants autour d’une table pendant un atelier textile"
      />

      <section className="bg-creme pt-4 pb-16 xl:pt-[30px] xl:pb-[90px]">
        <div className="container-site">
          <CenteredHeading
            title={
              <>
                Notre histoire <em>en quatre fils</em>
              </>
            }
          />
          <ol className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-10 lg:grid-cols-4 xl:mt-[50px] xl:gap-x-[40px]">
            {fils.map((f, i) => (
              <Reveal
                as="li"
                key={f.titre}
                delay={i * 120}
                className={`flex flex-col items-center text-center ${i % 2 === 1 ? 'lg:mt-8' : ''}`}
              >
                <div className="relative size-[150px] sm:size-[210px]">
                  <img src={f.image} alt="" loading="lazy" className="absolute top-2 left-2 size-[134px] rounded-full object-cover sm:size-[194px]" />
                  <img src={anneau} alt="" aria-hidden="true" className="absolute inset-0 size-full" />
                </div>
                <p className="mt-5 text-label text-brique">{String(i + 1).padStart(2, '0')}</p>
                <h2 className="mt-1 max-w-[250px] font-serif text-[21px] leading-[1.18] text-brun sm:text-[26px]">{f.titre}</h2>
                <p className="mt-3 max-w-[230px] text-petit text-brun-doux">{f.texte}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
