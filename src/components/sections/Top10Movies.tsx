import React from "react";
import { top10MoviesHeading } from "@/config/site-content";
import { getPopularMovies } from "@/lib/tmdb";
import { MediaCard } from "@/components/ui/MediaCard";

export async function Top10Movies() {
  const movies = await getPopularMovies(10);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white tracking-tight drop-shadow-sm">
          {top10MoviesHeading.title}
        </h2>
        {top10MoviesHeading.subtitle && (
          <p className="text-sm text-zinc-400/90 mt-1.5 font-medium">{top10MoviesHeading.subtitle}</p>
        )}
      </div>

      <div className="flex gap-5 md:gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
        {movies.map((movie) => (
          <MediaCard
            key={movie.id}
            data={movie}
            variant="slider"
          />
        ))}
      </div>
    </section>
  );
}
