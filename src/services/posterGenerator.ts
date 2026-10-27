import { TEMPLATE_CONFIG } from "@/config/template";
import type { CropAreaPixels } from "@/types";

/**
 * Charge une image et retourne une promesse résolue une fois prête.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

interface GeneratePosterParams {
  userImageSrc: string;
  croppedAreaPixels: CropAreaPixels;
}

/** Makes the blank white area transparent while keeping nearby white artwork. */
function createTemplateOverlay(templateImg: HTMLImageElement): HTMLCanvasElement {
  const { width, height, circle, photoBleed } = TEMPLATE_CONFIG;
  const maskRadiusX = circle.radiusX + photoBleed;
  const maskRadiusY = circle.radiusY + photoBleed;
  const overlay = document.createElement("canvas");
  overlay.width = width;
  overlay.height = height;

  const ctx = overlay.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Impossible d'initialiser le canvas.");

  ctx.drawImage(templateImg, 0, 0, width, height);
  const image = ctx.getImageData(0, 0, width, height);
  const { data } = image;

  const left = Math.max(0, Math.floor(circle.centerX - maskRadiusX));
  const right = Math.min(width - 1, Math.ceil(circle.centerX + maskRadiusX));
  const top = Math.max(0, Math.floor(circle.centerY - maskRadiusY));
  const bottom = Math.min(height - 1, Math.ceil(circle.centerY + maskRadiusY));
  const regionWidth = right - left + 1;
  const regionHeight = bottom - top + 1;
  const visited = new Uint8Array(regionWidth * regionHeight);
  const queue = new Int32Array(regionWidth * regionHeight);

  const isWhite = (x: number, y: number) => {
    const index = (y * width + x) * 4;
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    return red >= 245 && green >= 245 && blue >= 245 && Math.max(red, green, blue) - Math.min(red, green, blue) <= 10;
  };

  let head = 0;
  let tail = 0;
  const seedX = Math.round(circle.centerX);
  const seedY = Math.round(circle.centerY);
  const seedIndex = (seedY - top) * regionWidth + seedX - left;
  if (isWhite(seedX, seedY)) {
    queue[tail++] = seedIndex;
    visited[seedIndex] = 1;
  }

  const enqueue = (x: number, y: number) => {
    if (x < left || x > right || y < top || y > bottom) return;

    const regionIndex = (y - top) * regionWidth + x - left;
    if (visited[regionIndex]) return;
    visited[regionIndex] = 1;

    const offsetX = (x - circle.centerX) / maskRadiusX;
    const offsetY = (y - circle.centerY) / maskRadiusY;
    if (offsetX * offsetX + offsetY * offsetY <= 1 && isWhite(x, y)) {
      queue[tail++] = regionIndex;
    }
  };

  while (head < tail) {
    const regionIndex = queue[head++];
    const x = left + (regionIndex % regionWidth);
    const y = top + Math.floor(regionIndex / regionWidth);
    data[(y * width + x) * 4 + 3] = 0;

    enqueue(x - 1, y);
    enqueue(x + 1, y);
    enqueue(x, y - 1);
    enqueue(x, y + 1);
  }

  ctx.putImageData(image, 0, 0);
  return overlay;
}

/**
 * Génère l'affiche finale en composant :
 * 1. Le fond officiel (template) — jamais modifié
 * 2. La photo de l'utilisateur, recadrée et masquée selon l'ouverture de l'affiche
 * Retourne une Data URL PNG haute qualité.
 */
export async function generatePoster({
  userImageSrc,
  croppedAreaPixels,
}: GeneratePosterParams): Promise<string> {
  const { width, height, background, circle, photoBleed, safeInset } = TEMPLATE_CONFIG;

  const [templateImg, userImg] = await Promise.all([
    loadImage(background),
    loadImage(userImageSrc),
  ]);
  const templateOverlay = createTemplateOverlay(templateImg);

  // Export en haute résolution (2x) pour un rendu HD
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = width * scale;
  canvas.height = height * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Impossible d'initialiser le canvas.");
  }

  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // 1. Photo utilisateur dans le cercle (dessinée AVANT le template
  //    pour que le contour officiel du cercle reste visible par-dessus)
  const radiusX = circle.radiusX + photoBleed - safeInset;
  const radiusY = circle.radiusY + photoBleed - safeInset;

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(circle.centerX, circle.centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(
    userImg,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    circle.centerX - radiusX,
    circle.centerY - radiusY,
    radiusX * 2,
    radiusY * 2
  );
  ctx.restore();

  // 2. Fond officiel de l'affiche par-dessus, avec un trou circulaire
  //    pour laisser apparaître la photo (le contour du cercle appartient au template)
  ctx.drawImage(templateOverlay, 0, 0, width, height);

  return canvas.toDataURL(TEMPLATE_CONFIG.export.mimeType, TEMPLATE_CONFIG.export.quality);
}

/**
 * Convertit une Data URL en Blob pour le partage / téléchargement.
 */
export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

/**
 * Déclenche le téléchargement du fichier PNG généré.
 */
export function downloadPoster(dataUrl: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = TEMPLATE_CONFIG.export.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
