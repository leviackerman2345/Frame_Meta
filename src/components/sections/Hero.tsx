"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { companyHero } from "@/config/site-content";
import { ChevronRight, Play } from "lucide-react";

export function Hero() {
  const { title, brandName, description, buttons, posters } = companyHero;
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center pt-32 pb-12 overflow-hidden bg-brand-black">
      {/* Background Decorative Element */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-brand-accent/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      
      {/* Content Container */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-6 md:gap-10">
        {/* Text Section */}
        <motion.div
           initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="space-y-4 md:space-y-6"
        >
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.2] md:leading-[1.1]">
            {title} <span className="text-yellow-400 block sm:inline">{brandName}</span>
          </h1>
          
          <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 pt-2 md:pt-4">
            <button className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-full font-bold text-base md:text-lg hover:bg-zinc-200 transition-all duration-300 hover:scale-105 shadow-2xl">
              {buttons.getStarted}
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-zinc-800/40 backdrop-blur-xl border border-white/10 text-white rounded-full font-semibold text-base md:text-lg hover:bg-zinc-800/60 transition-all duration-300 hover:border-white/20">
              <Play className="w-5 h-5 fill-white/20" />
              {buttons.explore}
            </button>
          </div>
        </motion.div>

        {/* Poster Cluster Visualization */}
        <div className="relative w-full h-[250px] sm:h-[300px] md:h-[500px] mt-8 md:mt-12">
          {posters.map((id, index) => {
            // Calculate random-like but stable positions for the fan/cluster
            const rotations = [-15, -8, -2, 2, 8, 15];
            const xOffsetsMobile = [-80, -40, -10, 10, 40, 80];
            const xOffsetsDesktop = [-180, -100, -20, 20, 100, 180];
            const zIndices = [10, 20, 40, 40, 20, 10];
            const scalesMobile = [0.75, 0.85, 1, 1, 0.85, 0.75];
            const scalesDesktop = [0.85, 0.9, 1, 1, 0.9, 0.85];
            const translationsY = [40, 20, 0, 0, 20, 40];

            return (
              <motion.div
                key={id}
                initial={mounted ? { opacity: 0, y: 100, rotate: 0 } : { opacity: 1, y: 100, rotate: 0 }}
                animate={{ 
                  opacity: 1, 
                  y: translationsY[index % translationsY.length], 
                  rotate: rotations[index % rotations.length],
                  x: isMobile 
                    ? xOffsetsMobile[index % xOffsetsMobile.length]
                    : xOffsetsDesktop[index % xOffsetsDesktop.length]
                }}
                transition={{ 
                  duration: 1, 
                  delay: 0.4 + (index * 0.1),
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="absolute left-1/2 top-0 -translate-x-1/2 origin-bottom w-[120px] sm:w-[150px] md:w-[220px] aspect-[2/3] rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                style={{ 
                  zIndex: zIndices[index % zIndices.length],
                  scale: isMobile 
                    ? scalesMobile[index % scalesMobile.length]
                    : scalesDesktop[index % scalesDesktop.length]
                }}
              >
                <div className="relative w-full h-full group">
                  <Image
                    src={`https://images.unsplash.com/${id}?q=80&w=400&h=600&auto=format&fit=crop`}
                    alt="Movie Poster"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 120px, 220px"
                  />
                  {/* Subtle Glow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-black to-transparent z-30" />
    </section>
  );
}
