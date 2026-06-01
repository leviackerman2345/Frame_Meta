import {
  getMovieReviews,
  getOMDbRatings,
  getRecommendations,
  getTMDBImageUrl,
  getTitleFullDetails,
  getTitleLogo,
} from "@/lib/tmdb";
import type {
  MovieCard,
  OMDbRating,
  TMDBCastMember,
  TMDBCrewMember,
  TMDBProvider,
  TMDBReview,
  TMDBTitleDetails,
} from "@/types/types";

export interface TitleDetailsBundle {
  details: TMDBTitleDetails;
  logoUrl: string | null;
  recommendations: MovieCard[];
  reviews: TMDBReview[];
  backdropUrl: string;
  rating: string | number;
  year: string | number;
  runtimeStr: string;
  certification: string;
  providers: TMDBProvider[];
  watchLink: string;
  inCinema: boolean;
  cast: TMDBCastMember[];
  crew: TMDBCrewMember[];
  omdbRatings: OMDbRating[];
}

export async function getTitleDetailsBundle(
  id: number,
  type: "movie" | "tv"
): Promise<TitleDetailsBundle | null> {
  const detailsPromise = getTitleFullDetails(id, type);
  const [detailsResponse, logoUrl, recommendations, reviewsData] =
    await Promise.all([
      detailsPromise,
      getTitleLogo(id, type),
      getRecommendations(id, type),
      getMovieReviews(id, type),
    ]);

  const details = detailsResponse as TMDBTitleDetails;
  if (!details || details.success === false || (!details.title && !details.name)) {
    return null;
  }

  const imdbId = details.imdb_id || details.external_ids?.imdb_id;
  const omdbPromise = imdbId ? getOMDbRatings(imdbId) : Promise.resolve([]);
  const reviews = (reviewsData?.results || []) as TMDBReview[];

  const backdropUrl = details.backdrop_path
    ? getTMDBImageUrl(details.backdrop_path, "original")
    : "/images/poster-placeholder.jpg";
  const rating = details.vote_average
    ? Math.round(details.vote_average * 10) / 10
    : "N/A";
  const releaseDate = details.release_date || details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";

  let runtimeStr = "N/A";
  if (type === "tv" && details.number_of_seasons) {
    runtimeStr = `${details.number_of_seasons} Season${
      details.number_of_seasons > 1 ? "s" : ""
    }`;
  } else if (details.runtime) {
    const hours = Math.floor(details.runtime / 60);
    const minutes = details.runtime % 60;
    runtimeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  } else if (details.episode_run_time && details.episode_run_time.length > 0) {
    runtimeStr = `${details.episode_run_time[0]}m`;
  }

  let certification = "N/A";
  if (details.release_dates?.results) {
    const usRelease = details.release_dates.results.find(
      (r) => r.iso_3166_1 === "US"
    );
    if (usRelease && usRelease.release_dates && usRelease.release_dates.length > 0) {
      certification = usRelease.release_dates[0].certification || "PG-13";
    }
  } else if (type === "tv" && details.content_ratings?.results) {
    const usRating = details.content_ratings.results.find(
      (r) => r.iso_3166_1 === "US"
    );
    if (usRating) {
      certification = usRating.rating || "TV-MA";
    }
  }

  let usProviders = details["watch/providers"]?.results?.US || {};
  if (!usProviders.flatrate && !usProviders.rent && !usProviders.buy) {
    const resultsObj = details["watch/providers"]?.results || {};
    const fallbackCode = Object.keys(resultsObj).find(
      (code) =>
        resultsObj[code].flatrate ||
        resultsObj[code].rent ||
        resultsObj[code].buy
    );
    if (fallbackCode) {
      usProviders = resultsObj[fallbackCode];
    }
  }

  const flatrate = (usProviders.flatrate || []) as TMDBProvider[];
  const rent = (usProviders.rent || []) as TMDBProvider[];
  const buy = (usProviders.buy || []) as TMDBProvider[];

  // Tag each provider with its category before merging.
  // Priority: flatrate > rent > buy (prefer subscription over purchase).
  const allProvidersMap = new Map<number, TMDBProvider>();
  flatrate.forEach((p) => {
    allProvidersMap.set(p.provider_id, { ...p, category: "flatrate" });
  });
  rent.forEach((p) => {
    if (!allProvidersMap.has(p.provider_id)) {
      allProvidersMap.set(p.provider_id, { ...p, category: "rent" });
    }
  });
  buy.forEach((p) => {
    if (!allProvidersMap.has(p.provider_id)) {
      allProvidersMap.set(p.provider_id, { ...p, category: "buy" });
    }
  });

  const providers = Array.from(allProvidersMap.values());
  const isReleased = details.status === "Released";
  const hasDigitalProviders = providers.length > 0;
  const inCinema = isReleased && !hasDigitalProviders && type === "movie";
  const watchLink =
    usProviders.link || `https://www.themoviedb.org/${type}/${id}/watch`;

  const cast = (details.credits?.cast || []) as TMDBCastMember[];
  const crew = (details.credits?.crew || []) as TMDBCrewMember[];

  const omdbRatings = await omdbPromise;

  return {
    details,
    logoUrl,
    recommendations: recommendations as MovieCard[],
    reviews,
    backdropUrl,
    rating,
    year,
    runtimeStr,
    certification,
    providers,
    watchLink,
    inCinema,
    cast,
    crew,
    omdbRatings,
  };
}
