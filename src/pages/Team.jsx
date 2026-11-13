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
    domaines: ['Égyptologie', 'Sources écrites', 'Vocabulaire des tisserands'],
  },
  {
    nom: 'Émilie Roma',
    role: 'Doctorante en archéologie, spécialiste des systèmes de tissage',
    bio: 'Comprendre les textiles anciens, c’est aussi comprendre les techniques qui leur ont donné forme. Émilie étudie les systèmes de tissage et fait connaître les savoir-faire qui se cachent derrière les étoffes.',
    photo: emilie,
    domaines: ['Archéologie', 'Systèmes de tissage', 'Techniques textiles'],
  },
]

/** Page L'équipe V3 (Figma 351:204) */
export default function TeamPage() {
  return (
    <>
      <PageHeader
        photoId="equipe"
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
              {/* Portrait : sépia → couleur, fil qui fait le tour de l'arche, carte qui se dévoile */}
              <figure data-cursor="Découvrir" tabIndex={0} className="group relative aspect-[300/400] w-full max-w-[250px] shrink-0 outline-none">
                <div className="absolute inset-0 overflow-hidden rounded-t-[150px] rounded-b-[24px]">
                  <img
                    src={m.photo}
                    alt={`Portrait de ${m.nom}`}
                    loading="lazy"
                    className="size-full object-cover sepia-[0.55] saturate-[0.7] transition-[filter,transform] duration-700 ease-out group-hover:scale-105 group-hover:sepia-0 group-hover:saturate-100 group-focus-visible:sepia-0"
                  />
                  <figcaption className="absolute inset-x-3 bottom-3 translate-y-[120%] rounded-[18px] bg-lin/92 p-4 backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
                    <span className="text-label text-brique">Domaines</span>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {m.domaines.map((d) => (
                        <li key={d} className="rounded-full border border-terre-cuite/30 px-2.5 py-1 text-[12px] text-brun">
                          {d}
                        </li>
                      ))}
                    </ul>
                  </figcaption>
                </div>
                <svg aria-hidden="true" viewBox="0 0 300 400" className="pointer-events-none absolute -inset-2.5 size-[calc(100%+20px)] overflow-visible">
                  <path
                    d="M4 396 V150 A146 146 0 0 1 296 150 V396 Z"
                    pathLength="1"
                    fill="none"
                    stroke="#B4583D"
                    strokeWidth="1.3"
                    vectorEffect="non-scaling-stroke"
                    className="transition-[stroke-dashoffset] duration-1000 ease-in-out [stroke-dasharray:1] [stroke-dashoffset:1] group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0]"
                  />
                </svg>
              </figure>
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
