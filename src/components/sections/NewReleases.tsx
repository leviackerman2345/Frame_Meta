import React from "react";
import Image from "next/image";
import Link from "next/link";
import { newReleasesHeading } from "@/config/site-content";
import { getNowPlayingMovies, getTrendingMovies } from "@/lib/tmdb";

interface Props {
  searchParams?: Promise<{ tab?: string }>;
}

export async function NewReleases({ searchParams }: Props) {
  const params = await searchParams;
  const activeTab = params?.tab === "month" ? "month" : "week";
  
  // Fetch only the movies needed for the active tab
  const movies = activeTab === "week" 
    ? (await getNowPlayingMovies(10))
    : (await getTrendingMovies("week")).slice(0, 10).map(m => ({ ...m, badge: "TRENDING" }));

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight drop-shadow-sm">
            {newReleasesHeading.title}
          </h2>
          {newReleasesHeading.subtitle && (
            <p className="text-sm text-zinc-400/90 mt-1.5 font-medium">{newReleasesHeading.subtitle}</p>
          )}
        </div>
        
        {/* Apple-style Pill Selector (Server-Side Tabs via Links) */}
        <div className="flex items-center bg-zinc-800/40 p-1 rounded-full border border-white/5 backdrop-blur-xl transition-all duration-500">
          <Link
            href="/?tab=week"
            scroll={false}
            className={`px-5 py-1.5 text-xs font-medium transition-all duration-300 rounded-full ${
              activeTab === "week" ? "bg-white/15 text-white shadow-sm" : "text-zinc-400 hover:text-white/80"
            }`}
          >
            This Week
          </Link>
          <Link
            href="/?tab=month"
            scroll={false}
            className={`px-5 py-1.5 text-xs font-medium transition-all duration-300 rounded-full ${
              activeTab === "month" ? "bg-white/15 text-white shadow-sm" : "text-zinc-400 hover:text-white/80"
            }`}
          >
            This Month
          </Link>
        </div>
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
            
            {/* Elegant Badge */}
            {(movie.badge || activeTab === "week") && (
              <div className="absolute top-4 right-4 z-20">
                <span className={`px-2.5 py-0.5 text-[8px] md:text-[10px] font-bold tracking-widest text-white rounded-full uppercase shadow-lg ${
                  activeTab === "week" ? "bg-blue-600 shadow-blue-900/20" : "bg-purple-600 shadow-purple-900/20"
                }`}>
                  {movie.badge || "NEW"}
                </span>
              </div>
            )}

            {/* Content Overlay */}
            <div className="absolute inset-0 transition-opacity flex flex-col justify-end p-5 z-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
              <h3 className="text-white font-medium text-sm md:text-base leading-snug drop-shadow-sm line-clamp-2">
                {movie.title}
              </h3>
              
              {/* Metadata String: Date, Genre, Rating */}
              <div className="flex items-center gap-1.5 mt-2 text-[10px] md:text-xs text-white/50 font-medium tracking-wide w-full overflow-hidden whitespace-nowrap">
                {movie.year && <span className="shrink-0">{movie.year}</span>}
                {movie.year && (movie.genre || movie.rating) && <span className="opacity-50 text-[8px] shrink-0">•</span>}
                {movie.genre && <span className="truncate min-w-0">{movie.genre}</span>}
                {movie.genre && movie.rating && <span className="opacity-50 text-[8px] shrink-0">•</span>}
                {movie.rating && (
                  <span className="flex items-center gap-0.5 text-white/80 shrink-0">
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
