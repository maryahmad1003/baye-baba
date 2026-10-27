/**
 * Configuration centrale du template de l'affiche.
 * Toutes les coordonnées de génération sont définies ici.
 * Aucune coordonnée ne doit être codée en dur ailleurs dans l'application.
 */

export const TEMPLATE_CONFIG = {
  /** Image de fond officielle (affiche complète, non modifiable) */
  background: "/assets/Affiche Baye Niass Day à Dakar.png",

  /** Dimensions natives de l'image de fond (px) */
  width: 1024,
  height: 1536,

  /** Ouverture réservée à la photo de l'utilisateur (coordonnées en px, base = width/height ci-dessus) */
  circle: {
    centerX: 341,
    centerY: 1060,
    radiusX: 234,
    radiusY: 238,
  },

  /** Debord sous le contour pour que la photo remplisse toute l'ouverture blanche (px) */
  photoBleed: 20,

  /** Épaisseur de la marge de sécurité interne pour éviter que la photo déborde sur le contour dessiné (px) */
  safeInset: 0,

  /** Qualité d'export du PNG final */
  export: {
    mimeType: "image/png" as const,
    quality: 1,
    fileName: "baye-niass-day.png",
  },
} as const;

export const ASSETS = {
  logo: "/assets/logo-nouroul-bassare.png",
  portraitPrincipal: "/assets/portrait-principal.jpeg",
  portraitSecondaire: "/assets/portrait-secondaire.jpeg",
  template: TEMPLATE_CONFIG.background,
} as const;

export const EVENT_INFO = {
  eventName: "Baye Niass Day",
  date: "08 novembre 2026",
  location: "Keur Baye Dieuppeul",
  ctaText: "J'y serai",
  contactPhones: ["77 294 33 72", "77 797 67 68"],
  organizer: "La Jeunesse Talibé de Baye Niass",
} as const;

/** Paramètres du recadreur ajustés au ratio de l'ouverture photo */
export const CROPPER_CONFIG = {
  cropShape: "round" as const,
  minZoom: 1,
  maxZoom: 3,
  zoomStep: 0.05,
  aspect: TEMPLATE_CONFIG.circle.radiusX / TEMPLATE_CONFIG.circle.radiusY,
};

export const WHATSAPP_SHARE = {
  baseUrl: "https://wa.me/",
  defaultMessage: `Je serai présent(e) au ${EVENT_INFO.eventName} à Dakar, le ${EVENT_INFO.date} ! 🎉`,
};
