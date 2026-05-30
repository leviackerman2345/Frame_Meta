import React from "react";
import { titlesContent } from "@/constants/titles";
import { getNowPlayingMovies } from "@/lib/tmdb";
import { MediaCard } from "@/components/ui/MediaCard";
import { SectionHeader } from "@/components/sections/SectionHeader";


export async function FeaturedMovie() {
  const movies = await getNowPlayingMovies(10, true);



  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-12 relative z-20">
      <SectionHeader
        title={titlesContent.featuredMovies.heading.title}
        subtitle={titlesContent.featuredMovies.heading.subtitle}
      />

      <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory px-1 scroll-smooth">
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
