import React from "react";
import { top10MoviesHeading } from "@/constants/titles";
import { getPopularMovies } from "@/lib/tmdb";
import { MediaCard } from "@/components/ui/MediaCard";
import { SectionHeader } from "@/components/sections/SectionHeader";

export async function Top10Movies() {
  const movies = await getPopularMovies(10, true);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      <SectionHeader
        title={top10MoviesHeading.title}
        subtitle={top10MoviesHeading.subtitle}
      />

      <div className="flex gap-5 md:gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x px-1 scroll-smooth">
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
