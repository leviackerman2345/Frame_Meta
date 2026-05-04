import React from "react";
import { inCinemaHeading } from "@/config/site-content";
import { getNowPlayingMovies } from "@/lib/tmdb";
import { MediaCard } from "@/components/ui/MediaCard";
import { SectionHeader } from "@/components/sections/SectionHeader";


export async function InCinema() {
  const movies = await getNowPlayingMovies(20, true);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      <SectionHeader
        title={inCinemaHeading.title}
        subtitle={inCinemaHeading.subtitle}
        layout="split"
      />

      <div className="flex gap-5 md:gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x px-1 scroll-smooth">
        {movies.map((movie) => (
          <MediaCard
            key={movie.id}
            data={{
              ...movie,
              badge: "IN CINEMA"
            }}
            variant="slider"
          />
        ))}
      </div>
    </section>
  );
}
