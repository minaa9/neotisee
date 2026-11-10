import PageHeader from '../components/PageHeader'
import { Eyebrow, Reveal } from '../components/ui'
import { news } from '../data/news'
import heroImage from '../assets/ateliers/tissage.webp'
import vague from '../assets/v3/home/vague-avis.svg'

/** Page Actualités V3 (Figma 352:280) */
export default function NewsPage() {
  const [featured, ...others] = news

  return (
    <>
      <PageHeader
        title="Actualités"
        subtitle={
          <>
            Les fils de
            <br />
            nos découvertes
          </>
        }
        text="Événements, ateliers, rencontres et nouvelles collaborations : suivez la vie de Néotisse."
        image={heroImage}
        imageAlt="Bandes tissées à chevrons sur des cadres en bois"
      />

      {/* À la une */}
      <article id={featured.id} className="scroll-mt-24 bg-creme pb-20 xl:h-[680px] xl:pt-10 xl:pb-0">
        <div className="container-site flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-[60px]">
          <Reveal className="overflow-hidden rounded-l-[260px] rounded-r-[24px] lg:w-[640px] lg:shrink-0">
            <img src={featured.image} alt={featured.alt} loading="lazy" className="aspect-[640/520] w-full object-cover" />
          </Reveal>
          <Reveal delay={120} className="lg:pt-[50px]">
            <Eyebrow>À la une · {featured.rubrique}</Eyebrow>
            <h2 className="mt-5 max-w-[500px] font-serif text-[40px] leading-[1.08] tracking-[-0.005em] text-brun md:text-[50px] xl:-ml-0.5">
              {featured.titre}
            </h2>
            <div className="mt-3 max-w-[460px] space-y-[1.65em] text-courant text-brun-doux">
              {featured.paragraphes.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </article>

      {/* Autres actualités */}
      <section aria-labelledby="derniers-fils" className="relative bg-peche pt-28 pb-24 xl:pt-[150px] xl:pb-[90px]">
        <img src={vague} alt="" aria-hidden="true" className="absolute inset-x-0 top-[-1px] h-[50px] w-full md:h-[101px]" />
        <div className="container-site relative">
          <Reveal as="h2" id="derniers-fils" className="font-serif text-[40px] leading-[1.08] tracking-[-0.005em] text-brun md:text-[48px]">
            Les derniers fils
          </Reveal>
          <ul className="mt-10 grid gap-[30px] md:grid-cols-2 lg:grid-cols-3 xl:mt-[38px]">
            {others.map((a, i) => (
              <Reveal as="li" key={a.id} id={a.id} delay={i * 100} className="scroll-mt-24">
                <article className="h-full overflow-hidden rounded-[24px] bg-lin">
                  <img src={a.image} alt={a.alt} loading="lazy" className="aspect-[380/220] w-full object-cover" />
                  <div className="px-7 pt-[26px] pb-10">
                    <p className="text-label text-brique">{a.rubrique}</p>
                    <h3 className="mt-2.5 font-serif text-[28px] leading-[1.18] text-brun">{a.titre}</h3>
                    <div className="mt-2 space-y-[1.55em] text-petit text-brun-doux">
                      {a.paragraphes.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
