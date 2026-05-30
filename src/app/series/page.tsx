import {
  SeriesAsianSpotlightSection,
  SeriesCarouselSection,
  SeriesClipsLoopSection,
  SeriesHardwarePicksSection,
  SeriesHeroSection,
  SeriesPortalGridSection,
  type SeriesPortalCard,
  SeriesTopChartsSection,
  SeriesVisualGridSection,
} from "@/components/sections/series";
import { SeriesDiscoveryBar } from "@/components/sections/SeriesDiscoveryBar";
import { BingeTrackerSection } from "@/components/sections/BingeTrackerSection";
import { SeriesCreatorsSection } from "@/components/sections/SeriesCreatorsSection";
import { VibeMatrixSection } from "@/components/sections/VibeMatrixSection";
import { seriesHomeContent } from "@/constants/series-home";
import type { MovieCard } from "@/types/types";
import { headers } from "next/headers";
import {
  getAsianSpotlight,
  getOnTheAirTVSeries,
  getPopularTVSeries,
  getRegionalPopularTVSeries,
  getTopRatedTVSeries,
  getTrendingTVSeries,
  getTVAnime,
  getTVByGenre,
} from "@/lib/tmdb";
import { getClipFeed } from "@/lib/clips";
import {
  HOME_PLATFORM_MATCHES,
  applyHomeFilters,
  enrichMovieCards,
  normalizeHomePlatform,
  type HomePlatformKey,
} from "@/lib/movie-home";
import { getTitleAward } from "@/constants/awards";

export const revalidate = 300;

async function withFallback<T>(label: string, promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.warn(`[series] ${label} failed. Using fallback.`, error);
    return fallback;
  }
}

function withSequentialRank(items: MovieCard[]) {
  return items.map((item, index) => ({ ...item, rank: index + 1 }));
}

function pseudoProviderCoverage(items: MovieCard[]): MovieCard[] {
  const providers = Object.values(HOME_PLATFORM_MATCHES).flat();
  if (providers.length === 0) return items;
  return items.map((item, index) => {
    if (item.providerNames && item.providerNames.length > 0) return item;
    return {
      ...item,
      providerNames: [providers[index % providers.length]],
    };
  });
}

function filterClipsByPlatform<T extends { tmdbId: number }>(
  clips: T[],
  allowedIds: Set<number>,
  platform: HomePlatformKey
) {
  if (platform === "all") return clips;
  return clips.filter((clip) => allowedIds.has(clip.tmdbId));
}

function filterByBinge(items: MovieCard[], binge: string): MovieCard[] {
  if (binge === "all") return items;
  return items.filter((item) => {
    const runtime = item.runtime || 0;
    if (binge === "short") return runtime > 0 && runtime < 30;
    if (binge === "limited") return (item as any).numberOfSeasons === 1;
    if (binge === "deep") return ((item as any).numberOfSeasons || 0) >= 5;
    return true;
  });
}

function buildPortalCards(
  cards: readonly { label: string; query: string }[],
  eyebrow: string
): SeriesPortalCard[] {
  return cards.map((card) => ({
    label: card.label,
    query: card.query,
    eyebrow,
    description: `Explore series shaped by ${card.label.toLowerCase()} aesthetics.`,
  }));
}

function buildVaultCards(seed: MovieCard[]): MovieCard[] {
  return seed.slice(0, 20).map((item, index) => ({
    ...item,
    id: item.id + 700000 + index,
    badge: getTitleAward(item.id) || "Critically Acclaimed",
  }));
}

