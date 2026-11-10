import { Button, Eyebrow, Reveal, Star } from '../../components/ui'
import photo from '../../assets/ateliers/broderie.webp'
import vague from '../../assets/v3/home/vague-contact.svg'
import cercle from '../../assets/v3/home/cercle-contact.svg'

/** 09 · Contact (Figma 350:121) */
export default function ContactCta() {
  return (
    <section className="relative overflow-hidden bg-creme pt-28 pb-16 xl:h-[731px] xl:pt-0 xl:pb-0">
      <img src={vague} alt="" aria-hidden="true" className="absolute inset-x-0 top-[-1px] h-[70px] w-full md:h-[141px]" />

      <div className="container-site relative flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between">
        <Reveal className="lg:pt-[240px]">
          <Eyebrow>Contact</Eyebrow>
          <h2 className="mt-6 font-serif text-[56px] leading-none font-light tracking-[-0.01em] text-brun md:text-[80px] xl:-ml-1">
            Tissons la suite
            <br />
            <em>ensemble.</em>
          </h2>
          <p className="mt-8 max-w-[440px] text-courant text-brun-doux xl:mt-[34px]">
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
        <Reveal delay={150} className="relative mx-auto aspect-[640/560] w-full max-w-[640px] lg:mx-0 lg:mt-[130px] lg:-mr-[60px] lg:w-[50%]">
          <img src={cercle} alt="" aria-hidden="true" className="animate-tourne absolute inset-0 size-full" />
          <div className="absolute top-[7.1%] left-[6.25%] h-[85.7%] w-[87.5%] overflow-hidden rounded-tl-[42%] rounded-tr-[7%] rounded-br-[42%] rounded-bl-[7%]">
            <img src={photo} alt="Broderie de fils de laine verte et beige sur toile de lin" loading="lazy" className="size-full object-cover" />
          </div>
          <Star className="absolute top-[-1.6%] left-[48.6%] size-[18px]" />
        </Reveal>
      </div>
    </section>
  )
}
