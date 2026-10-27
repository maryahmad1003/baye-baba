import { create } from "zustand";
import type { PosterStore } from "@/types";

const initialState = {
  step: "idle" as const,
  rawImageSrc: null,
  croppedAreaPixels: null,
  crop: { x: 0, y: 0 },
  zoom: 1,
  finalImageUrl: null,
  error: null,
};

export const usePosterStore = create<PosterStore>((set) => ({
  ...initialState,

  setRawImage: (src) =>
    set({
      rawImageSrc: src,
      step: "cropping",
      crop: { x: 0, y: 0 },
      zoom: 1,
      finalImageUrl: null,
      error: null,
    }),

  setCrop: (crop) => set({ crop }),

  setZoom: (zoom) => set({ zoom }),

  setCroppedAreaPixels: (croppedAreaPixels) => set({ croppedAreaPixels }),

  setStep: (step) => set({ step }),

  setFinalImage: (finalImageUrl) => set({ finalImageUrl, step: "done" }),

  setError: (error) => set({ error }),

  reset: () => set({ ...initialState }),
}));
