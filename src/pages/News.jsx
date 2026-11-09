import { Eyebrow, Reveal } from '../components/ui'
import { news } from '../data/news'
import traitTitre from '../assets/actualites/trait-titre.svg'
import photoTissage from '../assets/actualites/photo-tissage.webp'
import HeroDecor from '../components/HeroDecor'

/** Page Actualités (Figma 257:324) */
export default function NewsPage() {
  return (
    <div className="overflow-hidden bg-creme pb-24 xl:pb-[120px]">
      <section className="relative pt-14 xl:min-h-[558px] xl:pt-[56px]">
        <HeroDecor />

        <Reveal as="header" className="container-site relative">
          <Eyebrow>Actualités</Eyebrow>
          <h1 className="mt-8 font-serif text-[40px] leading-[normal] text-black/88 xl:text-[48px]">
            Les fils de nos découvertes.
          </h1>
          <img src={traitTitre} alt="" width="122" height="4" className="mt-6 -ml-0.5 xl:mt-9" />
          <p className="mt-6 max-w-[569px] text-[19px] leading-[normal] text-black/72 xl:text-[22px]">
            Événements, ateliers, rencontres et nouvelles collaborations : suivez la vie de Néotisse
            et découvrez comment les savoir-faire textiles anciens continuent de se transmettre et
            de s’expérimenter.
          </p>
        </Reveal>

        <Reveal className="container-site mt-10 xl:hidden">
          <img src={photoTissage} alt="" className="mx-auto w-full max-w-[442px]" />
        </Reveal>
      </section>

      <div className="container-site mt-14 xl:mt-[100px]">
        {news.map((article, i) => {
          const reversed = i % 2 === 1
          return (
            <article
              key={article.id}
              id={article.id}
              className={`scroll-mt-28 border-terre/18 ${i > 0 ? 'mt-14 border-t pt-14 xl:mt-[60px] xl:pt-[60px]' : ''}`}
            >
              <div
                className={`flex flex-col gap-8 lg:items-center lg:gap-[82px] ${
                  reversed ? 'lg:flex-row-reverse lg:justify-between' : 'lg:flex-row'
                }`}
              >
                <Reveal className="overflow-hidden rounded-[24px] lg:w-[600px] lg:shrink-0">
                  <img
                    src={article.image}
                    alt={article.alt}
                    loading="lazy"
                    className="aspect-[3/2] w-full object-cover"
                  />
                </Reveal>
                <Reveal
                  delay={120}
                  className={`flex max-w-[520px] flex-col items-start gap-[18px] ${reversed ? 'lg:ml-[82px]' : ''}`}
                >
                  <p className="text-xs font-semibold tracking-[0.14em] text-terre uppercase">
                    {article.rubrique}
                  </p>
                  <h2 className="font-serif text-[30px] leading-[1.2] text-encre xl:text-[38px]">
                    {article.titre}
                  </h2>
                  <span aria-hidden="true" className="h-[2px] w-16 bg-terre" />
                  <p className="text-[17px] leading-[1.55] text-encre/72 xl:text-[18px]">{article.texte}</p>
                </Reveal>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
