/**
 * Fil décoratif entre deux sections : il se dessine au rythme du défilement
 * (voir SiteMotion, data-fil-scroll), avec un petit nœud au milieu.
 */
export default function ThreadDivider({ className = '', flip = false }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none relative h-16 w-full overflow-visible md:h-24 ${className}`}>
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className={`absolute inset-0 size-full overflow-visible ${flip ? '-scale-x-100' : ''}`}>
        <path
          data-fil-scroll
          d="M-10 70 C 220 10, 420 95, 650 50 C 760 28, 800 30, 830 48 C 850 62, 820 78, 805 62 C 790 46, 840 30, 900 40 C 1100 72, 1260 20, 1450 45"
          fill="none"
          stroke="#B4583D"
          strokeOpacity="0.5"
          strokeWidth="1.3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}
