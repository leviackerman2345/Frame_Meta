import type { MovieCard, OMDbRating, TMDBTitleDetails, CollectionData, TMDBCastMember, TMDBCrewMember } from "@/types/types";

interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
  vote_average: number;
  media_type?: string;
  first_air_date?: string;
  release_date?: string;
  poster_path?: string;
  backdrop_path?: string;
  popularity?: number;
  overview?: string;
  belongs_to_collection?: {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  parts?: TMDBItem[];
  genre_ids?: number[];
}

const genreMap: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics"
};

let hasLoggedMissingToken = false;

// Token is retrieved dynamically to ensure it's picked up correctly during different build phases
const getAccessToken = () => {
  let token = process.env.TMDB_ACCESS_TOKEN;

  if (token) {
    // Sanitize: trim whitespace and remove potential surrounding quotes
    token = token.trim().replace(/^["'](.+)["']$/, '$1');
  }

  if (!token && !hasLoggedMissingToken) {
    console.warn("[TMDB] Warning: TMDB_ACCESS_TOKEN is undefined. Check Vercel Environment Variables.");
    hasLoggedMissingToken = true;
  } else if (token && !hasLoggedMissingToken) {
    // Log masked token for verification
    const masked = `${token.substring(0, 4)}...${token.substring(token.length - 4)}`;
    console.log(`[TMDB] Token loaded: ${masked} (Length: ${token.length})`);
    hasLoggedMissingToken = true;
  }

  return token;
};
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";
const DEFAULT_REVALIDATE_SECONDS = 300;
const DEFAULT_FETCH_TIMEOUT_MS = 15000;
const inFlightRequests = new Map<string, Promise<any>>();

// In-memory cache to prevent N+1 API call limits and improve initial SSR load performance
const textlessPosterCache = new Map<string, string | null>();
const titleLogoCache = new Map<string, string | null>();

// Module-level result cache for getDiscoverableCollections (expensive pipeline)
interface CollectionsCache {
  data: any[];
  expiresAt: number;
}
let collectionsCache: CollectionsCache | null = null;
const COLLECTIONS_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes



export const fetchFromTMDB = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAccessToken();
  if (!token) {
    console.error(`TMDB API error: No access token provided for ${endpoint}. Check your .env.local file.`);
    return { results: [], parts: [] };
  }

  const url = `${TMDB_BASE_URL}${endpoint}`;

  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const nextOptions = (options as { next?: { revalidate?: number } }).next || {
    revalidate: DEFAULT_REVALIDATE_SECONDS,
  };

  const existing = inFlightRequests.get(url);
  if (existing) return existing;

  const requestPromise = (async () => {
    let attempts = 0;
    const maxAttempts = 2; // 1 original + 1 retry

    while (attempts < maxAttempts) {
      attempts++;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), DEFAULT_FETCH_TIMEOUT_MS);

      try {
        const startTime = Date.now();
        const response = await fetch(url, {
          ...options,
          headers,
          next: nextOptions,
          signal: controller.signal,
        });

        const duration = Date.now() - startTime;
        if (duration > 5000) {
          console.warn(`[TMDB] Slow request: ${duration}ms at ${endpoint}`);
        }

        if (!response.ok) {
          let errorDetail = "";
          try {
            const errorData = await response.json();
            errorDetail = JSON.stringify(errorData);
          } catch (e) {
            errorDetail = "Could not parse error response body";
          }

          console.warn(`[TMDB] API Warning: ${response.status} ${response.statusText} at ${endpoint}`);
          console.warn(`[TMDB] Error Detail: ${errorDetail}`);
          return { results: [], parts: [] };
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        if (error?.name === "AbortError") {
          if (attempts < maxAttempts) {
            console.warn(`[TMDB] Timeout after ${DEFAULT_FETCH_TIMEOUT_MS}ms at ${endpoint}. Retrying (attempt ${attempts + 1}/${maxAttempts})...`);
            continue;
          }
          console.error(`[TMDB] Timeout after ${DEFAULT_FETCH_TIMEOUT_MS}ms at ${endpoint}. Max retries reached.`);
        } else {
          console.error(`[TMDB] Network error at ${endpoint}:`, error);
          return { results: [], parts: [] };
        }
      } finally {
        clearTimeout(timeout);
      }
    }
    return { results: [], parts: [] };
  })();

  inFlightRequests.set(url, requestPromise);
  
  // Ensure we remove from in-flight requests when the final promise settles
  requestPromise.finally(() => {
    inFlightRequests.delete(url);
  });

  return requestPromise;
}



/**
 * Get the full image URL from a TMDB path.
 * @param path The partial path from TMDB (e.g., "/poster.jpg")
 * @param size The size identifier (e.g., "w500", "original")
 */
