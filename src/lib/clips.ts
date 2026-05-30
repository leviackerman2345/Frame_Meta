"use server";

import { FALLBACK_CLIPS } from "@/constants/clips";
import { Clip, ClipSource, TMDBVideo } from "@/types/types";
import {
  getPopularTitlesForClips,
  getTitleCertification,
  getTitleVideos,
  getTMDBImageUrl,
} from "@/lib/tmdb";

const SOURCE_LIMIT_MULTIPLIER = 4;
const MIN_SOURCE_POOL = 24;

const VIDEO_TYPE_PRIORITY: Record<TMDBVideo["type"], number> = {
  Clip: 5,
  Trailer: 4,
  Teaser: 3,
  Featurette: 2,
  "Behind the Scenes": 1,
  Bloopers: 0,
};

type RankedClip = Clip & {
  score: number;
  sourceScore: number;
  videoScore: number;
  tieBreaker: number;
};

function deriveCategory(genreIds: number[]): Clip["category"] {
  const genreMap: Record<number, Clip["category"]> = {
    28: "action",
    12: "action",
    35: "comedy",
    18: "drama",
    27: "horror",
    878: "scifi",
    16: "animation",
    53: "thriller",
    80: "thriller",
    9648: "thriller",
  };

  for (const id of genreIds) {
    if (genreMap[id]) return genreMap[id];
  }
  return "drama";
}

function deriveTag(video: TMDBVideo): string[] {
  const tags: string[] = [];
  const typeTag = video.type.toLowerCase().replace(/\s+/g, "-");
  tags.push(typeTag);
  if (video.official) tags.push("official");
  if (video.size >= 1080) tags.push("hd");
  if (video.official && video.type === "Trailer") tags.push("iconic");
  return tags;
}

function normalizeTitleKey(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function hashToUnit(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function scoreVideo(video: TMDBVideo): number {
  let score = VIDEO_TYPE_PRIORITY[video.type] || 0;

  if (video.official) score += 1.5;
  if (video.size >= 1080) score += 1;
  else if (video.size >= 720) score += 0.6;
  if (video.name.toLowerCase().includes("official")) score += 0.5;
  if (video.name.toLowerCase().includes("trailer")) score += 0.25;

  if (video.published_at) {
    const publishedAt = Date.parse(video.published_at);
    if (!Number.isNaN(publishedAt)) {
      const ageDays = Math.max(0, (Date.now() - publishedAt) / 86_400_000);
      score += Math.max(0, 2 - Math.min(2, ageDays / 180));
    }
  }

  return score;
}

function pickBestVideo(videos: TMDBVideo[]): TMDBVideo | null {
  if (videos.length === 0) return null;

  return [...videos].sort((a, b) => {
    const scoreA = scoreVideo(a);
    const scoreB = scoreVideo(b);
    if (scoreA !== scoreB) return scoreB - scoreA;
    return b.size - a.size;
  })[0];
}

function scoreClip(clip: Clip, source: ClipSource, video: TMDBVideo, page: number): number {
  const sourceScore = source.sourceScore ?? 0;
  const sourceKindBoost = source.sourceKind === "trending" ? 18 : 8;
  const sourceAgeBoost = source.year >= new Date().getFullYear() - 1 ? 12 : source.year >= new Date().getFullYear() - 3 ? 6 : 0;
  const popularityBoost = Math.log1p(Math.max(clip.popularity || 0, 0)) * 4;
  const videoBoost = scoreVideo(video) * 10;
  const pageNoise = hashToUnit(`${page}:${clip.id}:${video.id}`) * 2;

  return sourceScore + sourceKindBoost + sourceAgeBoost + popularityBoost + videoBoost + pageNoise;
}

function rebalanceClips(clips: RankedClip[], page: number): RankedClip[] {
  const pool = [...clips].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.tieBreaker - a.tieBreaker;
  });

  const output: RankedClip[] = [];

  while (pool.length > 0) {
    let bestIndex = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < pool.length; i++) {
      const candidate = pool[i];
      let adjusted = candidate.score + candidate.tieBreaker;
      const prev = output[output.length - 1];
      const prev2 = output[output.length - 2];

      if (prev) {
        if (candidate.category === prev.category) adjusted -= 8;
        if (candidate.mediaType === prev.mediaType) adjusted -= 5;
      }

      if (prev2) {
        if (candidate.category === prev.category && candidate.category === prev2.category) {
          adjusted -= 4;
        }
        if (candidate.mediaType === prev.mediaType && candidate.mediaType === prev2.mediaType) {
          adjusted -= 3;
        }
      }

      adjusted += hashToUnit(`${page}:${candidate.id}:${output.length}`) * 0.5;

      if (adjusted > bestScore) {
        bestScore = adjusted;
        bestIndex = i;
      }
    }

    output.push(pool.splice(bestIndex, 1)[0]);
  }

  return output;
}

