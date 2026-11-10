import PageHeader from '../components/PageHeader'
import { Reveal } from '../components/ui'
import marie from '../assets/v3/equipe/marie.webp'
import emilie from '../assets/v3/equipe/emilie.webp'

const membres = [
  {
    nom: 'Marie-Salomé',
    role: 'Diplômée d’un master en égyptologie',
    bio: 'Les mots sont aussi des traces du passé. Marie-Salomé s’intéresse aux termes de l’Égypte ancienne liés aux tisserands, pour explorer la place du textile dans les sociétés anciennes à travers les sources écrites.',
    photo: marie,
  },
  {
    nom: 'Émilie Roma',
    role: 'Doctorante en archéologie, spécialiste des systèmes de tissage',
    bio: 'Comprendre les textiles anciens, c’est aussi comprendre les techniques qui leur ont donné forme. Émilie étudie les systèmes de tissage et fait connaître les savoir-faire qui se cachent derrière les étoffes.',
    photo: emilie,
  },
]

/** Page L'équipe V3 (Figma 351:204) */
export default function TeamPage() {
  return (
    <>
      <PageHeader
        title="L’équipe"
        subtitle={
          <>
            Deux chercheuses,
            <br />
            une même passion
          </>
        }
        text="Archéologie, égyptologie, gestes de tisserands : Néotisse est née de la rencontre entre la recherche et l’envie de transmettre."
        image={emilie}
        imageAlt="Émilie Roma file de la laine au fuseau"
      />

      <section aria-label="Portraits" className="bg-creme pb-16 xl:pt-10 xl:pb-[90px]">
        <ul className="container-site grid gap-12 lg:grid-cols-2 lg:gap-[30px]">
          {membres.map((m, i) => (
            <Reveal
              as="li"
              key={m.nom}
              delay={i * 150}
              className={`flex flex-col gap-6 sm:flex-row sm:gap-[30px] ${i === 1 ? 'lg:mt-[70px]' : ''}`}
            >
              <img
                src={m.photo}
                alt={`Portrait de ${m.nom}`}
                loading="lazy"
                className="aspect-[300/400] w-full max-w-[250px] shrink-0 rounded-t-[150px] rounded-b-[24px] object-cover"
              />
              <div className="max-w-[280px] sm:pt-[40px]">
                <h2 className="font-serif text-[38px] leading-[1.08] tracking-[-0.005em] text-brun">{m.nom}</h2>
                <p className="mt-6 font-serif text-[22px] leading-[1.15] font-light text-terre-cuite italic sm:mt-[30px] sm:min-h-[50px]">
                  {m.role}
                </p>
                <p className="mt-4 text-petit text-brun-doux">{m.bio}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  )
}
