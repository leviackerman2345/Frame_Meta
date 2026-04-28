import { MovieCard } from "@/types/types";

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
  let token = process.env.TMDB_ACCESS_TOKEN || process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

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

// In-memory cache to prevent N+1 API call limits and improve initial SSR load performance
const textlessPosterCache = new Map<string, string | null>();



async function fetchFromTMDB(endpoint: string, options: RequestInit = {}) {
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

  try {
    const response = await fetch(url, { ...options, headers });

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
  } catch (error) {
    console.error(`TMDB network error at ${endpoint}:`, error);
    return { results: [], parts: [] };
  }
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

    const posterUrl = getTMDBImageUrl(best.file_path, "w500");
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

    const posterUrl = getTMDBImageUrl(best.file_path, "w500");
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
  const results = await Promise.allSettled(
    items.map(async (item) => {
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
    })
  );

  return results.map((r, i) =>
    r.status === "fulfilled" ? r.value : items[i]
  );
}

/**
 * Fetch trending movies for the day or week and format them.
 */
export async function getTrendingMovies(timeWindow: "day" | "week" = "day"): Promise<MovieCard[]> {
  const data = await fetchFromTMDB(`/trending/movie/${timeWindow}?language=en-US`);
  const items = (data.results || [] as TMDBItem[]).map((movie: TMDBItem) => formatTMDBData(movie));
  return enrichWithTextlessPosters(items);
}

/**
 * Fetch a title's logo from TMDB.
 */
export async function getTitleLogo(id: number, type: "movie" | "tv" = "movie"): Promise<string | null> {
  try {
    // Fetch with English and null language specifically, as this is most reliable for logos
    const data = await fetchFromTMDB(`/${type}/${id}/images?include_image_language=en,null`);
    let logos = data.logos || [];

    if (logos.length === 0) {
      // If still no logos, try fetching everything
      const allImages = await fetchFromTMDB(`/${type}/${id}/images`);
      logos = allImages.logos || [];
    }

    if (logos.length === 0) return null;

    // Sort by popularity/vote to get the best quality one if multiple exist
    // Prefer English, then fallback to any
    const englishLogo = logos.find((l: any) => l.iso_639_1 === "en") || logos[0];

    return getTMDBImageUrl(englishLogo.file_path, "w500");
  } catch (error) {
    console.error(`Failed to fetch logo for ${type} ${id}:`, error);
    return null;
  }
}

/**
 * Fetch combined trending movies and TV series.
 */
export async function getTrendingAll(timeWindow: "day" | "week" = "day", page: number = 1): Promise<MovieCard[]> {
  const data = await fetchFromTMDB(`/trending/all/${timeWindow}?language=en-US&page=${page}`);
  const items = (data.results || [] as TMDBItem[])
    .filter((item: TMDBItem) => item.media_type === "movie" || item.media_type === "tv")
    .map((item: TMDBItem) => formatTMDBData(item))
    .filter((item: MovieCard) => isTitleAvailable(item));
  return enrichWithTextlessPosters(items);
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
export async function getOMDbRatings(imdbId: string | null | undefined) {
  if (!imdbId) return [];
  const apiKey = "c540d669";
  try {
    const res = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data?.Ratings || [];
  } catch (error) {
    console.error(`[OMDb] Error fetching ratings for ${imdbId}:`, error);
    return [];
  }
}

/**
 * Helper to format raw TMDB data into MovieCard type.
 */
export function formatTMDBData(item: TMDBItem, index?: number): MovieCard {
  const backdrop = item.backdrop_path ? getTMDBImageUrl(item.backdrop_path, "w780") : undefined;
  const poster = item.poster_path ? getTMDBImageUrl(item.poster_path, "w500") : undefined;

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
export async function getPopularMovies(limit: number = 20): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/movie/popular?language=en-US&page=1");
  const items = data.results.slice(0, limit).map((movie: TMDBItem, index: number) => formatTMDBData(movie, index));
  return enrichWithTextlessPosters(items);
}

/**
 * Fetch popular TV series and format them as MovieCards.
 */
export async function getPopularTVSeries(limit: number = 20): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/tv/popular?language=en-US&page=1");
  const items = data.results.slice(0, limit).map((tv: TMDBItem, index: number) => formatTMDBData(tv, index));
  return enrichWithTextlessPosters(items);
}

/**
 * Fetch "Now Playing" movies for the Featured section.
 */
export async function getNowPlayingMovies(limit: number = 20): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/movie/now_playing?language=en-US&page=1");
  const items = data.results.slice(0, limit).map((movie: TMDBItem) => formatTMDBData(movie));
  return enrichWithTextlessPosters(items);
}

/**
 * Fetch "On The Air" TV series for the Featured section.
 */
export async function getOnTheAirTVSeries(limit: number = 20): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/tv/on_the_air?language=en-US&page=1");
  const items = data.results.slice(0, limit).map((tv: TMDBItem) => formatTMDBData(tv));
  return enrichWithTextlessPosters(items);
}

/**
 * Fetch "Upcoming" movies for the Coming Soon section.
 */
export async function getUpcomingMovies(limit: number = 20): Promise<MovieCard[]> {
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
  return enrichWithTextlessPosters(items);
}

/**
 * Fetch unified "Coming Soon" content (Movies + Series) specifically for 2026.
 */
