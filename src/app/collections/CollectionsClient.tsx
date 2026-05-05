"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { MovieCard } from "@/types/types";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { CollectionSkeleton } from "@/components/collections/CollectionSkeleton";

interface CollectionsClientProps {
  initialCollections: MovieCard[];
}

export function CollectionsClient({ initialCollections }: CollectionsClientProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(24);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Extract unique genres from collections
  const genres = useMemo(() => {
    const genreSet = new Set<string>(["All"]);
    initialCollections.forEach(c => {
      if (c.genre) genreSet.add(c.genre);
    });
    return Array.from(genreSet).sort((a, b) => {
      if (a === "All") return -1;
      if (b === "All") return 1;
      return a.localeCompare(b);
    });
  }, [initialCollections]);

  // Filter collections based on selected genre
  const filteredCollections = useMemo(() => {
    let filtered = initialCollections;
    if (selectedGenre !== "All") {
      filtered = initialCollections.filter(c => c.genre === selectedGenre);
    }
    return filtered;
  }, [selectedGenre, initialCollections]);

  // Handle Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && visibleCount < filteredCollections.length) {
          setIsLoadingMore(true);
          // High-fidelity delay for smooth entry
          setTimeout(() => {
            setVisibleCount((prev) => prev + 12);
            setIsLoadingMore(false);
          }, 400);
        }
      },
      { threshold: 0, rootMargin: "200px" } // Trigger early before reaching the bottom
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [isLoadingMore, visibleCount, filteredCollections.length]);

  // Reset scroll when genre changes
  useEffect(() => {
    setVisibleCount(24);
  }, [selectedGenre]);

  const displayedCollections = filteredCollections.slice(0, visibleCount);

  return (
    <div className="space-y-12">
      {/* Category Navigation - Floating Pill Style */}
      <div className="mx-auto sticky top-[8.5rem] z-30 max-w-5xl w-fit px-2 py-2 bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl flex items-center justify-center">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-500 whitespace-nowrap ${
              selectedGenre === genre
                ? "bg-white text-black shadow-xl scale-105"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            {genre}
          </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="text-zinc-500 text-sm font-medium">
        Showing {displayedCollections.length} of {filteredCollections.length} collections
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {displayedCollections.map((collection, index) => (
          <div 
            key={collection.id} 
            className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
            style={{ animationDelay: `${(index % 6) * 50}ms` }}
          >
            <CollectionCard collection={collection} index={index} />
          </div>
        ))}
      </div>

      {/* Loader / Intersection Target */}
      {(visibleCount < filteredCollections.length || isLoadingMore) && (
        <div ref={loaderRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 py-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <CollectionSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredCollections.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-zinc-500 text-lg">No collections found in this category.</p>
          <button 
            onClick={() => setSelectedGenre("All")}
            className="mt-4 text-white hover:underline font-semibold"
          >
            View all collections
          </button>
        </div>
      )}
    </div>
  );
}
