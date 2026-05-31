import type { MovieCard } from "@/types/types";
import { fetchFromTMDB, formatTMDBData, isTitleAvailable, formatBadgeDate, TMDBItem } from "./tmdb-client";
import { enrichWithTextlessPosters, enrichWithLogos } from "./tmdb-enrichment";
import { homeDiscoveryMetaCache, HOME_DISCOVERY_META_TTL_MS, normalizeProviderName } from "./tmdb-cache";
import { getTitleFullDetails } from "./tmdb-client";
import type { TMDBProvider } from "@/types/types";

export async function getTitleHomeMeta(
  id: number,
  type: "movie" | "tv" = "movie"
): Promise<{ runtime?: number; providerNames: string[] }> {
  const cacheKey = `home-meta-${type}-${id}`;
  const cached = homeDiscoveryMetaCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) return cached.data;

  try {
    const details = await getTitleFullDetails(id, type);
    const runtime =
      type === "tv"
        ? details.episode_run_time?.[0] || details.runtime || undefined
        : details.runtime || details.episode_run_time?.[0] || undefined;

    const results = details["watch/providers"]?.results || {};
    const preferredProviders =
      results.US ||
      results.PH ||
      Object.values(results).find(
        (entry: any) => entry?.flatrate || entry?.rent || entry?.buy
      ) ||
      {};

    const rawProviders = [
      ...(preferredProviders.flatrate || []),
      ...(preferredProviders.rent || []),
      ...(preferredProviders.buy || []),
    ];

    const providerNames = Array.from(
      new Set(
        rawProviders
          .map((provider: TMDBProvider) => normalizeProviderName(provider.provider_name))
          .filter((name): name is string => !!name)
      )
    );

    const data = { runtime, providerNames };
    homeDiscoveryMetaCache.set(cacheKey, { data, expiresAt: Date.now() + HOME_DISCOVERY_META_TTL_MS });
    return data;
  } catch {
    const data = { providerNames: [] as string[] };
    homeDiscoveryMetaCache.set(cacheKey, { data, expiresAt: Date.now() + HOME_DISCOVERY_META_TTL_MS });
    return data;
  }
}

