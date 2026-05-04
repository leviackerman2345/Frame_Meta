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
import { getPopularMovies } from "@/lib/tmdb";

// Revalidate every 5 minutes — trending/popular data doesn't need per-request freshness.
export const revalidate = 300;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const popularMovies = await getPopularMovies(12);
  const posterUrls = popularMovies
    .map((m) => m.posterUrl)
    .filter((url): url is string => !!url && !url.includes("placeholder"));

  return (
    <div className="flex flex-col flex-1 w-full bg-black font-sans pb-24 text-white">
      <Hero posters={posterUrls} />
      <Partners />

      <PlatformControls />
      <FeaturedMovie />
      <FeaturedSeries />
      <Top10Movies />
      <Top10Series />
      <NewReleases searchParams={searchParams} />
      <InCinema />
      <ComingSoon />
      <AsianSpotlight />
      <Collections />
      <FeaturedNews />
      <FeaturedAbout />
      <FAQ />
      <Newsletter />
    </div>
  );
}
