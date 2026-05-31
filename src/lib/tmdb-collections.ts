import type { CollectionData, TMDBCastMember, TMDBCrewMember } from "@/types/types";
import { fetchFromTMDB, formatTMDBData, formatBadgeDate, getTMDBImageUrl, getMovieDetails, genreMap, TMDBItem } from "./tmdb-client";
import { enrichWithTextlessPosters, enrichWithLogos, getTitleLogo, mapWithConcurrency } from "./tmdb-enrichment";
import { collectionsCache, setCollectionsCache, COLLECTIONS_CACHE_TTL_MS } from "./tmdb-cache";
import { getTitleFullDetails } from "./tmdb-client";

export async function getCollectionDetails(collectionId: number) {
  return fetchFromTMDB(`/collection/${collectionId}?language=en-US`);
}

export async function getUniverseByKeyword(keywordId: number) {
  const [movies, tv] = await Promise.all([
    fetchFromTMDB(`/discover/movie?with_keywords=${keywordId}&language=en-US&sort_by=popularity.desc`),
    fetchFromTMDB(`/discover/tv?with_keywords=${keywordId}&language=en-US&sort_by=popularity.desc`)
  ]);
  const allParts = [...(movies.results || []), ...(tv.results || [])];
  return {
    id: keywordId,
    name: "",
    overview: allParts[0]?.overview || "",
    backdrop_path: allParts[0]?.backdrop_path || "",
    parts: allParts
  };
}

