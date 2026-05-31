import { Suspense } from "react";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getPopularMovies,
  getPopularTVSeries,
  getTopRatedMovies,
  getTopRatedTVSeries,
  getTrendingMovies,
  getTrendingTVSeries,
} from "@/lib/tmdb";
import { enrichMovieCards } from "@/lib/movie-home";
import type { MovieCard } from "@/types/types";
import { ReferenceQualityGrid } from "@/components/sections/ReferenceQualityGrid";

export const revalidate = 300;

async function withFallback<T>(
  label: string,
  promise: Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.warn(`[reference-quality] ${label} failed. Using fallback.`, error);
    return fallback;
  }
}

export default async function ReferenceQualityPage() {
  const requestHeaders = await headers();
  const detectedCountry =
    requestHeaders.get("x-vercel-ip-country") ||
    requestHeaders.get("cf-ipcountry") ||
    "PH";
  const [
    topRatedMovies,
    popularMovies,
    trendingMovies,
    topRatedTV,
    popularTV,
    trendingTV,
  ] = await Promise.all([
    withFallback("top rated movies", getTopRatedMovies(20, true), []),
    withFallback("popular movies", getPopularMovies(20, true), []),
    withFallback("trending movies", getTrendingMovies("day", true), []),
    withFallback("top rated tv", getTopRatedTVSeries(20, true), []),
    withFallback("popular tv", getPopularTVSeries(20, true), []),
    withFallback("trending tv", getTrendingTVSeries("day", true), []),
  ]);

  const [enrichedMovies, enrichedTV] = await Promise.all([
    enrichMovieCards(
      [...topRatedMovies, ...popularMovies, ...trendingMovies],
      "movie"
    ),
    enrichMovieCards(
      [...topRatedTV, ...popularTV, ...trendingTV],
      "tv"
    ),
  ]);

  // Deduplicate by id and merge
  const seen = new Set<number>();
  const allItems: MovieCard[] = [];
  for (const item of [...enrichedMovies, ...enrichedTV]) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      allItems.push(item);
    }
  }

  // Sort by rating descending for a quality-first listing
  allItems.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <main className="min-h-screen bg-black pb-24 text-white pt-28">
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-2 relative z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/55 hover:text-white transition-colors mb-4 md:mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="mb-1.5 md:mb-2">
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-white/35">
            Reference library
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
          Reference Quality
        </h1>
        <p className="mt-2 md:mt-3 text-sm md:text-[15px] text-white/55 leading-relaxed max-w-2xl">
          Every title rated for premium home theater — 4K, HDR, Dolby Vision, and
          Dolby Atmos. Filter by format to find what your setup can truly showcase.
        </p>
      </div>

      {/* Grid with filters */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6 relative z-20">
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-[1.75rem] bg-zinc-900/40 animate-pulse"
                />
              ))}
            </div>
          }
        >
          <ReferenceQualityGrid items={allItems} />
        </Suspense>
      </div>
    </main>
  );
}
