"use client";

import Image from "next/image";
import Link from "next/link";
import { TitleLogo } from "@/components/ui/TitleLogo";

import { MovieCard } from "@/types/types";

interface MediaCardProps {
  data: MovieCard;
  variant?: "catalog" | "slider";
  container?: "grid" | "slider";
  glow?: boolean;
}

export function MediaCard({
  data,
  variant = "slider",
  container = "slider",
  glow = false,
}: MediaCardProps) {
  const { id, title, genre, posterUrl, year, rating, badge, rank, logoUrl } = data;
  const getBadgeStyles = (label: string) => {
    const text = label.toUpperCase();
    if (glow) return "bg-intent-cyan text-black border-transparent shadow-[0_0_20px_rgba(34,211,238,0.6)] font-black";
    if (text.includes("FEATURED")) return "text-intent-cyan border-intent-cyan/30";
    if (text.includes("AWARD") || text.includes("WINNER")) return "text-intent-gold border-intent-gold/30";
    if (text.includes("MUST") || text.includes("WATCH")) return "text-intent-rose border-intent-rose/30";
    if (text.includes("NEW")) return "text-blue-400 border-blue-500/30";
    if (text.includes("CINEMA")) return "text-red-400 border-red-500/30";
    return "text-intent-lime border-intent-lime/30";
  };

  const isCatalog = variant === "catalog";

  const isSeries = genre?.includes("Series");
  const Component = Link;
  const href = `/titles/${id}?type=${isSeries ? "tv" : "movie"}`;

  return (
    <Component
      href={href}
      className={`relative block aspect-[2/3] bg-zinc-900/40 shadow-lg shadow-black/30 outline outline-1 outline-transparent [transform:translateZ(0)] rounded-[1.75rem] overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-xl hover:shadow-black/40 hover:ring-1 hover:ring-white/10 ${container === "grid" ? "w-full" : "w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2*1rem)/3)] md:w-[calc((100%-4*1.25rem)/5)] snap-start shrink-0"
        }`}
    >
      {/* Poster Image */}
      <div className="absolute top-0 inset-x-0 h-[calc(100%+1px)] z-0">
        <Image
          src={posterUrl && !posterUrl.includes('placeholder') ? posterUrl : `https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop`}
          alt={title || ""}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out contrast-[1.1] saturate-[1.1]"
          sizes="(max-width: 768px) 160px, 200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80" />
      </div>

      {/* Elegant Ranking Number */}
      {rank !== undefined && (
        <div className="absolute -right-4 -bottom-2 text-[140px] font-medium text-white/[0.1] group-hover:text-white/[0.15] transition-colors duration-500 leading-none select-none pointer-events-none z-10 tracking-tighter">
          {rank}
        </div>
      )}

      {/* Upper Right Rating Pill (Catalog style) */}
      {isCatalog && rating && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-1 rounded-lg bg-[#121212]/90 backdrop-blur-md border border-white/10 shadow-lg">
          <svg className="w-2.5 h-2.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-[10px] font-bold text-white/90">{rating}</span>
        </div>
      )}

      {/* Top Right Outlined Badge (Slider style) */}
      {!isCatalog && badge && (
        <div className="absolute top-4 right-4 z-20">
          <span className={`inline-block px-2.5 py-1 text-[7px] md:text-[9px] font-black tracking-[0.2em] bg-[#121212]/90 backdrop-blur-md border rounded-full uppercase shadow-2xl transition-colors duration-300 ${getBadgeStyles(badge)}`}>
            {badge}
          </span>
        </div>
      )}

      {/* Content Overlay */}
      <div className="absolute inset-0 transition-opacity flex flex-col justify-end p-5 items-center z-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent text-center">
        {/* Outlined Badge above title (Catalog style) */}
        {isCatalog && badge && (
          <span className={`inline-block px-2.5 py-1 mb-3 text-[7px] md:text-[9px] font-black tracking-[0.2em] bg-[#121212]/90 backdrop-blur-md border rounded-full uppercase shadow-sm w-max mx-auto transition-colors duration-300 ${getBadgeStyles(badge)}`}>
            {badge}
          </span>
        )}

        {/* Fixed-height container to lock label alignment */}
        <div className="h-[4.5rem] flex flex-col justify-center w-full z-20">
          <TitleLogo
            id={id}
            title={title || ""}
            type={isSeries ? "series" : "movie"}
            logoUrl={logoUrl}
          />

          {/* Metadata String */}
          <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] md:text-xs text-white/50 font-medium tracking-wide w-full overflow-hidden whitespace-nowrap">
            {year && <span className="shrink-0">{year}</span>}
            {year && (genre || (rating && !isCatalog)) && <span className="opacity-50 text-[8px] shrink-0">•</span>}
            {genre && (
              <span className="truncate">
                {genre.split(/[,/&|-]/).map((g) => g.trim()).filter((g) => g !== "Movie" && g !== "Series")[0] ||
                  genre.split(/[,/&|-]/)[0].trim()}
              </span>
            )}
            {!isCatalog && rating && <span className="opacity-50 text-[8px] shrink-0">•</span>}
            {!isCatalog && rating && (
              <span className="flex items-center gap-0.5 text-white/80 shrink-0">
                <svg className="w-2.5 h-2.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating}
              </span>
            )}
          </div>
        </div>
      </div>
    </Component>
  );
}
