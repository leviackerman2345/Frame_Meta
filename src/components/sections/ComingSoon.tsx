import React from "react";
import Image from "next/image";
import { comingSoonHeading } from "@/config/site-content";
import { getComingSoon } from "@/lib/tmdb";
import { Bell } from "lucide-react";
import { TitleLogo } from "@/components/ui/TitleLogo";


export async function ComingSoon() {
  const content = await getComingSoon(20);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight drop-shadow-sm">
            {comingSoonHeading.title}
          </h2>
          {comingSoonHeading.subtitle && (
            <p className="text-sm text-zinc-400/90 mt-1.5 font-medium">{comingSoonHeading.subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex gap-5 md:gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
        {content.map((item) => (
          <div
            key={item.id}
            className="min-w-[160px] md:min-w-[200px] aspect-[2/3] bg-zinc-800/30 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-xl snap-start relative group cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:z-50 hover:shadow-2xl overflow-hidden"
          >
            {/* Poster Image */}
            {item.posterUrl && (
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.posterUrl}
                  alt={item.title || "Poster"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 160px, 200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
              </div>
            )}
            
            {/* Elegant Calendar Badge */}
            {item.badge && (
              <div className="absolute top-4 left-4 z-20">
                <span className="px-2.5 py-1 text-[8px] md:text-[9px] font-bold tracking-widest text-zinc-900 bg-white/90 backdrop-blur-md rounded-lg uppercase shadow-lg">
                  {item.badge}
                </span>
              </div>
            )}

            {/* Notify Icon (Appears on Hover) */}
            <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/20 transition-all">
                <Bell className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Clean Content Overlay */}
            <div className="absolute inset-0 transition-opacity flex flex-col justify-end p-5 items-center z-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent text-center rounded-3xl">
              {/* Fixed-height container to lock label alignment */}
              <div className="h-[4.5rem] flex flex-col justify-center w-full">
                <TitleLogo
                  id={item.id}
                  title={item.title || ""}
                  type={item.genre === "Series" ? "series" : "movie"}
                />

                {/* Metadata String */}
                <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] md:text-xs text-white/50 font-medium tracking-wide w-full overflow-hidden whitespace-nowrap">
                  {item.year && <span className="shrink-0">{item.year}</span>}
                  <span className="opacity-30 text-[8px] shrink-0">•</span>
                  <span className="shrink-0">{item.genre === "Series" ? "Season Premiere" : "Theatrical Release"}</span>
                </div>
              </div>
            </div>
            
            {/* Apple-style hover border illumination */}
            <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}
