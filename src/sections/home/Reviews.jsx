import InfiniteCards from '../../components/InfiniteCards'
import { CenteredHeading } from '../../components/ui'
import { usePublic } from '../../lib/usePublic'
import vague from '../../assets/v3/home/vague-avis.svg'

/** 06 · Avis (Figma 368:458) — carrousel infini qu'on peut faire glisser. */
export default function Reviews() {
  const temoignages = usePublic('temoignages')
  return (
    <section className="relative overflow-hidden bg-peche pt-24 pb-14 xl:pt-[120px] xl:pb-[70px]">
      <img src={vague} alt="" aria-hidden="true" className="absolute inset-x-0 top-[-1px] h-[50px] w-full md:h-[101px]" />
      <div className="container-site relative">
        <CenteredHeading
          title={
            <>
              Ils ont tissé <em>avec nous</em>
            </>
          }
          subtitle="Les mots de celles et ceux qui ont filé, tissé et teint à nos côtés."
        />
        <div className="mt-10 xl:mt-[40px]">
          <InfiniteCards items={temoignages} />
        </div>
      </div>
    </section>
  )
}
