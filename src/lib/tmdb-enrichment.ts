import type { MovieCard } from "@/types/types";
import { fetchFromTMDB, getTMDBImageUrl } from "./tmdb-client";
import { textlessPosterCache, titleLogoCache } from "./tmdb-cache";

export async function mapWithConcurrency<T, R>(
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
      } catch {
        results[current] = items[current] as unknown as R;
      }
    }
  });

  await Promise.all(workers);
  return results;
}

export async function getTextlessPosterUrl(
  id: number,
  type: "movie" | "tv" = "movie"
): Promise<string | null> {
  if (type !== "movie" && type !== "tv") return null;
  const cacheKey = `${type}-${id}`;
  if (textlessPosterCache.has(cacheKey)) {
    return textlessPosterCache.get(cacheKey)!;
  }

  try {
    const data = await fetchFromTMDB(`/${type}/${id}/images?include_image_language=null`);
    const posters = data.posters || [];
    if (posters.length === 0) {
      textlessPosterCache.set(cacheKey, null);
      return null;
    }

    const best = posters.sort((a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0))[0];
    const posterUrl = getTMDBImageUrl(best.file_path, "w780");
    textlessPosterCache.set(cacheKey, posterUrl);
    return posterUrl;
  } catch (error) {
    console.error(`Failed to fetch textless poster for ${type} ${id}:`, error);
    return null;
  }
}

export async function getAnyPosterUrl(
  id: number,
  type: "movie" | "tv" = "movie"
): Promise<string | null> {
  if (type !== "movie" && type !== "tv") return null;
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

    const best = posters.sort((a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0))[0];
    const posterUrl = getTMDBImageUrl(best.file_path, "w780");
    textlessPosterCache.set(cacheKey, posterUrl);
    return posterUrl;
  } catch (error) {
    console.error(`Failed to fetch any poster for ${type} ${id}:`, error);
    return null;
  }
}

export async function getTitleLogo(id: number, type: "movie" | "tv" | "collection" = "movie"): Promise<string | null> {
  if (type !== "movie" && type !== "tv" && type !== "collection") return null;
  const cacheKey = `logo-${type}-${id}`;
  if (titleLogoCache.has(cacheKey)) {
    return titleLogoCache.get(cacheKey)!;
  }

  try {
    const data = await fetchFromTMDB(`/${type}/${id}/images?include_image_language=en,null`);
    let logos = data.logos || [];

    if (logos.length === 0) {
      const allImages = await fetchFromTMDB(`/${type}/${id}/images`);
      logos = allImages.logos || [];
    }

    if (logos.length === 0) {
      titleLogoCache.set(cacheKey, null);
      return null;
    }

    const englishLogo = logos.find((l: any) => l.iso_639_1 === "en") || logos[0];
    const logoUrl = getTMDBImageUrl(englishLogo.file_path, "original");
    titleLogoCache.set(cacheKey, logoUrl);
    return logoUrl;
  } catch (error) {
    console.error(`Failed to fetch logo for ${type} ${id}:`, error);
    return null;
  }
}

export async function enrichWithTextlessPosters(items: MovieCard[]): Promise<MovieCard[]> {
  return mapWithConcurrency(items, 5, async (item) => {
    const mediaType: "movie" | "tv" = item.genre?.includes("Series") ? "tv" : "movie";

    let finalPoster = await getTextlessPosterUrl(item.id, mediaType);
    if (!finalPoster && (!item.posterUrl || item.posterUrl.includes('placeholder'))) {
      finalPoster = await getAnyPosterUrl(item.id, mediaType);
    }
    if (!finalPoster && (!item.posterUrl || item.posterUrl.includes('placeholder'))) {
      finalPoster = item.backdropUrl || null;
    }

    if (finalPoster) {
      return { ...item, originalPosterUrl: item.posterUrl, posterUrl: finalPoster };
    }
    return item;
  });
}

export async function enrichWithLogos(items: MovieCard[]): Promise<MovieCard[]> {
  return mapWithConcurrency(items, 6, async (item) => {
    if (item.logoUrl !== undefined) return item;
    const mediaType: "movie" | "tv" = item.genre?.includes("Series") ? "tv" : "movie";
    const logoUrl = await getTitleLogo(item.id, mediaType);
    return { ...item, logoUrl: logoUrl || undefined };
  });
}