export async function getTrendingMovies(
  timeWindow: "day" | "week" = "day",
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB(`/trending/movie/${timeWindow}?language=en-US`);
  const items = ((data.results || []) as TMDBItem[]).map(formatTMDBData);
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

export async function getTopRatedMovies(
  limit: number = 10,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/movie/top_rated?language=en-US&page=1");
  const items = ((data.results || []) as TMDBItem[]).slice(0, limit).map((m, i) => formatTMDBData(m, i));
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

export async function getPopularMovies(
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/movie/popular?language=en-US&page=1");
  const items = ((data.results || []) as TMDBItem[]).slice(0, limit).map((m, i) => formatTMDBData(m, i));
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

export async function getRegionalPopularMovies(
  region: string,
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const safeRegion = /^[A-Z]{2}$/.test(region) ? region : "PH";
  const data = await fetchFromTMDB(
    `/discover/movie?language=en-US&region=${safeRegion}&sort_by=popularity.desc&page=1&include_adult=false`
  );
  const items = ((data.results || []) as TMDBItem[]).slice(0, limit).map((m, i) => formatTMDBData(m, i));
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

export async function getNowPlayingMovies(
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/movie/now_playing?language=en-US&page=1");
  const items = ((data.results || []) as TMDBItem[]).slice(0, limit).map(formatTMDBData);
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

export async function getUpcomingMovies(
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const today = new Date().toISOString().split("T")[0];
  const [page1, page2] = await Promise.all([
    fetchFromTMDB("/movie/upcoming?language=en-US&page=1"),
    fetchFromTMDB("/movie/upcoming?language=en-US&page=2")
  ]);

  const allMovies = [...(page1.results || []), ...(page2.results || [])];
  const items = allMovies
    .filter((movie: any) => movie.release_date && movie.release_date > today)
    .sort((a: any, b: any) => a.release_date.localeCompare(b.release_date))
    .slice(0, limit)
    .map((movie: any) => {
      const formatted = formatTMDBData(movie);
      formatted.badge = formatBadgeDate(movie.release_date);
      return formatted;
    });
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

export async function getComingSoon(
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const today = new Date().toISOString().split("T")[0];
  const endDate = "2026-12-31";

  const [movieData, tvData] = await Promise.all([
    fetchFromTMDB(
      `/discover/movie?language=en-US&primary_release_date.gte=${today}&primary_release_date.lte=${endDate}&with_origin_country=US&with_original_language=en&sort_by=popularity.desc&page=1`,
      { softFailOnTimeout: true }
    ),
    fetchFromTMDB(
      `/discover/tv?language=en-US&first_air_date.gte=${today}&first_air_date.lte=${endDate}&with_origin_country=US&with_original_language=en&sort_by=popularity.desc&page=1`,
      { softFailOnTimeout: true }
    )
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

export async function getAsianSpotlight(
  region: "KR" | "JP" | "CN" | "TH" | "PH",
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const endpoints: Record<string, string> = {
    KR: "/discover/tv?with_origin_country=KR&sort_by=popularity.desc",
    JP: "/discover/movie?with_origin_country=JP&sort_by=popularity.desc",
    CN: "/discover/movie?with_origin_country=CN&sort_by=popularity.desc",
    TH: "/discover/tv?with_origin_country=TH&sort_by=popularity.desc",
    PH: "/discover/movie?with_origin_country=PH&sort_by=popularity.desc",
  };
  const data = await fetchFromTMDB(`${endpoints[region]}&language=en-US&page=1`);
  const items = ((data.results || []) as TMDBItem[]).slice(0, limit).map(formatTMDBData);
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

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

export async function searchMulti(query: string, page: number = 1): Promise<MovieCard[]> {
  if (!query) return [];
  const data = await fetchFromTMDB(`/search/multi?query=${encodeURIComponent(query)}&language=en-US&page=${page}&include_adult=false`);
  const items = (data.results || [] as TMDBItem[])
    .filter((item: TMDBItem) => item.media_type === "movie" || item.media_type === "tv")
    .map((item: TMDBItem) => formatTMDBData(item))
    .filter((item: MovieCard) => isTitleAvailable(item));
  return enrichWithTextlessPosters(items);
}

export async function searchMultiFast(query: string, page: number = 1): Promise<MovieCard[]> {
  if (!query) return [];
  const data = await fetchFromTMDB(`/search/multi?query=${encodeURIComponent(query)}&language=en-US&page=${page}&include_adult=false`);
  return (data.results || [] as TMDBItem[])
    .filter((item: TMDBItem) => item.media_type === "movie" || item.media_type === "tv")
    .map((item: TMDBItem) => formatTMDBData(item))
    .filter((item: MovieCard) => isTitleAvailable(item));
}

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

export async function discoverByGenre(genre: string, page: number = 1): Promise<MovieCard[]> {
  const key = genre.toLowerCase();

  if (key === "movie") {
    const data = await fetchFromTMDB(`/discover/movie?language=en-US&sort_by=popularity.desc&page=${page}`);
    const items = (data.results || [])
      .map((item: TMDBItem) => formatTMDBData({ ...item, media_type: "movie" }))
      .filter((item: MovieCard) => isTitleAvailable(item));
    return enrichWithTextlessPosters(items);
  }

  if (key === "series") {
    const data = await fetchFromTMDB(`/discover/tv?language=en-US&sort_by=popularity.desc&page=${page}`);
    const items = (data.results || [])
      .map((item: TMDBItem) => formatTMDBData({ ...item, media_type: "tv" }))
      .filter((item: MovieCard) => isTitleAvailable(item));
    return enrichWithTextlessPosters(items);
  }

  const ids = genreNameToIds[key];
  if (!ids) return [];

  const [movieData, tvData] = await Promise.all([
    fetchFromTMDB(`/discover/movie?language=en-US&sort_by=popularity.desc&with_genres=${ids.movie.join(",")}&page=${page}`),
    fetchFromTMDB(`/discover/tv?language=en-US&sort_by=popularity.desc&with_genres=${ids.tv.join(",")}&page=${page}`),
  ]);

  const movies = (movieData.results || []).map((item: TMDBItem) => formatTMDBData({ ...item, media_type: "movie" }));
  const tvShows = (tvData.results || []).map((item: TMDBItem) => formatTMDBData({ ...item, media_type: "tv" }));

  const combined = [...movies, ...tvShows]
    .filter((item: MovieCard) => isTitleAvailable(item))
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return enrichWithTextlessPosters(combined);
}

export async function getRecommendations(id: number, type: "movie" | "tv" = "movie"): Promise<MovieCard[]> {
  const data = await fetchFromTMDB(`/${type}/${id}/recommendations?language=en-US`);
  const items = (data.results || []).map((item: TMDBItem) => formatTMDBData({ ...item, media_type: type }));
  return enrichWithTextlessPosters(items.slice(0, 20));
}
