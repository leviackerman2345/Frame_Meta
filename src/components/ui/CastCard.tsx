"use client";

import Image from "next/image";
import { TMDBCastMember } from "@/types/types";

interface CastCardProps {
  actor: {
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

export function CastCard({ actor, index }: CastCardProps) {
  const actorPhoto = actor.profile_path
    ? `https://image.tmdb.org/t/p/h632${actor.profile_path}`
    : null;
  
  const initial = (actor.name?.[0] || "A").toUpperCase();
  
  const bgColors = [
    "from-indigo-950 via-slate-900 to-zinc-950",
    "from-violet-950 via-neutral-900 to-black",
    "from-emerald-950 via-zinc-900 to-zinc-950",
    "from-cyan-950 via-slate-950 to-black",
    "from-rose-950 via-stone-900 to-zinc-950",
  ];
  const bgColor = bgColors[index % bgColors.length];

  return (
    <div className="w-full aspect-[2/3] rounded-[2.5rem] overflow-hidden relative border border-white/10 bg-[#121214] shadow-xl transform-gpu backface-hidden [perspective:1000px]">
      {/* Photo Container — own GPU layer via will-change */}
      <div className="absolute top-0 inset-x-0 h-full overflow-hidden z-0">
        {actorPhoto ? (
          <Image
            src={actorPhoto}
            alt={actor.name || "Actor"}
            fill
            className="object-cover object-top contrast-[1.1] saturate-[1.1]"
            unoptimized
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${bgColor} flex items-center justify-center relative`}>
            <div className="absolute inset-4 rounded-full border border-white/[0.05] bg-white/[0.02] backdrop-blur-md flex items-center justify-center shadow-inner">
              <span className="text-6xl md:text-7xl font-black bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] tracking-tighter">
                {initial}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Blurred Panel (Oversized + Mask Composite + GPU layer) */}
      <div 
        className="absolute -inset-x-6 -bottom-6 h-[45%] backdrop-blur-3xl bg-black/35 z-10"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%), radial-gradient(circle, black 100%, black 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%), radial-gradient(circle, black 100%, black 100%)',
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      />

      {/* Actor & Character Info Overlay */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end text-center p-6 pb-8 z-20 gap-4">
        <div className="flex flex-col gap-1.5 max-w-full">
          <h4 className="text-white font-bold text-lg md:text-xl tracking-tight">
            {actor.name}
          </h4>
          <p className="text-white/70 font-medium text-xs md:text-sm truncate px-2">
            {actor.displayRole || actor.character || actor.job}
          </p>
        </div>

        <a
          href={`https://www.themoviedb.org/person/${actor.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-[160px] py-2.5 rounded-full bg-white text-black text-xs font-bold tracking-wide hover:bg-zinc-200 active:scale-95 transition-all duration-300 shadow-lg text-center"
        >
          View
        </a>
      </div>
    </div>
  );
}
