import { useRef } from 'react'
import { Link } from 'react-router'
import { MOTION_OK, SplitText, gsap, useGSAP } from '../../motion/gsap'
import hero from '../../assets/home/hero.webp'
import noeud from '../../assets/v3/home/noeud.svg'
import flecheClair from '../../assets/v3/ui/fleche-clair.svg'

/**
 * Bouton « Découvrir l'association » : pilule en verre dépoli. Au survol,
 * le lin remplit la pilule depuis la gauche comme un fil qu'on tire, le
 * texte passe en brun et la navette terre cuite pivote vers la droite.
 */
function HeroButton() {
  return (
    <Link
      to="/association"
      className="group relative mt-8 inline-flex items-center gap-4 overflow-hidden rounded-full border border-lin/45 bg-lin/10 py-2 pr-2 pl-7 backdrop-blur-md transition-[border-color,box-shadow] duration-500 hover:border-lin hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lin xl:mt-[33px]"
    >
      <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 rounded-full bg-lin transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100" />
      <span className="relative flex flex-col text-left">
        <span className="text-[11px] tracking-[0.18em] text-lin/70 uppercase transition-colors duration-500 group-hover:text-brique">Notre histoire</span>
        <span className="font-serif text-[22px] leading-[1.1] text-lin italic transition-colors duration-500 group-hover:text-brun">
          Découvrir l’association
        </span>
      </span>
      <span className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-terre-cuite transition-transform duration-500 group-hover:scale-105">
        <img src={flecheClair} alt="" width="16" height="16" className="size-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0" />
      </span>
    </Link>
  )
}

/**
 * 01 · Hero — entrée « cinématographique » :
 *  1. la photo s'ouvre depuis une fenêtre arrondie et se dézoome ;
 *  2. un fil terre cuite traverse l'écran en se dessinant et forme une boucle ;
 *  3. « Néotisse » apparaît lettre par lettre, puis l'accroche ligne par ligne ;
 *  4. au défilement, la photo glisse en parallaxe et le texte s'éloigne.
 */
export default function Hero() {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Intro « pelote » : rejouée à chaque arrivée sur l'accueil,
        // l'entrée du hero démarre quand le rideau de laine se lève.
        const intro = window.__ntIntro
        if (intro && !intro.playing()) intro.play()
        const start = intro && intro.playing() ? 2.5 : 0.3
        const title = SplitText.create('[data-hero-title]', { type: 'chars', mask: 'chars' })
        const lines = SplitText.create('[data-hero-lines]', { type: 'lines', mask: 'lines' })

        gsap
          .timeline({ delay: start, defaults: { ease: 'expo.out' } })
          .fromTo('[data-hero-frame]', { clipPath: 'inset(22% 30% 22% 30% round 300px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.8, ease: 'expo.inOut' })
          .fromTo('[data-hero-img]', { scale: 1.35 }, { scale: 1.08, duration: 2.4 }, 0)
          .from('[data-hero-veil]', { autoAlpha: 0, duration: 1.2 }, 0.6)
          .from('[data-hero-thread]', { drawSVG: 0, duration: 2.6, ease: 'power2.inOut' }, 0.7)
          .from(title.chars, { yPercent: 110, rotation: 6, duration: 1.2, stagger: 0.06 }, 1)
          .from(lines.lines, { yPercent: 105, duration: 1, stagger: 0.12 }, 1.4)
          .from('[data-hero-fade]', { autoAlpha: 0, y: 24, duration: 1, stagger: 0.15 }, 1.7)

        // Au défilement : la photo reste plein écran (elle ne rétrécit plus),
        // elle glisse doucement en parallaxe et le texte s'éloigne.
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } })
          .to('[data-hero-img]', { yPercent: 12, ease: 'none' }, 0)
          .to('[data-hero-content]', { yPercent: -35, autoAlpha: 0, ease: 'none' }, 0)

        return () => {
          title.revert()
          lines.revert()
        }
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} data-no-motion className="relative isolate h-[100svh] min-h-[600px] max-h-[960px] overflow-hidden bg-creme">
      <div data-hero-frame className="absolute inset-0 -z-10 overflow-hidden bg-brun">
        <img
          data-hero-img
          src={hero}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-[70%_center]"
        />
        <div data-hero-veil aria-hidden="true" className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(61,42,35,0.78)_0%,rgba(61,42,35,0.35)_55%,rgba(180,88,61,0.12)_100%)] max-md:bg-[linear-gradient(90deg,rgba(61,42,35,0.8)_0%,rgba(61,42,35,0.55)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-[rgba(140,152,165,0.45)] to-transparent" />
        </div>
      </div>

      {/* Fil textile qui traverse l'écran et fait une boucle */}
      <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full">
        <path
          data-hero-thread
          d="M-20 690 C 180 640, 330 760, 520 700 C 700 640, 760 520, 700 470 C 640 420, 560 500, 640 560 C 760 650, 1000 560, 1130 470 C 1260 380, 1360 420, 1460 380"
          fill="none"
          stroke="#E7C6B3"
          strokeOpacity="0.75"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>


      <div className="container-site relative flex h-full items-center pt-20 pb-36 md:pb-40">
        <div data-hero-content>
          <h1 data-hero-title className="-ml-1 font-serif text-[96px] leading-[0.95] font-light tracking-[-0.02em] text-lin sm:text-[120px] xl:-ml-2 xl:text-[clamp(110px,15svh,140px)]">
            Néotisse
          </h1>
          <p data-hero-lines className="mt-6 max-w-[700px] font-serif text-[38px] leading-[1.15] font-light text-lin italic sm:text-[48px] xl:mt-[12px] xl:text-[48px]">
            Des gestes oubliés,
            <br />
            des histoires à retisser
          </p>
          <p data-hero-fade className="mt-6 max-w-[420px] text-courant text-lin/88 xl:mt-[17px]">
            Du Néolithique au Moyen Âge, redécouvrons les savoir-faire textiles qui racontent nos
            histoires.
          </p>
          <div data-hero-fade>
            <HeroButton />
          </div>
        </div>
      </div>

      {/* Fil « Défiler » */}
      <a
        data-hero-fade
        data-cursor="Défiler"
        href="#association"
        aria-label="Défiler vers la suite"
        className="group absolute bottom-[40px] left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-label text-lin/80 transition-colors group-hover:text-lin">Défiler</span>
        <span aria-hidden="true" className="h-12 w-px animate-[fil_2.4s_ease-in-out_infinite] bg-lin/60" />
        <img src={noeud} alt="" className="size-[9px] animate-bounce" />
      </a>
    </section>
  )
}
