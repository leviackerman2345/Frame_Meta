import { 
  featuredMovies, 
  featuredSeries, 
  top10Movies, 
  top10Series, 
  newReleasesThisWeek, 
  newReleasesThisMonth, 
  asianSpotlightKorean, 
  asianSpotlightJapanese, 
  collectionsData, 
  comingSoonData 
} from "@/config/site-content";
import { MovieCard } from "@/types/types";
import { isTitleAvailable } from "./tmdb";

/**
 * Aggregates all movie and series data into a single catalog.
 * We normalize the data to ensure they all follow the MovieCard interface.
 */
export const getAllTitles = (): MovieCard[] => {
  const allTitles: MovieCard[] = [
    ...featuredMovies.map(m => ({ ...m, type: 'movie' as const })),
    ...featuredSeries.map(s => ({ ...s, type: 'series' as const })),
    ...top10Movies.map(m => ({ ...m, type: 'movie' as const })),
    ...top10Series.map(s => ({ ...s, type: 'series' as const })),
    ...newReleasesThisWeek.map(m => ({ ...m, type: 'movie' as const })),
    ...newReleasesThisMonth.map(m => ({ ...m, type: 'movie' as const })),
    ...asianSpotlightKorean.map(m => ({ ...m, type: 'movie' as const })),
    ...asianSpotlightJapanese.map(m => ({ ...m, type: 'movie' as const })),
    ...comingSoonData.map(m => ({ ...m, type: 'movie' as const })),
  ];

  // For collections, we might want to treat them differently or extract titles
  // For now, let's just use the individual items.

  // Remove duplicates by ID (if any) and filter by availability
  const seenIds = new Set<number>();
  return allTitles.filter(title => {
    if (seenIds.has(title.id)) return false;
    seenIds.add(title.id);
    return isTitleAvailable(title);
  });
};

/**
 * Get all unique genres from the catalog
 */
export const getUniqueGenres = (): string[] => {
  const titles = getAllTitles();
  const genres = new Set<string>();
  titles.forEach(title => {
    if (title.genre) {
      // Handle multiple genres if they are comma/slash separated
      const splitGenres = title.genre.split(/[,\/]/).map(g => g.trim());
      splitGenres.forEach(g => genres.add(g));
    }
  });
  return Array.from(genres).sort();
};

/**
 * Search titles by query
 */
export const searchTitles = (query: string): MovieCard[] => {
  if (!query || query.length < 2) return [];
  const titles = getAllTitles();
  const lowerQuery = query.toLowerCase();
  
  return titles.filter(title => 
    title.title?.toLowerCase().includes(lowerQuery) || 
    title.genre?.toLowerCase().includes(lowerQuery) ||
    title.studio?.toLowerCase().includes(lowerQuery)
  );
};
