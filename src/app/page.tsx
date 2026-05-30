import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { PlatformControls } from "@/components/sections/PlatformControls";
import { FeaturedMovie } from "@/components/sections/FeaturedMovie";
import { FeaturedSeries } from "@/components/sections/FeaturedSeries";
import { Top10Movies } from "@/components/sections/Top10Movies";
import { Top10Series } from "@/components/sections/Top10Series";
import { NewReleases } from "@/components/sections/NewReleases";
import { InCinema } from "@/components/sections/InCinema";
import { ComingSoon } from "@/components/sections/ComingSoon";
import { AsianSpotlight } from "@/components/sections/AsianSpotlight";
import { Collections } from "@/components/sections/Collections";
import { FeaturedNews } from "@/components/sections/FeaturedNews";
import { FeaturedAbout } from "@/components/sections/FeaturedAbout";
import { FAQ } from "@/components/sections/FAQ";
import { Newsletter } from "@/components/sections/Newsletter";
import { getPopularMovies, getPopularTVSeries } from "@/lib/tmdb";
import type { MovieCard } from "@/types/types";

export const revalidate = 300;

interface HomePageProps {
  searchParams: Promise<{ tab?: string; country?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const withFallback = async <T,>(promise: Promise<T>, fallback: T): Promise<T> => {
    try {
      return await promise;
    } catch {
      return fallback;
    }
  };

  // Global-ranked hero sources: top movies + top series
  const [popularMovies, popularSeries] = await Promise.all([
    withFallback(getPopularMovies(8), [] as MovieCard[]),
    withFallback(getPopularTVSeries(8), [] as MovieCard[]),
  ]);

  const posterUrls = [...popularMovies, ...popularSeries]
    .map((m) => m.posterUrl)
    .filter((url): url is string => !!url && !url.includes("placeholder"));

  return (
    <main className="min-h-screen bg-black pb-24 text-white">
      {/* 1. Cinematic Hero Header */}
      <Hero posters={posterUrls} />

      {/* 2. Platform Trust Partners (Netflix, HBO, Disney logos right below Hero) */}
      <Partners />

      {/* 3. Streaming Platform Active Controls */}
      <PlatformControls />

      {/* 4. Spotlit Features */}
      <FeaturedMovie />
      <FeaturedSeries />

      {/* 5. Charts & Analytics */}
      <Top10Movies />
      <Top10Series />

      {/* 6. Release Anchors */}
      <NewReleases searchParams={searchParams} />
      <InCinema />
      <ComingSoon />

      {/* 7. Regional Spotlights & Collections */}
      <AsianSpotlight searchParams={searchParams} />
      <Collections />

      {/* 8. Media, News & Press */}
      <FeaturedNews />

      {/* 9. Core Platform Context & Brand Story */}
      <FeaturedAbout />

      {/* 10. Engagement & Support Footer Sections */}
      <FAQ />
      <Newsletter />
    </main>
  );
}
