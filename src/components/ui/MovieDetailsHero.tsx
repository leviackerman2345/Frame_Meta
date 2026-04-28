"use client";

import Image from "next/image";
import { Sparkles, Plus } from "lucide-react";

interface MovieDetailsHeroProps {
  details: any;
  logoUrl: string | null;
  backdropUrl: string;
  children?: React.ReactNode;
}

export function MovieDetailsHero({
  details,
  logoUrl,
  backdropUrl,
  children,
}: MovieDetailsHeroProps) {
  const title = details.title;

  return (
    <>
      {/* Hero Image Section (Absolute to fill modal) */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Image
          src={backdropUrl}
          alt={title}
          fill
          className="object-cover object-center"
          sizes="100vw"
          unoptimized
          priority
        />
        {/* Sleek minimalist dark overlay for Apple-like depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="relative z-30 flex flex-col justify-end items-center text-center md:items-start md:text-left flex-1 p-6 sm:p-10 md:p-16 lg:p-24 w-full min-h-[85vh] md:min-h-screen">
        {/* Title Logo or Fallback */}
        <div className="mb-10 md:mb-12 w-full flex justify-center md:justify-start">
          {logoUrl ? (
            <div className="relative w-[90%] max-w-[500px] h-24 md:h-40">
              <Image
                src={logoUrl}
                alt={title}
                fill
                className="object-contain object-center md:object-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                unoptimized
              />
            </div>
          ) : (
            <h2 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight subpixel-antialiased drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] text-white">
              {title}
            </h2>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-nowrap items-center justify-center md:justify-start gap-2 sm:gap-4 w-full md:w-auto mb-10 md:mb-12">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-8 py-3 md:py-3.5 rounded-full bg-white text-black hover:bg-zinc-200 font-bold text-xs sm:text-sm md:text-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            Where to Watch
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-8 py-3 md:py-3.5 rounded-full bg-zinc-800/60 backdrop-blur-md border border-white/10 hover:bg-zinc-700/60 text-white font-semibold text-xs sm:text-sm md:text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap">
            <Plus className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            My Wish List
          </button>
        </div>

        {children}
      </div>
    </>
  );
}
