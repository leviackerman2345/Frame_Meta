import type { TMDBProvider } from "@/types/types";

interface ProviderLinkConfig {
  webUrl: (tmdbId: number, mediaType: string) => string;
  appUrl?: (tmdbId: number, mediaType: string) => string;
}

const PROVIDER_LINKS: Record<number, ProviderLinkConfig> = {
  // Netflix
  8: {
    webUrl: (id) => `https://www.netflix.com/title/${id}`,
    appUrl: (id) => `netflix://title/${id}`,
  },
  // Amazon Prime Video
  9: {
    webUrl: (id, type) =>
      type === "tv"
        ? `https://www.amazon.com/gp/video/detail/${id}`
        : `https://www.amazon.com/gp/video/detail/${id}`,
    appUrl: (id) => `aiv://aiv/resume?gti=${id}`,
  },
  // Hulu
  15: {
    webUrl: (id) => `https://www.hulu.com/movie/${id}`,
    appUrl: (id) => `hulu://movie/${id}`,
  },
  // Disney+
  337: {
    webUrl: (id) => `https://www.disneyplus.com/video/${id}`,
    appUrl: (id) => `disneyplus://video/${id}`,
  },
  // HBO Max / Max
  384: {
    webUrl: (id) => `https://play.max.com/title/${id}`,
    appUrl: (id) => `hbomax://title/${id}`,
  },
  // Apple TV+
  350: {
    webUrl: (id, type) =>
      type === "tv"
        ? `https://tv.apple.com/show/${id}`
        : `https://tv.apple.com/movie/${id}`,
    appUrl: (id, type) =>
      type === "tv"
        ? `com.apple.tv://show/${id}`
        : `com.apple.tv://movie/${id}`,
  },
  // Peacock
  386: {
    webUrl: (id) => `https://www.peacocktv.com/watch/${id}`,
  },
  // Paramount+
  531: {
    webUrl: (id) => `https://www.paramountplus.com/movies/${id}/`,
    appUrl: (id) => `paramountplus://content/${id}`,
  },
  // Crunchyroll
  283: {
    webUrl: () => `https://www.crunchyroll.com/`,
  },
  // Discovery+
  524: {
    webUrl: () => `https://www.discoveryplus.com/`,
  },
  // Starz
  49: {
    webUrl: () => `https://www.starz.com/`,
  },
  // Showtime
  37: {
    webUrl: () => `https://www.sho.com/`,
  },
  // FuboTV
  257: {
    webUrl: () => `https://www.fubo.tv/`,
  },
  // Plex
  538: {
    webUrl: () => `https://www.plex.tv/`,
  },
  // Tubi
  73: {
    webUrl: () => `https://tubitv.com/`,
  },
  // Pluto TV
  300: {
    webUrl: () => `https://pluto.tv/`,
  },
  // Vudu / Fandango at Home
  7: {
    webUrl: (id) => `https://www.vudu.com/content/movies/details/${id}`,
  },
  // Google Play Movies
  3: {
    webUrl: (id, type) =>
      type === "tv"
        ? `https://play.google.com/store/tv/show?id=${id}`
        : `https://play.google.com/store/movies/details?id=${id}`,
  },
  // Microsoft Store
  68: {
    webUrl: () => `https://www.microsoft.com/en-us/store/movies-and-tv`,
  },
  // YouTube (purchase/rent)
  192: {
    webUrl: (id) => `https://www.youtube.com/results?search_query=${id}`,
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  flatrate: "Included with subscription",
  rent: "Rent",
  buy: "Buy",
};

export function getProviderLink(
  provider: TMDBProvider,
  tmdbId: number,
  mediaType: string,
  fallbackLink?: string | null
): string {
  const config = PROVIDER_LINKS[provider.provider_id];
  if (!config) return fallbackLink || "#";
  return config.webUrl(tmdbId, mediaType);
}

export function getCategoryLabel(category?: string): string {
  if (!category) return "Watch";
  return CATEGORY_LABELS[category] || "Watch";
}

export function getCategoryColor(category?: string): string {
  switch (category) {
    case "flatrate":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    case "rent":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "buy":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
  }
}