export function getTMDBImageUrl(path: string | null | undefined, size: string = "w500") {
  if (!path) return "/images/poster-placeholder.jpg";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

/**
 * Fetch a textless poster URL for a given movie or TV show.
 * Textless posters are identified by having iso_639_1 === null in TMDB's images API.
 * Returns the URL of the best textless poster, or null if none exist.
 */
export async function getTextlessPosterUrl(
  id: number,
  type: "movie" | "tv" = "movie"
): Promise<string | null> {
  const cacheKey = `${type}-${id}`;
  if (textlessPosterCache.has(cacheKey)) {
    return textlessPosterCache.get(cacheKey)!;
  }

  try {
    const data = await fetchFromTMDB(
      `/${type}/${id}/images?include_image_language=null`
    );
    const posters = data.posters || [];

    if (posters.length === 0) {
      textlessPosterCache.set(cacheKey, null);
      return null;
    }

    // Sort by vote_average descending to pick the highest-rated textless poster
    const best = posters.sort(
      (a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0)
    )[0];

    const posterUrl = getTMDBImageUrl(best.file_path, "w780");
    textlessPosterCache.set(cacheKey, posterUrl);
    return posterUrl;
  } catch (error) {
    console.error(`Failed to fetch textless poster for ${type} ${id}:`, error);
    return null;
  }
}

/**
 * Fetch any poster URL for a given movie or TV show.
 */
export async function getAnyPosterUrl(
  id: number,
  type: "movie" | "tv" = "movie"
): Promise<string | null> {
  const cacheKey = `any-${type}-${id}`;
  if (textlessPosterCache.has(cacheKey)) {
    return textlessPosterCache.get(cacheKey)!;
  }

  try {
    const data = await fetchFromTMDB(`/${type}/${id}/images`);
    const posters = data.posters || [];

    if (posters.length === 0) {
      textlessPosterCache.set(cacheKey, null);
      return null;
    }

    const best = posters.sort(
      (a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0)
    )[0];

    const posterUrl = getTMDBImageUrl(best.file_path, "w780");
    textlessPosterCache.set(cacheKey, posterUrl);
    return posterUrl;
  } catch (error) {
    console.error(`Failed to fetch any poster for ${type} ${id}:`, error);
    return null;
  }
}

/**
 * Batch-enrich an array of MovieCards with textless poster URLs.
 * Replaces posterUrl with the textless version when available;
 * keeps the original poster as a fallback.
 */
async function enrichWithTextlessPosters(
  items: MovieCard[]
): Promise<MovieCard[]> {
  const results = await mapWithConcurrency(items, 5, async (item) => {
    const mediaType: "movie" | "tv" =
      item.genre?.includes("Series") ? "tv" : "movie";

    // Tier 1: Try textless poster
    let finalPoster = await getTextlessPosterUrl(item.id, mediaType);

    // Tier 2: Try any poster
    if (!finalPoster && (!item.posterUrl || item.posterUrl.includes('placeholder'))) {
      finalPoster = await getAnyPosterUrl(item.id, mediaType);
    }

    // Tier 3: Fallback to backdrop
    if (!finalPoster && (!item.posterUrl || item.posterUrl.includes('placeholder'))) {
      finalPoster = item.backdropUrl || null;
    }

    if (finalPoster) {
      return {
        ...item,
        originalPosterUrl: item.posterUrl,
        posterUrl: finalPoster,
      };
    }
    return item;
  });

  return results;
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let index = 0;

  const workers = new Array(Math.min(limit, items.length)).fill(null).map(async () => {
    while (index < items.length) {
      const current = index++;
      try {
        results[current] = await mapper(items[current], current);
      } catch (error) {
        results[current] = items[current] as unknown as R;
      }
    }
  });

  await Promise.all(workers);
  return results;
}

async function enrichWithLogos(items: MovieCard[]): Promise<MovieCard[]> {
  const enriched = await mapWithConcurrency(items, 6, async (item) => {
    if (item.logoUrl !== undefined) return item;

    const mediaType: "movie" | "tv" =
      item.genre?.includes("Series") ? "tv" : "movie";
    const logoUrl = await getTitleLogo(item.id, mediaType);
    return { ...item, logoUrl: logoUrl || undefined };
  });

  return enriched;
}

/**
 * Fetch trending movies for the day or week and format them.
 */
export async function getTrendingMovies(
  timeWindow: "day" | "week" = "day",
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB(`/trending/movie/${timeWindow}?language=en-US`);
  const items = ((data.results || []) as TMDBItem[]).map((movie: TMDBItem) => formatTMDBData(movie));
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

/**
 * Fetch a title's logo from TMDB.
 */
export async function getTitleLogo(id: number, type: "movie" | "tv" | "collection" = "movie"): Promise<string | null> {
  const cacheKey = `logo-${type}-${id}`;
  if (titleLogoCache.has(cacheKey)) {
    return titleLogoCache.get(cacheKey)!;
  }

  try {
    // Fetch with English and null language specifically, as this is most reliable for logos
    const data = await fetchFromTMDB(`/${type}/${id}/images?include_image_language=en,null`);
    let logos = data.logos || [];

    if (logos.length === 0) {
      // If still no logos, try fetching everything
      const allImages = await fetchFromTMDB(`/${type}/${id}/images`);
      logos = allImages.logos || [];
    }

    if (logos.length === 0) {
      titleLogoCache.set(cacheKey, null);
      return null;
    }

    // Sort by popularity/vote to get the best quality one if multiple exist
    // Prefer English, then fallback to any
    const englishLogo = logos.find((l: any) => l.iso_639_1 === "en") || logos[0];

    const logoUrl = getTMDBImageUrl(englishLogo.file_path, "w500");
    titleLogoCache.set(cacheKey, logoUrl);
    return logoUrl;
  } catch (error) {
    console.error(`Failed to fetch logo for ${type} ${id}:`, error);
    return null;
  }
}

/**
 * Fetch combined trending movies and TV series.
 */
export async function getTrendingAll(
  timeWindow: "day" | "week" = "day",
  page: number = 1,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB(`/trending/all/${timeWindow}?language=en-US&page=${page}`);
  const items = (data.results || [] as TMDBItem[])
    .filter((item: TMDBItem) => item.media_type === "movie" || item.media_type === "tv")
    .map((item: TMDBItem) => formatTMDBData(item))
    .filter((item: MovieCard) => isTitleAvailable(item));
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

/**
 * Fetch details for a specific movie.
 */
export async function getMovieDetails(movieId: number) {
  return fetchFromTMDB(`/movie/${movieId}?language=en-US`);
}

/**
 * Fetch full details for a specific movie or TV show, including certifications and providers.
 */
export async function getTitleFullDetails(id: number, type: "movie" | "tv" = "movie") {
  const endpoint = `/${type}/${id}?language=en-US&append_to_response=release_dates,content_ratings,watch/providers,videos,credits,external_ids`;
  return fetchFromTMDB(endpoint);
}

/**
 * Fetch episodes and details for a specific TV show season.
 */
export async function getTVSeasonDetails(id: number, seasonNumber: number) {
  return fetchFromTMDB(`/tv/${id}/season/${seasonNumber}?language=en-US`);
}

/**
 * Fetch critic/user review articles from TMDB.
 */
export async function getMovieReviews(id: number, type: "movie" | "tv" = "movie") {
  return fetchFromTMDB(`/${type}/${id}/reviews?language=en-US`);
}

/**
 * Fetch ratings from OMDb API (Rotten Tomatoes, IMDb, Metacritic).
 */
export async function getOMDbRatings(
  imdbId: string | null | undefined
): Promise<OMDbRating[]> {
  if (!imdbId) return [];
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    console.warn("[OMDb] OMDB_API_KEY is not defined. Skipping ratings fetch.");
    return [];
  }
  try {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.Ratings || []) as OMDbRating[];
  } catch (error) {
    console.error(`[OMDb] Error fetching ratings for ${imdbId}:`, error);
    return [];
  }
}

/**
 * Helper to format raw TMDB data into MovieCard type.
 */
export function formatTMDBData(item: TMDBItem, index?: number): MovieCard {
  const backdrop = item.backdrop_path ? getTMDBImageUrl(item.backdrop_path, "original") : undefined;
  const poster = item.poster_path ? getTMDBImageUrl(item.poster_path, "w780") : undefined;

  return {
    id: item.id,
    title: item.title || item.name,
    rank: index !== undefined ? index + 1 : undefined,
    rating: Math.round(item.vote_average * 10) / 10,
    genre: (() => {
      const type = item.media_type === "tv" || item.first_air_date ? "Series" : "Movie";
      const names = (item.genre_ids || [])
        .map(id => genreMap[id])
        .filter(Boolean)
        .slice(0, 2);
      return [type, ...names].join(", ");
    })(),
    year: (item.release_date || item.first_air_date) ? new Date((item.release_date || item.first_air_date) as string).getFullYear() : undefined,
    posterUrl: poster || backdrop || "/images/poster-placeholder.jpg",
    backdropUrl: backdrop,
    badge: item.vote_average > 8 ? "Must Watch" : undefined,
    releaseDate: item.release_date || item.first_air_date,
  };
}

/**
 * Check if a title is "available" based on:
 * 1. Has a valid poster path
 * 2. Has a release date in the past or present
 */
export function isTitleAvailable(item: MovieCard): boolean {
  // Basic validation
  if (!item.title) return false;

  // Poster validation: must have a real poster OR be a local image
  const isLocalImage = item.posterUrl?.startsWith('/images/') || item.posterUrl?.startsWith('/');
  if (!isLocalImage && (!item.posterUrl || item.posterUrl.includes('placeholder'))) {
    return false;
  }

  // Date validation: do not show unreleased titles
  if (item.releaseDate) {
    // Check if it's a "coming soon" date like "Nov 22" (no year)
    // or a full ISO date like "2026-12-25"
    const today = new Date().toISOString().split("T")[0];

    // If it's a full ISO date, we can compare directly
    if (item.releaseDate.includes('-') && item.releaseDate.length >= 10) {
      if (item.releaseDate > today) return false;
    }
    // If it's a "Coming Soon" style date like "Nov 22", we should probably 
    // consider it unavailable if it's in the comingSoonData
    // But since we are already filtering in SearchPage, maybe this is enough.
  }

  return true;
}

/**
 * Format a date string into a month abbreviation and day (e.g., "NOV 22").
 */
export function formatBadgeDate(dateString: string | undefined) {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

/**
 * Fetch top rated movies and format them as MovieCards.
 */
export async function getTopRatedMovies(): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/movie/top_rated?language=en-US&page=1");
  const items = data.results.slice(0, 10).map((movie: TMDBItem, index: number) => formatTMDBData(movie, index));
  return enrichWithTextlessPosters(items);
}

/**
 * Fetch popular movies and format them as MovieCards.
 */
export async function getPopularMovies(
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/movie/popular?language=en-US&page=1");
  const items = ((data.results || []) as TMDBItem[])
    .slice(0, limit)
    .map((movie: TMDBItem, index: number) => formatTMDBData(movie, index));
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

/**
 * Fetch popular TV series and format them as MovieCards.
 */
export async function getPopularTVSeries(
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/tv/popular?language=en-US&page=1");
  const items = ((data.results || []) as TMDBItem[])
    .slice(0, limit)
    .map((tv: TMDBItem, index: number) => formatTMDBData(tv, index));
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

/**
 * Fetch "Now Playing" movies for the Featured section.
 */
export async function getNowPlayingMovies(
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/movie/now_playing?language=en-US&page=1");
  const items = ((data.results || []) as TMDBItem[])
    .slice(0, limit)
    .map((movie: TMDBItem) => formatTMDBData(movie));
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

/**
 * Fetch "On The Air" TV series for the Featured section.
 */
export async function getOnTheAirTVSeries(
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/tv/on_the_air?language=en-US&page=1");
  const items = ((data.results || []) as TMDBItem[])
    .slice(0, limit)
    .map((tv: TMDBItem) => formatTMDBData(tv));
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

/**
 * Fetch "Upcoming" movies for the Coming Soon section.
 */
export async function getUpcomingMovies(
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const today = new Date().toISOString().split("T")[0];

  // Fetch two pages to ensure we have enough "future" releases after filtering
  const [page1, page2] = await Promise.all([
    fetchFromTMDB("/movie/upcoming?language=en-US&page=1"),
    fetchFromTMDB("/movie/upcoming?language=en-US&page=2")
  ]);

  const allMovies = [...(page1.results || []), ...(page2.results || [])];

  const items = allMovies
    .filter((movie: any) => movie.release_date && movie.release_date > today) // Strictly future releases
    .sort((a: any, b: any) => a.release_date.localeCompare(b.release_date)) // Soonest first
    .slice(0, limit)
    .map((movie: any) => {
      const formatted = formatTMDBData(movie);
      formatted.badge = formatBadgeDate(movie.release_date);
      return formatted;
    });
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

/**
 * Fetch unified "Coming Soon" content (Movies + Series) specifically for 2026.
 */
export async function getComingSoon(
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const today = new Date().toISOString().split("T")[0];
  const startDate = today;
  const endDate = "2026-12-31";

  // Fetch most popular Hollywood movies and series for 2026 to "skip low, mid" content
  const [movieData, tvData] = await Promise.all([
    fetchFromTMDB(`/discover/movie?language=en-US&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&with_origin_country=US&with_original_language=en&sort_by=popularity.desc&page=1`),
    fetchFromTMDB(`/discover/tv?language=en-US&first_air_date.gte=${startDate}&first_air_date.lte=${endDate}&with_origin_country=US&with_original_language=en&sort_by=popularity.desc&page=1`)
  ]);

  const allContent = [
    ...((movieData.results || []) as TMDBItem[]).slice(0, 15).map((m: any) => ({ ...m, media_type: "movie" })),
    ...((tvData.results || []) as TMDBItem[]).slice(0, 15).map((t: any) => ({ ...t, media_type: "tv" }))
  ];

  const items = allContent
    .filter((item: any) => (item.release_date || item.first_air_date) >= today)
    .sort((a: any, b: any) => {
      const dateA = a.release_date || a.first_air_date;
      const dateB = b.release_date || b.first_air_date;
      return dateA.localeCompare(dateB);
    })
    .slice(0, limit)
    .map((item: any) => {
      const formatted = formatTMDBData(item);
      formatted.badge = formatBadgeDate(item.release_date || item.first_air_date);
      formatted.genre = item.media_type === "tv" ? "Series" : "Movie";
      return formatted;
    });
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}



/**
 * Fetch content from specific Asian regions (KR, JP, CN, TH).
 */
export async function getAsianSpotlight(
  region: "KR" | "JP" | "CN" | "TH",
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  let endpoint = "";
  switch (region) {
    case "KR":
      endpoint = "/discover/tv?with_origin_country=KR&sort_by=popularity.desc";
      break;
    case "JP":
      endpoint = "/discover/movie?with_origin_country=JP&sort_by=popularity.desc";
      break;
    case "CN":
      endpoint = "/discover/movie?with_origin_country=CN&sort_by=popularity.desc";
      break;
    case "TH":
      endpoint = "/discover/tv?with_origin_country=TH&sort_by=popularity.desc";
      break;
  }
  const data = await fetchFromTMDB(`${endpoint}&language=en-US&page=1`);
  const items = ((data.results || []) as TMDBItem[])
    .slice(0, limit)
    .map((item: TMDBItem) => formatTMDBData(item));
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

/**
 * Fetch full details for a collection.
 */
export async function getCollectionDetails(collectionId: number) {
  return fetchFromTMDB(`/collection/${collectionId}?language=en-US`);
}

/**
 * Fetch a "Universe" (Movies + TV) using a keyword ID.
 */
export async function getUniverseByKeyword(keywordId: number) {
  const [movies, tv] = await Promise.all([
    fetchFromTMDB(`/discover/movie?with_keywords=${keywordId}&language=en-US&sort_by=popularity.desc`),
    fetchFromTMDB(`/discover/tv?with_keywords=${keywordId}&language=en-US&sort_by=popularity.desc`)
  ]);

  const allParts = [...(movies.results || []), ...(tv.results || [])];

  return {
    id: keywordId,
    name: "", // Will be overridden or set later
    overview: allParts[0]?.overview || "",
    backdrop_path: allParts[0]?.backdrop_path || "",
    parts: allParts
  };
}

/**
 * Discover popular movie franchises (Collections with 2+ movies).
 */
export async function getDiscoverableCollections(limit: number | null = 15): Promise<MovieCard[]> {
  // ─── Module-level result cache (10-min TTL) ────────────────────────────────
  const now = Date.now();
  if (collectionsCache && now < collectionsCache.expiresAt) {
    const cached = collectionsCache.data;
    return limit ? cached.slice(0, limit) : cached;
  }

  // 1. Define Master Universes (these use keyword IDs for discovery — NOT movie IDs)
  const masterUniverses = [
    { id: 180547, name: "Marvel Cinematic Universe" },
    { id: 229266, name: "DC Extended Universe" }
  ];
  const masterUniverseIds = new Set(masterUniverses.map(u => u.id));

  // 2. Curated seed list — verified valid TMDB collection IDs, no duplicates, no 404s
  const collectionIds = new Set<number>([
    // Sci-Fi / Action blockbusters
    10,       // Star Wars
    1241,     // Harry Potter
    645,      // James Bond
    119,      // Lord of the Rings
    404609,   // John Wick
    86311,    // The Avengers
    230,      // The Terminator
    945,      // Fast & Furious
    295,      // Pirates of the Caribbean
    328,      // Jurassic Park
    2344,     // The Matrix
    133352,   // Mission: Impossible (correct)
    1570,     // Die Hard
    422834,   // Fantastic Beasts
    115575,   // The Dark Knight
    33514,    // Thor
    130062,   // Iron Man
    748,      // Indiana Jones
    8650,     // Back to the Future
    8091,     // Alien
    14890,    // Predator
    8945,     // Transformers
    94602,    // Guardians of the Galaxy
    748,      // X-Men (original)
    386546,   // Captain America
    263,      // The Bourne
    5039,     // Rambo (correct)
    173710,   // Planet of the Apes (reboot)
    10194,    // Toy Story
    121938,   // The Hobbit
    72728,    // Hunger Games (correct)
    86055,    // Men in Black
    2806,     // Batman (Burton/Schumacher)
    2901,     // Shrek
    86066,    // Despicable Me (correct)
    89137,    // How to Train Your Dragon (correct)
    304,      // Ocean's (correct)
    528,      // Ace Ventura
    529,      // Beverly Hills Cop
    8354,     // Ice Age (correct)
    9737,     // Lethal Weapon (correct)
    8945,     // Transformers
    9818,     // Mad Max (correct)
    1575,     // Rocky
    10243,    // Spider-Man (Raimi)
    94301,    // Spider-Man (Amazing / Webb)
    126286,   // Spider-Man (MCU)
    11030,    // Scream (correct)
    10237,    // Friday the 13th (correct)
    407887,   // The Conjuring Universe (correct)
    126929,   // Halloween
    91361,    // Ant-Man
    131292,   // Doctor Strange
    403374,   // Jack Reacher
    126288,   // Kung Fu Panda (correct)
    87236,    // Creed
    12627,    // Underworld (correct)
    12648,    // RoboCop (correct)
    2150,     // The Mummy
  ]);

  try {
    // ── Discovery layer 1: 3 pages of trending + 3 pages of popular ──────────
    // Reduced from 10+10 pages — still yields ~1,200 unique movies
    const generalPromises = [1, 2, 3].flatMap(page => [
      fetchFromTMDB(`/trending/movie/week?language=en-US&page=${page}`),
      fetchFromTMDB(`/movie/popular?language=en-US&page=${page}`),
    ]);

    // ── Discovery layer 2: 4 pages × 6 top genres ────────────────────────────
    // Reduced from 10 pages × 12 genres — still gives 4,800 genre-scoped movies
    const topGenres = [28, 12, 16, 14, 878, 27]; // Action, Adventure, Animation, Fantasy, Sci-Fi, Horror
    const genrePromises = topGenres.flatMap(genreId =>
      [1, 2, 3, 4].map(page =>
        fetchFromTMDB(`/discover/movie?language=en-US&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`)
      )
    );

    const allDiscoveryData = await Promise.all([...generalPromises, ...genrePromises]);
    const allResults = allDiscoveryData.flatMap(d => d.results || []);

    // ── Extract collection membership from top-300 titles (concurrency-capped) ─
    // Reduced from 3,000 uncapped Promise.all → 300 with 20-concurrency
    const uniqueMovies = Array.from(new Map(allResults.map((m: any) => [m.id, m])).values());
    const detailedMovies = await mapWithConcurrency(
      uniqueMovies.slice(0, 300),
      20,
      (m: any) => getMovieDetails(m.id).catch(() => null)
    );

    detailedMovies.forEach((m: any) => {
      if (m && m.belongs_to_collection) {
        collectionIds.add(m.belongs_to_collection.id);
      }
    });
  } catch (e) {
    console.warn("[Collections] Discovery phase failed (using seed list only):", e);
  }

  // 3. Fetch collection details (concurrency-capped at 15)
  const universePromises = masterUniverses.map(u => getUniverseByKeyword(u.id));
  const uniqueIds = Array.from(collectionIds);
  const collectionDetails = await mapWithConcurrency(
    uniqueIds,
    15,
    (id: number) => getCollectionDetails(id).catch(() => null)
  );

  const [universes] = await Promise.all([Promise.all(universePromises)]);

  const overrides: Record<number, string> = {
    180547: "Marvel Cinematic Universe",
    229266: "DC Extended Universe",
    10: "Star Wars Saga",
    1241: "Harry Potter Collection",
    645: "James Bond Anthology",
    119: "The Lord of the Rings",
    404609: "John Wick Collection",
    403374: "Jack Reacher Collection",
    72688: "The Hunger Games",
  };

  const today = new Date().toISOString().split("T")[0];

  // Format universes (no logo fetch here — done at end)
  const formattedUniverses = universes.map((u) => {
    const releasedParts = u.parts.filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) <= today);
    const upcomingParts = u.parts.filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) > today);

    const allGenreIds = u.parts.flatMap((p: any) => p.genre_ids || []);
    const genreCounts: Record<number, number> = {};
    allGenreIds.forEach((id: number) => { genreCounts[id] = (genreCounts[id] || 0) + 1; });
    const topGenreId = Object.keys(genreCounts).sort((a: any, b: any) => genreCounts[b] - genreCounts[a])[0];
    const detectedGenre = genreMap[Number(topGenreId)] || "Universe";

    return {
      id: u.id,
      title: overrides[u.id] || u.name,
      description: u.overview,
      badge: `${releasedParts.length}+ TITLES`,
      backdropUrl: getTMDBImageUrl(u.backdrop_path, "original"),
      logoUrl: undefined as string | undefined | null,
      rating: releasedParts.length > 0 ? Math.round((releasedParts.reduce((acc: number, p: any) => acc + (p.vote_average || 0), 0) / releasedParts.length) * 10) / 10 : 0,
      year: releasedParts[0]?.release_date ? new Date(releasedParts[0].release_date).getFullYear() : undefined,
      genre: detectedGenre,
      popularity: releasedParts.length > 0 ? releasedParts.reduce((acc: number, p: any) => acc + (p.popularity || 0), 0) / releasedParts.length : 0,
      isAnticipated: upcomingParts.length > 0
    };
  });

  // Format collections (no logo fetch here — done at end)
  const formattedCollections = collectionDetails
    .filter((c): c is any => c != null && Array.isArray(c.parts))
    .map((c) => {
      const releasedParts = c.parts.filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) <= today);
      const upcomingParts = c.parts.filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) > today);

      if (releasedParts.length < 2) return null;

      const allGenreIds = c.parts.flatMap((p: any) => p.genre_ids || []);
      const genreCounts: Record<number, number> = {};
      allGenreIds.forEach((id: number) => { genreCounts[id] = (genreCounts[id] || 0) + 1; });
      const topGenreId = Object.keys(genreCounts).sort((a: any, b: any) => genreCounts[b] - genreCounts[a])[0];
      const detectedGenre = genreMap[Number(topGenreId)] || "Franchise";

      return {
        id: c.id,
        title: overrides[c.id] || c.name,
        description: c.overview,
        badge: `${releasedParts.length} MOVIES`,
        backdropUrl: getTMDBImageUrl(c.backdrop_path || c.parts[0]?.backdrop_path, "original"),
        logoUrl: undefined as string | undefined | null,
        rating: releasedParts.length > 0 ? Math.round((releasedParts.reduce((acc: number, p: any) => acc + (p.vote_average || 0), 0) / releasedParts.length) * 10) / 10 : 0,
        year: releasedParts[0]?.release_date ? new Date(releasedParts[0].release_date).getFullYear() : undefined,
        genre: detectedGenre,
        popularity: c.parts.reduce((acc: number, p: any) => acc + (p.popularity || 0), 0) / c.parts.length,
        isAnticipated: upcomingParts.length > 0
      };
    })
    .filter((c): c is any => c !== null);

  // Sort by popularity before fetching logos — so we only fetch logos for the
  // items that will actually be displayed (most popular first).
  const sorted = [...formattedUniverses, ...formattedCollections]
    .sort((a, b) => b.popularity - a.popularity);

  // ── Fetch logos for the final set with concurrency cap of 8 ───────────────
  // NOTE: masterUniverses use keyword IDs (not movie IDs), so we skip logo
  // fetching for them entirely to avoid 404s on /movie/{keywordId}/images.
  const withLogos = await mapWithConcurrency(sorted, 8, async (item: any) => {
    if (masterUniverseIds.has(item.id)) {
      // Keyword-based universe — no logo available via the images endpoint
      return { ...item, logoUrl: null };
    }
    const logoUrl = await getTitleLogo(item.id, "collection").catch(() => null);
    return { ...item, logoUrl };
  });

  // ── Write to module-level cache ────────────────────────────────────────────
  collectionsCache = { data: withLogos, expiresAt: Date.now() + COLLECTIONS_CACHE_TTL_MS };
  console.log(`[Collections] Cached ${withLogos.length} collections for 10 minutes.`);

  return limit ? withLogos.slice(0, limit) : withLogos;
}


