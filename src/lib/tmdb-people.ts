import { fetchFromTMDB } from "./tmdb-client";
import { personBasicCache, personCreditsCache, PERSON_CACHE_TTL_MS } from "./tmdb-cache";

export async function getPersonBasicInfo(personId: string | number) {
  const key = String(personId);
  const cached = personBasicCache.get(key);
  if (cached && Date.now() < cached.expiresAt) return cached.data;

  const endpoint = `/person/${personId}?language=en-US&append_to_response=external_ids,images`;
  const data = await fetchFromTMDB(endpoint, { next: { revalidate: 3600 } } as any);
  if (data?.id) {
    personBasicCache.set(key, { data, expiresAt: Date.now() + PERSON_CACHE_TTL_MS });
  }
  return data;
}

export async function getPersonCredits(personId: string | number) {
  const key = String(personId);
  const cached = personCreditsCache.get(key);
  if (cached && Date.now() < cached.expiresAt) return cached.data;

  const [movieCredits, tvCredits] = await Promise.all([
    fetchFromTMDB(`/person/${personId}/movie_credits?language=en-US`, { next: { revalidate: 3600 } } as any),
    fetchFromTMDB(`/person/${personId}/tv_credits?language=en-US`, { next: { revalidate: 3600 } } as any),
  ]);
  const result = { movieCredits, tvCredits };
  if (movieCredits?.cast || tvCredits?.cast) {
    personCreditsCache.set(key, { data: result, expiresAt: Date.now() + PERSON_CACHE_TTL_MS });
  }
  return result;
}

/**
 * @deprecated Use getPersonBasicInfo + getPersonCredits for better performance.
 */
export async function getPersonDetails(personId: string | number) {
  const endpoint = `/person/${personId}?language=en-US&append_to_response=movie_credits,tv_credits,external_ids,images`;
  return fetchFromTMDB(endpoint);
}

export async function getTrendingPeople(limit: number = 20): Promise<any[]> {
  try {
    const data = await fetchFromTMDB(`/trending/person/day?language=en-US`);
    return (data.results || []).slice(0, limit);
  } catch (error) {
    console.error("Failed to fetch trending people:", error);
    return [];
  }
}

export async function getPopularPeople(limit: number = 20): Promise<any[]> {
  try {
    const data = await fetchFromTMDB(`/person/popular?language=en-US&page=1`);
    return (data.results || []).slice(0, limit);
  } catch (error) {
    console.error("Failed to fetch popular people:", error);
    return [];
  }
}
