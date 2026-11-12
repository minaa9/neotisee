import { useRef } from 'react'
import { Button, Eyebrow, Reveal } from '../../components/ui'
import { MOTION_OK, gsap, useGSAP } from '../../motion/gsap'
import photo from '../../assets/ateliers/broderie.webp'
import vague from '../../assets/v3/home/vague-contact.svg'
import cercle from '../../assets/v3/home/cercle-contact.svg'

/** 09 · Contact (Figma 350:121) */
export default function ContactCta() {
  const ref = useRef(null)

  // Au défilement : le cercle de fil tourne avec le scroll, et la photo s'ouvre
  // depuis le centre.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const st = { trigger: ref.current, start: 'top 85%', end: 'bottom top', scrub: 1 }
        gsap.to('[data-cta-cercle]', { rotate: 140, ease: 'none', scrollTrigger: st })
        gsap.fromTo(
          '[data-cta-photo]',
          { clipPath: 'circle(18% at 50% 50%)' },
          { clipPath: 'circle(75% at 50% 50%)', ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'center 55%', scrub: 1 } },
        )
        gsap.fromTo('[data-cta-photo] img', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: st })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="relative overflow-hidden bg-creme pt-24 pb-12 xl:h-[580px] xl:pt-0 xl:pb-0">
      <img src={vague} alt="" aria-hidden="true" className="absolute inset-x-0 top-[-1px] h-[70px] w-full md:h-[141px]" />

      <div className="container-site relative flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between">
        <Reveal className="lg:pt-[170px]">
          <Eyebrow>Contact</Eyebrow>
          <h2 className="mt-6 font-serif text-[50px] leading-none font-light tracking-[-0.01em] text-brun md:text-[68px] xl:-ml-1">
            Tissons la suite
            <br />
            <em>ensemble.</em>
          </h2>
          <p className="mt-6 max-w-[440px] text-courant text-brun-doux xl:mt-[26px]">
            Un atelier pour une école, un musée, un festival ? Une question sur nos rendez-vous ?
            Écrivez-nous, nous serons ravies d’échanger avec vous.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-4 xl:mt-[28px]">
            <Button to="/contact" variant="plein">
              Nous écrire
            </Button>
            <Button to="/contact?objet=prestation" variant="contour">
              Demander une prestation
            </Button>
          </div>
        </Reveal>

        {/* Image organique entourée d'un cercle de fil */}
        <Reveal delay={150} className="relative mx-auto aspect-[640/560] w-full max-w-[520px] lg:mx-0 lg:mt-[110px] lg:-mr-[40px] lg:w-[42%]">
          <div data-cta-cercle aria-hidden="true" className="absolute inset-0">
            <img src={cercle} alt="" className="animate-tourne size-full" />
          </div>
          <div data-cta-photo data-no-motion className="absolute top-[7.1%] left-[6.25%] h-[85.7%] w-[87.5%] overflow-hidden rounded-tl-[42%] rounded-tr-[7%] rounded-br-[42%] rounded-bl-[7%]">
            <img src={photo} alt="Broderie de fils de laine verte et beige sur toile de lin" loading="lazy" className="size-full object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
