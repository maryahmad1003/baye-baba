export interface CropAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropPoint {
  x: number;
  y: number;
}

export type AppStep = "idle" | "cropping" | "generating" | "done";

export interface PosterState {
  step: AppStep;
  rawImageSrc: string | null;
  croppedAreaPixels: CropAreaPixels | null;
  crop: CropPoint;
  zoom: number;
  finalImageUrl: string | null;
  error: string | null;
}

export interface PosterActions {
  setRawImage: (src: string) => void;
  setCrop: (crop: CropPoint) => void;
  setZoom: (zoom: number) => void;
  setCroppedAreaPixels: (area: CropAreaPixels) => void;
  setStep: (step: AppStep) => void;
  setFinalImage: (url: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export type PosterStore = PosterState & PosterActions;
