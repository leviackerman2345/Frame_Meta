import { Suspense } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
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
import { DeferredSection } from "@/components/ui/DeferredSection";
import { CarouselSkeleton } from "@/components/ui/CarouselSkeleton";
import { NewsCarouselSkeleton, CollectionCarouselSkeleton, ContentSectionSkeleton } from "@/components/ui/SectionSkeletons";
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
    withFallback(getPopularMovies(5), [] as MovieCard[]),
    withFallback(getPopularTVSeries(5), [] as MovieCard[]),
  ]);

  const posterUrls = [...popularMovies, ...popularSeries]
    .map((m) => m.posterUrl)
    .filter((url): url is string => !!url && !url.includes("placeholder"));

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://framemeta.app";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FrameMeta",
    url: baseUrl,
    description:
      "Discover movies, series, and collections with cinematic-grade detail.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FrameMeta",
    url: baseUrl,
    logo: `${baseUrl}/og-default.png`,
  };

  return (
    <main className="min-h-screen bg-black pb-24 text-white">
      <JsonLd schema={websiteSchema} />
      <JsonLd schema={organizationSchema} />

      {/* 1. Cinematic Hero Header */}
      <Hero posters={posterUrls} />

      {/* 2. Platform Trust Partners (Netflix, HBO, Disney logos right below Hero) */}
      <Partners />

      {/* 3. Streaming Platform Active Controls */}
      <PlatformControls />

      {/* 4. Spotlit Features */}
      <DeferredSection fallback={<CarouselSkeleton />}>
        <Suspense fallback={<CarouselSkeleton />}>
          <FeaturedMovie />
        </Suspense>
      </DeferredSection>
      <DeferredSection fallback={<CarouselSkeleton />}>
        <Suspense fallback={<CarouselSkeleton />}>
          <FeaturedSeries />
        </Suspense>
      </DeferredSection>

      {/* 5. Charts & Analytics */}
      <DeferredSection fallback={<CarouselSkeleton />}>
        <Suspense fallback={<CarouselSkeleton />}>
          <Top10Movies />
        </Suspense>
      </DeferredSection>
      <DeferredSection fallback={<CarouselSkeleton />}>
        <Suspense fallback={<CarouselSkeleton />}>
          <Top10Series />
        </Suspense>
      </DeferredSection>

      {/* 6. Release Anchors */}
      <DeferredSection fallback={<CarouselSkeleton />}>
        <Suspense fallback={<CarouselSkeleton />}>
          <NewReleases searchParams={searchParams} />
        </Suspense>
      </DeferredSection>
      <DeferredSection fallback={<CarouselSkeleton />}>
        <Suspense fallback={<CarouselSkeleton />}>
          <InCinema />
        </Suspense>
      </DeferredSection>
      <DeferredSection fallback={<CarouselSkeleton />}>
        <Suspense fallback={<CarouselSkeleton />}>
          <ComingSoon />
        </Suspense>
      </DeferredSection>

      {/* 7. Regional Spotlights & Collections */}
      <DeferredSection fallback={<CarouselSkeleton />}>
        <Suspense fallback={<CarouselSkeleton />}>
          <AsianSpotlight searchParams={searchParams} />
        </Suspense>
      </DeferredSection>
      <DeferredSection fallback={<CollectionCarouselSkeleton />}>
        <Suspense fallback={<CollectionCarouselSkeleton />}>
          <Collections />
        </Suspense>
      </DeferredSection>

      {/* 8. Media, News & Press */}
      <DeferredSection fallback={<NewsCarouselSkeleton />}>
        <Suspense fallback={<NewsCarouselSkeleton />}>
          <FeaturedNews />
        </Suspense>
      </DeferredSection>

      {/* 9. Core Platform Context & Brand Story */}
      <DeferredSection fallback={<ContentSectionSkeleton />}>
        <Suspense fallback={<ContentSectionSkeleton />}>
          <FeaturedAbout />
        </Suspense>
      </DeferredSection>

      {/* 10. Engagement & Support Footer Sections */}
      <DeferredSection fallback={<ContentSectionSkeleton />}>
        <Suspense fallback={<ContentSectionSkeleton />}>
          <FAQ />
        </Suspense>
      </DeferredSection>
      <DeferredSection fallback={<ContentSectionSkeleton />}>
        <Suspense fallback={<ContentSectionSkeleton />}>
          <Newsletter />
        </Suspense>
      </DeferredSection>
    </main>
  );
}
