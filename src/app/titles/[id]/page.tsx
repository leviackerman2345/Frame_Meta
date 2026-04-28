import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Plus, Info, ChevronLeft, Volume2, Maximize2, Sparkles, Star } from "lucide-react";
import { getTitleFullDetails, getTitleLogo, getTMDBImageUrl, getOMDbRatings, getMovieReviews, getRecommendations } from "@/lib/tmdb";
import { MovieDetailsExtended } from "@/components/ui/MovieDetailsExtended";

interface TitlePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: "movie" | "tv" }>;
}

export default async function TitlePage({ params, searchParams }: TitlePageProps) {
  const { id } = await params;
  const { type = "movie" } = await searchParams;

  const titleId = parseInt(id, 10);
  if (isNaN(titleId)) {
    notFound();
  }

  // Fetch full details, logo, recommendations, and reviews in parallel
  const [details, logoUrl, recommendations, reviewsData] = await Promise.all([
    getTitleFullDetails(titleId, type),
    getTitleLogo(titleId, type),
    getRecommendations(titleId, type),
    getMovieReviews(titleId, type),
  ]);

  if (!details || details.success === false || (!details.title && !details.name)) {
    notFound();
  }

  const imdbId = details.imdb_id || details.external_ids?.imdb_id;
  const omdbRatings = await getOMDbRatings(imdbId);
  const reviews = reviewsData?.results || [];

  const title = details.title || details.name;
  const overview = details.overview || "No overview available.";
  const backdropUrl = details.backdrop_path 
    ? getTMDBImageUrl(details.backdrop_path, "original") 
    : "/images/poster-placeholder.jpg";
  
  const rating = details.vote_average ? Math.round(details.vote_average * 10) / 10 : "N/A";
  const releaseDate = details.release_date || details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  
  // Format Runtime
  let runtimeStr = "N/A";
  if (type === "tv" && details.number_of_seasons) {
    runtimeStr = `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? "s" : ""}`;
  } else if (details.runtime) {
    const hours = Math.floor(details.runtime / 60);
    const minutes = details.runtime % 60;
    runtimeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  } else if (details.episode_run_time && details.episode_run_time.length > 0) {
    runtimeStr = `${details.episode_run_time[0]}m`;
  }

  // Extract Certification (MPAA Rating)
  let certification = "N/A";
  if (type === "movie" && details.release_dates?.results) {
    const usRelease = details.release_dates.results.find(
      (r: any) => r.iso_3166_1 === "US"
    );
    if (usRelease && usRelease.release_dates?.length > 0) {
      certification = usRelease.release_dates[0].certification || "PG-13";
    }
  } else if (type === "tv" && details.content_ratings?.results) {
    const usRating = details.content_ratings.results.find(
      (r: any) => r.iso_3166_1 === "US"
    );
    if (usRating) {
      certification = usRating.rating || "TV-MA";
    }
  }

  // Get Watch Providers (Streaming Services)
  const providers = details["watch/providers"]?.results?.US?.flatrate || [];
  
  // Cast and Crew
  const cast = details.credits?.cast || [];
  const crew = details.credits?.crew || [];

  return (
    <main className="relative min-h-screen bg-zinc-900 text-white overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0 h-[85vh] md:h-screen w-full">
        <Image
          src={backdropUrl}
          alt={title}
          fill
          className="object-cover object-center priority"
          sizes="100vw"
          priority
        />
      </div>

      {/* Navigation / Back Button */}
      <div className="absolute top-24 left-6 md:left-12 z-30">
        <Link 
          href="/" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 group"
        >
          <ChevronLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-20 flex flex-col justify-end items-center text-center md:items-start md:text-left min-h-[85vh] md:min-h-screen px-4 sm:px-6 md:px-12 pb-16 md:pb-24 max-w-7xl mx-auto w-full">
        <div className="w-full max-w-2xl lg:max-w-3xl flex flex-col items-center md:items-start">
          {/* Title Logo or Fallback Text */}
          <div className="mb-10 md:mb-12 flex justify-center md:justify-start items-center w-full">
            {logoUrl ? (
              <div className="relative w-[90%] max-w-[500px] h-24 md:h-40">
                <Image
                  src={logoUrl}
                  alt={title}
                  fill
                  className="object-contain object-center md:object-left drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
                  unoptimized
                />
              </div>
            ) : (
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight drop-shadow-md text-balance">
                {title}
              </h1>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-nowrap items-center justify-center md:justify-start gap-2 sm:gap-4 w-full md:w-auto mb-10 md:mb-12">
            {/* Primary Button: Where to Watch */}
            <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-8 py-3 md:py-3.5 rounded-full bg-intent-cyan text-black hover:bg-intent-cyan/90 font-bold text-xs sm:text-sm md:text-lg shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              Where to Watch
            </button>

            {/* Secondary Button: Add to Wishlist */}
            <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-8 py-3 md:py-3.5 rounded-full bg-zinc-800/60 backdrop-blur-md border border-white/10 hover:bg-zinc-700/60 text-white font-semibold text-xs sm:text-sm md:text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap">
              <Plus className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              My Wish List
            </button>
          </div>

          {/* Metadata & Technical Specs Row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 text-sm md:text-lg text-zinc-300/90 font-medium mb-6">
            {/* Genre */}
            {details.genres && details.genres.length > 0 && (
              <span className="text-intent-cyan font-semibold">
                {details.genres[0].name}
              </span>
            )}
            <span className="opacity-40">•</span>
            
            {/* Year */}
            <span>{year}</span>
            <span className="opacity-40">•</span>
            
            {/* Runtime */}
            <span>{runtimeStr}</span>
            <span className="opacity-40">•</span>

            {/* Certification */}
            <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/50 text-[10px] md:text-xs font-bold tracking-wider uppercase">
              {certification}
            </span>

            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold text-[10px] md:text-xs">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {rating}
            </span>
          </div>

          {/* Technical Specification Badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-1.5 py-0.5 text-[9px] md:text-[10px] font-black tracking-widest bg-zinc-900/90 border border-white/10 rounded text-zinc-300">
              4K
            </span>
            <span className="px-1.5 py-0.5 text-[9px] md:text-[10px] font-black tracking-widest bg-zinc-900/90 border border-white/10 rounded text-zinc-300">
              HDR
            </span>
            <span className="px-1.5 py-0.5 text-[9px] md:text-[10px] font-black tracking-widest bg-zinc-900/90 border border-white/10 rounded text-zinc-300">
              DOLBY VISION
            </span>
            <span className="px-1.5 py-0.5 text-[9px] md:text-[10px] font-black tracking-widest bg-zinc-900/90 border border-white/10 rounded text-zinc-300">
              DOLBY ATMOS
            </span>
            <span className="px-1.5 py-0.5 text-[9px] md:text-[10px] font-black tracking-widest bg-zinc-900/90 border border-white/10 rounded text-zinc-300">
              CC
            </span>
          </div>
        </div>
      </div>

      {/* Decorative background effects */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Extended Details Section (Synopsis, Grid, Episodes) */}
      <MovieDetailsExtended 
        type={type} 
        details={details} 
        logoUrl={logoUrl} 
        providers={providers} 
        recommendations={recommendations} 
        cast={cast} 
        crew={crew} 
        omdbRatings={omdbRatings} 
        reviews={reviews} 
      />
    </main>
  );
}