export async function getDiscoverableCollections(limit: number | null = 15): Promise<any[]> {
  const now = Date.now();
  if (collectionsCache && now < collectionsCache.expiresAt) {
    const cached = collectionsCache.data;
    return limit ? cached.slice(0, limit) : cached;
  }

  const masterUniverses = [
    { id: 180547, name: "Marvel Cinematic Universe" },
    { id: 229266, name: "DC Extended Universe" }
  ];
  const masterUniverseIds = new Set(masterUniverses.map(u => u.id));

  const collectionIds = new Set<number>([
    10, 1241, 645, 119, 404609, 86311, 230, 9485, 295, 328, 2344, 133352,
    1570, 115575, 131292, 131295, 33514, 8650, 284433, 31562, 1709, 131635,
    86055, 2150, 86066, 89137, 8354, 1575, 556, 125574, 2602, 9735, 313086,
    91361, 422834, 618529, 77816, 553717, 2326, 5547, 8945,
  ]);

  try {
    const generalPromises = [1, 2, 3].flatMap(page => [
      fetchFromTMDB(`/trending/movie/week?language=en-US&page=${page}`),
      fetchFromTMDB(`/movie/popular?language=en-US&page=${page}`),
    ]);

    const topGenres = [28, 12, 16, 14, 878, 27];
    const genrePromises = topGenres.flatMap(genreId =>
      [1, 2, 3, 4].map(page =>
        fetchFromTMDB(`/discover/movie?language=en-US&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`)
      )
    );

    const allDiscoveryData = await Promise.all([...generalPromises, ...genrePromises]);
    const allResults = allDiscoveryData.flatMap(d => d.results || []);

    const uniqueMovies = Array.from(new Map(allResults.map((m: any) => [m.id, m])).values());
    const detailedMovies = await mapWithConcurrency(
      uniqueMovies.slice(0, 300), 20,
      (m: any) => getMovieDetails(m.id).catch(() => null)
    );

    detailedMovies.forEach((m: any) => {
      if (m && m.belongs_to_collection) {
        collectionIds.add(m.belongs_to_collection.id);
      }
    });
  } catch (e) {
    console.warn("[Collections] Discovery phase failed (using seed list only):", e);
  }

  const universePromises = masterUniverses.map(u => getUniverseByKeyword(u.id));
  const uniqueIds = Array.from(collectionIds);
  const collectionDetails = await mapWithConcurrency(
    uniqueIds, 15,
    (id: number) => getCollectionDetails(id).catch(() => null)
  );

  const [universes] = await Promise.all([Promise.all(universePromises)]);

  const overrides: Record<number, string> = {
    180547: "Marvel Cinematic Universe",
    229266: "DC Extended Universe",
    10: "Star Wars Saga",
    1241: "Harry Potter Collection",
    645: "James Bond Anthology",
    119: "The Lord of the Rings",
    404609: "John Wick Collection",
    403374: "Jack Reacher Collection",
    72688: "The Hunger Games",
  };

  const today = new Date().toISOString().split("T")[0];

  const formattedUniverses = universes.map((u) => {
    const releasedParts = u.parts.filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) <= today);
    const upcomingParts = u.parts.filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) > today);
    const allGenreIds = u.parts.flatMap((p: any) => p.genre_ids || []);
    const genreCounts: Record<number, number> = {};
    allGenreIds.forEach((id: number) => { genreCounts[id] = (genreCounts[id] || 0) + 1; });
    const topGenreId = Object.keys(genreCounts).sort((a: any, b: any) => genreCounts[b] - genreCounts[a])[0];
    const detectedGenre = genreMap[Number(topGenreId)] || "Universe";

    return {
      id: u.id,
      title: overrides[u.id] || u.name,
      description: u.overview,
      badge: `${releasedParts.length}+ TITLES`,
      backdropUrl: getTMDBImageUrl(u.backdrop_path, "original"),
      logoUrl: undefined as string | undefined | null,
      rating: releasedParts.length > 0 ? Math.round((releasedParts.reduce((acc: number, p: any) => acc + (p.vote_average || 0), 0) / releasedParts.length) * 10) / 10 : 0,
      year: releasedParts[0]?.release_date ? new Date(releasedParts[0].release_date).getFullYear() : undefined,
      genre: detectedGenre,
      popularity: releasedParts.length > 0 ? releasedParts.reduce((acc: number, p: any) => acc + (p.popularity || 0), 0) / releasedParts.length : 0,
      isAnticipated: upcomingParts.length > 0
    };
  });

  const formattedCollections = collectionDetails
    .filter((c): c is any => c != null && Array.isArray(c.parts))
    .map((c) => {
      const releasedParts = c.parts.filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) <= today);
      const upcomingParts = c.parts.filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) > today);
      if (releasedParts.length < 2) return null;

      const allGenreIds = c.parts.flatMap((p: any) => p.genre_ids || []);
      const genreCounts: Record<number, number> = {};
      allGenreIds.forEach((id: number) => { genreCounts[id] = (genreCounts[id] || 0) + 1; });
      const topGenreId = Object.keys(genreCounts).sort((a: any, b: any) => genreCounts[b] - genreCounts[a])[0];
      const detectedGenre = genreMap[Number(topGenreId)] || "Franchise";

      return {
        id: c.id,
        title: overrides[c.id] || c.name,
        description: c.overview,
        badge: `${releasedParts.length} MOVIES`,
        backdropUrl: getTMDBImageUrl(c.backdrop_path || c.parts[0]?.backdrop_path, "original"),
        logoUrl: undefined as string | undefined | null,
        rating: releasedParts.length > 0 ? Math.round((releasedParts.reduce((acc: number, p: any) => acc + (p.vote_average || 0), 0) / releasedParts.length) * 10) / 10 : 0,
        year: releasedParts[0]?.release_date ? new Date(releasedParts[0].release_date).getFullYear() : undefined,
        genre: detectedGenre,
        popularity: c.parts.reduce((acc: number, p: any) => acc + (p.popularity || 0), 0) / c.parts.length,
        isAnticipated: upcomingParts.length > 0
      };
    })
    .filter((c): c is any => c !== null);

  const sorted = [...formattedUniverses, ...formattedCollections]
    .sort((a, b) => b.popularity - a.popularity);

  const withLogos = await mapWithConcurrency(sorted, 8, async (item: any) => {
    if (masterUniverseIds.has(item.id)) return { ...item, logoUrl: null };
    const logoUrl = await getTitleLogo(item.id, "collection").catch(() => null);
    return { ...item, logoUrl };
  });

  setCollectionsCache(withLogos);
  console.log(`[Collections] Cached ${withLogos.length} collections for 10 minutes.`);
  return limit ? withLogos.slice(0, limit) : withLogos;
}

