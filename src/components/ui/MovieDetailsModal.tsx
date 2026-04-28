"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { MovieDetailsHero } from "./MovieDetailsHero";
import { MovieDetailsMeta } from "./MovieDetailsMeta";
import { MovieDetailsExtended } from "./MovieDetailsExtended";

interface MovieDetailsModalProps {
  type?: "movie" | "tv";
  details: any;
  logoUrl: string | null;
  backdropUrl: string;
  rating: string | number;
  year: string | number;
  runtimeStr: string;
  certification: string;
  providers: any[];
  cast: any[];
  crew?: any[];
  watchLink?: string;
  inCinema?: boolean;
  recommendations?: any[];
  omdbRatings?: any[];
  reviews?: any[];
}

export function MovieDetailsModal({
  type = "movie",
  details,
  logoUrl,
  backdropUrl,
  rating,
  year,
  runtimeStr,
  certification,
  providers,
  cast,
  crew = [],
  watchLink,
  inCinema,
  recommendations,
  omdbRatings = [],
  reviews = [],
}: MovieDetailsModalProps) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    return () => {
      document.body.style.overflow = "unset";
      document.body.classList.remove("modal-open");
    };
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      router.back();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleDismiss}
      className="fixed inset-0 z-50 bg-black flex overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full min-h-screen bg-black z-50 flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 right-6 z-40 flex items-center justify-center w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white transition-all duration-300 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Section (Includes Backdrop, Title, Actions) */}
        <MovieDetailsHero
          details={details}
          logoUrl={logoUrl}
          backdropUrl={backdropUrl}
        >
          {/* Metadata & Tech Specs inside the same layout wrapper */}
          <MovieDetailsMeta
            details={details}
            year={year}
            runtimeStr={runtimeStr}
            certification={certification}
            rating={rating}
            omdbRatings={omdbRatings}
          />
        </MovieDetailsHero>

        {/* Extended Details Section (Synopsis, Grid) */}
        <MovieDetailsExtended type={type} details={details} logoUrl={logoUrl} providers={providers} watchLink={watchLink} inCinema={inCinema} recommendations={recommendations} cast={cast} crew={crew} omdbRatings={omdbRatings} reviews={reviews} />
      </motion.div>
    </div>
  );
}
