import React from "react";
import { inCinemaHeading } from "@/config/site-content";
import { getNowPlayingMovies } from "@/lib/tmdb";
import { MediaCard } from "@/components/ui/MediaCard";


export async function InCinema() {
  const movies = await getNowPlayingMovies(20);

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight drop-shadow-sm">
            {inCinemaHeading.title}
          </h2>
          {inCinemaHeading.subtitle && (
            <p className="text-sm text-zinc-400/90 mt-1.5 font-medium">{inCinemaHeading.subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex gap-5 md:gap-6 overflow-x-auto pb-6 custom-scrollbar snap-x">
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
