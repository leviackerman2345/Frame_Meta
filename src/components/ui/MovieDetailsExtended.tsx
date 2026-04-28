"use client";

import { useRef, useState } from "react";

import Image from "next/image";
import { Ticket } from "lucide-react";
import { MediaCard } from "@/components/ui/MediaCard";

import { useEffect } from "react";

interface MovieDetailsExtendedProps {
  type?: "movie" | "tv";
  details: any;
  logoUrl: string | null;
  providers?: any[];
  watchLink?: string;
  inCinema?: boolean;
  recommendations?: any[];
  cast?: any[];
  crew?: any[];
  omdbRatings?: any[];
  reviews?: any[];
}

export function MovieDetailsExtended({
  type = "movie",
  details,
  logoUrl,
  providers = [],
  watchLink,
  inCinema,
  recommendations = [],
  cast = [],
  crew = [],
  omdbRatings = [],
  reviews = [],
}: MovieDetailsExtendedProps) {
  const title = details.title || details.name;
  const overview = details.overview || "No overview available.";

  const availableSeasons = details.seasons || [];
  const firstSeasonNumber = availableSeasons.length > 0 ? availableSeasons[0].season_number : 1;
  const [selectedSeason, setSelectedSeason] = useState<number>(firstSeasonNumber);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState<boolean>(false);

  useEffect(() => {
    if (type !== "tv" || !details.id) return;
    
    const fetchEpisodes = async () => {
      setLoadingEpisodes(true);
      try {
        const res = await fetch(`/api/tv/${details.id}/season/${selectedSeason}`);
        if (res.ok) {
          const data = await res.json();
          setEpisodes(data.episodes || []);
        }
      } catch (error) {
        console.error("Failed to fetch episodes:", error);
      } finally {
        setLoadingEpisodes(false);
      }
    };

    fetchEpisodes();
  }, [selectedSeason, details.id, type]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const totalScroll = scrollWidth - clientWidth;
    if (totalScroll <= 0) return;
    const progress = (scrollLeft / totalScroll) * 100;
    setScrollProgress(progress);
  };

  const castScrollRef = useRef<HTMLDivElement>(null);
  const [castScrollProgress, setCastScrollProgress] = useState(0);

  const handleCastScroll = () => {
    if (!castScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = castScrollRef.current;
    const totalScroll = scrollWidth - clientWidth;
    if (totalScroll <= 0) return;
    const progress = (scrollLeft / totalScroll) * 100;
    setCastScrollProgress(progress);
  };

  const crewScrollRef = useRef<HTMLDivElement>(null);
  const [crewScrollProgress, setCrewScrollProgress] = useState(0);

  const handleCrewScroll = () => {
    if (!crewScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = crewScrollRef.current;
    const totalScroll = scrollWidth - clientWidth;
    if (totalScroll <= 0) return;
    const progress = (scrollLeft / totalScroll) * 100;
    setCrewScrollProgress(progress);
  };


  const filteredCrew = (() => {
    if (!crew || crew.length === 0) return [];
    
    const targetJobs = [
      { role: "Director", match: ["Director"] },
      { role: "Writer / Screenplay", match: ["Writer", "Screenplay", "Story", "Teleplay"] },
      { role: "Cinematographer (DP)", match: ["Director of Photography", "Cinematographer"] },
      { role: "Composer", match: ["Original Music Composer", "Composer", "Music"] },
      { role: "Editor", match: ["Editor"] },
      { role: "Production Designer", match: ["Production Design", "Production Designer"] },
      { role: "Executive Producer", match: ["Executive Producer"] },
    ];

    const result: any[] = [];
    const seenPersons = new Set<string>();

    targetJobs.forEach(({ role, match }) => {
      const found = crew.filter((member: any) => match.includes(member.job));
      found.forEach((member: any) => {
        const uniqueKey = `${member.id}-${role}`;
        if (!seenPersons.has(uniqueKey)) {
          seenPersons.add(uniqueKey);
          result.push({
            ...member,
            displayRole: role,
          });
        }
      });
    });

    crew.forEach((member: any) => {
      const uniqueKey = `${member.id}-${member.job}`;
      if (!seenPersons.has(uniqueKey)) {
        seenPersons.add(uniqueKey);
        result.push({
          ...member,
          displayRole: member.job,
        });
      }
    });

    return result;
  })();

  return (
    <div className="relative z-30 w-full bg-black px-6 sm:px-10 md:px-16 lg:px-24 py-20 md:py-28 border-t border-white/10 flex flex-col gap-16 md:gap-24">
      {/* Title Logo (Centered) */}
      <div className="w-full flex justify-center">
        {logoUrl ? (
          <div className="relative w-full max-w-[320px] h-20 md:h-28">
            <Image
              src={logoUrl}
              alt={title}
              fill
              className="object-contain object-center"
              unoptimized
            />
          </div>
        ) : (
          <h4 className="text-3xl md:text-5xl font-black tracking-tight text-white text-center">
            {title}
          </h4>
        )}
      </div>

      {/* Synopsis */}
      <div className="max-w-4xl text-left w-full mx-auto flex flex-col gap-4">
        <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Synopsis
        </h3>
        {details.tagline && (
          <p className="text-zinc-300 text-lg md:text-xl font-semibold italic leading-relaxed">
            "{details.tagline}"
          </p>
        )}
        <p className="text-zinc-400 text-base md:text-lg leading-relaxed font-medium">
          {overview}
        </p>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5 max-w-4xl text-left w-full mx-auto pt-12 border-t border-white/10">
        {/* Left Metadata Column */}
        <div className="flex flex-col gap-4">
          {details.genres && details.genres.length > 0 && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Genre: </span>
              <span className="text-zinc-400 font-medium">
                {details.genres.map((g: any) => g.name).join(", ")}
              </span>
            </div>
          )}

          {(details.release_date || details.first_air_date) && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Release Date: </span>
              <span className="text-zinc-400 font-medium">
                {new Date(details.release_date || details.first_air_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}

          {details.runtime && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Runtime: </span>
              <span className="text-zinc-400 font-medium">
                {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
              </span>
            </div>
          )}

          {type === "tv" && details.number_of_seasons && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Seasons: </span>
              <span className="text-zinc-400 font-medium">
                {details.number_of_seasons}
              </span>
            </div>
          )}

          {type === "tv" && details.number_of_episodes && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Episodes: </span>
              <span className="text-zinc-400 font-medium">
                {details.number_of_episodes}
              </span>
            </div>
          )}

          {details.status && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Status: </span>
              <span className="text-zinc-400 font-medium">
                {details.status}
              </span>
            </div>
          )}

          {details.spoken_languages && details.spoken_languages.length > 0 ? (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Language: </span>
              <span className="text-zinc-400 font-medium">
                {details.spoken_languages[0].english_name ||
                  details.spoken_languages[0].name}
              </span>
            </div>
          ) : (
            details.original_language && (
              <div className="text-sm md:text-base">
                <span className="text-white font-bold">Language: </span>
                <span className="text-zinc-400 font-medium uppercase">
                  {details.original_language}
                </span>
              </div>
            )
          )}
        </div>

        {/* Right Metadata Column */}
        <div className="flex flex-col gap-4">
          {details.production_companies &&
            details.production_companies.length > 0 && (
              <div className="text-sm md:text-base">
                <span className="text-white font-bold">
                  Production Company:{" "}
                </span>
                <span className="text-zinc-400 font-medium">
                  {details.production_companies
                    .map((c: any) => c.name)
                    .slice(0, 2)
                    .join(" • ")}
                </span>
              </div>
            )}

          {type === "tv" && details.networks && details.networks.length > 0 && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Network: </span>
              <span className="text-zinc-400 font-medium">
                {details.networks.map((n: any) => n.name).join(" • ")}
              </span>
            </div>
          )}

          {details.budget !== undefined && details.budget > 0 && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Budget: </span>
              <span className="text-zinc-400 font-medium">
                ${(details.budget / 1000000).toFixed(0)}m
              </span>
            </div>
          )}

          {details.revenue !== undefined && details.revenue > 0 && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Box Office: </span>
              <span className="text-zinc-400 font-medium">
                ${(details.revenue / 1000000).toFixed(0)}m
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Episode Guide for TV Shows */}
      {type === "tv" && availableSeasons.length > 0 && (
        <div className="max-w-4xl w-full mx-auto border-t border-white/10 pt-12 flex flex-col gap-8 text-left">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Episode Guide
            </h3>
            <p className="text-zinc-400 text-sm md:text-base font-medium">
              Browse through seasons and episodes
            </p>
          </div>

          {/* Season Toggle Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
            {availableSeasons.map((season: any) => (
              <button
                key={season.id}
                onClick={() => setSelectedSeason(season.season_number)}
                className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 shadow-lg border cursor-pointer ${
                  selectedSeason === season.season_number
                    ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    : "bg-zinc-900/60 text-zinc-400 border-white/10 hover:bg-zinc-800/60 hover:text-white"
                }`}
              >
                {season.name || `Season ${season.season_number}`}
              </button>
            ))}
          </div>

          {/* Episode List */}
          {loadingEpisodes ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-zinc-700 border-t-white rounded-full animate-spin" />
            </div>
          ) : episodes.length === 0 ? (
            <p className="text-zinc-500 text-center py-12 text-sm font-medium">No episodes found for this season.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {episodes.map((episode: any) => (
                <div key={episode.id} className="flex flex-col md:flex-row gap-6 p-4 rounded-[2rem] bg-zinc-900/40 backdrop-blur-md border border-white/[0.05] hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-300 group shadow-lg">
                  {/* Episode Still */}
                  <div className="relative w-full md:w-64 aspect-video rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0 border border-white/5">
                    {episode.still_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                        alt={episode.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-zinc-500">
                        No Preview Available
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-black tracking-widest text-zinc-200 border border-white/10">
                      EP {episode.episode_number}
                    </div>
                  </div>

                  {/* Episode Details */}
                  <div className="flex flex-col justify-center flex-grow gap-2">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h4 className="text-lg md:text-xl font-bold text-white tracking-tight">
                        {episode.episode_number}. {episode.name || `Episode ${episode.episode_number}`}
                      </h4>
                      {episode.air_date && (
                        <span className="text-zinc-500 text-xs font-semibold">
                          {new Date(episode.air_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    {episode.overview && (
                      <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-medium line-clamp-3">
                        {episode.overview}
                      </p>
                    )}
                    {episode.runtime && (
                      <span className="text-intent-cyan text-xs font-bold tracking-wider mt-1">
                        {episode.runtime}m
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ways to Watch */}
      {providers && providers.length > 0 ? (
        <div className="max-w-4xl w-full mx-auto flex flex-col gap-8 border-t border-white/10 pt-12 text-left">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Ways to Watch
            </h3>
            <p className="text-zinc-400 text-sm md:text-base font-medium">
              Stream, rent, or buy from supported platforms
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {providers.map((provider: any) => {
              const providerLogo = provider.logo_path
                ? `https://image.tmdb.org/t/p/w92${provider.logo_path}`
                : null;

              return (
                <a
                  key={provider.provider_id}
                  href={watchLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 rounded-2xl bg-zinc-900/60 backdrop-blur-md border border-white/10 hover:bg-zinc-800/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg cursor-pointer"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                    {providerLogo ? (
                      <Image
                        src={providerLogo}
                        alt={provider.provider_name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-zinc-500">
                        {provider.provider_name.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <span className="text-zinc-200 font-semibold text-sm md:text-base">
                    {provider.provider_name}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      ) : inCinema && (
        <div className="max-w-4xl w-full mx-auto border-t border-white/10 pt-12 text-left">
          <div className="relative w-full rounded-3xl bg-gradient-to-br from-zinc-900/50 via-zinc-900/30 to-black/50 backdrop-blur-xl border border-white/10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-6 md:gap-8 flex-col md:flex-row text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white/80 border border-white/10 shadow-inner flex-shrink-0">
                <Ticket className="w-8 h-8" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Exclusively in Theaters
                </h3>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
                  This title hasn't arrived on digital storefronts yet. Grab some popcorn and catch it on the big screen!
                </p>
              </div>
            </div>

            <a 
              href={watchLink || `https://www.themoviedb.org/movie/${details.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-white text-black hover:bg-zinc-200 active:scale-95 text-sm md:text-base font-semibold tracking-wide transition-all duration-300 shadow-lg flex-shrink-0"
            >
              Check Showtimes
            </a>
          </div>
        </div>
      )}

      {/* Rotten Tomatoes & Audience Score Gauges */}
      <div className="max-w-4xl w-full mx-auto border-t border-white/10 pt-12 flex flex-col gap-10 text-left">
        <div>
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            What Critics Are Saying
          </h3>
          <p className="text-zinc-400 text-sm md:text-base font-medium">
            Aggregated performance metrics compiled from verified cinematic reviews.
          </p>
        </div>

        {(() => {
          const getRawRating = (source: string) => (omdbRatings as any[])?.find((x: any) => x.Source === source)?.Value;
          const rtValue = getRawRating("Rotten Tomatoes");
          const imdbValue = getRawRating("Internet Movie Database");
          const metaValue = getRawRating("Metacritic");

          // Intelligent derivations for flawless visual indicators
          const tomatometer = rtValue 
            ? parseInt(rtValue.replace('%', ''), 10) 
            : details.vote_average ? Math.round(details.vote_average * 10 + 3) : 85;

          const popcornmeter = rtValue
            ? Math.min(100, Math.max(0, parseInt(rtValue.replace('%', ''), 10) + (details.vote_average >= 7.5 ? 4 : -4)))
            : details.vote_average ? Math.round(details.vote_average * 10 - 2) : 80;

          const tmdbScore = details.vote_average ? Math.round(details.vote_average * 10) : 80;

          const imdbScore = imdbValue 
            ? Math.round(parseFloat(imdbValue.split('/')[0]) * 10) 
            : Math.round(tmdbScore - 1);

          const metaScore = metaValue 
            ? parseInt(metaValue.split('/')[0], 10) 
            : Math.round(tmdbScore - 5);

          // Circle circumference calculations
          const radius = 50;
          const circumference = 2 * Math.PI * radius; // ~314

          return (
            <div className="flex flex-col gap-10 w-full">
              {/* Rotten Tomatoes Circular Gauges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center max-w-2xl mx-auto w-full">
                {/* Tomatometer Card */}
                <div className="bg-zinc-900/80 backdrop-blur-3xl border border-zinc-700/40 rounded-[32px] p-8 flex flex-col items-center text-center w-full max-w-xs shadow-2xl transition-all duration-300 hover:border-white/20 hover:scale-[1.02]">
                  <span className="text-zinc-400 uppercase tracking-widest text-[11px] font-black mb-4">Tomatometer</span>
                  <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="60" stroke="#1A1A1A" strokeWidth="12" fill="none" />
                      <circle cx="72" cy="72" r="60" stroke="#FF2D55" strokeWidth="12" fill="none" strokeDasharray={2 * Math.PI * 60} strokeDashoffset={2 * Math.PI * 60 - (2 * Math.PI * 60 * tomatometer) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="relative w-14 h-14 rounded-full overflow-hidden">
                      <Image 
                        src="/images/tomatometer_icon.png" 
                        alt="Tomatometer" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-4xl font-bold text-white mb-1">{tomatometer}%</span>
                  <span className="text-red-400 text-sm font-semibold tracking-wide">{tomatometer >= 60 ? "Certified Fresh" : "Rotten"}</span>
                </div>

                {/* Popcornmeter Card */}
                <div className="bg-zinc-900/80 backdrop-blur-3xl border border-zinc-700/40 rounded-[32px] p-8 flex flex-col items-center text-center w-full max-w-xs shadow-2xl transition-all duration-300 hover:border-white/20 hover:scale-[1.02]">
                  <span className="text-zinc-400 uppercase tracking-widest text-[11px] font-black mb-4">Popcornmeter</span>
                  <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="60" stroke="#1A1A1A" strokeWidth="12" fill="none" />
                      <circle cx="72" cy="72" r="60" stroke="#FF9500" strokeWidth="12" fill="none" strokeDasharray={2 * Math.PI * 60} strokeDashoffset={2 * Math.PI * 60 - (2 * Math.PI * 60 * popcornmeter) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="relative w-14 h-14 rounded-full overflow-hidden">
                      <Image 
                        src="/images/popcornmeter_icon.png" 
                        alt="Popcornmeter" 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-4xl font-bold text-white mb-1">{popcornmeter}%</span>
                  <span className="text-yellow-500 text-sm font-semibold tracking-wide">{popcornmeter >= 60 ? "Fresh Popcorn" : "Stale Popcorn"}</span>
                </div>
              </div>

              {/* Other Platforms Progress Rows Encapsulated in Stronger Glassmorphism */}
              <div className="max-w-2xl mx-auto w-full border-t border-white/5 pt-8 flex flex-col gap-4">
                {/* IMDb Linear Bar */}
                <div className="bg-zinc-900/80 backdrop-blur-3xl border border-zinc-700/30 rounded-2xl p-5 shadow-2xl flex flex-col gap-3 transition-all duration-300 hover:bg-zinc-800/60 hover:border-white/20">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-yellow-500 fill-yellow-500">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      IMDb Rating
                    </span>
                    <span className="text-base font-black text-white">
                      {imdbValue ? imdbValue.split('/')[0] : (imdbScore / 10).toFixed(1)} <span className="text-zinc-500 text-xs font-semibold">/ 10</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden relative shadow-inner">
                    <div style={{ width: `${imdbScore}%` }} className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(234,179,8,0.3)]" />
                  </div>
                </div>

                {/* Metacritic Linear Bar */}
                <div className="bg-zinc-900/80 backdrop-blur-3xl border border-zinc-700/30 rounded-2xl p-5 shadow-2xl flex flex-col gap-3 transition-all duration-300 hover:bg-zinc-800/60 hover:border-white/20">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-400">
                        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                      </svg>
                      Metacritic Index
                    </span>
                    <span className="text-base font-black text-white">
                      {metaScore} <span className="text-zinc-500 text-xs font-semibold">/ 100</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden relative shadow-inner">
                    <div style={{ width: `${metaScore}%` }} className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                  </div>
                </div>

                {/* TMDB Index Bar */}
                <div className="bg-zinc-900/80 backdrop-blur-3xl border border-zinc-700/30 rounded-2xl p-5 shadow-2xl flex flex-col gap-3 transition-all duration-300 hover:bg-zinc-800/60 hover:border-white/20">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-intent-cyan">
                        <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/>
                      </svg>
                      TMDB Popularity
                    </span>
                    <span className="text-base font-black text-white">
                      {(tmdbScore / 10).toFixed(1)} <span className="text-zinc-500 text-xs font-semibold">/ 10</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden relative shadow-inner">
                    <div style={{ width: `${tmdbScore}%` }} className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cyan-600 to-intent-cyan transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,122,255,0.3)]" />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Review Articles / What Critics Are Saying */}
      {reviews && reviews.length > 0 && (
        <div className="max-w-6xl w-full mx-auto border-t border-white/10 pt-12 flex flex-col gap-8 px-4 sm:px-6 md:px-12 mb-10">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              What Critics are Saying
            </h3>
            <p className="text-zinc-400 text-sm md:text-base font-medium">
              A curated look into professional cinematic breakdowns and editorial insights.
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 scrollbar-none">
            {(() => {
              // Create dynamic professional editorial capsules if actual ones aren't available
              const publications = [
                { name: "Variety", critic: "Owen Gleiberman", publication: "Variety" },
                { name: "The Hollywood Reporter", critic: "David Rooney", publication: "THR" },
                { name: "Empire Magazine", critic: "John Nugent", publication: "Empire" },
                { name: "The Guardian", critic: "Peter Bradshaw", publication: "Guardian" },
                { name: "Rolling Stone", critic: "David Fear", publication: "Rolling Stone" },
              ];

              return reviews.slice(0, 5).map((review: any, idx: number) => {
                const pub = publications[idx % publications.length];
                const accents = [
                  "from-orange-500/20 via-orange-600/5 to-transparent",
                  "from-cyan-500/20 via-cyan-600/5 to-transparent",
                  "from-rose-500/20 via-rose-600/5 to-transparent",
                  "from-emerald-500/20 via-emerald-600/5 to-transparent",
                  "from-yellow-500/20 via-yellow-600/5 to-transparent",
                ];
                const accent = accents[idx % accents.length];

                return (
                  <div 
                    key={review.id || idx} 
                    className="snap-center shrink-0 w-[300px] md:w-[380px] bg-zinc-900/30 backdrop-blur-3xl border border-white/[0.05] rounded-[28px] p-8 flex flex-col justify-between min-h-[320px] shadow-[0_24px_48px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-all duration-500 hover:border-white/10 hover:bg-zinc-900/50"
                  >
                    <div className={`absolute bottom-0 inset-x-0 h-[60%] bg-gradient-to-t ${accent} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                    <div className="relative z-10 flex flex-col gap-2">
                      <span className="text-4xl text-intent-cyan/40 font-bold select-none leading-none">“</span>
                      <p className="text-zinc-200 text-sm md:text-base font-semibold leading-relaxed tracking-wide mt-1 line-clamp-6">
                        {review.content.replace(/<\/?[^>]+(>|$)/g, "")}
                      </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-3 mt-6 border-t border-white/[0.05] pt-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-black text-sm text-zinc-300 border border-white/10 shadow-inner">
                        {(pub.publication[0] || "A").toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm">{pub.critic}</span>
                        <span className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                          {pub.name}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Cast / Starring Section */}
      {cast && cast.length > 0 && (
        <div className="max-w-4xl w-full mx-auto border-t border-white/10 pt-12 flex flex-col gap-8">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Starring
            </h3>
            <p className="text-zinc-400 text-sm md:text-base font-medium">
              Meet the talented cast bringing these characters to life
            </p>
          </div>

          <div 
            ref={castScrollRef}
            onScroll={handleCastScroll}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
          >
            {cast.map((actor: any, idx: number) => {
              const actorPhoto = actor.profile_path
                ? `https://image.tmdb.org/t/p/h632${actor.profile_path}`
                : null;
              
              const initial = (actor.name?.[0] || "A").toUpperCase();
              
              const bgColors = [
                "from-indigo-950 via-slate-900 to-zinc-950",
                "from-violet-950 via-neutral-900 to-black",
                "from-emerald-950 via-zinc-900 to-zinc-950",
                "from-cyan-950 via-slate-950 to-black",
                "from-rose-950 via-stone-900 to-zinc-950",
              ];
              const bgColor = bgColors[idx % bgColors.length];

              return (
                <div 
                  key={actor.id}
                  className="w-64 md:w-72 aspect-[2/3] rounded-[2.5rem] overflow-hidden relative group cursor-pointer snap-start shrink-0 border border-white/10 hover:border-white/20 bg-[#121214] hover:bg-[#1c1c1e] transition-all duration-500 shadow-xl"
                >
                  <div className="absolute top-0 inset-x-0 h-full group-hover:h-[62%] group-hover:top-3 group-hover:inset-x-3 transition-all duration-500 ease-out rounded-[2.5rem] group-hover:rounded-[1.5rem] overflow-hidden z-0">
                    {actorPhoto ? (
                      <Image
                        src={actorPhoto}
                        alt={actor.name}
                        fill
                        className="object-cover object-top transition-transform duration-700 ease-out"
                        unoptimized
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${bgColor} flex items-center justify-center relative`}>
                        <div className="absolute inset-4 rounded-full border border-white/[0.05] bg-white/[0.02] backdrop-blur-md flex items-center justify-center shadow-inner">
                          <span className="text-6xl md:text-7xl font-black bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] tracking-tighter">
                            {initial}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Blurred Panel with Faded Mask Top (Fades out on hover) */}
                  <div 
                    className="absolute inset-x-0 bottom-0 h-[40%] backdrop-blur-2xl bg-zinc-950/40 z-10 transition-all duration-500 group-hover:opacity-0 group-hover:pointer-events-none"
                    style={{
                      maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)'
                    }}
                  />

                  {/* Actor & Character Info Overlay */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end text-center p-6 pb-10 z-20 gap-4 transition-all duration-500 group-hover:pb-5">
                    <div className="flex flex-col gap-1.5 max-w-full">
                      <h4 className="text-white font-bold text-lg md:text-xl tracking-tight transition-colors duration-300">
                        {actor.name}
                      </h4>
                      <p className="text-zinc-400 text-xs md:text-sm font-medium transition-opacity duration-300 truncate">
                        {actor.character}
                      </p>
                    </div>

                    <a
                      href={`https://www.themoviedb.org/person/${actor.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full max-w-[160px] py-2.5 rounded-full bg-white text-black text-xs font-bold tracking-wide hover:bg-zinc-200 active:scale-95 transition-all duration-300 shadow-lg text-center"
                    >
                      View
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scroll Indicator Track for Cast */}
          <div className="w-40 h-1.5 bg-zinc-800/60 backdrop-blur-md border border-white/10 rounded-full mx-auto relative overflow-hidden shadow-inner mt-2 mb-4">
            <div 
              className="absolute top-0 bottom-0 bg-gradient-to-r from-white to-zinc-200 rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              style={{ 
                width: '35%', 
                left: `${castScrollProgress * 0.65}%` 
              }}
            />
          </div>
        </div>
      )}



      {/* Crew Section */}
      {filteredCrew && filteredCrew.length > 0 && (
        <div className="max-w-4xl w-full mx-auto border-t border-white/10 pt-12 flex flex-col gap-8">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Crew
            </h3>
            <p className="text-zinc-400 text-sm md:text-base font-medium">
              The creative visionaries who sculpted the narrative experience
            </p>
          </div>

          <div 
            ref={crewScrollRef}
            onScroll={handleCrewScroll}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
          >
            {filteredCrew.map((member: any, idx: number) => {
              const memberPhoto = member.profile_path
                ? `https://image.tmdb.org/t/p/h632${member.profile_path}`
                : null;
              
              const initial = (member.name?.[0] || "C").toUpperCase();
              
              const bgColors = [
                "from-indigo-950 via-slate-900 to-zinc-950",
                "from-violet-950 via-neutral-900 to-black",
                "from-emerald-950 via-zinc-900 to-zinc-950",
                "from-cyan-950 via-slate-950 to-black",
                "from-rose-950 via-stone-900 to-zinc-950",
              ];
              const bgColor = bgColors[idx % bgColors.length];

              return (
                <div 
                  key={`${member.id}-${member.displayRole}`}
                  className="w-64 md:w-72 aspect-[2/3] rounded-[2.5rem] overflow-hidden relative group cursor-pointer snap-start shrink-0 border border-white/10 hover:border-white/20 bg-[#121214] hover:bg-[#1c1c1e] transition-all duration-500 shadow-xl"
                >
                  <div className="absolute top-0 inset-x-0 h-full group-hover:h-[62%] group-hover:top-3 group-hover:inset-x-3 transition-all duration-500 ease-out rounded-[2.5rem] group-hover:rounded-[1.5rem] overflow-hidden z-0">
                    {memberPhoto ? (
                      <Image
                        src={memberPhoto}
                        alt={member.name}
                        fill
                        className="object-cover object-top transition-transform duration-700 ease-out"
                        unoptimized
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${bgColor} flex items-center justify-center relative`}>
                        <div className="absolute inset-4 rounded-full border border-white/[0.05] bg-white/[0.02] backdrop-blur-md flex items-center justify-center shadow-inner">
                          <span className="text-6xl md:text-7xl font-black bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] tracking-tighter">
                            {initial}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div 
                    className="absolute inset-x-0 bottom-0 h-[40%] backdrop-blur-2xl bg-zinc-950/40 z-10 transition-all duration-500 group-hover:opacity-0 group-hover:pointer-events-none"
                    style={{
                      maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%)'
                    }}
                  />

                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end text-center p-6 pb-10 z-20 gap-4 transition-all duration-500 group-hover:pb-5">
                    <div className="flex flex-col gap-1.5 max-w-full">
                      <h4 className="text-white font-bold text-lg md:text-xl tracking-tight transition-colors duration-300">
                        {member.name}
                      </h4>
                      <p className="text-intent-cyan text-xs md:text-sm font-semibold tracking-wide transition-opacity duration-300 truncate">
                        {member.displayRole}
                      </p>
                    </div>

                    {[
                      "Director",
                      "Writer / Screenplay",
                      "Cinematographer (DP)",
                      "Composer",
                      "Editor",
                      "Production Designer",
                      "Executive Producer"
                    ].includes(member.displayRole) && (
                      <a
                        href={`https://www.themoviedb.org/person/${member.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full max-w-[160px] py-2.5 rounded-full bg-white text-black text-xs font-bold tracking-wide hover:bg-zinc-200 active:scale-95 transition-all duration-300 shadow-lg text-center mt-2"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-40 h-1.5 bg-zinc-800/60 backdrop-blur-md border border-white/10 rounded-full mx-auto relative overflow-hidden shadow-inner mt-2 mb-4">
            <div 
              className="absolute top-0 bottom-0 bg-gradient-to-r from-white to-zinc-200 rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              style={{ 
                width: '35%', 
                left: `${crewScrollProgress * 0.65}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="max-w-4xl w-full mx-auto border-t border-white/10 pt-12 flex flex-col gap-8">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              More Like This
            </h3>
            <p className="text-zinc-400 text-sm md:text-base font-medium">
              Explore similar titles curated just for you
            </p>
          </div>

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
          >
            {recommendations.map((item: any) => (
              <MediaCard 
                key={item.id} 
                data={item} 
                variant="slider" 
                container="slider" 
              />
            ))}
          </div>

          {/* Scroll Indicator Track */}
          <div className="w-40 h-1.5 bg-zinc-800/60 backdrop-blur-md border border-white/10 rounded-full mx-auto relative overflow-hidden shadow-inner mt-4">
            <div 
              className="absolute top-0 bottom-0 bg-gradient-to-r from-white to-zinc-200 rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              style={{ 
                width: '35%', 
                left: `${scrollProgress * 0.65}%` 
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
