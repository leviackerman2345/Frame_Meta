"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { homeContent } from "@/constants/home";
import { ChevronRight, Play } from "lucide-react";

export function Hero({ posters: customPosters }: { posters?: string[] }) {
  const { title, brandName, description, buttons, posters: defaultPosters } = homeContent.hero;
  const posters = customPosters && customPosters.length > 0 ? customPosters : defaultPosters;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[600px] md:h-[900px] bg-white/[0.02] rounded-full blur-[120px] md:blur-[180px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 text-center flex flex-col items-center pt-40 pb-16 md:pt-48 md:pb-24">
        {/* Text Block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-5 md:gap-7 mb-16 md:mb-24"
        >
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.03em] text-white leading-[1.05] max-w-4xl">
            {title.split(brandName)[0]}
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              {brandName}
            </span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-xl mx-auto leading-relaxed font-light">
            {description}
          </p>

          {/* Apple-style frosted glass CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button className="group flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-white/90 transition-all duration-300 cursor-pointer">
              {buttons.getStarted}
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
            <button className="flex items-center gap-2 px-7 py-3.5 bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] text-white rounded-full text-sm font-medium hover:bg-white/[0.14] transition-all duration-300 cursor-pointer">
              <Play className="w-4 h-4 fill-white/40" />
              {buttons.explore}
            </button>
          </div>
        </motion.div>

        {/* Cinematic Poster Showcase - Apple TV style horizontal depth */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-5xl mx-auto"
        >
          <div className="flex items-end justify-center gap-3 md:gap-5 px-4">
            {posters.map((poster, index) => {
              const count = posters.length;
              const center = (count - 1) / 2;
              const distFromCenter = index - center;
              const absDist = Math.abs(distFromCenter);

              // Scale: center is largest, edges get progressively smaller
              const scale = 1 - absDist * 0.08;

              // Y offset: center stays up, edges drop down slightly
              const translateY = absDist * 20;

              // Z-index: center on top
              const zIndex = Math.floor(50 - absDist * 10);

              // Slight rotation for depth
              const rotation = distFromCenter * 3;

              const isUrl = poster.startsWith('http') || poster.startsWith('/');
              const imgSrc = isUrl ? poster : `https://images.unsplash.com/${poster}?q=80&w=400&h=600&auto=format&fit=crop`;

              return (
                <motion.div
                  key={poster + index}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{
                    opacity: 1,
                    y: translateY,
                    rotate: rotation,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4 + index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative shrink-0 w-[100px] sm:w-[130px] md:w-[180px] lg:w-[200px] aspect-[2/3] rounded-xl md:rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.6)] group cursor-pointer"
                  style={{
                    zIndex,
                    transform: `scale(${scale}) translateY(${translateY}px) rotate(${rotation}deg)`,
                  }}
                >
                  <Image
                    src={imgSrc}
                    alt={`Movie poster ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100px, 200px"
                    priority={index < 4}
                  />
                  {/* Subtle glass border */}
                  <div className="absolute inset-0 rounded-xl md:rounded-2xl border border-white/[0.08] pointer-events-none" />
                  {/* Bottom fade for depth */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </motion.div>
              );
            })}
          </div>

          {/* Ambient reflection beneath posters */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-white/[0.015] rounded-full blur-2xl pointer-events-none" />
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-30" />
    </section>
  );
}
