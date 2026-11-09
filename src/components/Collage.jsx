/**
 * Compositions libres des maquettes (photos détourées, gravures, notes
 * manuscrites). Les positions sont saisies en pixels Figma, relativement
 * à une boîte `width × height`, puis converties en pourcentages pour que
 * la composition se redimensionne proportionnellement.
 *
 * Chaque élément :
 *  - x, y, w, h : boîte englobante dans Figma (après rotation)
 *  - iw, ih     : taille réelle de l'élément avant rotation (par défaut w, h)
 *  - rotate     : rotation en degrés
 *  - flipY      : miroir vertical (-scale-y-100 dans Figma)
 *  - src / node : image ou contenu React
 *  - cover      : true pour object-cover (images détourées par un masque)
 */
export default function Collage({ width, height, items, className = '' }) {
  return (
    <div
      className={`relative @container ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
      aria-hidden="true"
    >
      {items.map((item, i) => {
        const iw = item.iw ?? item.w
        const ih = item.ih ?? item.h
        const transform = [
          item.rotate ? `rotate(${item.rotate}deg)` : '',
          item.flipY ? 'scaleY(-1)' : '',
        ].join(' ')

        return (
          <div
            key={i}
            className="absolute flex items-center justify-center"
            style={{
              left: `${(item.x / width) * 100}%`,
              top: `${(item.y / height) * 100}%`,
              width: `${(item.w / width) * 100}%`,
              height: `${(item.h / height) * 100}%`,
              zIndex: item.z,
            }}
          >
            <div
              className="relative shrink-0"
              style={{
                width: `${(iw / item.w) * 100}%`,
                height: `${(ih / item.h) * 100}%`,
                transform: transform.trim() || undefined,
              }}
            >
              {item.src ? (
                <img
                  src={item.src}
                  alt=""
                  loading="lazy"
                  className={`absolute inset-0 size-full max-w-none ${
                    item.cover ? 'object-cover' : ''
                  }`}
                />
              ) : (
                item.node
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
