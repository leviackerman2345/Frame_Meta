import type { MovieCard } from "@/types/types";
import { fetchFromTMDB, formatTMDBData, TMDBItem } from "./tmdb-client";
import { enrichWithTextlessPosters, enrichWithLogos } from "./tmdb-enrichment";

export async function getPopularTVSeries(
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/tv/popular?language=en-US&page=1");
  const items = ((data.results || []) as TMDBItem[]).slice(0, limit).map((tv, i) => formatTMDBData(tv, i));
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

export async function getOnTheAirTVSeries(
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/tv/on_the_air?language=en-US&page=1");
  const items = ((data.results || []) as TMDBItem[]).slice(0, limit).map(formatTMDBData);
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

export async function getTrendingTVSeries(
  timeWindow: "day" | "week" = "day",
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB(`/trending/tv/${timeWindow}?language=en-US`);
  const items = ((data.results || []) as TMDBItem[]).map(formatTMDBData);
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

export async function getTopRatedTVSeries(
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/tv/top_rated?language=en-US&page=1");
  const items = ((data.results || []) as TMDBItem[]).slice(0, limit).map((tv, i) => formatTMDBData(tv, i));
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

export async function getTVAnime(
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB(
    "/discover/tv?with_origin_country=JP&with_genres=16&sort_by=popularity.desc&language=en-US&page=1"
  );
  const items = ((data.results || []) as TMDBItem[]).slice(0, limit).map(formatTMDBData);
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

export async function getRegionalPopularTVSeries(
  region: string,
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const safeRegion = /^[A-Z]{2}$/.test(region) ? region : "PH";
  const data = await fetchFromTMDB(
    `/discover/tv?with_origin_country=${safeRegion}&sort_by=popularity.desc&language=en-US&page=1`
  );
  const items = ((data.results || []) as TMDBItem[]).slice(0, limit).map(formatTMDBData);
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}

export async function getTVByGenre(
  genreId: number,
  limit: number = 20,
  includeLogos: boolean = false
): Promise<MovieCard[]> {
  const data = await fetchFromTMDB(
    `/discover/tv?with_genres=${genreId}&sort_by=popularity.desc&language=en-US&page=1`
  );
  const items = ((data.results || []) as TMDBItem[]).slice(0, limit).map(formatTMDBData);
  const posters = await enrichWithTextlessPosters(items);
  return includeLogos ? enrichWithLogos(posters) : posters;
}
