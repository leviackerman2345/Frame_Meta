import { notFound } from "next/navigation";
import { getTitleFullDetails, getTitleLogo, getTMDBImageUrl, getRecommendations, getOMDbRatings, getMovieReviews } from "@/lib/tmdb";
import { MovieDetailsModal } from "@/components/ui/MovieDetailsModal";

interface InterceptedTitlePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: "movie" | "tv" }>;
}

export default async function InterceptedTitlePage({ params, searchParams }: InterceptedTitlePageProps) {
  const { id } = await params;
  const { type: queryType } = await searchParams;
  const type = queryType === "tv" ? "tv" : "movie";

  const titleId = parseInt(id, 10);
  if (isNaN(titleId)) {
    notFound();
  }

  const [details, logoUrl, recommendations, reviewsData] = await Promise.all([
    getTitleFullDetails(titleId, type),
    getTitleLogo(titleId, type),
    getRecommendations(titleId, type),
    getMovieReviews(titleId, type),
  ]);

  if (!details || details.success === false || (!details.title && !details.name)) {
    notFound();
  }

  console.log("INTERCEPTED ROUTE id:", id, "type:", type, "has_seasons:", details.seasons ? details.seasons.length : "NO");


  const imdbId = details.imdb_id || details.external_ids?.imdb_id;
  const omdbRatings = await getOMDbRatings(imdbId);
  const reviews = reviewsData?.results || [];

  const backdropUrl = details.backdrop_path 
    ? getTMDBImageUrl(details.backdrop_path, "original") 
    : "/images/poster-placeholder.jpg";
  
  const rating = details.vote_average ? Math.round(details.vote_average * 10) / 10 : "N/A";
  const releaseDate = details.release_date || details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  
  let runtimeStr = "N/A";
  if (type === "tv" && details.number_of_seasons) {
    runtimeStr = `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? "s" : ""}`;
  } else if (details.runtime) {
    const hours = Math.floor(details.runtime / 60);
    const minutes = details.runtime % 60;
    runtimeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  let certification = "N/A";
  if (details.release_dates?.results) {
    const usRelease = details.release_dates.results.find(
      (r: any) => r.iso_3166_1 === "US"
    );
    if (usRelease && usRelease.release_dates?.length > 0) {
      certification = usRelease.release_dates[0].certification || "PG-13";
    }
  }

  let usProviders = details["watch/providers"]?.results?.US || {};
  
  if (!usProviders.flatrate && !usProviders.rent && !usProviders.buy) {
    const resultsObj = details["watch/providers"]?.results || {};
    const fallbackCode = Object.keys(resultsObj).find(
      (code) => resultsObj[code].flatrate || resultsObj[code].rent || resultsObj[code].buy
    );
    if (fallbackCode) {
      usProviders = resultsObj[fallbackCode];
    }
  }

  const flatrate = usProviders.flatrate || [];
  const rent = usProviders.rent || [];
  const buy = usProviders.buy || [];
  
  const allProvidersMap = new Map();
  [...flatrate, ...rent, ...buy].forEach((p: any) => {
    allProvidersMap.set(p.provider_id, p);
  });
  
  const providers = Array.from(allProvidersMap.values());
  const isReleased = details.status === "Released";
  const hasDigitalProviders = providers.length > 0;
  const inCinema = isReleased && !hasDigitalProviders && type === "movie";
  
  const watchLink = usProviders.link || `https://www.themoviedb.org/${type}/${id}/watch`;
  const cast = details.credits?.cast || [];
  const crew = details.credits?.crew || [];

  return (
    <MovieDetailsModal
      type={type}
      details={details}
      logoUrl={logoUrl}
      backdropUrl={backdropUrl}
      rating={rating}
      year={year}
      runtimeStr={runtimeStr}
      certification={certification}
      providers={providers}
      watchLink={watchLink}
      inCinema={inCinema}
      recommendations={recommendations}
      cast={cast}
      crew={crew}
      omdbRatings={omdbRatings}
      reviews={reviews}
    />
  );
}
