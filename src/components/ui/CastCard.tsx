"use client";

import Image from "next/image";
import Link from "next/link";

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
    ? `https://image.tmdb.org/t/p/original${actor.profile_path}`
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
    <Link href={`/actor/${actor.id}`}>
      <div className="w-full aspect-2/3 rounded-[2.5rem] overflow-hidden relative border border-white/10 bg-[#121214] shadow-xl transform-gpu backface-hidden perspective-[1000px]">
      {/* Photo Container — own GPU layer via will-change */}
      <div className="absolute top-0 inset-x-0 h-full overflow-hidden z-0">
        {actorPhoto ? (
          <Image
            src={actorPhoto}
            alt={actor.name || "Actor"}
            fill
            quality={100}
            className="object-cover object-center contrast-[1.05] saturate-[1.1]"
            unoptimized
          />
        ) : (
          <div className={`w-full h-full bg-linear-to-br ${bgColor} flex items-center justify-center relative`}>
            <div className="absolute inset-4 rounded-full border border-white/5 bg-white/2 backdrop-blur-md flex items-center justify-center shadow-inner">
              <span className="text-6xl md:text-7xl font-black bg-linear-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] tracking-tighter">
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
        <div className="flex items-center gap-2 w-full pt-2">
          <button className="flex-1 px-4 py-2 rounded-2xl bg-transparent hover:bg-white border border-white text-white hover:text-black text-[10px] md:text-xs font-bold transition-all active:scale-95 uppercase tracking-widest">
            View
          </button>
          <button className="px-4 py-2 rounded-2xl bg-white text-black hover:bg-black hover:text-white border border-white text-[10px] md:text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1 uppercase tracking-widest">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            Follow
          </button>
        </div>
        </div>
      </div>
      </div>
    </Link>
  );
}
