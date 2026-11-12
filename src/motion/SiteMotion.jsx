import { useLocation } from 'react-router'
import { MOTION_OK, ScrollTrigger, SplitText, gsap, useGSAP } from './gsap'

/**
 * Animations communes à toutes les pages, relancées à chaque changement de page :
 *  1. Parallaxe des images : chaque photo cadrée (dans un conteneur
 *     overflow-hidden) glisse doucement à l'intérieur de son cadre.
 *  2. Titres : découpés en lignes (SplitText autoSplit) qui montent une à une
 *     quand le titre arrive à l'écran ; le découpage se refait tout seul si la
 *     largeur change.
 *  3. Fil courbe des en-têtes : il se dessine de gauche à droite.
 *  4. Listes marquées data-stagger : les éléments arrivent l'un après l'autre.
 *  5. Chiffres marqués data-count : ils se comptent jusqu'à leur valeur.
 *  6. Cartes data-tilt : légère inclinaison 3D sous la souris.
 *  7. Fils data-fil-scroll : se dessinent au rythme du défilement.
 *
 * Un élément peut s'exclure avec l'attribut data-no-motion.
 */
export default function SiteMotion() {
  const { pathname } = useLocation()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const main = document.getElementById('contenu')
        if (!main) return

        // 1. Parallaxe
        main.querySelectorAll('.overflow-hidden > img.object-cover').forEach((img) => {
          if (img.closest('[data-no-motion]')) return
          gsap.fromTo(
            img,
            { yPercent: -6, scale: 1.14 },
            {
              yPercent: 6,
              scale: 1.14,
              ease: 'none',
              scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })

        // 2. Titres ligne par ligne
        main.querySelectorAll('h1, h2').forEach((title) => {
          if (title.closest('[data-no-motion]')) return
          SplitText.create(title, {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1,
                ease: 'expo.out',
                stagger: 0.09,
                scrollTrigger: { trigger: title, start: 'top 88%', once: true },
              }),
          })
        })

        // 3. Fil courbe qui se dessine
        main.querySelectorAll('[data-draw]').forEach((path) => {
          gsap.from(path, { drawSVG: 0, duration: 2.4, ease: 'power2.inOut', delay: 0.3 })
        })

        // 4. Listes qui apparaissent élément par élément
        main.querySelectorAll('[data-stagger]').forEach((list) => {
          gsap.from(list.children, {
            y: 34,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: { trigger: list, start: 'top 85%', once: true },
          })
        })

        // 5. Chiffres qui se comptent (ex. 2024, 4, 5)
        main.querySelectorAll('[data-count]').forEach((el) => {
          const end = Number(el.dataset.count)
          const from = end > 1000 ? end - 40 : 0
          const obj = { v: from }
          el.textContent = from
          gsap.to(obj, {
            v: end,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate: () => (el.textContent = Math.round(obj.v)),
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          })
        })

        // 6. Cartes qui s'inclinent légèrement sous la souris (data-tilt)
        if (window.matchMedia('(hover: hover)').matches) {
          main.querySelectorAll('[data-tilt]').forEach((card) => {
            gsap.set(card, { transformPerspective: 900 })
            const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' })
            const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' })
            const move = (e) => {
              const r = card.getBoundingClientRect()
              ry(((e.clientX - r.left) / r.width - 0.5) * 8)
              rx(-((e.clientY - r.top) / r.height - 0.5) * 8)
            }
            const leave = () => (rx(0), ry(0))
            card.addEventListener('mousemove', move)
            card.addEventListener('mouseleave', leave)
          })
        }

        // 7. Fils séparateurs qui se dessinent au défilement (data-fil-scroll)
        main.querySelectorAll('[data-fil-scroll]').forEach((path) => {
          gsap.from(path, {
            drawSVG: 0,
            ease: 'none',
            scrollTrigger: { trigger: path.closest('svg'), start: 'top 90%', end: 'bottom 40%', scrub: 0.6 },
          })
        })

        // Les images arrivent après le premier rendu : on recalcule les positions.
        const t = setTimeout(() => ScrollTrigger.refresh(), 400)
        return () => clearTimeout(t)
      })
      return () => mm.revert()
    },
    { dependencies: [pathname], revertOnUpdate: true },
  )

  return null
}
