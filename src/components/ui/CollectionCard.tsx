"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MovieCard } from "@/types/types";

interface CollectionCardProps {
  collection: MovieCard;
  index?: number;
}

export function CollectionCard({ collection, index = 0 }: CollectionCardProps) {
  return (
    <Link
      href={`/collection/${collection.id}`}
      className="min-w-[280px] sm:min-w-[400px] md:min-w-[calc((100%-48px)/3)] aspect-[16/11] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl border border-zinc-800 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] outline outline-1 outline-transparent [transform:translateZ(0)] snap-start relative group bg-zinc-950/10 transition-all duration-700 hover:border-white/20 hover:bg-black/40 block"
    >
      {/* Backdrop with Fade Blur Effect */}
      {collection.backdropUrl && (
        <div className="absolute top-0 inset-x-0 h-[calc(100%+1px)] z-0 overflow-hidden">
          <Image
            src={collection.backdropUrl}
            alt={collection.title || "Collection Backdrop"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out brightness-[0.92] group-hover:brightness-100"
            sizes="(max-width: 768px) 400px, (max-width: 1280px) 450px, 600px"
            priority={index < 3}
          />
          
          {/* Equal Blur Overlay - Uniform blur across the entire backdrop */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 backdrop-blur-2xl bg-black/20 transition-opacity duration-700 ease-in-out z-5" />
        </div>
      )}

      {/* Bottom Fade Blur & 20% Darkshade (Non-Hover Only) */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/20 via-black/[0.05] to-transparent backdrop-blur-md [mask-image:linear-gradient(to_top,black_20%,transparent)] z-10 group-hover:opacity-0 transition-opacity duration-700 pointer-events-none" />

      {/* Darkshade Overlays (Reduced to 8%) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/[0.08] to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/[0.08] via-transparent to-transparent z-10" />
      
      {/* Content Container with Backdrop Blur (Glassmorphism) */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 md:px-10 md:pb-6">
        <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
          {collection.badge && (
            <span className="inline-block px-3 py-1 mb-4 text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-white bg-white/10 backdrop-blur-xl border border-white/10 rounded-full uppercase shadow-2xl w-max">
              {collection.badge}
            </span> 
          )}

          {collection.logoUrl ? (
            <div className="relative w-full h-12 md:h-16 mb-5">
              <Image
                src={collection.logoUrl}
                alt={collection.title || "Logo"}
                fill
                className="object-contain object-left drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]"
                unoptimized
              />
            </div>
          ) : (
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] mb-4 md:mb-5 line-clamp-2 leading-tight">
              {collection.title}
            </h3>
          )}


          {/* Meta Info with Fade Blur Background */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs text-white/50 font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-2 group-hover:translate-y-0">
            <span className="bg-white/5 px-2.5 py-1.5 rounded-lg backdrop-blur-2xl border border-white/5">{collection.year}</span>
            <span className="bg-white/5 px-2.5 py-1.5 rounded-lg backdrop-blur-2xl border border-white/5">{collection.genre}</span>
            <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500/90 px-2.5 py-1.5 rounded-lg backdrop-blur-2xl border border-white/5">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {collection.rating}
            </span>
          </div>
        </div>
      </div>

      {/* Glossy Overlay / Darkshade Glow */}
      <div className="absolute inset-0 z-30 rounded-[2.5rem] ring-1 ring-white/0 group-hover:ring-white/20 transition-all duration-700 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </div>
    </Link>
  );
}
