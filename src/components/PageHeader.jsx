import { Reveal } from './ui'
import filCourbe from '../assets/v3/association/fil-courbe.svg'
import etoile from '../assets/v3/ui/etoile.svg'

/**
 * En-tête des pages intérieures V3 (Figma « Header », 860 px) :
 * grand titre, sous-titre en italique, texte, et image organique à droite
 * soulignée d'un fil courbe et d'une étoile.
 */
export default function PageHeader({ title, subtitle, text, image, imageAlt = '', children }) {
  return (
    <section className="relative overflow-hidden bg-creme pt-28 pb-20 lg:min-h-[780px] lg:pt-0 lg:pb-0 xl:h-[860px]">
      {image && (
        <Reveal
          effect="reveal-wave"
          className="ml-auto h-[340px] w-[92%] overflow-hidden rounded-l-[200px] sm:h-[460px] lg:absolute lg:top-[104px] lg:right-0 lg:h-[620px] lg:w-[48.6%] lg:rounded-tl-[340px] lg:rounded-bl-[280px]"
        >
          <img src={image} alt={imageAlt} fetchPriority="high" className="size-full object-cover" />
        </Reveal>
      )}

      {/* Fil courbe + étoile */}
      <img
        src={filCourbe}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[640px] hidden h-[140px] w-full lg:block"
      />
      <img
        src={etoile}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[722px] left-[55%] hidden size-4 lg:block"
      />

      <Reveal className="container-site relative mt-10 lg:mt-0 lg:pt-[210px]">
        <h1 className="font-serif text-[60px] leading-none font-light tracking-[-0.01em] text-brun md:text-[80px] xl:-ml-1 xl:text-[92px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-[560px] font-serif text-[30px] leading-[1.15] font-light text-brun-doux italic md:text-[40px] xl:mt-[18px]">
            {subtitle}
          </p>
        )}
        {text && <p className="mt-6 max-w-[440px] text-courant text-brun-doux xl:mt-[38px]">{text}</p>}
        {children}
      </Reveal>
    </section>
  )
}
