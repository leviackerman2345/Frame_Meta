import React from "react";
import { titlesContent } from "@/constants/titles";
import { getNowPlayingMovies } from "@/lib/tmdb";
import { MediaCard } from "@/components/ui/MediaCard";
import { SectionHeader } from "@/components/sections/SectionHeader";


export async function InCinema() {
  const movies = await getNowPlayingMovies(10, true);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      <SectionHeader
        title={titlesContent.inCinema.heading.title}
        subtitle={titlesContent.inCinema.heading.subtitle}
        layout="split"
      />

      <div className="flex gap-4 md:gap-5 overflow-x-auto pb-6 custom-scrollbar snap-x snap-mandatory px-px scroll-smooth scrollbar-hide">
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
