"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ZoomIn, ZoomOut, Check, X } from "lucide-react";
import { usePosterStore } from "@/store/usePosterStore";
import { CROPPER_CONFIG } from "@/config/template";
import type { CropAreaPixels } from "@/types";

export function CropModal() {
  const step = usePosterStore((s) => s.step);
  const rawImageSrc = usePosterStore((s) => s.rawImageSrc);
  const crop = usePosterStore((s) => s.crop);
  const zoom = usePosterStore((s) => s.zoom);
  const setCrop = usePosterStore((s) => s.setCrop);
  const setZoom = usePosterStore((s) => s.setZoom);
  const setCroppedAreaPixels = usePosterStore((s) => s.setCroppedAreaPixels);
  const setStep = usePosterStore((s) => s.setStep);
  const reset = usePosterStore((s) => s.reset);

  const [localArea, setLocalArea] = useState<CropAreaPixels | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: unknown, croppedAreaPixels: CropAreaPixels) => {
      setLocalArea(croppedAreaPixels);
    },
    []
  );

  const handleValidate = () => {
    if (localArea) {
      setCroppedAreaPixels(localArea);
    }
    setStep("generating");
  };

  const isOpen = step === "cropping" && !!rawImageSrc;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between px-4 py-3 text-white"
          >
            <button
              type="button"
              onClick={reset}
              aria-label="Annuler"
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={22} />
            </button>
            <p className="text-sm font-medium tracking-wide">Ajuster votre photo</p>
            <div className="w-9" />
          </motion.div>

          <div className="relative flex-1 min-h-0">
            {rawImageSrc && (
              <Cropper
                image={rawImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={CROPPER_CONFIG.aspect}
                cropShape={CROPPER_CONFIG.cropShape}
                showGrid={false}
                minZoom={CROPPER_CONFIG.minZoom}
                maxZoom={CROPPER_CONFIG.maxZoom}
                zoomSpeed={CROPPER_CONFIG.zoomStep * 10}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                objectFit="contain"
              />
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="px-6 py-4 flex flex-col gap-4 bg-black/40"
          >
            <div className="flex items-center gap-3">
              <ZoomOut size={18} className="text-white/70 shrink-0" />
              <input
                type="range"
                min={CROPPER_CONFIG.minZoom}
                max={CROPPER_CONFIG.maxZoom}
                step={CROPPER_CONFIG.zoomStep}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-emerald-500"
                aria-label="Zoom"
              />
              <ZoomIn size={18} className="text-white/70 shrink-0" />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                }}
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition-colors"
              >
                <RotateCcw size={16} />
                Centrer
              </button>
              <button
                type="button"
                onClick={handleValidate}
                disabled={!localArea}
                className="flex items-center justify-center gap-2 flex-[2] py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-900/30 disabled:opacity-50 transition-opacity"
              >
                <Check size={18} />
                Valider
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