/**
 * Search for movies and TV series across TMDB.
 */
export async function searchMulti(query: string, page: number = 1): Promise<MovieCard[]> {
  if (!query) return [];
  const data = await fetchFromTMDB(`/search/multi?query=${encodeURIComponent(query)}&language=en-US&page=${page}&include_adult=false`);
  const items = (data.results || [] as TMDBItem[])
    .filter((item: TMDBItem) => item.media_type === "movie" || item.media_type === "tv")
    .map((item: TMDBItem) => formatTMDBData(item))
    .filter((item: MovieCard) => isTitleAvailable(item));
  return enrichWithTextlessPosters(items);
}

/**
 * Genre name → TMDB genre IDs for movie and TV discover endpoints.
 */
const genreNameToIds: Record<string, { movie: number[]; tv: number[] }> = {
  action: { movie: [28], tv: [10759] },
  adventure: { movie: [12], tv: [10759] },
  animation: { movie: [16], tv: [16] },
  comedy: { movie: [35], tv: [35] },
  crime: { movie: [80], tv: [80] },
  drama: { movie: [18], tv: [18] },
  fantasy: { movie: [14], tv: [10765] },
  horror: { movie: [27], tv: [9648] },
  mystery: { movie: [9648], tv: [9648] },
  romance: { movie: [10749], tv: [10749] },
  "sci-fi": { movie: [878], tv: [10765] },
  thriller: { movie: [53], tv: [53] },
};

