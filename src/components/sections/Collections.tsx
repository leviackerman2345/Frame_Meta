import React from "react";
import Image from "next/image";
import { collectionsHeading } from "@/config/site-content";
import { getDiscoverableCollections } from "@/lib/tmdb";

export async function Collections() {
  const collections = await getDiscoverableCollections();

  if (!collections || collections.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight drop-shadow-sm">
            {collectionsHeading.title}
          </h2>
          <p className="text-sm text-zinc-400/90 mt-1.5 font-medium">
            {collectionsHeading.subtitle}
          </p>
        </div>

        <button className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors duration-300">
          See All Collections
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Horizontal Scrolling Cards */}
      <div className="flex gap-5 overflow-x-auto pb-6 custom-scrollbar snap-x">
        {collections.map((collection, i) => (
          <div
            key={collection.id}
            className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer shadow-2xl snap-start relative group bg-zinc-900 border border-white/5 shrink-0"
          >
            {/* Backdrop */}
            {collection.backdropUrl && (
              <div className="absolute inset-0 z-0">
                <Image
                  src={collection.backdropUrl}
                  alt={collection.title || "Collection Backdrop"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 320px, 360px"
                  priority={i === 0}
                />
              </div>
            )}

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10" />

            {/* Content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 md:p-6">
              {collection.badge && (
                <span className="inline-block px-2.5 py-0.5 mb-3 text-[9px] md:text-[10px] font-semibold tracking-widest text-zinc-900 bg-white/90 backdrop-blur-md rounded-full uppercase shadow-sm w-max">
                  {collection.badge}
                </span>
              )}

              <h3 className="text-base md:text-xl font-semibold text-white tracking-tight drop-shadow-md mb-1.5 line-clamp-1">
                {collection.title}
              </h3>

              <p className="text-zinc-300/70 text-xs font-medium mb-3 line-clamp-2 leading-relaxed">
                {collection.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] md:text-xs text-white/50 font-medium tracking-wide">
                <span>{collection.year}</span>
                <span className="opacity-50 text-[8px]">•</span>
                <span>{collection.genre}</span>
                <span className="opacity-50 text-[8px]">•</span>
                <span className="flex items-center gap-0.5 text-white/80">
                  <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {collection.rating}
                </span>
              </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 z-30 rounded-2xl ring-1 ring-white/0 group-hover:ring-white/10 transition-all duration-500 pointer-events-none" />
          </div>
        ))}
      </div>
    </section>
  );
}
