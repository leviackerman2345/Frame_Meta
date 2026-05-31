"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info } from "lucide-react";
import { TitleLogo } from "@/components/ui/TitleLogo";
import type { MovieCard } from "@/types/types";

interface FeaturedMoviesHeroProps {
  items: MovieCard[];
}

function formatRuntime(minutes?: number): string | null {
  if (!minutes || minutes <= 0) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

function getAmbientGlow(genre?: string): string {
  if (!genre) return "from-indigo-500/15 via-purple-500/5 to-transparent";
  const g = genre.toLowerCase();
  if (
    g.includes("sci-fi") ||
    g.includes("science fiction") ||
    g.includes("action") ||
    g.includes("adventure")
  ) {
    return "from-cyan-500/15 via-blue-600/5 to-transparent";
  }
  if (g.includes("drama") || g.includes("romance") || g.includes("comedy")) {
    return "from-rose-500/15 via-amber-500/5 to-transparent";
  }
  if (g.includes("thriller") || g.includes("horror") || g.includes("mystery")) {
    return "from-red-600/15 via-zinc-900/5 to-transparent";
  }
  return "from-yellow-500/15 via-orange-500/5 to-transparent";
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function FeaturedMoviesHero({ items }: FeaturedMoviesHeroProps) {
  const slides = items.slice(0, 8);
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const shelfRef = useRef<HTMLDivElement>(null);

  const activeSlide = slides[activeIndex] || slides[0] || null;

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, activeIndex]);

  useEffect(() => {
    if (shelfRef.current) {
      const activeEl = shelfRef.current.querySelector(`[data-index="${activeIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeIndex]);

  if (!activeSlide) return null;

  const title = activeSlide.title || "Featured Title";
  const meta = [
    activeSlide.year,
    activeSlide.genre,
    activeSlide.rating ? `${activeSlide.rating.toFixed(1)}/10` : undefined,
  ]
    .filter(Boolean)
    .join(" • ");
  const runtime = formatRuntime(activeSlide.runtime);
  const providers = (activeSlide.providerNames || []).slice(0, 2).join(", ");
  const artwork =
    activeSlide.backdropUrl || activeSlide.posterUrl || "/images/poster-placeholder.jpg";

  return (
    <section className="relative w-full h-screen bg-zinc-950 overflow-hidden select-none">
      
      {/* Cinematic Backdrop Image Slider */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={artwork}
              alt={title}
              fill
              className="object-cover object-center pointer-events-none"
              sizes="100vw"
              priority
              unoptimized
            />
          </motion.div>
        </AnimatePresence>

        {/* Clean bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
      </div>

      {/* Floating Content Layer */}
      <div className="relative z-20 flex flex-col justify-end h-full w-full max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-20 md:pb-28 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col gap-3 md:gap-4 max-w-2xl text-left pointer-events-auto"
          >
            {/* Dynamic Radial Glow mapped to active slide genre */}
            <div
              className={`absolute -left-24 -bottom-24 w-[500px] h-[500px] rounded-full blur-[130px] bg-gradient-to-tr ${getAmbientGlow(activeSlide.genre)} pointer-events-none -z-10`}
            />

            {/* Badges */}
            <motion.div variants={itemVariants} className="flex items-center gap-2.5">
              <span className="inline-flex items-center rounded-full bg-white/[0.08] px-4 py-1.5 text-[10px] md:text-xs font-semibold tracking-[0.2em] text-zinc-300 uppercase backdrop-blur-xl border border-white/[0.08]">
                FRAMEMETA ORIGINAL
              </span>
              {activeSlide.badge && (
                <span className="inline-flex items-center rounded-full bg-amber-400/[0.08] px-3 py-1 text-[10px] md:text-xs font-semibold tracking-wider text-amber-300/80 uppercase border border-amber-400/[0.1]">
                  {activeSlide.badge}
                </span>
              )}
            </motion.div>

            {/* Title Logo */}
            <motion.div variants={itemVariants}>
              <TitleLogo
                id={activeSlide.id}
                title={title}
                type="movie"
                logoUrl={activeSlide.logoUrl}
                logoClassName="h-16 md:h-20 lg:h-24"
                fallbackClassName="text-3xl md:text-5xl lg:text-6xl font-bold tracking-[-0.02em] text-white leading-[1.08] text-left"
                className="justify-start"
                sizes="(max-width: 768px) 250px, 400px"
              />
            </motion.div>

            {/* Metadata */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-zinc-300 font-medium"
            >
              {activeSlide.year && <span>{activeSlide.year}</span>}
              {runtime && (
                <>
                  <span className="text-zinc-600">·</span>
                  <span>{runtime}</span>
                </>
              )}
              {activeSlide.rating && (
                <>
                  <span className="text-zinc-600">·</span>
                  <span className="text-amber-400/90 font-semibold">{activeSlide.rating.toFixed(1)}</span>
                </>
              )}
              {activeSlide.genre && (
                <>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-400">{activeSlide.genre}</span>
                </>
              )}
            </motion.div>

            {/* Description */}
            {activeSlide.description && (
              <motion.p
                variants={itemVariants}
                className="text-xs md:text-sm lg:text-base leading-relaxed text-zinc-300 max-w-lg line-clamp-2 md:line-clamp-3"
              >
                {activeSlide.description}
              </motion.p>
            )}

            {/* Streaming Partners */}
            {providers && (
              <motion.div
                variants={itemVariants}
                className="text-xs text-zinc-400 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                <span>
                  Streaming on{" "}
                  <span className="text-zinc-300 font-medium">{providers}</span>
                </span>
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3 pt-2 md:pt-4"
            >
              <Link
                href={`/titles/${activeSlide.id}?type=movie`}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 md:px-7 md:py-3 text-xs md:text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black stroke-black" />
                <span>Play Now</span>
              </Link>
              <Link
                href={`/titles/${activeSlide.id}?type=movie`}
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] px-6 py-2.5 md:px-7 md:py-3 text-xs md:text-sm font-medium text-white transition-all duration-300 hover:bg-white/[0.14] cursor-pointer"
              >
                <Info className="w-4 h-4" />
                <span>More Info</span>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Apple-style slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 pointer-events-auto">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
              index === activeIndex ? "w-5 bg-white" : "w-1 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}