export async function getComingSoon(limit: number = 20): Promise<MovieCard[]> {
  const today = new Date().toISOString().split("T")[0];
  const startDate = today;
  const endDate = "2026-12-31";

  // Fetch most popular Hollywood movies and series for 2026 to "skip low, mid" content
  const [movieData, tvData] = await Promise.all([
    fetchFromTMDB(`/discover/movie?language=en-US&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&with_origin_country=US&with_original_language=en&sort_by=popularity.desc&page=1`),
    fetchFromTMDB(`/discover/tv?language=en-US&first_air_date.gte=${startDate}&first_air_date.lte=${endDate}&with_origin_country=US&with_original_language=en&sort_by=popularity.desc&page=1`)
  ]);

  const allContent = [
    ...(movieData.results || []).slice(0, 15).map((m: any) => ({ ...m, media_type: "movie" })),
    ...(tvData.results || []).slice(0, 15).map((t: any) => ({ ...t, media_type: "tv" }))
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
  return enrichWithTextlessPosters(items);
}

/**
 * Fetch content from specific Asian regions (KR, JP, CN, TH).
 */
export async function getAsianSpotlight(region: "KR" | "JP" | "CN" | "TH", limit: number = 20): Promise<MovieCard[]> {
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
  const items = data.results.slice(0, limit).map((item: TMDBItem) => formatTMDBData(item));
  return enrichWithTextlessPosters(items);
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
export async function getDiscoverableCollections(): Promise<MovieCard[]> {
  // 1. Define Master Universes (Keyword Based for Movies + TV)
  const masterUniverses = [
    { id: 180547, name: "Marvel Cinematic Universe (the Infinity Saga)" },
    { id: 229266, name: "DC Extended Universe" }
  ];

  // 2. Seed with "Famous" all-time legendary franchises
  // Star Wars: 10, Harry Potter: 1241, James Bond: 645, Lord of the Rings: 119, John Wick: 403374
  const collectionIds = new Set<number>([10, 1241, 645, 119, 403374]);

  try {
    const trendingData = await fetchFromTMDB('/trending/movie/week?language=en-US');
    const sample = (trendingData?.results || []).slice(0, 40);

    const detailsPromises = sample.map((m: any) => getMovieDetails(m.id).catch(() => null));
    const detailedMovies = await Promise.all(detailsPromises);

    detailedMovies.forEach((m: any) => {
      if (m && m.belongs_to_collection) {
        collectionIds.add(m.belongs_to_collection.id);
      }
    });
  } catch (e) {
    console.warn("Failed to fetch trending movies for collection discovery:", e);
  }

  // 3. Batch fetch everything
  const universePromises = masterUniverses.map(u => getUniverseByKeyword(u.id));
  const uniqueIds = Array.from(collectionIds).slice(0, 10);
  const collectionPromises = uniqueIds.map(id => getCollectionDetails(id).catch(() => null));

  const [universes, collections] = await Promise.all([
    Promise.all(universePromises),
    Promise.all(collectionPromises)
  ]);

  // 4. Format Mapping
  const overrides: Record<number, string> = {
    180547: "Marvel Cinematic Universe (The Infinity Saga)",
    229266: "DC Extended Universe",
    403374: "John Wick (The \"Gun\" Universe)",
    10: "Star Wars Saga",
    1241: "Harry Potter Collection",
    645: "007: James Bond Anthology",
    119: "The Lord of the Rings"
  };

  const today = new Date().toISOString().split("T")[0];

  const formattedUniverses = universes.map(u => {
    const releasedParts = u.parts.filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) <= today);
    const upcomingParts = u.parts.filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) > today);

    return {
      id: u.id,
      title: overrides[u.id] || u.name,
      description: u.overview,
      badge: `${releasedParts.length}+ TITLES`,
      backdropUrl: getTMDBImageUrl(u.backdrop_path, "original"),
      rating: Math.round((releasedParts.reduce((acc: number, p: any) => acc + (p.vote_average || 0), 0) / releasedParts.length) * 10) / 10,
      year: new Date(releasedParts[0]?.release_date || releasedParts[0]?.first_air_date).getFullYear(),
      genre: "Universe",
      popularity: releasedParts.reduce((acc: number, p: any) => acc + (p.popularity || 0), 0) / releasedParts.length,
      isAnticipated: upcomingParts.length > 0
    };
  });

  const formattedCollections = collections
    .filter(c => c && c.parts)
    .map(c => {
      // Filter out unreleased titles
      const releasedParts = c.parts.filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) <= today);
      const upcomingParts = c.parts.filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) > today);

      return {
        ...c,
        releasedParts,
        isAnticipated: upcomingParts.length > 0
      };
    })
    .filter(c => c.releasedParts.length >= 2)
    .map(c => ({
      id: c.id,
      title: overrides[c.id] || c.name,
      description: c.overview,
      badge: `${c.releasedParts.length} MOVIES`,
      backdropUrl: getTMDBImageUrl(c.backdrop_path || c.releasedParts[0]?.backdrop_path, "original"),
      rating: Math.round((c.releasedParts.reduce((acc: number, p: any) => acc + p.vote_average, 0) / c.releasedParts.length) * 10) / 10,
      year: new Date(c.releasedParts[0]?.release_date || c.releasedParts[0]?.first_air_date).getFullYear(),
      genre: "Franchise",
      popularity: c.releasedParts.reduce((acc: number, p: any) => acc + (p.popularity || 0), 0) / c.releasedParts.length,
      isAnticipated: c.isAnticipated
    }));

  // 5. Combine, Sort, and Limit
  return [...formattedUniverses, ...formattedCollections]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 10);
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
