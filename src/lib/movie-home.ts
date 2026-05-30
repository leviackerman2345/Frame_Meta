import type { MovieCard } from "@/types/types";
import { getTitleHomeMeta } from "@/lib/tmdb";

export type HomePlatformKey = "all" | "netflix" | "disney" | "viu" | "hbo";
export type HomeDurationKey = "all" | "short" | "feature";

export const HOME_PLATFORM_MATCHES: Record<HomePlatformKey, string[]> = {
  all: [],
  netflix: ["Netflix"],
  disney: ["Disney+"],
  viu: ["Viu"],
  hbo: ["HBO Go", "HBO Max", "Max"],
};

export function normalizeHomePlatform(input?: string | null): HomePlatformKey {
  const value = (input || "all").toLowerCase();
  if (value === "netflix" || value === "disney" || value === "viu" || value === "hbo") {
    return value;
  }
  return "all";
}

export function normalizeHomeDuration(input?: string | null): HomeDurationKey {
  const value = (input || "all").toLowerCase();
  if (value === "short" || value === "feature") return value;
  return "all";
}

export async function enrichMovieCards(
  items: MovieCard[],
  type: "movie" | "tv" = "movie"
): Promise<MovieCard[]> {
  return Promise.all(
    items.map(async (item) => {
      if (item.runtime && item.providerNames?.length) return item;

      const meta = await getTitleHomeMeta(item.id, type);
      return {
        ...item,
        runtime: item.runtime ?? meta.runtime,
        providerNames: item.providerNames ?? meta.providerNames,
      };
    })
  );
}

export function filterBySubscription(
  items: MovieCard[],
  platform: HomePlatformKey
): MovieCard[] {
  if (platform === "all") return items;
  const matches = HOME_PLATFORM_MATCHES[platform];
  return items.filter((item) =>
    (item.providerNames || []).some((provider) => matches.includes(provider))
  );
}

export function filterByDuration(
  items: MovieCard[],
  duration: HomeDurationKey
): MovieCard[] {
  if (duration === "all") return items;
  return items.filter((item) => {
    const runtime = item.runtime || 0;
    if (duration === "short") return runtime > 0 && runtime < 90;
    if (duration === "feature") return runtime >= 120;
    return true;
  });
}

export function applyHomeFilters(
  items: MovieCard[],
  platform: HomePlatformKey,
  duration: HomeDurationKey
): MovieCard[] {
  return filterByDuration(filterBySubscription(items, platform), duration);
}