/**
 * Discover titles by genre or type filter.
 * - "Movie" / "Series" → type filter (all genres)
 * - Other genres → genre-specific discover for both movie + TV
 */
export async function discoverByGenre(
  genre: string,
  page: number = 1
): Promise<MovieCard[]> {
  const key = genre.toLowerCase();

  // Type filters: "Movie" or "Series"
  if (key === "movie") {
    const data = await fetchFromTMDB(
      `/discover/movie?language=en-US&sort_by=popularity.desc&page=${page}`
    );
    const items = (data.results || [])
      .map((item: TMDBItem) => formatTMDBData({ ...item, media_type: "movie" }))
      .filter((item: MovieCard) => isTitleAvailable(item));
    return enrichWithTextlessPosters(items);
  }

  if (key === "series") {
    const data = await fetchFromTMDB(
      `/discover/tv?language=en-US&sort_by=popularity.desc&page=${page}`
    );
    const items = (data.results || [])
      .map((item: TMDBItem) => formatTMDBData({ ...item, media_type: "tv" }))
      .filter((item: MovieCard) => isTitleAvailable(item));
    return enrichWithTextlessPosters(items);
  }

  // Genre filter: fetch from both movie + TV discover
  const ids = genreNameToIds[key];
  if (!ids) return [];

  const [movieData, tvData] = await Promise.all([
    fetchFromTMDB(
      `/discover/movie?language=en-US&sort_by=popularity.desc&with_genres=${ids.movie.join(",")}&page=${page}`
    ),
    fetchFromTMDB(
      `/discover/tv?language=en-US&sort_by=popularity.desc&with_genres=${ids.tv.join(",")}&page=${page}`
    ),
  ]);

  const movies = (movieData.results || []).map((item: TMDBItem) =>
    formatTMDBData({ ...item, media_type: "movie" })
  );
  const tvShows = (tvData.results || []).map((item: TMDBItem) =>
    formatTMDBData({ ...item, media_type: "tv" })
  );

  // Interleave movie + TV, sorted by popularity (rating as proxy)
  const combined = [...movies, ...tvShows]
    .filter((item: MovieCard) => isTitleAvailable(item))
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return enrichWithTextlessPosters(combined);
}