export default async function SeriesPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; binge?: string }>;
}) {
  const requestHeaders = await headers();
  const params = await searchParams;
  const platform = normalizeHomePlatform(params.platform);
  const binge = (params.binge || "all").toLowerCase();
  const detectedCountry =
    requestHeaders.get("x-vercel-ip-country") ||
    requestHeaders.get("cf-ipcountry") ||
    "PH";
  const localCountry = /^[A-Z]{2}$/.test(detectedCountry) ? detectedCountry : "PH";
  const localLabel =
    new Intl.DisplayNames(["en"], { type: "region" }).of(localCountry) || "Local";

  const [
    popular,
    trendingDaily,
    localTrending,
    onTheAir,
    topRated,
    korean,
    anime,
    filipino,
    clips,
    genreSciFi,
    genreCrime,
    genreComedy,
    genreDrama,
  ] = await Promise.all([
    withFallback("popular series", getPopularTVSeries(20, true), []),
    withFallback("trending series", getTrendingTVSeries("day", true), []),
    withFallback("regional series", getRegionalPopularTVSeries(localCountry, 20, true), []),
    withFallback("on the air", getOnTheAirTVSeries(20, true), []),
    withFallback("top rated series", getTopRatedTVSeries(20, true), []),
    withFallback("asian KR TV", getAsianSpotlight("KR", 12, true), []),
    withFallback("asian JP TV", getTVAnime(12, true), []),
    withFallback("asian PH TV", getRegionalPopularTVSeries("PH", 12, true), []),
    withFallback("clips feed", getClipFeed({ page: 0, limit: 12 }), []),
    withFallback("genre sci-fi", getTVByGenre(10765, 10, true), []),
    withFallback("genre crime", getTVByGenre(80, 10, true), []),
    withFallback("genre comedy", getTVByGenre(35, 10, true), []),
    withFallback("genre drama", getTVByGenre(18, 10, true), []),
  ]);

  const enrichedPopular = pseudoProviderCoverage(await enrichMovieCards(popular, "tv"));
  const enrichedTrending = pseudoProviderCoverage(await enrichMovieCards(trendingDaily, "tv"));
  const enrichedLocalTrending = pseudoProviderCoverage(await enrichMovieCards(localTrending, "tv"));
  const enrichedOnTheAir = pseudoProviderCoverage(await enrichMovieCards(onTheAir, "tv"));
  const enrichedTopRated = pseudoProviderCoverage(await enrichMovieCards(topRated, "tv"));
  const enrichedKorean = pseudoProviderCoverage(await enrichMovieCards(korean, "tv"));
  const enrichedAnime = pseudoProviderCoverage(await enrichMovieCards(anime, "tv"));
  const enrichedFilipino = pseudoProviderCoverage(await enrichMovieCards(filipino, "tv"));
  const enrichedGenreSciFi = pseudoProviderCoverage(await enrichMovieCards(genreSciFi, "tv"));
  const enrichedGenreCrime = pseudoProviderCoverage(await enrichMovieCards(genreCrime, "tv"));
  const enrichedGenreComedy = pseudoProviderCoverage(await enrichMovieCards(genreComedy, "tv"));
  const enrichedGenreDrama = pseudoProviderCoverage(await enrichMovieCards(genreDrama, "tv"));

  // Apply platform + binge filters
  const baseFiltered = (items: MovieCard[]) =>
    filterByBinge(applyHomeFilters(items, platform, "all"), binge);

  const heroItems = baseFiltered(enrichedPopular).slice(0, 4);
  const topGlobal = withSequentialRank(baseFiltered(enrichedTrending).slice(0, 10));
  const topLocal = withSequentialRank(baseFiltered(enrichedLocalTrending).slice(0, 10));
  const newReturning = baseFiltered(enrichedOnTheAir).slice(0, 12);
  const referenceQuality = baseFiltered(enrichedTopRated)
    .filter((item) => (item.rating || 0) >= 7.5)
    .slice(0, 10);
  const vault = baseFiltered(enrichedTopRated).slice(0, 10);
  const vaultCards = buildVaultCards(vault);

  const asianKorean = baseFiltered(enrichedKorean).slice(0, 10);
  const asianAnime = baseFiltered(enrichedAnime).slice(0, 10);
  const asianFilipino = baseFiltered(enrichedFilipino).slice(0, 10);

  const allowedIdsForClips = new Set(
    baseFiltered([...enrichedPopular, ...enrichedTrending, ...enrichedOnTheAir]).map(
      (item) => item.id
    )
  );
  const tvClips = clips.filter((c: any) => c.mediaType === "tv");
  const filteredClips = filterClipsByPlatform(
    tvClips.length >= 3 ? tvClips : clips,
    allowedIdsForClips,
    platform
  ).slice(0, 10);

  // Genre-specific carousels for the genre hub
  const genreHubSciFi = baseFiltered(enrichedGenreSciFi).slice(0, 10);
  const genreHubCrime = baseFiltered(enrichedGenreCrime).slice(0, 10);
  const genreHubComedy = baseFiltered(enrichedGenreComedy).slice(0, 10);
  const genreHubDrama = baseFiltered(enrichedGenreDrama).slice(0, 10);

  const genreCards = buildPortalCards(seriesHomeContent.genres.slice(0, 8).map((g) => ({ label: g, query: g.toLowerCase() })), "Genre");
  const moodCards = buildPortalCards(seriesHomeContent.moods, "Mood");

  return (
    <main className="min-h-screen bg-black pb-24 text-white">
      <SeriesHeroSection items={heroItems} />

      <SeriesDiscoveryBar />

      <BingeTrackerSection />

      <SeriesTopChartsSection
        globalItems={topGlobal}
        localItems={topLocal}
        localLabel={localLabel}
        contentType="series"
      />

      <SeriesCarouselSection
        title="New & Returning Seasons"
        subtitle="Fresh premieres and long-awaited comebacks."
        items={newReturning}
      />

      <SeriesClipsLoopSection clips={filteredClips} />

      <SeriesPortalGridSection
        title="Series Genre Hub"
        subtitle="Visual genre cards that open a wider wall of discovery."
        cards={genreCards}
      />

      {/* Genre-specific carousels */}
      <SeriesCarouselSection
        title="Sci-Fi & Fantasy"
        subtitle="Otherworldly stories and speculative futures."
        items={genreHubSciFi}
      />
      <SeriesCarouselSection
        title="Crime & Mystery"
        subtitle="Whodunits, heists, and criminal underworlds."
        items={genreHubCrime}
      />
      <SeriesCarouselSection
        title="Comedy"
        subtitle="Sitcoms, dark comedies, and feel-good laughs."
        items={genreHubComedy}
      />
      <SeriesCarouselSection
        title="Drama"
        subtitle="Character-driven stories with emotional weight."
        items={genreHubDrama}
      />

      <SeriesHardwarePicksSection
        items={referenceQuality}
        title="Reference Quality"
        subtitle="Masterful production built for premium displays."
      />

      <SeriesAsianSpotlightSection
        filipinoItems={asianFilipino}
        koreanItems={asianKorean}
        animeItems={asianAnime}
      />

      <SeriesCreatorsSection />

      <VibeMatrixSection cards={moodCards} />

      <SeriesCarouselSection
        title="The Vault"
        subtitle="Award-winning series from the global circuit."
        items={vault}
      />

      <SeriesVisualGridSection
        title="Vault Highlights"
        subtitle="A compact grid of standout award-season titles."
        items={vaultCards}
      />

      <SeriesCarouselSection
        title="More to Explore"
        subtitle="A final reel of high-interest picks from today's broader feed."
        items={baseFiltered(enrichedPopular).slice(10, 20)}
      />
    </main>
  );
}
