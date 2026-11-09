/**
 * Taille de police proportionnelle à la largeur d'un <Collage>
 * (px Figma → unités de conteneur).
 */
export function cq(px, boxWidth) {
  return `${(px / boxWidth) * 100}cqw`
}
