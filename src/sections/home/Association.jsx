import { Eyebrow, Reveal } from '../../components/ui'
import photo from '../../assets/ateliers/tissage.webp'
import planteGravee from '../../assets/v3/ui/plante-gravee.webp'

const stats = [
  { value: '2024', label: 'Fondée à Montpellier' },
  { value: '4', label: 'ateliers de savoir-faire' },
  { value: '5', label: 'partenaires culturels' },
]

/** 02 · L'association (Figma 347:59) */
export default function Association() {
  return (
    <section id="association" className="relative scroll-mt-10 overflow-hidden bg-creme py-16 xl:h-[780px] xl:py-0">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
        {/* Image organique, révélée en vague */}
        <Reveal
          effect="reveal-wave"
          className="h-[420px] w-[92%] shrink-0 overflow-hidden rounded-tr-[220px] rounded-br-[40px] sm:h-[560px] lg:h-[700px] lg:w-[600px] lg:rounded-tr-[340px] lg:rounded-br-[60px] xl:mt-5 xl:-ml-px"
        >
          <img src={photo} alt="Bandes tissées à motifs de chevrons sur des cadres en bois" loading="lazy" className="size-full object-cover" />
        </Reveal>

        <div className="px-5 md:px-12 lg:px-0 lg:pt-[100px] lg:pl-[120px]">
          <Reveal>
            <Eyebrow>L’association</Eyebrow>
            <h2 className="mt-6 max-w-[620px] font-serif text-[42px] leading-[1.08] tracking-[-0.005em] text-brun md:text-[60px] xl:-ml-0.5">
              Un fil ancien,
              <br />
              <em className="font-light">une histoire bien actuelle.</em>
            </h2>
            <p className="mt-6 max-w-[470px] text-courant text-brun-doux xl:mt-[45px]">
              Néotisse fait revivre les savoir-faire textiles anciens à travers l’archéologie
              expérimentale et la médiation scientifique. Fondée en 2024 à Montpellier,
              l’association fait découvrir l’histoire du textile, du filage au tissage.
            </p>
          </Reveal>
          <Reveal as="dl" delay={150} className="mt-12 flex flex-wrap gap-x-10 gap-y-6 xl:mt-[78px]">
            {stats.map((s) => (
              <div key={s.label} className="flex w-[150px] flex-col-reverse">
                <dt className="mt-3 text-petit text-brun-doux">{s.label}</dt>
                <dd className="font-serif text-[54px] leading-[1.08] tracking-[-0.005em] text-terre-cuite">{s.value}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      <img
        src={planteGravee}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[430px] right-[40px] hidden h-[330px] w-[160px] object-contain opacity-60 xl:block"
      />
    </section>
  )
}
