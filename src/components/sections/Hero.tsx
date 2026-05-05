"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { companyHero } from "@/constants/home";
import { ChevronRight, Play } from "lucide-react";

export function Hero({ posters: customPosters }: { posters?: string[] }) {
  const { title, brandName, description, buttons, posters: defaultPosters } = companyHero;
  const posters = customPosters && customPosters.length > 0 ? customPosters : defaultPosters;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center pt-48 pb-12 overflow-hidden bg-brand-black">
      {/* Background Decorative Element */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-brand-accent/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      
      {/* Content Container */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-16 md:gap-28 -mt-10 md:-mt-16">
        {/* Text Section */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
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
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 pt-0">
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
          {posters.map((poster, index) => {
            // Calculate dynamic positions for the fan/cluster based on number of items
            const count = posters.length;
            const progress = count > 1 ? index / (count - 1) : 0.5;
            const factor = progress - 0.5; // -0.5 to 0.5

            // Rotation: spread from -30 to 30 degrees
            const rotation = factor * 60;
            
            // X Offset: spread them out (wider on desktop)
            const xOffsetDesktop = factor * 840;
            const xOffsetMobile = factor * 340;
            
            // Z Index: higher in the middle (peak at 50)
            const zIndex = Math.floor(50 - Math.abs(factor) * 40);
            
            // Scale: slightly smaller on edges (1.0 in middle, 0.75 on edges)
            const scale = 1 - Math.abs(factor) * 0.3;
            
            // Translation Y: arc effect (0 in middle, 100 on edges)
            const translateY = Math.abs(factor) * 120;

            const isUrl = poster.startsWith('http') || poster.startsWith('/');
            const imgSrc = isUrl ? poster : `https://images.unsplash.com/${poster}?q=80&w=400&h=600&auto=format&fit=crop`;

            return (
              <motion.div
                key={poster + index}
                initial={{ opacity: 0, y: 100, rotate: 0 }}
                animate={{ 
                  opacity: 1, 
                  y: translateY, 
                  rotate: rotation,
                  x: isMobile ? xOffsetMobile : xOffsetDesktop
                }}
                transition={{ 
                  duration: 1.2, 
                  delay: 0.2 + (index * 0.05),
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="absolute left-1/2 top-0 -translate-x-1/2 origin-bottom w-[120px] sm:w-[150px] md:w-[220px] aspect-[2/3] rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900"
                style={{ 
                  zIndex: zIndex,
                  scale: scale
                }}
              >
                <div className="relative w-full h-full group">
                  <Image
                    src={imgSrc}
                    alt="Movie Poster"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 120px, 220px"
                    priority={index < 4}
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
