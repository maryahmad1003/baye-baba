"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { TEMPLATE_CONFIG } from "@/config/template";
import { getCirclePercentPosition, POSTER_ASPECT_RATIO } from "@/utils/geometry";
import { useFileInput } from "@/hooks/useFileInput";

export function PosterCanvas() {
  const { inputRef, openFilePicker, handleFileChange } = useFileInput();
  const circle = getCirclePercentPosition();

  const handleClick = () => {
    openFilePicker();
  };

  return (
    <div
      className="relative w-full select-none"
      style={{ aspectRatio: POSTER_ASPECT_RATIO }}
    >
      {/* Affiche officielle — fond jamais modifié */}
      <Image
        src={TEMPLATE_CONFIG.background}
        alt="Affiche Baye Niass Day à Dakar"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 480px"
        className="object-contain pointer-events-none select-none"
      />

      {/* Zone interactive pour ajouter une photo */}
      <motion.button
        type="button"
        aria-label="Ajouter votre photo"
        onClick={handleClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover="hover"
        transition={{ duration: 0.5 }}
        className="group absolute rounded-full cursor-pointer outline-none"
        style={{
          left: `${circle.leftPercent}%`,
          top: `${circle.topPercent}%`,
          width: `${circle.sizePercentOfWidth}%`,
          height: `${circle.sizePercentOfHeight}%`,
        }}
      >
        <motion.div
          variants={{
            hover: { boxShadow: "0 0 0 6px rgba(0, 100, 40, 0.18)" },
          }}
          className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-1 bg-transparent transition-shadow"
        >
          <motion.div
            variants={{ hover: { opacity: 1, scale: 1 } }}
            initial={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center justify-center gap-1.5 rounded-full bg-black/35 backdrop-blur-[1px] w-[70%] h-[70%]"
          >
            <Camera className="text-white drop-shadow" size="28%" strokeWidth={1.8} />
            <span className="text-white text-[11px] sm:text-xs font-medium tracking-tight text-center px-2 drop-shadow">
              Ajouter votre photo
            </span>
          </motion.div>
        </motion.div>
      </motion.button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
