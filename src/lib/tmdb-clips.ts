import type { TMDBVideo, ClipSource } from "@/types/types";
import { fetchFromTMDB, TMDBItem } from "./tmdb-client";
import { videoCache, popularClipsCache, VIDEO_CACHE_TTL_MS, POPULAR_CLIPS_CACHE_TTL_MS } from "./tmdb-cache";

const FEED_VIDEO_TYPE_PRIORITY: Record<TMDBVideo["type"], number> = {
  Clip: 5,
  Trailer: 4,
  Teaser: 3,
  Featurette: 2,
  "Behind the Scenes": 1,
  Bloopers: 0,
};

const FEED_ALLOWED_VIDEO_TYPES = new Set<TMDBVideo["type"]>([
  "Clip", "Trailer", "Teaser", "Featurette", "Behind the Scenes",
]);

type RankedClipSource = ClipSource & {
  sourceKind: "trending" | "popular";
  sourceRank: number;
  sourceScore: number;
};

function scoreFeedVideo(video: TMDBVideo): number {
  let score = FEED_VIDEO_TYPE_PRIORITY[video.type] || 0;
  if (video.official) score += 1.5;
  if (video.size >= 1080) score += 1;
  else if (video.size >= 720) score += 0.6;
  if (video.name.toLowerCase().includes("official")) score += 0.5;
  if (video.name.toLowerCase().includes("trailer")) score += 0.25;

  if (video.published_at) {
    const published = Date.parse(video.published_at);
    if (!Number.isNaN(published)) {
      const ageDays = Math.max(0, (Date.now() - published) / 86_400_000);
      score += Math.max(0, 2 - Math.min(2, ageDays / 180));
    }
  }
  return score;
}

function scoreClipSource(source: RankedClipSource): number {
  const popularityScore = Math.log1p(Math.max(source.popularity || 0, 0)) * 18;
  const sourceBoost = source.sourceKind === "trending" ? 42 : 18;
  const rankBoost = Math.max(0, 20 - source.sourceRank) * (source.sourceKind === "trending" ? 2.2 : 1.2);
  const recencyBoost =
    source.year >= new Date().getFullYear() - 1 ? 28 :
    source.year >= new Date().getFullYear() - 3 ? 14 :
    source.year >= new Date().getFullYear() - 6 ? 6 : 0;

  return popularityScore + sourceBoost + rankBoost + recencyBoost;
}

async function validateAspectRatio(youtubeId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`,
      { next: { revalidate: 86400 } }
    );
    if (!response.ok) return false;
    const data = await response.json();
    const ratio = data.width / data.height;
    const target = 16 / 9;
    const tolerance = 0.05;
    return Math.abs(ratio - target) <= tolerance;
  } catch {
    return false;
  }
}

export async function getTitleVideos(
  id: number,
  mediaType: 'movie' | 'tv'
): Promise<TMDBVideo[]> {
  const cacheKey = `video_${mediaType}_${id}`;
  const cached = videoCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) return cached.data;

  const data = await fetchFromTMDB(`/${mediaType}/${id}/videos?language=en-US`, { softFailOnTimeout: true });
  const videos: TMDBVideo[] = data.results || [];

  const filteredVideos = videos.filter(video =>
    video.site === 'YouTube' &&
    FEED_ALLOWED_VIDEO_TYPES.has(video.type) &&
    Boolean(video.key) &&
    [360, 480, 720, 1080, 1440, 2160].includes(video.size)
  );

  const validationResults = await Promise.all(
    filteredVideos.map(video => validateAspectRatio(video.key))
  );

  const validVideos = filteredVideos.filter((_, index) => validationResults[index]);

  validVideos.sort((a, b) => {
    const scoreA = scoreFeedVideo(a);
    const scoreB = scoreFeedVideo(b);
    if (scoreA !== scoreB) return scoreB - scoreA;
    return b.size - a.size;
  });

  videoCache.set(cacheKey, { data: validVideos, expiresAt: Date.now() + VIDEO_CACHE_TTL_MS });
  return validVideos;
}

export async function getPopularTitlesForClips(
  options: { page?: number; limit?: number } = {}
): Promise<ClipSource[]> {
  const page = options.page ?? 1;
  const limit = options.limit ?? 40;
  const cacheKey = `popular_clips_${page}_${limit}`;
  const cached = popularClipsCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) return cached.data;

  const [trendingRes, moviesRes, tvRes] = await Promise.all([
    fetchFromTMDB(`/trending/all/day?language=en-US&page=${page}`),
    fetchFromTMDB(`/movie/popular?language=en-US&page=${page}`),
    fetchFromTMDB(`/tv/popular?language=en-US&page=${page}`)
  ]);

  const sources: RankedClipSource[] = [];
  const trendingItems = (trendingRes.results || []) as TMDBItem[];
  const movieItems = (moviesRes.results || []) as TMDBItem[];
  const tvItems = (tvRes.results || []) as TMDBItem[];

  trendingItems.forEach((item, index: number) => {
    if (item.media_type !== "movie" && item.media_type !== "tv") return;
    sources.push({
      tmdbId: item.id,
      mediaType: item.media_type as "movie" | "tv",
      title: item.title || item.name || "",
      popularity: item.popularity || 0,
      year: item.release_date ? new Date(item.release_date).getFullYear() : item.first_air_date ? new Date(item.first_air_date).getFullYear() : 0,
      posterPath: item.poster_path || null,
      backdropPath: item.backdrop_path || null,
      genreIds: item.genre_ids || [],
      sourceKind: "trending",
      sourceRank: index,
      sourceScore: 0,
    });
  });

  movieItems.forEach((item, index: number) => {
    sources.push({
      tmdbId: item.id,
      mediaType: "movie",
      title: item.title || item.name || "",
      popularity: item.popularity || 0,
      year: item.release_date ? new Date(item.release_date).getFullYear() : 0,
      posterPath: item.poster_path || null,
      backdropPath: item.backdrop_path || null,
      genreIds: item.genre_ids || [],
      sourceKind: "popular",
      sourceRank: index,
      sourceScore: 0,
    });
  });

  tvItems.forEach((item, index: number) => {
    sources.push({
      tmdbId: item.id,
      mediaType: "tv",
      title: item.title || item.name || "",
      popularity: item.popularity || 0,
      year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : 0,
      posterPath: item.poster_path || null,
      backdropPath: item.backdrop_path || null,
      genreIds: item.genre_ids || [],
      sourceKind: "popular",
      sourceRank: index,
      sourceScore: 0,
    });
  });

  const uniqueSources = Array.from(
    new Map(
      sources.map((source) => {
        const scored = { ...source, sourceScore: scoreClipSource(source) };
        return [`${scored.mediaType}:${scored.tmdbId}`, scored] as const;
      })
    ).values()
  );

  uniqueSources.sort((a, b) => {
    if (b.sourceScore !== a.sourceScore) return b.sourceScore - a.sourceScore;
    if (a.sourceKind !== b.sourceKind) return a.sourceKind === "trending" ? -1 : 1;
    if (a.sourceRank !== b.sourceRank) return a.sourceRank - b.sourceRank;
    return b.popularity - a.popularity;
  });

  const rankedSources = uniqueSources.slice(0, limit);
  popularClipsCache.set(cacheKey, { data: rankedSources, expiresAt: Date.now() + POPULAR_CLIPS_CACHE_TTL_MS });
  return rankedSources;
}