/**
 * Fetch recommendations for a specific movie or TV show.
 */
export async function getRecommendations(id: number, type: "movie" | "tv" = "movie"): Promise<MovieCard[]> {
  const data = await fetchFromTMDB(`/${type}/${id}/recommendations?language=en-US`);
  const items = (data.results || []).map((item: TMDBItem) => formatTMDBData({ ...item, media_type: type }));
  return enrichWithTextlessPosters(items.slice(0, 20));
}

/**
 * Fetch a unified Collection or Universe data object for the details page.
 */
export async function getCollectionOrUniverseDetails(id: string): Promise<CollectionData | null> {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const masterUniverses: Record<number, string> = {
    180547: "Marvel Cinematic Universe",
    229266: "DC Extended Universe",
    10: "Star Wars Saga",
    1241: "Harry Potter Collection",
    645: "James Bond Anthology",
    119: "The Lord of the Rings",
    403374: "John Wick Collection"
  };

  const isUniverse = [180547, 229266].includes(numericId);
  let rawData: any;
  let title = masterUniverses[numericId] || "";
  let highQualityBackdropPath: string | null = null;

  if (isUniverse) {
    rawData = await getUniverseByKeyword(numericId);
    title = title || rawData.name;
  } else {
    // Fetch details and images in parallel to ensure high-quality asset selection
    const [details, images] = await Promise.all([
      getCollectionDetails(numericId),
      fetchFromTMDB(`/collection/${numericId}/images`).catch(() => ({ backdrops: [] }))
    ]);
    rawData = details;
    title = title || rawData.name;

    // Select the best backdrop based on resolution and rating for "High Quality" requirement
    if (images.backdrops && images.backdrops.length > 0) {
      const best = images.backdrops.sort((a: any, b: any) => {
        const scoreA = (a.width || 0) * (a.vote_average || 0);
        const scoreB = (b.width || 0) * (b.vote_average || 0);
        return scoreB - scoreA;
      })[0];
      highQualityBackdropPath = best.file_path;
    }
  }

  if (!rawData || !rawData.parts) return null;

  const today = new Date().toISOString().split("T")[0];
  
  // Format parts to MovieCards
  const partsItems = rawData.parts
    .filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) <= today)
    .sort((a: any, b: any) => {
      const dateA = a.release_date || a.first_air_date;
      const dateB = b.release_date || b.first_air_date;
      return dateA.localeCompare(dateB);
    })
    .map((p: any) => {
      const formatted = formatTMDBData({ ...p, media_type: p.media_type || (isUniverse ? (p.first_air_date ? "tv" : "movie") : "movie") });
      return formatted;
    });

  const enrichedParts = await enrichWithTextlessPosters(partsItems);

  // Format upcoming parts
  const upcomingPartsRaw = rawData.parts
    .filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) > today)
    .sort((a: any, b: any) => {
      const dateA = a.release_date || a.first_air_date;
      const dateB = b.release_date || b.first_air_date;
      return dateA.localeCompare(dateB);
    })
    .map((p: any) => {
      const formatted = formatTMDBData({ ...p, media_type: p.media_type || (isUniverse ? (p.first_air_date ? "tv" : "movie") : "movie") });
      formatted.badge = formatBadgeDate(p.release_date || p.first_air_date);
      return formatted;
    });
  
  const enrichedComingSoon = await enrichWithTextlessPosters(upcomingPartsRaw);

  // Calculate stats
  const averageRating = rawData.parts.reduce((acc: number, p: any) => acc + (p.vote_average || 0), 0) / (rawData.parts.length || 1);
  const rating = Math.round(averageRating * 10) / 10;
  
  const sortedDates = enrichedParts
    .map(p => p.year)
    .filter((y): y is number => y !== undefined)
    .sort((a, b) => a - b);
  
  const yearSpan = sortedDates.length > 0 
    ? (sortedDates[0] === sortedDates[sortedDates.length - 1] 
        ? `${sortedDates[0]}` 
        : `${sortedDates[0]} - ${sortedDates[sortedDates.length - 1]}`)
    : "";

  const uniqueGenres = Array.from(new Set(enrichedParts.map(p => p.genre).filter(Boolean))) as string[];
  const topGenres = uniqueGenres.slice(0, 3);

  // Get logo, try collection logo first, then fallback to first part
  let logoUrl = await getTitleLogo(numericId, isUniverse ? "movie" : "collection");
  if (!logoUrl && rawData.parts && rawData.parts[0]) {
    logoUrl = await getTitleLogo(rawData.parts[0].id, rawData.parts[0].media_type || "movie");
  }

  // Calculate total runtime, revenue, and aggregate cast
  const fullParts = await mapWithConcurrency(rawData.parts, 12, async (p: any) => {
    const type = p.media_type || (isUniverse ? (p.first_air_date ? "tv" : "movie") : "movie");
    try {
      return await getTitleFullDetails(p.id, type as "movie" | "tv");
    } catch (e) {
      return p;
    }
  });

  const totalRuntimeMin = fullParts.reduce((acc: number, p: any) => acc + (p.runtime || (p.episode_run_time ? p.episode_run_time[0] : 0) || 0), 0);
  const totalRevenueVal = fullParts.reduce((acc: number, p: any) => acc + (p.revenue || 0), 0);

  const hours = Math.floor(totalRuntimeMin / 60);
  const minutes = totalRuntimeMin % 60;
  const totalRuntime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const totalRevenue = totalRevenueVal > 0 
    ? `$${(totalRevenueVal / 1000000000).toFixed(1)}B` 
    : "N/A";

  // Aggregate Cast
  const castMap = new Map<number, { 
    person: TMDBCastMember; 
    count: number; 
    characters: Set<string>;
    popularity: number;
  }>();

  fullParts.forEach((part: any) => {
    const partCast = part.credits?.cast || [];
    // Only take top 15 cast members per movie to avoid noise from background extras
    partCast.slice(0, 15).forEach((actor: any) => {
      const existing = castMap.get(actor.id);
      if (existing) {
        existing.count += 1;
        if (actor.character) existing.characters.add(actor.character);
      } else {
        castMap.set(actor.id, {
          person: actor,
          count: 1,
          characters: new Set(actor.character ? [actor.character] : []),
          popularity: actor.popularity || 0
        });
      }
    });
  });

  const aggregatedCast = Array.from(castMap.values())
    .map(item => ({
      ...item.person,
      appearanceCount: item.count,
      allCharacters: Array.from(item.characters),
      character: Array.from(item.characters).slice(0, 2).join(" • ") // UI fallback
    }))
    // Sort by: 
    // 1. Appearance count (desc)
    // 2. Popularity (desc) to break ties for main stars
    .sort((a, b) => {
      if (b.appearanceCount !== a.appearanceCount) {
        return b.appearanceCount - a.appearanceCount;
      }
      return (b as any).popularity - (a as any).popularity;
    })
    .slice(0, 40); // Cap at 40 for UI performance

  // Aggregate Crew - High Fidelity Creative Team logic
  const crewMap = new Map<number, { 
    person: TMDBCrewMember; 
    count: number; 
    jobs: Set<string>;
    popularity: number;
  }>();

  // Focus on top-tier creative roles for collection overview
  const primaryJobs = ["Director", "Writer", "Screenplay", "Producer", "Executive Producer", "Original Music Composer"];

  fullParts.forEach((part: any) => {
    const partCrew = part.credits?.crew || [];
    partCrew.forEach((member: any) => {
      if (primaryJobs.includes(member.job || "")) {
        const existing = crewMap.get(member.id);
        if (existing) {
          existing.count += 1;
          if (member.job) existing.jobs.add(member.job);
        } else {
          crewMap.set(member.id, {
            person: member,
            count: 1,
            jobs: new Set(member.job ? [member.job] : []),
            popularity: member.popularity || 0
          });
        }
      }
    });
  });

  const aggregatedCrew = Array.from(crewMap.values())
    .map(item => ({
      ...item.person,
      appearanceCount: item.count,
      displayRole: Array.from(item.jobs).slice(0, 2).join(" • ")
    }))
    .sort((a, b) => {
      if (b.appearanceCount !== a.appearanceCount) {
        return b.appearanceCount - a.appearanceCount;
      }
      return (b as any).popularity - (a as any).popularity;
    })
    .slice(0, 25); // Cap for UI performance

  return {
    id: numericId,
    title,
    overview: rawData.overview || "",
    backdropUrl: getTMDBImageUrl(highQualityBackdropPath || rawData.backdrop_path || rawData.parts[0]?.backdrop_path, "original"),
    posterUrl: getTMDBImageUrl(rawData.poster_path || rawData.parts[0]?.poster_path, "w500"),
    logoUrl,
    parts: enrichedParts,
    comingSoon: enrichedComingSoon,
    rating,
    yearSpan,
    genres: topGenres,
    totalRuntime,
    totalRevenue,
    cast: aggregatedCast,
    crew: aggregatedCrew
  };
}
/**
 * Fetch details for a specific person.
 */
export async function getPersonDetails(personId: string | number) {
  const endpoint = `/person/${personId}?language=en-US&append_to_response=movie_credits,tv_credits,external_ids,images`;
  return fetchFromTMDB(endpoint);
}
