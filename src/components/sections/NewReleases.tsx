import React from "react";
import Link from "next/link";
import { newReleasesHeading } from "@/constants/titles";
import { getNowPlayingMovies, getTrendingMovies } from "@/lib/tmdb";
import { MediaCard } from "@/components/ui/MediaCard";
import { SectionHeader } from "@/components/sections/SectionHeader";


interface Props {
  searchParams?: Promise<{ tab?: string }>;
}

export async function NewReleases({ searchParams }: Props) {
  const params = await searchParams;
  const activeTab = params?.tab === "month" ? "month" : "week";
  
  // Fetch only the movies needed for the active tab
  const movies = activeTab === "week" 
    ? (await getNowPlayingMovies(10, true))
    : (await getTrendingMovies("week", true)).slice(0, 10).map(m => ({ ...m, badge: "TRENDING" }));

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      <SectionHeader
        title={newReleasesHeading.title}
        subtitle={newReleasesHeading.subtitle}
        layout="split"
        action={(
          <div className="flex items-center bg-zinc-800/40 p-1 rounded-full border border-white/5 backdrop-blur-xl transition-all duration-500">
            <Link
              href="/?tab=week"
              scroll={false}
              className={`px-5 py-1.5 text-xs font-medium transition-all duration-300 rounded-full ${
                activeTab === "week"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white/80"
              }`}
            >
              This Week
            </Link>
            <Link
              href="/?tab=month"
              scroll={false}
              className={`px-5 py-1.5 text-xs font-medium transition-all duration-300 rounded-full ${
                activeTab === "month"
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white/80"
              }`}
            >
              This Month
            </Link>
          </div>
        )}
      />

      <div className="flex gap-5 md:gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x px-1 scroll-smooth">
        {movies.map((movie) => (
          <MediaCard
            key={movie.id}
            data={{
              ...movie,
              badge: movie.badge || (activeTab === "week" ? "NEW" : undefined)
            }}
            variant="slider"
          />
        ))}
      </div>
    </section>
  );
}
