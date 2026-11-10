import { Reveal } from './ui'
import filCourbe from '../assets/v3/association/fil-courbe.svg'

/**
 * En-tête des pages intérieures V3 (Figma « Header », version resserrée) :
 * grand titre, sous-titre en italique, texte, et image organique à droite
 * soulignée d'un fil courbe.
 */
export default function PageHeader({ title, subtitle, text, image, imageAlt = '', children }) {
  return (
    <section className="relative overflow-hidden bg-creme pt-24 pb-12 lg:min-h-[600px] lg:pt-0 lg:pb-0 xl:h-[640px]">
      {image && (
        <Reveal
          effect="reveal-wave"
          className="ml-auto h-[220px] w-[92%] overflow-hidden rounded-l-[160px] sm:h-[380px] lg:absolute lg:top-[96px] lg:right-0 lg:h-[460px] lg:w-[46%] lg:rounded-tl-[260px] lg:rounded-bl-[210px]"
        >
          <img src={image} alt={imageAlt} fetchPriority="high" className="size-full object-cover" />
        </Reveal>
      )}

      {/* Fil courbe */}
      <img
        src={filCourbe}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[480px] hidden h-[120px] w-full lg:block"
      />

      <Reveal className="container-site relative mt-8 lg:mt-0 lg:pt-[160px]">
        <h1 className="font-serif text-[52px] leading-none font-light tracking-[-0.01em] text-brun md:text-[72px] xl:-ml-1 xl:text-[80px]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-[560px] font-serif text-[26px] leading-[1.15] font-light text-brun-doux italic md:text-[34px] xl:mt-[14px]">
            {subtitle}
          </p>
        )}
        {text && <p className="mt-5 max-w-[440px] text-courant text-brun-doux xl:mt-[26px]">{text}</p>}
        {children}
      </Reveal>
    </section>
  )
}
