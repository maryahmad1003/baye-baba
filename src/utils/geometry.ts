import { TEMPLATE_CONFIG } from "@/config/template";

/**
 * Retourne la position et la taille du cercle interactif en pourcentage
 * du conteneur, pour un positionnement responsive fidèle à l'affiche
 * quelle que soit la taille d'écran (le ratio de l'affiche est toujours conservé).
 */
export function getCirclePercentPosition() {
  const { width, height, circle } = TEMPLATE_CONFIG;

  return {
    leftPercent: ((circle.centerX - circle.radiusX) / width) * 100,
    topPercent: ((circle.centerY - circle.radiusY) / height) * 100,
    sizePercentOfWidth: ((circle.radiusX * 2) / width) * 100,
    sizePercentOfHeight: ((circle.radiusY * 2) / height) * 100,
  };
}

export const POSTER_ASPECT_RATIO = TEMPLATE_CONFIG.width / TEMPLATE_CONFIG.height;
