
import type { Metadata } from "next";
import {
  MoviesAsianSpotlightSection,
  MoviesCarouselSection,
  MoviesClipsLoopSection,
  MoviesHardwarePicksSection,
  MoviesHeroSection,
  MoviesPortalGridSection,
  type MoviesPortalCard,
  MoviesTopChartsSection,
  MoviesVisualGridSection,
} from "@/components/sections/movies";
import { movieHomeContent } from "@/constants/movie-home";
import type { MovieCard } from "@/types/types";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Movies",
  description:
    "Browse popular, trending, and top-rated movies. Filter by genre, region, and streaming platform on FrameMeta.",
  openGraph: {
    title: "Movies | FrameMeta",
    description:
      "Browse popular, trending, and top-rated movies. Filter by genre, region, and streaming platform on FrameMeta.",
  },
  alternates: { canonical: "/movies" },
};
import {
  getAsianSpotlight,
  getComingSoon,
  getNowPlayingMovies,
  getPopularMovies,
  getRegionalPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
} from "@/lib/tmdb";
import { getClipFeedFast } from "@/lib/clips";
import {
  HOME_PLATFORM_MATCHES,
  applyHomeFilters,
  enrichMovieCards,
  normalizeHomeDuration,
  normalizeHomePlatform,
  type HomePlatformKey,
} from "@/lib/movie-home";
import { getTitleAward } from "@/constants/awards";

export const revalidate = 300;

