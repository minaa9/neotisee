import { Button } from '../../components/ui'
import hero from '../../assets/home/hero.webp'
import cercleFil from '../../assets/v3/home/cercle-fil.svg'
import noeud from '../../assets/v3/home/noeud.svg'
import vagueCreme from '../../assets/v3/home/vague-creme.svg'

/** 01 · Hero (Figma 347:20) */
export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-brun md:min-h-[700px] xl:h-[820px]">
      <img
        src={hero}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 -z-20 size-full object-cover object-[70%_center]"
      />
      {/* Voile chaud + voile ciel */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(61,42,35,0.78)_0%,rgba(61,42,35,0.35)_55%,rgba(180,88,61,0.12)_100%)] max-md:bg-[linear-gradient(90deg,rgba(61,42,35,0.8)_0%,rgba(61,42,35,0.55)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-[rgba(140,152,165,0.45)] to-[rgba(140,152,165,0)]"
      />

      {/* Cercle de fil qui tourne lentement */}
      <div aria-hidden="true" className="pointer-events-none absolute top-[90px] left-1/2 hidden size-[540px] translate-x-[20px] lg:block">
        <img src={cercleFil} alt="" className="animate-tourne absolute inset-0 size-full" />
      </div>

      <div className="container-site relative pt-24 pb-32 xl:pt-[40px] xl:pb-[90px]">
        <div className="animate-[heroIn_1.1s_ease_both]">
          <h1 className="-ml-1 font-serif text-[96px] leading-[0.9] font-light tracking-[-0.02em] text-lin sm:text-[130px] xl:-ml-2 xl:text-[140px]">
            Néotisse
          </h1>
          <p className="mt-6 max-w-[700px] font-serif text-[38px] leading-[1.15] font-light text-lin italic sm:text-[48px] xl:mt-[12px] xl:text-[48px]">
            Des gestes oubliés,
            <br />
            des histoires à retisser
          </p>
          <p className="mt-6 max-w-[420px] text-courant text-lin/88 xl:mt-[17px]">
            Du Néolithique au Moyen Âge, redécouvrons les savoir-faire textiles qui racontent nos
            histoires.
          </p>
          <Button to="/association" variant="clair" className="mt-8 xl:mt-[33px]">
            Découvrir l’association
          </Button>
        </div>
      </div>

      {/* Fil « Défiler » */}
      <a
        href="#association"
        aria-label="Défiler vers la suite"
        className="absolute bottom-[110px] left-1/2 hidden h-[110px] w-6 -translate-x-1/2 md:block"
      >
        <span aria-hidden="true" className="absolute top-0 left-1/2 h-[110px] w-px -translate-x-1/2 bg-lin/60" />
        <img src={noeud} alt="" className="absolute bottom-[-4px] left-1/2 size-[9px] -translate-x-1/2 animate-bounce" />
        <span className="absolute top-[30px] left-1/2 -translate-x-1/2 rotate-90 text-petit whitespace-nowrap text-lin/80">
          Défiler
        </span>
      </a>

      <img
        src={vagueCreme}
        alt=""
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[-1px] h-[60px] w-full md:h-[146px]"
      />
    </section>
  )
}
