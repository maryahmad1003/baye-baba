import { useEffect } from "react";
import { usePosterStore } from "@/store/usePosterStore";
import { generatePoster } from "@/services/posterGenerator";

/**
 * Écoute le passage à l'étape "generating" et produit l'image finale.
 */
export function usePosterGeneration() {
  const step = usePosterStore((s) => s.step);
  const rawImageSrc = usePosterStore((s) => s.rawImageSrc);
  const croppedAreaPixels = usePosterStore((s) => s.croppedAreaPixels);
  const setFinalImage = usePosterStore((s) => s.setFinalImage);
  const setError = usePosterStore((s) => s.setError);
  const setStep = usePosterStore((s) => s.setStep);

  useEffect(() => {
    if (step !== "generating" || !rawImageSrc || !croppedAreaPixels) return;

    let cancelled = false;

    generatePoster({ userImageSrc: rawImageSrc, croppedAreaPixels })
      .then((dataUrl) => {
        if (!cancelled) setFinalImage(dataUrl);
      })
      .catch(() => {
        if (!cancelled) {
          setError("La génération de l'affiche a échoué. Veuillez réessayer.");
          setStep("cropping");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [step, rawImageSrc, croppedAreaPixels, setFinalImage, setError, setStep]);
}
