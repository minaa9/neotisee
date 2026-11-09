import { Button } from '../../components/ui'
import hero from '../../assets/home/hero.webp'
import chevron from '../../assets/common/chevron.svg'

/** 01 · Hero (Figma 252:4) */
export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-brun md:min-h-[760px] xl:h-[900px]">
      <img
        src={hero}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 -z-20 size-full object-cover object-[70%_center]"
      />
      {/* Voiles */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(38,26,18,0.92)_0%,rgba(38,26,18,0.72)_42%,rgba(38,26,18,0)_72%)] max-md:bg-[linear-gradient(90deg,rgba(38,26,18,0.9)_0%,rgba(38,26,18,0.7)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-[260px] bg-gradient-to-b from-brun/0 to-brun/55"
      />

      <div className="container-site pt-[120px] pb-24 xl:pt-[108px]">
        <div className="max-w-[640px] animate-[heroIn_1s_ease_both]">
          <h1 className="text-[76px] leading-none font-light text-ivoire sm:text-[100px] xl:text-[130px]">
            Néotisse
          </h1>
          <p className="mt-[22px] font-serif text-[30px] leading-[1.25] text-white sm:text-[38px] xl:text-[45px]">
            Des gestes oubliés,
            <br />
            des histoires à retisser
          </p>
          <span aria-hidden="true" className="mt-[34px] block h-[3.5px] w-[157px] rounded-[2px] bg-terre" />
          <p className="mt-[30px] max-w-[500px] text-[18px] leading-[1.35] text-ivoire xl:text-[20px]">
            Du Néolithique au Moyen Âge, redécouvrons les savoir-faire textiles qui racontent nos
            histoires.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button to="/association" size="lg" className="max-sm:text-[17px]">
              Tirez le fil de notre histoire
            </Button>
            <Button to="/ateliers" variant="outline-light" size="lg" className="max-sm:text-[17px]">
              Nos ateliers
            </Button>
          </div>
        </div>
      </div>

      <a
        href="#association"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-ivoire/80 transition-colors hover:text-ivoire xl:bottom-[38px]"
      >
        DÉFILER
        <img src={chevron} alt="" width="14" height="8" className="animate-bounce" />
      </a>
    </section>
  )
}
