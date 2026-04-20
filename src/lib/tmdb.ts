import { MovieCard } from "@/types/types";

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p";

if (!TMDB_ACCESS_TOKEN) {
  console.warn("TMDB_ACCESS_TOKEN is not defined in environment variables.");
}

async function fetchFromTMDB(endpoint: string, options: RequestInit = {}) {
  const url = `${TMDB_BASE_URL}${endpoint}`;
  
  const headers = {
    accept: "application/json",
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
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
 * Fetch trending movies for the day or week.
 */
export async function getTrendingMovies(timeWindow: "day" | "week" = "day") {
  return fetchFromTMDB(`/trending/movie/${timeWindow}?language=en-US`);
}

/**
 * Fetch details for a specific movie.
 */
export async function getMovieDetails(movieId: number) {
  return fetchFromTMDB(`/movie/${movieId}?language=en-US`);
}

/**
 * Helper to format raw TMDB data into MovieCard type.
 */
function formatTMDBData(item: any, index?: number): MovieCard {
  return {
    id: item.id,
    title: item.title || item.name,
    rank: index !== undefined ? index + 1 : undefined,
    rating: Math.round(item.vote_average * 10) / 10,
    genre: item.media_type === "tv" || item.first_air_date ? "Series" : "Movie",
    year: new Date(item.release_date || item.first_air_date).getFullYear(),
    posterUrl: getTMDBImageUrl(item.poster_path, "w500"),
    badge: item.vote_average > 8 ? "Must Watch" : undefined,
    releaseDate: item.release_date || item.first_air_date,
  };
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
  return data.results.slice(0, 10).map((movie: any, index: number) => formatTMDBData(movie, index));
}

/**
 * Fetch popular movies and format them as MovieCards.
 */
export async function getPopularMovies(limit: number = 20): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/movie/popular?language=en-US&page=1");
  return data.results.slice(0, limit).map((movie: any, index: number) => formatTMDBData(movie, index));
}

/**
 * Fetch popular TV series and format them as MovieCards.
 */
export async function getPopularTVSeries(limit: number = 20): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/tv/popular?language=en-US&page=1");
  return data.results.slice(0, limit).map((tv: any, index: number) => formatTMDBData(tv, index));
}

/**
 * Fetch "Now Playing" movies for the Featured section.
 */
export async function getNowPlayingMovies(limit: number = 20): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/movie/now_playing?language=en-US&page=1");
  return data.results.slice(0, limit).map((movie: any) => formatTMDBData(movie));
}

/**
 * Fetch "On The Air" TV series for the Featured section.
 */
export async function getOnTheAirTVSeries(limit: number = 20): Promise<MovieCard[]> {
  const data = await fetchFromTMDB("/tv/on_the_air?language=en-US&page=1");
  return data.results.slice(0, limit).map((tv: any) => formatTMDBData(tv));
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
  
  return allMovies
    .filter((movie: any) => movie.release_date && movie.release_date > today) // Strictly future releases
    .sort((a: any, b: any) => a.release_date.localeCompare(b.release_date)) // Soonest first
    .slice(0, limit)
    .map((movie: any) => {
      const formatted = formatTMDBData(movie);
      formatted.badge = formatBadgeDate(movie.release_date);
      return formatted;
    });
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
  
  return allContent
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
  return data.results.slice(0, limit).map((item: any) => formatTMDBData(item));
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
  
  const trending = await getTrendingMovies("week");
  const sample = trending.results.slice(0, 40);
  
  const detailsPromises = sample.map((m: any) => getMovieDetails(m.id).catch(() => null));
  const detailedMovies = await Promise.all(detailsPromises);

  detailedMovies.forEach((m: any) => {
    if (m && m.belongs_to_collection) {
      collectionIds.add(m.belongs_to_collection.id);
    }
  });

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
