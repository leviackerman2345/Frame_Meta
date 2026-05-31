import type { TMDBVideo, ClipSource } from "@/types/types";

// Textless poster & general poster cache
export const textlessPosterCache = new Map<string, string | null>();

// Title logo cache
export const titleLogoCache = new Map<string, string | null>();

// Certification (age rating) cache
export const certificationCache = new Map<string, string | null>();

// Home discovery metadata cache
export const homeDiscoveryMetaCache = new Map<
  string,
  { data: { runtime?: number; providerNames: string[] }; expiresAt: number }
>();
export const HOME_DISCOVERY_META_TTL_MS = 30 * 60 * 1000;

// Collections cache
export interface CollectionsCache {
  data: any[];
  expiresAt: number;
}
export let collectionsCache: CollectionsCache | null = null;
export const COLLECTIONS_CACHE_TTL_MS = 10 * 60 * 1000;

export function setCollectionsCache(data: any[]) {
  collectionsCache = { data, expiresAt: Date.now() + COLLECTIONS_CACHE_TTL_MS };
}

// Person data caches
export interface PersonCache {
  data: any;
  expiresAt: number;
}
export const personBasicCache = new Map<string, PersonCache>();
export const personCreditsCache = new Map<string, PersonCache>();
export const PERSON_CACHE_TTL_MS = 30 * 60 * 1000;

// Video cache
export const videoCache = new Map<string, { data: TMDBVideo[]; expiresAt: number }>();
export const VIDEO_CACHE_TTL_MS = 60 * 60 * 1000;

// Popular clips cache
export const popularClipsCache = new Map<string, { data: ClipSource[]; expiresAt: number }>();
export const POPULAR_CLIPS_CACHE_TTL_MS = 10 * 60 * 1000;

export function normalizeProviderName(name?: string): string | null {
  if (!name) return null;
  const trimmed = name.trim();
  if (/^netflix$/i.test(trimmed)) return "Netflix";
  if (/disney/i.test(trimmed)) return "Disney+";
  if (/viu/i.test(trimmed)) return "Viu";
  if (/hbo|max/i.test(trimmed)) return "HBO Go";
  return trimmed;
}
