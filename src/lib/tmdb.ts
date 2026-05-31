// Barrel re-export — all existing `import { ... } from "@/lib/tmdb"` continue to work.
// The actual implementations live in focused sub-modules.

// Client infrastructure
export {
  fetchFromTMDB,
  getTMDBImageUrl,
  formatTMDBData,
  isTitleAvailable,
  formatBadgeDate,
  getMovieDetails,
  getTitleFullDetails,
  getTitleCertification,
  getTVSeasonDetails,
  getMovieReviews,
  getOMDbRatings,
  genreMap,
  TMDB_IMAGE_BASE_URL,
} from "./tmdb-client";
export type { TMDBItem } from "./tmdb-client";

// Enrichment & concurrency
export {
  mapWithConcurrency,
  getTextlessPosterUrl,
  getAnyPosterUrl,
  getTitleLogo,
  enrichWithTextlessPosters,
  enrichWithLogos,
} from "./tmdb-enrichment";

// Movie functions
export {
  getTitleHomeMeta,
  getTrendingMovies,
  getTopRatedMovies,
  getPopularMovies,
  getRegionalPopularMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getComingSoon,
  getAsianSpotlight,
  getTrendingAll,
  searchMulti,
  searchMultiFast,
  discoverByGenre,
  getRecommendations,
} from "./tmdb-movies";

// TV functions
export {
  getPopularTVSeries,
  getOnTheAirTVSeries,
  getTrendingTVSeries,
  getTopRatedTVSeries,
  getTVAnime,
  getRegionalPopularTVSeries,
  getTVByGenre,
} from "./tmdb-tv";

// Collection/universe functions
export {
  getCollectionDetails,
  getUniverseByKeyword,
  getDiscoverableCollections,
  getCollectionOrUniverseDetails,
} from "./tmdb-collections";

// Clip/video functions
export {
  getTitleVideos,
  getPopularTitlesForClips,
} from "./tmdb-clips";

// People functions
export {
  getPersonBasicInfo,
  getPersonCredits,
  getPersonDetails,
  getTrendingPeople,
  getPopularPeople,
} from "./tmdb-people";

// Re-export fetchWithTimeout from shared utility for any external consumers
export { fetchWithTimeout } from "./fetch-utils";
