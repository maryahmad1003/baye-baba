"use client";

import { motion } from "framer-motion";
import { PosterCanvas } from "@/components/Poster/PosterCanvas";
import { CropModal } from "@/components/Cropper/CropModal";
import { ResultOverlay } from "@/components/Poster/ResultOverlay";
import { usePosterStore } from "@/store/usePosterStore";

export default function Home() {
  const error = usePosterStore((s) => s.error);
  const setError = usePosterStore((s) => s.setError);

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#eff5ec] p-0 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full h-screen sm:h-auto sm:max-w-md sm:rounded-2xl sm:shadow-2xl sm:overflow-hidden bg-white"
      >
        <PosterCanvas />
      </motion.div>

      <CropModal />
      <ResultOverlay />

      {error && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] bg-red-600 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg">
          <button onClick={() => setError(null)} className="font-medium">
            {error} — fermer
          </button>
        </div>
      )}
    </main>
  );
}
