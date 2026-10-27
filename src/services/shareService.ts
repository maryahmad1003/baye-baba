import { TEMPLATE_CONFIG, WHATSAPP_SHARE } from "@/config/template";
import { dataUrlToBlob, downloadPoster } from "@/services/posterGenerator";

/**
 * Partage l'affiche via l'API native de partage (mobile), avec l'image en pièce jointe.
 * Si non disponible, télécharge l'image et ouvre WhatsApp Web en repli.
 */
export async function sharePoster(dataUrl: string): Promise<"shared" | "fallback"> {
  const blob = await dataUrlToBlob(dataUrl);
  const file = new File([blob], TEMPLATE_CONFIG.export.fileName, { type: "image/png" });

  const canShareFiles =
    typeof navigator !== "undefined" &&
    "share" in navigator &&
    "canShare" in navigator &&
    navigator.canShare?.({ files: [file] });

  if (canShareFiles) {
    try {
      await navigator.share({
        files: [file],
        text: WHATSAPP_SHARE.defaultMessage,
      });
      return "shared";
    } catch {
      // L'utilisateur a annulé ou une erreur est survenue : on bascule sur le repli
    }
  }

  downloadPoster(dataUrl);
  const waUrl = `${WHATSAPP_SHARE.baseUrl}?text=${encodeURIComponent(
    WHATSAPP_SHARE.defaultMessage
  )}`;
  window.open(waUrl, "_blank", "noopener,noreferrer");
  return "fallback";
}