function getFallbackClips(category: Clip["category"] | "all", page: number, limit: number): Clip[] {
  let clips = FALLBACK_CLIPS as Clip[];
  if (category !== "all") {
    clips = clips.filter((clip) => clip.category === category);
  }
  const start = page * limit;
  return clips.slice(start, start + limit);
}

export async function getClipFeed(options?: {
  page?: number;
  category?: Clip["category"] | "all";
  limit?: number;
}): Promise<Clip[]> {
  const page = options?.page ?? 0;
  const category = options?.category ?? "all";
  const limit = options?.limit ?? 10;

  try {
    const tmdbPage = Math.max(1, page + 1);
    const sourceLimit = Math.max(limit * SOURCE_LIMIT_MULTIPLIER, MIN_SOURCE_POOL);
    const sources = await getPopularTitlesForClips({ page: tmdbPage, limit: sourceLimit });

    const rankedClips = await Promise.all(
      sources.map(async (source) => {
        const [videos, certification] = await Promise.all([
          getTitleVideos(source.tmdbId, source.mediaType),
          getTitleCertification(source.tmdbId, source.mediaType),
        ]);

        const bestVideo = pickBestVideo(videos);
        if (!bestVideo) return null;

        const clip: Clip = {
          id: `${source.tmdbId}-${bestVideo.id}`,
          tmdbId: source.tmdbId,
          title: source.title,
          description: bestVideo.name || source.title,
          youtubeId: bestVideo.key,
          thumbnailUrl: source.backdropPath ? getTMDBImageUrl(source.backdropPath, "w780") : `https://img.youtube.com/vi/${bestVideo.key}/maxresdefault.jpg`,
          category: deriveCategory(source.genreIds),
          mediaType: source.mediaType,
          year: source.year,
          popularity: source.popularity,
          tags: deriveTag(bestVideo),
          duration: 0,
          posterPath: source.posterPath ? getTMDBImageUrl(source.posterPath, "w500") : null,
          certification,
        };

        const scoredClip: RankedClip = {
          ...clip,
          score: scoreClip(clip, source, bestVideo, page),
          sourceScore: source.sourceScore ?? 0,
          videoScore: scoreVideo(bestVideo),
          tieBreaker: hashToUnit(`${page}:${clip.id}:${bestVideo.id}`),
        };

        return scoredClip;
      })
    );

    const validClips = rankedClips.filter((clip): clip is RankedClip => clip !== null);
    if (validClips.length === 0) {
      return getFallbackClips(category, page, limit);
    }

    const bestByTitle = new Map<string, RankedClip>();
    for (const clip of validClips) {
      const key = normalizeTitleKey(clip.title);
      const existing = bestByTitle.get(key);
      if (!existing || clip.score > existing.score || (clip.score === existing.score && clip.tieBreaker > existing.tieBreaker)) {
        bestByTitle.set(key, clip);
      }
    }

    const sortedClips = rebalanceClips(Array.from(bestByTitle.values()), page);
    const filteredClips = category === "all" ? sortedClips : sortedClips.filter((clip) => clip.category === category);
    return filteredClips.slice(page * limit, page * limit + limit);
  } catch (error) {
    console.warn("[clips] TMDB fetch failed, using static fallback clips.", error);
    return getFallbackClips(category, page, limit);
  }
}

export async function getTotalClips(category?: Clip["category"] | "all"): Promise<number> {
  try {
    return 1000;
  } catch {
    const cat = category ?? "all";
    if (cat === "all") return FALLBACK_CLIPS.length;
    return FALLBACK_CLIPS.filter((clip) => clip.category === cat).length;
  }
}