export async function getCollectionOrUniverseDetails(id: string): Promise<CollectionData | null> {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;

  const masterUniverses: Record<number, string> = {
    180547: "Marvel Cinematic Universe",
    229266: "DC Extended Universe",
    10: "Star Wars Saga",
    1241: "Harry Potter Collection",
    645: "James Bond Anthology",
    119: "The Lord of the Rings",
    403374: "John Wick Collection"
  };

  const isUniverse = [180547, 229266].includes(numericId);
  let rawData: any;
  let title = masterUniverses[numericId] || "";
  let highQualityBackdropPath: string | null = null;

  if (isUniverse) {
    rawData = await getUniverseByKeyword(numericId);
    title = title || rawData.name;
  } else {
    const [details, images] = await Promise.all([
      getCollectionDetails(numericId),
      fetchFromTMDB(`/collection/${numericId}/images`).catch(() => ({ backdrops: [] }))
    ]);
    rawData = details;
    title = title || rawData.name;

    if (images.backdrops && images.backdrops.length > 0) {
      const best = images.backdrops.sort((a: any, b: any) => {
        const scoreA = (a.width || 0) * (a.vote_average || 0);
        const scoreB = (b.width || 0) * (b.vote_average || 0);
        return scoreB - scoreA;
      })[0];
      highQualityBackdropPath = best.file_path;
    }
  }

  if (!rawData || !rawData.parts) return null;

  const today = new Date().toISOString().split("T")[0];

  const partsItems = rawData.parts
    .filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) <= today)
    .sort((a: any, b: any) => (a.release_date || a.first_air_date).localeCompare(b.release_date || b.first_air_date))
    .map((p: any) => formatTMDBData({ ...p, media_type: p.media_type || (isUniverse ? (p.first_air_date ? "tv" : "movie") : "movie") }));

  const enrichedParts = await enrichWithTextlessPosters(partsItems);

  const upcomingPartsRaw = rawData.parts
    .filter((p: any) => (p.release_date || p.first_air_date) && (p.release_date || p.first_air_date) > today)
    .sort((a: any, b: any) => (a.release_date || a.first_air_date).localeCompare(b.release_date || b.first_air_date))
    .map((p: any) => {
      const formatted = formatTMDBData({ ...p, media_type: p.media_type || (isUniverse ? (p.first_air_date ? "tv" : "movie") : "movie") });
      formatted.badge = formatBadgeDate(p.release_date || p.first_air_date);
      return formatted;
    });

  const enrichedComingSoon = await enrichWithTextlessPosters(upcomingPartsRaw);

  const averageRating = rawData.parts.reduce((acc: number, p: any) => acc + (p.vote_average || 0), 0) / (rawData.parts.length || 1);
  const rating = Math.round(averageRating * 10) / 10;

  const sortedDates = enrichedParts
    .map(p => p.year)
    .filter((y): y is number => y !== undefined)
    .sort((a, b) => a - b);

  const yearSpan = sortedDates.length > 0
    ? (sortedDates[0] === sortedDates[sortedDates.length - 1]
      ? `${sortedDates[0]}`
      : `${sortedDates[0]} - ${sortedDates[sortedDates.length - 1]}`)
    : "";

  const uniqueGenres = Array.from(new Set(enrichedParts.map(p => p.genre).filter(Boolean))) as string[];
  const topGenres = uniqueGenres.slice(0, 3);

  let logoUrl = await getTitleLogo(numericId, isUniverse ? "movie" : "collection");
  if (!logoUrl && rawData.parts && rawData.parts[0]) {
    logoUrl = await getTitleLogo(rawData.parts[0].id, rawData.parts[0].media_type || "movie");
  }

  const fullParts = await mapWithConcurrency(rawData.parts, 12, async (p: any) => {
    const type = p.media_type || (isUniverse ? (p.first_air_date ? "tv" : "movie") : "movie");
    try {
      return await getTitleFullDetails(p.id, type as "movie" | "tv");
    } catch {
      return p;
    }
  });

  const totalRuntimeMin = fullParts.reduce((acc: number, p: any) => acc + (p.runtime || (p.episode_run_time ? p.episode_run_time[0] : 0) || 0), 0);
  const totalRevenueVal = fullParts.reduce((acc: number, p: any) => acc + (p.revenue || 0), 0);

  const hours = Math.floor(totalRuntimeMin / 60);
  const minutes = totalRuntimeMin % 60;
  const totalRuntime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const totalRevenue = totalRevenueVal > 0 ? `$${(totalRevenueVal / 1000000000).toFixed(1)}B` : "N/A";

  const castMap = new Map<number, { person: TMDBCastMember; count: number; characters: Set<string>; popularity: number }>();
  fullParts.forEach((part: any) => {
    (part.credits?.cast || []).slice(0, 15).forEach((actor: any) => {
      const existing = castMap.get(actor.id);
      if (existing) {
        existing.count += 1;
        if (actor.character) existing.characters.add(actor.character);
      } else {
        castMap.set(actor.id, { person: actor, count: 1, characters: new Set(actor.character ? [actor.character] : []), popularity: actor.popularity || 0 });
      }
    });
  });

  const aggregatedCast = Array.from(castMap.values())
    .map(item => ({
      ...item.person,
      appearanceCount: item.count,
      allCharacters: Array.from(item.characters),
      character: Array.from(item.characters).slice(0, 2).join(" • ")
    }))
    .sort((a, b) => b.appearanceCount !== a.appearanceCount ? b.appearanceCount - a.appearanceCount : (b as any).popularity - (a as any).popularity)
    .slice(0, 40);

  const crewMap = new Map<number, { person: TMDBCrewMember; count: number; jobs: Set<string>; popularity: number }>();
  const primaryJobs = ["Director", "Writer", "Screenplay", "Producer", "Executive Producer", "Original Music Composer"];

  fullParts.forEach((part: any) => {
    (part.credits?.crew || []).forEach((member: any) => {
      if (primaryJobs.includes(member.job || "")) {
        const existing = crewMap.get(member.id);
        if (existing) {
          existing.count += 1;
          if (member.job) existing.jobs.add(member.job);
        } else {
          crewMap.set(member.id, { person: member, count: 1, jobs: new Set(member.job ? [member.job] : []), popularity: member.popularity || 0 });
        }
      }
    });
  });

  const aggregatedCrew = Array.from(crewMap.values())
    .map(item => ({ ...item.person, appearanceCount: item.count, displayRole: Array.from(item.jobs).slice(0, 2).join(" • ") }))
    .sort((a, b) => b.appearanceCount !== a.appearanceCount ? b.appearanceCount - a.appearanceCount : (b as any).popularity - (a as any).popularity)
    .slice(0, 25);

  return {
    id: numericId,
    title,
    overview: rawData.overview || "",
    backdropUrl: getTMDBImageUrl(highQualityBackdropPath || rawData.backdrop_path || rawData.parts[0]?.backdrop_path, "original"),
    posterUrl: getTMDBImageUrl(rawData.poster_path || rawData.parts[0]?.poster_path, "w500"),
    logoUrl,
    parts: enrichedParts,
    comingSoon: enrichedComingSoon,
    rating,
    yearSpan,
    genres: topGenres,
    totalRuntime,
    totalRevenue,
    cast: aggregatedCast,
    crew: aggregatedCrew
  };
}
