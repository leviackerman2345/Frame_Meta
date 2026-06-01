import type { MovieCard, OMDbRating } from "@/types/types";
import { fetchWithTimeout } from "@/lib/fetch-utils";

export interface TMDBItem {
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

export const genreMap: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics"
};

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";
const DEFAULT_REVALIDATE_SECONDS = 3600;
const DEFAULT_FETCH_TIMEOUT_MS = 5000;
const inFlightRequests = new Map<string, Promise<any>>();

let hasLoggedMissingToken = false;

const getAccessToken = () => {
  let token = process.env.TMDB_ACCESS_TOKEN;
  if (token) {
    token = token.trim().replace(/^["'](.+)["']$/, '$1');
  }
  if (!token && !hasLoggedMissingToken) {
    console.warn("[TMDB] Warning: TMDB_ACCESS_TOKEN is undefined. Check Vercel Environment Variables.");
    hasLoggedMissingToken = true;
  } else if (token && !hasLoggedMissingToken) {
    console.log("[TMDB] Token loaded successfully.");
    hasLoggedMissingToken = true;
  }
  return token;
};

interface TMDBFetchOptions extends RequestInit {
  next?: { revalidate?: number };
  softFailOnTimeout?: boolean;
}

export const fetchFromTMDB = async (endpoint: string, options: TMDBFetchOptions = {}) => {
  const token = getAccessToken();
  if (!token) {
    console.error(`TMDB API error: No access token provided for ${endpoint}. Check your .env.local file.`);
    return { results: [], parts: [] };
  }

  const url = `${TMDB_BASE_URL}${endpoint}`;
  const { softFailOnTimeout = false, ...fetchOptions } = options;

  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${token}`,
    ...fetchOptions.headers,
  };

  const nextOptions = fetchOptions.next || { revalidate: DEFAULT_REVALIDATE_SECONDS };
  const requestKey = `${url}::softFailOnTimeout=${softFailOnTimeout ? "1" : "0"}`;
  const existing = inFlightRequests.get(requestKey);
  if (existing) return existing;

  const requestPromise = (async () => {
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), DEFAULT_FETCH_TIMEOUT_MS);

      try {
        const startTime = Date.now();
        const response = await fetch(url, {
          ...fetchOptions,
          headers,
          next: nextOptions,
          signal: controller.signal,
        });

        const duration = Date.now() - startTime;
        if (duration > 5000) {
          console.warn(`[TMDB] Slow request: ${duration}ms at ${endpoint}`);
        }

        if (!response.ok) {
          console.warn(`[TMDB] API Warning: ${response.status} at ${endpoint}`);
          return { results: [], parts: [] };
        }

        return await response.json();
      } catch (error: any) {
        if (error?.name === "AbortError") {
          if (attempts < maxAttempts) {
            console.warn(`[TMDB] Timeout after ${DEFAULT_FETCH_TIMEOUT_MS}ms at ${endpoint}. Retrying...`);
            continue;
          }
          const isNonCriticalImageEndpoint =
            endpoint.includes("/images") || endpoint.includes("include_image_language");
          if (isNonCriticalImageEndpoint) {
            console.warn(`[TMDB] Soft timeout at ${endpoint}. Falling back to default artwork.`);
            return { results: [], parts: [], posters: [], logos: [], backdrops: [] };
          }
          if (softFailOnTimeout) {
            console.warn(`[TMDB] Soft timeout at ${endpoint}. Returning empty data.`);
            return { results: [], parts: [] };
          }
          console.error(`[TMDB] Timeout after ${DEFAULT_FETCH_TIMEOUT_MS}ms at ${endpoint}. Max retries reached.`);
          throw new Error(`TMDB request timed out after ${DEFAULT_FETCH_TIMEOUT_MS}ms (${endpoint}). Please try again.`);
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

  inFlightRequests.set(requestKey, requestPromise);
  requestPromise.finally(() => inFlightRequests.delete(requestKey));
  return requestPromise;
};

export function getTMDBImageUrl(path: string | null | undefined, size: string = "w500") {
  if (!path) return "/images/poster-placeholder.jpg";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

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

export function isTitleAvailable(item: MovieCard): boolean {
  if (!item.title) return false;
  const isLocalImage = item.posterUrl?.startsWith('/images/') || item.posterUrl?.startsWith('/');
  if (!isLocalImage && (!item.posterUrl || item.posterUrl.includes('placeholder'))) {
    return false;
  }
  return true;
}

export function formatBadgeDate(dateString: string | undefined) {
  if (!dateString) return undefined;
  const date = new Date(dateString);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

export async function getMovieDetails(movieId: number) {
  return fetchFromTMDB(`/movie/${movieId}?language=en-US`, { softFailOnTimeout: true });
}

export async function getTitleFullDetails(id: number, type: "movie" | "tv" = "movie") {
  const endpoint = `/${type}/${id}?language=en-US&append_to_response=release_dates,content_ratings,watch/providers,videos,credits,external_ids`;
  return fetchFromTMDB(endpoint);
}

export async function getTitleCertification(id: number, mediaType: 'movie' | 'tv'): Promise<string | null> {
  const { certificationCache } = await import("./tmdb-cache");
  const cacheKey = `cert_${mediaType}_${id}`;
  if (certificationCache.has(cacheKey)) {
    return certificationCache.get(cacheKey)!;
  }

  try {
    if (mediaType === 'movie') {
      const data = await fetchFromTMDB(`/movie/${id}/release_dates`, { softFailOnTimeout: true });
      const results = data.results || [];
      const usRelease = results.find((r: any) => r.iso_3166_1 === 'US');
      if (usRelease && usRelease.release_dates && usRelease.release_dates.length > 0) {
        const cert = usRelease.release_dates.find((d: any) => d.certification)?.certification || null;
        certificationCache.set(cacheKey, cert || null);
        return cert || null;
      }
    } else if (mediaType === 'tv') {
      const data = await fetchFromTMDB(`/tv/${id}/content_ratings`, { softFailOnTimeout: true });
      const results = data.results || [];
      const usRating = results.find((r: any) => r.iso_3166_1 === 'US');
      if (usRating && usRating.rating) {
        certificationCache.set(cacheKey, usRating.rating);
        return usRating.rating;
      }
    }
  } catch (error) {
    console.error(`Failed to fetch certification for ${mediaType} ${id}:`, error);
  }

  certificationCache.set(cacheKey, null);
  return null;
}

export async function getTVSeasonDetails(id: number, seasonNumber: number) {
  return fetchFromTMDB(`/tv/${id}/season/${seasonNumber}?language=en-US`);
}

export async function getMovieReviews(id: number, type: "movie" | "tv" = "movie") {
  return fetchFromTMDB(`/${type}/${id}/reviews?language=en-US`);
}

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
    const res = await fetchWithTimeout(`https://www.omdbapi.com/?i=${imdbId}&apikey=${apiKey}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.Ratings || []) as OMDbRating[];
  } catch (error) {
    console.error(`[OMDb] Error fetching ratings for ${imdbId}:`, error);
    return [];
  }
}
