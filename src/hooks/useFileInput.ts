import { useCallback, useRef } from "react";
import { usePosterStore } from "@/store/usePosterStore";

const MAX_FILE_SIZE_MB = 15;

export function useFileInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const setRawImage = usePosterStore((s) => s.setRawImage);
  const setError = usePosterStore((s) => s.setError);

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = ""; // permet de re-sélectionner le même fichier

      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner une image valide.");
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`L'image est trop volumineuse (max ${MAX_FILE_SIZE_MB} Mo).`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setRawImage(reader.result);
        }
      };
      reader.onerror = () => setError("Impossible de lire cette image.");
      reader.readAsDataURL(file);
    },
    [setRawImage, setError]
  );

  return { inputRef, openFilePicker, handleFileChange };
}
