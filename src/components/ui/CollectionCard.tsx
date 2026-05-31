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
      className="w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2*1rem)/3)] md:w-[calc((100%-2*1.25rem)/3)] aspect-[4/3] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl border border-zinc-800 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] outline outline-1 outline-transparent [transform:translateZ(0)] snap-start shrink-0 relative group bg-zinc-950/10 transition-all duration-700 hover:border-white/20 block"
    >
      {/* Backdrop */}
      {collection.backdropUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={collection.backdropUrl}
            alt={collection.title || "Collection Backdrop"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out brightness-[0.92] group-hover:brightness-100"
            sizes="(max-width: 768px) 400px, (max-width: 1280px) 450px, 600px"
            priority={index < 3}
          />
        </div>
      )}

      {/* Hover blur overlay */}
      <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity duration-700 pointer-events-none" />

      {/* Bottom gradient for title legibility */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none" />

      {/* Content — centered always, translated to bottom by default */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-5 md:p-8 pointer-events-none">
        <div
          className="text-center translate-y-60 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ willChange: "transform" }}
        >
          {/* Award badge */}
          {collection.badge && (
            <span className="inline-block px-3 py-1 mb-3 text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-white/80 bg-white/15 border border-white/10 rounded-full uppercase">
              {collection.badge}
            </span>
          )}

          {/* Title */}
          {collection.logoUrl ? (
            <div className="relative w-full h-12 md:h-16">
              <Image
                src={collection.logoUrl}
                alt={collection.title || "Logo"}
                fill
                className="object-contain object-bottom drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)]"
                unoptimized
              />
            </div>
          ) : (
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] line-clamp-2 leading-tight">
              {collection.title}
            </h3>
          )}

          {/* Award details — revealed on hover */}
          <p className="text-[11px] md:text-xs text-white/50 font-medium mt-3 max-w-[220px] mx-auto leading-relaxed opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 delay-150 ease-[cubic-bezier(0.22,1,0.36,1)]">
            Recognized for outstanding achievement in cinematic storytelling and production excellence.
          </p>
        </div>
      </div>
    </Link>
  );
}
