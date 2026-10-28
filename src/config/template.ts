/**
 * Configuration centrale du template de l'affiche.
 * Toutes les coordonnées de génération sont définies ici.
 * Aucune coordonnée ne doit être codée en dur ailleurs dans l'application.
 */

export const TEMPLATE_CONFIG = {
  /** Image de fond officielle (affiche complète, non modifiable) */
  background: "/assets/image.png",

  /** Dimensions natives de l'image de fond (px) */
  width: 905,
  height: 1280,

  /** Ouverture réservée à la photo de l'utilisateur (coordonnées en px, base = width/height ci-dessus) */
  circle: {
    centerX: 276,
    centerY: 985,
    radiusX: 193,
    radiusY: 192,
  },

  /** Debord sous le contour pour que la photo remplisse toute l'ouverture blanche (px) */
  photoBleed: 20,

  /** Épaisseur de la marge de sécurité interne pour éviter que la photo déborde sur le contour dessiné (px) */
  safeInset: 0,

  /** Qualité d'export du PNG final */
  export: {
    mimeType: "image/png" as const,
    quality: 1,
    fileName: "caravane-magal-judd.png",
  },
} as const;

export const ASSETS = {
  logo: "/assets/logo-nouroul-bassare.png",
  portraitPrincipal: "/assets/portrait-principal.jpeg",
  portraitSecondaire: "/assets/portrait-secondaire.jpeg",
  template: TEMPLATE_CONFIG.background,
} as const;

export const EVENT_INFO = {
  eventName: "Caravane Magal JUDD",
  date: "vendredi 25 décembre",
  location: "Medina Baye - Leona Niassène - Taiba Niassène - Kossy",
  ctaText: "J'y serai",
  contactPhones: ["78 151 82 82", "76 996 30 08", "78 220 11 03"],
  organizer: "Ak Khadimou Fayda",
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
  defaultMessage: `Je serai présent(e) à la ${EVENT_INFO.eventName}, le ${EVENT_INFO.date} ! 🎉`,
};
