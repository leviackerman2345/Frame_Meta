import { Hero } from "@/components/sections/Hero";
import { Partners } from "@/components/sections/Partners";
import { PlatformControls } from "@/components/sections/PlatformControls";
import { FeaturedMovie } from "@/components/sections/FeaturedMovie";
import { FeaturedSeries } from "@/components/sections/FeaturedSeries";
import { Top10Movies } from "@/components/sections/Top10Movies";
import { Top10Series } from "@/components/sections/Top10Series";
import { NewReleases } from "@/components/sections/NewReleases";
import { ComingSoon } from "@/components/sections/ComingSoon";
import { AsianSpotlight } from "@/components/sections/AsianSpotlight";
import { Collections } from "@/components/sections/Collections";
import { FeaturedNews } from "@/components/sections/FeaturedNews";

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
      <ComingSoon />
      <AsianSpotlight />
      <Collections />
      <FeaturedNews />
    </div>
  );
}
