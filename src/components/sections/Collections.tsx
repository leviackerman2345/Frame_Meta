import React from "react";
import Image from "next/image";
import { collectionsHeading } from "@/config/site-content";
import { getDiscoverableCollections } from "@/lib/tmdb";

export async function Collections() {
  const allCollections = await getDiscoverableCollections();
  const collections = allCollections.filter((c) => c.isAnticipated);

  // If no collections found, we can show nothing or a fallback. 
  // Given the "If 2 or more installments" rule, empty is safer than broken data.
  if (!collections || collections.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight drop-shadow-sm">
            Highly Anticipated Collections
          </h2>
          <p className="text-sm text-zinc-400/90 mt-1.5 font-medium">
            Discover the {collections.length} most anticipated legendary franchises
          </p>
        </div>

        <button className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors duration-300">
          See All Collections
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="min-w-[85vw] sm:min-w-[60vw] md:min-w-[40vw] lg:min-w-[800px] aspect-[4/3] md:aspect-[21/9] rounded-3xl overflow-hidden cursor-pointer shadow-2xl transition-transform duration-500 hover:-translate-y-1 block bg-zinc-900 border border-white/5 snap-start group relative"
          >
            {/* Background Image */}
            {collection.backdropUrl && (
              <div className="absolute inset-0 z-0">
                <Image 
                  src={collection.backdropUrl}
                  alt={collection.title || "Collection Backdrop"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority={collection.id === collections[0]?.id}
                />
              </div>
            )}

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/98 via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent md:w-3/4 z-10" />

            {/* Content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12 md:w-[85%]">
              {collection.badge && (
                <span className="inline-block px-3 py-1 mb-4 text-[10px] md:text-xs font-semibold tracking-widest text-zinc-900 bg-white/90 backdrop-blur-md rounded-full uppercase shadow-sm w-max">
                  {collection.badge}
                </span>
              )}

              <h3 className="text-3xl md:text-5xl font-semibold text-white tracking-tight drop-shadow-md mb-3 line-clamp-1">
                {collection.title}
              </h3>

              <p className="text-zinc-300/90 text-sm md:text-lg font-medium mb-4 line-clamp-2 md:line-clamp-3">
                {collection.description}
              </p>

              {/* Rating, Genre, Year */}
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-white/50 font-medium tracking-wide">
                <span>{collection.year}</span>
                <span className="opacity-50 text-[10px]">•</span>
                <span>{collection.genre}</span>
                <span className="opacity-50 text-[10px]">•</span>
                <span className="flex items-center gap-1 text-white/80">
                  <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  {collection.rating} Average
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
