import React from "react";
import Image from "next/image";
import { top10MoviesHeading } from "@/config/site-content";
import { getPopularMovies } from "@/lib/tmdb";

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
          <div
            key={movie.id}
            className="min-w-[160px] md:min-w-[200px] aspect-[2/3] bg-zinc-800/30 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-xl snap-start relative overflow-hidden group cursor-pointer transition-transform duration-500 hover:-translate-y-1"
          >
            {/* Poster Image */}
            {movie.posterUrl && (
              <div className="absolute inset-0 z-0">
                <Image
                  src={movie.posterUrl}
                  alt={movie.title || "Movie Poster"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 160px, 200px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
              </div>
            )}

            {/* Elegant Ranking Number */}
            <div className="absolute -right-4 -bottom-2 text-[140px] font-medium text-white/[0.1] group-hover:text-white/[0.15] transition-colors duration-500 leading-none select-none pointer-events-none z-10 tracking-tighter">
              {movie.rank}
            </div>

            {/* Clean Content Overlay */}
            <div className="absolute inset-0 transition-opacity flex flex-col justify-end p-5 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
              <h3 className="text-white font-medium text-sm md:text-base leading-snug drop-shadow-sm truncate">
                {movie.title}
              </h3>

              {/* Rating, Genre, Year */}
              <div className="flex items-center gap-1.5 mt-2 text-[10px] md:text-xs text-white/70 font-medium tracking-wide w-full overflow-hidden whitespace-nowrap">
                {movie.year && <span className="shrink-0">{movie.year}</span>}
                {movie.year && (movie.genre || movie.rating) && <span className="opacity-50 text-[8px] shrink-0">•</span>}
                {movie.genre && <span className="truncate min-w-0">{movie.genre}</span>}
                {movie.genre && movie.rating && <span className="opacity-50 text-[8px] shrink-0">•</span>}
                {movie.rating && (
                  <span className="flex items-center gap-0.5 text-white/90 shrink-0">
                    <svg className="w-2.5 h-2.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {movie.rating}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
