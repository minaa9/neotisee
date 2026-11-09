import { Link } from 'react-router'
import { ArrowLink, Eyebrow, Reveal, SectionTitle } from '../../components/ui'
import { news } from '../../data/news'

/** 07 · Actualités (Figma 254:44) */
export default function LatestNews() {
  const [featured, ...others] = news

  return (
    <section className="bg-lin py-20 xl:pt-[70px] xl:pb-[90px]">
      <div className="container-site">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal className="flex flex-col items-start gap-4">
            <Eyebrow>Actualités</Eyebrow>
            <SectionTitle className="text-encre/88">Les fils de nos découvertes.</SectionTitle>
          </Reveal>
          <ArrowLink to="/actualites" className="sm:mb-2 xl:mr-[22px]">
            Toutes les actualités
          </ArrowLink>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[640fr_560fr] lg:gap-[62px] xl:mt-[50px]">
          <Reveal className="overflow-hidden rounded-[18px]">
            <img
              src={featured.image}
              alt=""
              loading="lazy"
              className="aspect-[640/400] size-full object-cover"
            />
          </Reveal>

          <Reveal delay={120} className="flex flex-col lg:pt-2.5">
            <h3 className="text-[26px] leading-[1.25] font-semibold text-terre xl:text-[30px]">
              {featured.titre}
            </h3>
            <p className="mt-4 text-[17px] leading-[1.45] text-encre/75">{featured.resume}</p>
            <ArrowLink to={`/actualites#${featured.id}`} className="mt-4 self-start">
              Lire l’article
            </ArrowLink>

            <ul className="mt-8 flex flex-col gap-6 border-t border-terre/25 pt-6 sm:flex-row sm:gap-7 lg:mt-auto">
              {others.map((a) => (
                <li key={a.id}>
                  <Link to={`/actualites#${a.id}`} className="group flex items-center gap-3.5">
                    <img
                      src={a.image}
                      alt=""
                      loading="lazy"
                      className="h-20 w-24 shrink-0 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="max-w-[150px] text-[15px] leading-[1.25] font-semibold text-encre group-hover:text-terre">
                      {a.titre}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
