"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, RefreshCw, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePosterStore } from "@/store/usePosterStore";
import { downloadPoster } from "@/services/posterGenerator";
import { sharePoster } from "@/services/shareService";
import { usePosterGeneration } from "@/hooks/usePosterGeneration";
import { POSTER_ASPECT_RATIO } from "@/utils/geometry";

export function ResultOverlay() {
  usePosterGeneration();

  const step = usePosterStore((s) => s.step);
  const finalImageUrl = usePosterStore((s) => s.finalImageUrl);
  const reset = usePosterStore((s) => s.reset);
  const setStep = usePosterStore((s) => s.setStep);

  const [isSharing, setIsSharing] = useState(false);

  const isGenerating = step === "generating";
  const isDone = step === "done" && !!finalImageUrl;
  const isVisible = isGenerating || isDone;

  const handleDownload = () => {
    if (!finalImageUrl) return;
    downloadPoster(finalImageUrl);
    toast.success("Affiche téléchargée !");
  };

  const handleShare = async () => {
    if (!finalImageUrl) return;
    setIsSharing(true);
    try {
      const result = await sharePoster(finalImageUrl);
      if (result === "fallback") {
        toast.info("Image téléchargée — partagez-la depuis WhatsApp.");
      }
    } catch {
      toast.error("Le partage a échoué.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm px-4 py-6"
        >
          {isDone && (
            <button
              type="button"
              onClick={() => setStep("cropping")}
              aria-label="Retour au recadrage"
              className="absolute top-4 left-4 p-2 rounded-full text-white hover:bg-white/10 transition-colors"
            >
              <X size={22} />
            </button>
          )}

          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 text-white"
            >
              <Loader2 className="animate-spin" size={40} />
              <p className="text-sm font-medium tracking-wide">
                Génération de votre affiche…
              </p>
            </motion.div>
          )}

          {isDone && finalImageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-5 w-full max-w-sm"
            >
              <div
                className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
                style={{ aspectRatio: POSTER_ASPECT_RATIO }}
              >
                <Image
                  src={finalImageUrl}
                  alt="Votre affiche personnalisée"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>

              <div className="flex flex-col gap-3 w-full">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white text-emerald-800 font-semibold shadow-lg hover:bg-emerald-50 transition-colors"
                >
                  <Download size={18} />
                  Télécharger
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  disabled={isSharing}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#25D366] text-white font-semibold shadow-lg shadow-green-900/20 disabled:opacity-60 transition-opacity"
                >
                  {isSharing ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Share2 size={18} />
                  )}
                  Partager sur WhatsApp
                </button>

                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition-colors"
                >
                  <RefreshCw size={15} />
                  Changer de photo
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
