"use client";

import { useRef, useState } from "react";
import { CastCard } from "./CastCard";

interface CastSectionProps {
  title?: string;
  subtitle?: string;
  cast: {
    id: number;
    name?: string;
    profile_path?: string;
    character?: string;
    job?: string;
    displayRole?: string;
    appearanceCount?: number;
    allCharacters?: string[];
  }[];
}

export function CastSection({
  title = "The Cast",
  subtitle = "A collection of the distinguished talent behind this production",
  cast
}: CastSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  const handleScroll = () => {
    if (!scrollRef.current || !indicatorRef.current) return;

    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        if (!scrollRef.current || !indicatorRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const totalScroll = scrollWidth - clientWidth;
        if (totalScroll > 0) {
          const progress = (scrollLeft / totalScroll) * 100;
          indicatorRef.current.style.left = `${progress * 0.65}%`;
        }
        ticking.current = false;
      });
      ticking.current = true;
    }
  };

  if (!cast || cast.length === 0) return null;

  return (
    <div className="max-w-[1224px] w-full mx-auto flex flex-col gap-8 text-left">
      <div>
        <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
          {title}
        </h3>
        <p className="text-zinc-200 text-sm md:text-base font-medium">
          {subtitle}
        </p>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory px-6 md:px-0"
      >
        {cast.map((actor, idx) => (
          <div
            key={`${actor.id}-${actor.displayRole || actor.character || actor.job || idx}-${idx}`}
            className="w-[calc(100%-48px)] sm:w-[calc((100%-32px)/2)] lg:w-[calc((100%-48px)/3)] shrink-0 snap-start snap-always"
          >
            <CastCard actor={actor} index={idx} />
          </div>
        ))}
      </div>

      {/* Scroll Indicator Track */}
      <div className="w-40 h-1.5 bg-zinc-800/60 backdrop-blur-md border border-white/10 rounded-full mx-auto relative overflow-hidden shadow-inner mt-2 mb-4">
        <div
          ref={indicatorRef}
          className="absolute top-0 bottom-0 bg-gradient-to-r from-white to-zinc-200 rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(255,255,255,0.4)]"
          style={{
            width: '35%',
            left: '0%'
          }}
        />
      </div>
    </div>
  );
}
