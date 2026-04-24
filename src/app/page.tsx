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

// Force dynamic rendering so TMDB data is always fetched at request time,
// not baked in during build (where env vars may be unavailable on the host).
export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  return (
    <div className="flex flex-col flex-1 w-full bg-black font-sans pb-24 text-white">
      <Hero />
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
