import { Reveal } from '../../components/ui'
import { TemoignagesPanel } from '../../components/TestimonialCarousel'
import { usePublic } from '../../lib/usePublic'
import vague from '../../assets/v3/home/vague-avis.svg'

/** 06 · Avis : les témoignages en éventail, dans un panneau clair. */
export default function Reviews() {
  const temoignages = usePublic('temoignages')
  return (
    <section className="relative overflow-hidden bg-peche pt-24 pb-14 xl:pt-[120px] xl:pb-[80px]">
      <img src={vague} alt="" aria-hidden="true" className="absolute inset-x-0 top-[-1px] h-[50px] w-full md:h-[101px]" />
      <Reveal className="container-site relative">
        <TemoignagesPanel
          items={temoignages}
          eyebrow="Livre d’or"
          title={
            <>
              Ils ont tissé <em>avec nous</em>
            </>
          }
          subtitle="Les mots de celles et ceux qui ont filé, tissé et teint à nos côtés."
        />
      </Reveal>
    </section>
  )
}