async function withFallback<T>(label: string, promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.warn(`[movies] ${label} failed. Using fallback.`, error);
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

function buildGenreCards(seed: MovieCard[]): MovieCard[] {
  return movieHomeContent.genres.slice(0, 4).map((genre, index) => {
    const pick = seed[index % Math.max(seed.length, 1)];
    return {
      id: 900000 + index,
      title: genre,
      genre,
      year: pick?.year,
      rating: pick?.rating,
      posterUrl: pick?.backdropUrl || pick?.posterUrl,
      backdropUrl: pick?.backdropUrl || pick?.posterUrl,
      badge: "Genre",
      logoUrl: undefined,
    };
  });
}

function buildPortalCards(
  cards: readonly { label: string; query: string }[],
  eyebrow: string
): MoviesPortalCard[] {
  return cards.map((card) => ({
    label: card.label,
    query: card.query,
    eyebrow,
    description: `Explore films shaped by ${card.label.toLowerCase()} aesthetics.`,
  }));
}

function buildVaultCards(seed: MovieCard[]): MovieCard[] {
  return seed.slice(0, 20).map((item, index) => ({
    ...item,
    id: item.id + 700000 + index,
    badge: getTitleAward(item.id) || "Critically Acclaimed",
  }));
}

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; budget?: string }>;
}) {
  const requestHeaders = await headers();
  const params = await searchParams;
  const platform = normalizeHomePlatform(params.platform);
  const duration = normalizeHomeDuration(params.budget);
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
    nowPlaying,
    comingSoon,
    topRated,
    korean,
    japanese,
    filipino,
    clips,
  ] = await Promise.all([
    withFallback("popular movies", getPopularMovies(20, true), []),
    withFallback("trending movies", getTrendingMovies("day", true), []),
    withFallback("regional movies", getRegionalPopularMovies(localCountry, 20, true), []),
    withFallback("now playing", getNowPlayingMovies(20, true), []),
    withFallback("coming soon", getComingSoon(20, true), []),
    withFallback("top rated", getTopRatedMovies(), []),
    withFallback("asian spotlight KR", getAsianSpotlight("KR", 12, true), []),
    withFallback("asian spotlight JP", getAsianSpotlight("JP", 12, true), []),
    withFallback("asian spotlight PH", getAsianSpotlight("PH", 12, true), []),
    withFallback("clips feed", getClipFeedFast(3), []),
  ]);

  const [
    enrichedPopular, enrichedTrending, enrichedLocalTrending,
    enrichedNowPlaying, enrichedComingSoon, enrichedTopRated,
    enrichedKorean, enrichedJapanese, enrichedFilipino,
  ] = await Promise.all([
    enrichMovieCards(popular, "movie"),
    enrichMovieCards(trendingDaily, "movie"),
    enrichMovieCards(localTrending, "movie"),
    enrichMovieCards(nowPlaying, "movie"),
    enrichMovieCards(comingSoon, "movie"),
    enrichMovieCards(topRated, "movie"),
    enrichMovieCards(korean, "tv"),
    enrichMovieCards(japanese, "movie"),
    enrichMovieCards(filipino, "movie"),
  ].map((p) => p.then(pseudoProviderCoverage)));

  const topGlobal = withSequentialRank(applyHomeFilters(enrichedTrending, platform, duration).slice(0, 10));
  const topLocal = withSequentialRank(applyHomeFilters(enrichedLocalTrending, platform, duration).slice(0, 10));
  const newReleases = applyHomeFilters(enrichedNowPlaying, platform, duration).slice(0, 12);
  const smartSessions = applyHomeFilters(enrichedPopular, platform, duration).slice(0, 12);
  const featuredHeroItems = smartSessions.slice(0, 4);
  const hardwareHub = applyHomeFilters(enrichedTopRated, platform, duration)
    .filter((item) => (item.runtime || 0) >= 120)
    .slice(0, 10);

  const asianFilipino = applyHomeFilters(enrichedFilipino, platform, duration).slice(0, 10);
  const asianKorean = applyHomeFilters(enrichedKorean, platform, duration).slice(0, 10);
  const asianAnime = applyHomeFilters(enrichedJapanese, platform, duration).slice(0, 10);

  const vault = applyHomeFilters(enrichedTopRated, platform, duration).slice(0, 10);
  const vaultCards = buildVaultCards(vault);
  const genreCards = buildGenreCards(applyHomeFilters(enrichedPopular, platform, duration));

  const allowedIdsForClips = new Set(
    applyHomeFilters(
      [...enrichedPopular, ...enrichedTrending, ...enrichedNowPlaying],
      platform,
      duration
    ).map((item) => item.id)
  );
  const filteredClips = filterClipsByPlatform(clips, allowedIdsForClips, platform).slice(0, 10);

  const moodCards = buildPortalCards(movieHomeContent.moods, "Mood");
  const visionaryCards = buildPortalCards(movieHomeContent.visionaries, "Auteur");

  return (
    <main className="min-h-screen bg-black pb-24 text-white">
      <MoviesHeroSection items={featuredHeroItems} />


      <MoviesCarouselSection
        title="Smart sessions"
        subtitle="Pick a film that fits the time you actually have."
        items={smartSessions}
      />

      <MoviesTopChartsSection globalItems={topGlobal} localItems={topLocal} localLabel={localLabel} />

      <MoviesCarouselSection
        title="New releases"
        subtitle="Fresh additions and recent theater-to-streaming arrivals."
        items={newReleases}
      />

      <MoviesClipsLoopSection clips={filteredClips} />

      <MoviesVisualGridSection
        title="Genre hub"
        subtitle="Visual genre cards that open a wider wall of discovery."
        items={genreCards}
        actionLabel="See all genres"
        actionHref="/genres"
      />

      <MoviesHardwarePicksSection items={hardwareHub} />

      <MoviesAsianSpotlightSection
        filipinoItems={asianFilipino}
        koreanItems={asianKorean}
        animeItems={asianAnime}
      />

      <MoviesPortalGridSection
        title="The visionaries"
        subtitle="Browse films shaped by distinct directorial signatures."
        cards={visionaryCards}
      />

      <MoviesPortalGridSection
        title="The vibe matrix"
        subtitle="Find films by mood and visual tone instead of genre alone."
        cards={moodCards}
      />

      <MoviesCarouselSection
        title="The vault"
        subtitle="Award-winning cinema from the global circuit."
        items={vault}
      />

      <MoviesVisualGridSection
        title="Vault highlights"
        subtitle="A compact grid of standout award-season titles."
        items={vaultCards}
      />

      <MoviesCarouselSection
        title="More to explore"
        subtitle="A final reel of high-interest picks from today's broader feed."
        items={applyHomeFilters(enrichedComingSoon, platform, duration).slice(0, 10)}
      />
    </main>
  );
}
