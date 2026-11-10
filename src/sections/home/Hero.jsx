import { Button } from '../../components/ui'
import hero from '../../assets/home/hero.webp'
import cercleFil from '../../assets/v3/home/cercle-fil.svg'
import noeud from '../../assets/v3/home/noeud.svg'
import vagueCreme from '../../assets/v3/home/vague-creme.svg'

/** 01 · Hero (Figma 347:20) — toujours la hauteur de l'écran, pour que la vague et « Défiler » restent visibles. */
export default function Hero() {
  return (
    <section className="relative isolate flex h-[100svh] min-h-[600px] max-h-[960px] items-center overflow-hidden bg-brun">
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
      <div aria-hidden="true" className="pointer-events-none absolute top-[calc(50%-20px)] right-[6%] hidden aspect-square h-[min(560px,62svh)] -translate-y-1/2 lg:block">
        <img src={cercleFil} alt="" className="animate-tourne absolute inset-0 size-full" />
      </div>

      <div className="container-site relative pt-20 pb-36 md:pb-40">
        <div className="animate-[heroIn_1.1s_ease_both]">
          <h1 className="-ml-1 font-serif text-[96px] leading-[0.9] font-light tracking-[-0.02em] text-lin sm:text-[120px] xl:-ml-2 xl:text-[clamp(110px,15svh,140px)]">
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
        className="group absolute bottom-[150px] left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-label text-lin/80 transition-colors group-hover:text-lin">Défiler</span>
        <span aria-hidden="true" className="h-12 w-px bg-lin/60" />
        <img src={noeud} alt="" className="size-[9px] animate-bounce" />
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
