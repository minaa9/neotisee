import PageHeader from '../components/PageHeader'
import { Button, Reveal } from '../components/ui'
import { ateliers } from '../data/ateliers'
import hero from '../assets/events/patrimoine.webp'
import pastille from '../assets/v3/ateliers/pastille.svg'
import iconeParticipatifs from '../assets/v3/ateliers/icone-participatifs.svg'
import iconeDemonstrations from '../assets/v3/ateliers/icone-demonstrations.svg'
import iconePresentations from '../assets/v3/ateliers/icone-presentations.svg'

const formats = [
  { label: 'Ateliers participatifs', icon: iconeParticipatifs },
  { label: 'Démonstrations', icon: iconeDemonstrations },
  { label: 'Présentations', icon: iconePresentations },
]

/** Page Nos ateliers V3 (Figma 352:195) */
export default function WorkshopsPage() {
  return (
    <>
      <PageHeader
        title="Nos ateliers"
        subtitle={
          <>
            Apprendre, expérimenter,
            <br />
            transmettre
          </>
        }
        text="Des ateliers participatifs, adaptés à tous, pour découvrir les gestes anciens et explorer les matières."
        image={hero}
        imageAlt="Des mains tissent avec des fils sur un petit métier en carton"
      />

      {/* Formats */}
      <section className="bg-creme pt-4 pb-20 xl:h-[420px] xl:pt-10 xl:pb-0">
        <Reveal className="container-site text-center">
          <h2 className="font-serif text-[40px] leading-[1.08] tracking-[-0.005em] text-brun md:text-[48px]">
            Filage, tissage, <em className="font-light">teinture…</em>
          </h2>
          <ul className="mt-12 flex flex-wrap justify-center gap-x-[154px] gap-y-8 xl:mt-[62px]">
            {formats.map((f) => (
              <li key={f.label} className="flex w-[176px] flex-col items-center">
                <span className="relative flex size-24 items-center justify-center">
                  <img src={pastille} alt="" className="absolute inset-0 size-full" />
                  <img src={f.icon} alt="" width="30" height="30" className="relative" />
                </span>
                <span className="mt-[22px] text-petit text-brun">{f.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Les quatre ateliers, en alternance */}
      {ateliers.map((a, i) => {
        const reversed = i % 2 === 1
        return (
          <section
            key={a.id}
            id={a.id}
            className={`relative scroll-mt-24 overflow-hidden py-14 xl:h-[620px] xl:py-[60px] ${reversed ? 'bg-peche' : 'bg-creme'}`}
          >
            <div
              className={`container-site flex flex-col gap-10 lg:items-start lg:gap-10 ${
                reversed ? 'lg:flex-row-reverse lg:justify-between' : 'lg:flex-row'
              }`}
            >
              <Reveal
                className={`overflow-hidden lg:w-[540px] lg:shrink-0 ${
                  reversed ? 'rounded-t-[250px] rounded-b-[24px]' : 'rounded-l-[24px] rounded-r-[250px]'
                }`}
              >
                <img src={a.image} alt="" loading="lazy" className="aspect-[540/500] w-full object-cover" />
              </Reveal>

              <Reveal delay={120} className={`relative lg:pt-[30px] ${reversed ? 'lg:pl-10' : ''}`}>
                <p className="font-serif text-[80px] leading-[0.9] font-light tracking-[-0.02em] text-terre-cuite/90 xl:text-[96px]">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2 className="mt-8 max-w-[520px] font-serif text-[40px] leading-[1.08] tracking-[-0.005em] text-brun md:text-[52px] xl:mt-[44px]">
                  {a.titre}
                </h2>
                <p className="mt-5 max-w-[460px] text-courant text-brun-doux xl:mt-6">{a.description}</p>
              </Reveal>
            </div>
            <img
              src={a.objet}
              alt=""
              aria-hidden="true"
              className={`pointer-events-none absolute top-[380px] hidden h-[180px] w-[90px] object-contain opacity-85 xl:block ${
                reversed ? 'left-[600px]' : 'left-[1260px]'
              }`}
            />
          </section>
        )
      })}

      <section className="bg-creme py-20 xl:py-24">
        <Reveal className="container-site flex flex-col items-center gap-6 text-center">
          <p className="text-chapo text-brun-doux">Un atelier pour votre école, votre musée ou votre festival ?</p>
          <Button to="/contact?objet=prestation" variant="plein">
            Demander une prestation
          </Button>
        </Reveal>
      </section>
    </>
  )
}
