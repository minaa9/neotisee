import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { CenteredHeading } from '../../components/ui'
import { MOTION_OK, gsap, useGSAP } from '../../motion/gsap'

// Réponses tirées des contenus déjà présents sur le site (ateliers, association, contact).
const questions = [
  {
    q: 'Faut-il savoir tisser pour participer ?',
    r: (
      <>
        Pas du tout. Chaque atelier commence par une présentation des outils et des gestes, puis
        chacun·e s’essaie à son tour. Nos ateliers s’adressent aux curieux de tout âge.
      </>
    ),
  },
  {
    q: 'Pouvez-vous venir dans notre école, musée ou festival ?',
    r: (
      <>
        Oui, nous partageons nos ateliers et démonstrations avec les écoles, les musées et les
        festivals. Racontez-nous votre projet via{' '}
        <Link to="/contact?objet=prestation" className="link-fil text-terre-cuite">
          une demande de prestation
        </Link>
        .
      </>
    ),
  },
  {
    q: 'Où trouver les prochains rendez-vous ?',
    r: (
      <>
        Tous nos ateliers et rencontres sont réunis dans{' '}
        <Link to="/calendrier" className="link-fil text-terre-cuite">
          le calendrier
        </Link>
        . Une question précise ? Écrivez-nous depuis la page{' '}
        <Link to="/contact" className="link-fil text-terre-cuite">
          Contact
        </Link>
        .
      </>
    ),
  },
]

/**
 * 10 · Questions fréquentes : un fil horizontal se dessine sous chaque
 * question au défilement, la réponse se déroule comme une pelote.
 */
export default function Faq() {
  const ref = useRef(null)
  const [open, setOpen] = useState(0)

  // Entrée : les fils se tracent de gauche à droite, les numéros montent.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-faq-line]', {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.4,
          ease: 'expo.inOut',
          stagger: 0.15,
          scrollTrigger: { trigger: ref.current, start: 'top 75%' },
        })
        gsap.from('[data-faq-num]', {
          yPercent: 100,
          autoAlpha: 0,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.15,
          scrollTrigger: { trigger: ref.current, start: 'top 75%' },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  // Ouverture / fermeture : la hauteur se déroule en douceur.
  useGSAP(
    () => {
      const reduce = !window.matchMedia(MOTION_OK).matches
      ref.current.querySelectorAll('[data-faq-panel]').forEach((panel, i) => {
        const isOpen = i === open
        gsap.to(panel, {
          height: isOpen ? 'auto' : 0,
          autoAlpha: isOpen ? 1 : 0,
          duration: reduce ? 0 : 0.7,
          ease: 'expo.inOut',
        })
      })
    },
    { scope: ref, dependencies: [open] },
  )

  return (
    <section ref={ref} aria-labelledby="faq-titre" className="bg-creme pt-10 pb-24 xl:pb-[130px]">
      <div className="container-site">
        <CenteredHeading
          title={
            <span id="faq-titre">
              Vos questions, <em>nos réponses</em>
            </span>
          }
          subtitle="Avant de prendre le fil avec nous."
        />

        <ul className="mx-auto mt-12 max-w-[860px] xl:mt-16">
          {questions.map((item, i) => {
            const isOpen = i === open
            return (
              <li key={item.q} className="relative">
                <span data-faq-line aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-brun/15" />
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-r-${i}`}
                    data-cursor={isOpen ? 'Fermer' : 'Lire'}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center gap-5 py-7 text-left md:gap-8"
                  >
                    <span className="overflow-hidden">
                      <span data-faq-num className="block font-serif text-[22px] text-terre-cuite italic">
                        0{i + 1}
                      </span>
                    </span>
                    <span
                      className={`flex-1 font-serif text-[26px] leading-[1.15] transition-[color,transform] duration-500 group-hover:translate-x-2 md:text-[34px] ${
                        isOpen ? 'text-terre-cuite' : 'text-brun'
                      }`}
                    >
                      {item.q}
                    </span>
                    {/* Petite pelote : le + tourne et devient – */}
                    <span
                      aria-hidden="true"
                      className={`relative flex size-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                        isOpen ? 'rotate-180 border-terre-cuite bg-terre-cuite text-lin' : 'border-brun/25 text-brun group-hover:border-terre-cuite group-hover:text-terre-cuite'
                      }`}
                    >
                      <span className="absolute h-px w-4 bg-current" />
                      <span className={`absolute h-4 w-px bg-current transition-transform duration-500 ${isOpen ? 'scale-y-0' : ''}`} />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-r-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  data-faq-panel
                  className="h-0 overflow-hidden opacity-0"
                >
                  <p className="max-w-[640px] pb-8 pl-[46px] text-courant text-brun-doux md:pl-[62px]">{item.r}</p>
                </div>
              </li>
            )
          })}
          <li aria-hidden="true" className="relative h-px">
            <span data-faq-line className="absolute inset-x-0 top-0 h-px bg-brun/15" />
          </li>
        </ul>
      </div>
    </section>
  )
}
