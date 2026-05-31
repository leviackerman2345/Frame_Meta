"use client";

import React from "react";

interface CrewCardProps {
  crew: {
    id: number;
    name?: string;
    profile_path?: string;
    character?: string;
    job?: string;
    displayRole?: string;
    appearanceCount?: number;
    allCharacters?: string[];
  };
  index: number;
}

export function CrewCard({ crew, index }: CrewCardProps) {
  const targetHref = `/people/${crew.id}`;
  const initial = (crew.name?.[0] || "C").toUpperCase();

  // Vibrant, tailored color palettes for a ultra-premium design
  const glowColors = [
    "from-cyan-500/10 via-cyan-500/3 to-transparent",
    "from-rose-500/10 via-rose-500/3 to-transparent",
    "from-emerald-500/10 via-emerald-500/3 to-transparent",
    "from-yellow-500/10 via-yellow-500/3 to-transparent",
    "from-violet-500/10 via-violet-500/3 to-transparent",
  ];
  const borderGlows = [
    "group-hover:border-cyan-500/30",
    "group-hover:border-rose-500/30",
    "group-hover:border-emerald-500/30",
    "group-hover:border-yellow-500/30",
    "group-hover:border-violet-500/30",
  ];
  const roleColors = [
    "text-intent-cyan border-intent-cyan/20 bg-intent-cyan/5",
    "text-intent-rose border-intent-rose/20 bg-intent-rose/5",
    "text-intent-lime border-intent-lime/20 bg-intent-lime/5",
    "text-intent-gold border-intent-gold/20 bg-intent-gold/5",
    "text-violet-400 border-violet-500/20 bg-violet-500/5",
  ];
  const followColors = [
    "hover:bg-intent-cyan hover:text-black hover:border-intent-cyan",
    "hover:bg-intent-rose hover:text-black hover:border-intent-rose",
    "hover:bg-intent-lime hover:text-black hover:border-intent-lime",
    "hover:bg-intent-gold hover:text-black hover:border-intent-gold",
    "hover:bg-violet-400 hover:text-black hover:border-violet-400",
  ];

  const glowColor = glowColors[index % glowColors.length];
  const borderGlow = borderGlows[index % borderGlows.length];
  const roleColor = roleColors[index % roleColors.length];
  const followColor = followColors[index % followColors.length];

  const displayJob = crew.displayRole || crew.job || "Crew";

  // Warm the in-memory cache on hover via low-priority background fetch
  const handleMouseEnter = () => {
    fetch(`/api/people/${crew.id}`, { priority: "low" } as RequestInit).catch(
      () => {} // Fire-and-forget
    );
  };

  // High-performance preload-then-navigate pattern
  const handleClick = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();

    const link = document.createElement("a");
    link.rel = "prefetch";
    link.href = targetHref;
    document.head.appendChild(link);

    const backgroundFetch = fetch(targetHref, {
      priority: "high",
      headers: { Accept: "text/html" },
    } as RequestInit).catch(() => {});

    const timeout = new Promise<void>((resolve) =>
      setTimeout(resolve, 3000)
    );

    await Promise.race([backgroundFetch, timeout]);
    window.location.href = targetHref;
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick(e);
      }}
      className={`group relative w-full min-h-[190px] md:min-h-[210px] rounded-[2.2rem] overflow-hidden border border-white/5 bg-zinc-950/80 shadow-2xl outline outline-1 outline-transparent [transform:translateZ(0)] transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:ring-1 hover:ring-white/10 ${borderGlow} cursor-pointer flex flex-col justify-between p-8 md:p-9 text-left`}
      aria-label={`View biography of ${crew.name}`}
    >
      {/* Background Soft Interactive Glow */}
      <div className={`absolute -right-16 -top-16 w-44 h-44 rounded-full bg-gradient-to-br ${glowColor} blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.015),transparent_40%)] pointer-events-none" />

      {/* Top Row: Initial Avatar Ring + Role Badge */}
      <div className="relative z-10 flex items-center justify-between w-full">
        {/* Sleek Monogram Sphere */}
        <div className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md flex items-center justify-center shadow-inner group-hover:border-white/20 group-hover:bg-white/[0.06] transition-all duration-500">
          <span className="text-sm font-black tracking-tighter bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            {initial}
          </span>
        </div>

        {/* Tailored tracked uppercase role badge */}
        <span className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] shadow-sm transition-all duration-300 ${roleColor}`}>
          {displayJob}
        </span>
      </div>

      {/* Middle Row: Title (Name) */}
      <div className="relative z-10 flex flex-col gap-1">
        <h4 className="text-white font-bold text-lg md:text-xl tracking-tight leading-snug group-hover:text-white transition-colors duration-300 line-clamp-1">
          {crew.name}
        </h4>
        <span className="text-white/40 text-[10px] md:text-xs font-semibold uppercase tracking-wider">
          Production Department
        </span>
      </div>

      {/* Bottom Row: Tactile Actions */}
      <div className="relative z-10 flex items-center justify-between gap-4 pt-3.5 border-t border-white/[0.03] mt-3">
        {/* Animated Arrow Bio Button */}
        <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors duration-300">
          Biography
          <svg
            className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>

        {/* Small Touch Follow button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            alert(`Following ${crew.name}`);
          }}
          className={`relative z-20 px-3.5 py-1.5 rounded-xl bg-white/[0.03] text-white/80 hover:bg-white hover:text-black border border-white/5 text-[9px] font-bold tracking-widest uppercase transition-all duration-300 active:scale-95 flex items-center justify-center gap-1 cursor-pointer ${followColor}`}
        >
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Follow
        </button>
      </div>

      {/* Soft overlay border light */}
      <div className="absolute inset-0 border border-white/5 rounded-[2rem] pointer-events-none group-hover:border-white/10 transition-colors duration-500" />
    </div>
  );
}
