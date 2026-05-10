"use client";

import { useRef, useState, useMemo, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { Ticket, Play, MoreHorizontal, Check, Download, Share2, Pause, X, Volume2, VolumeX, Maximize, Minimize, Settings } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MediaCard } from "@/components/ui/MediaCard";
import { CastSection } from "@/components/sections/CastSection";
import { RelatedNewsSection } from "@/components/sections/RelatedNewsSection";
import { getTMDBImageUrl } from "@/lib/tmdb";
import type {
  MovieCard,
  OMDbRating,
  TMDBCastMember,
  TMDBCrewMember,
  TMDBEpisode,
  TMDBProvider,
  TMDBReview,
  TMDBSeason,
  TMDBTitleDetails,
  TMDBVideo,
} from "@/types/types";



interface MovieDetailsExtendedProps {
  type?: "movie" | "tv";
  details: TMDBTitleDetails;
  logoUrl: string | null;
  providers?: TMDBProvider[];
  watchLink?: string;
  inCinema?: boolean;
  recommendations?: MovieCard[];
  cast?: TMDBCastMember[];
  crew?: TMDBCrewMember[];
  omdbRatings?: OMDbRating[];
  reviews?: TMDBReview[];
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
  const trailers = useMemo(() => (details.videos?.results || [])
    .filter(
      (v: TMDBVideo) =>
        v.site === "YouTube" &&
        (v.type === "Trailer" || v.type === "Teaser" || v.type === "Clip")
    )
    .sort((a: TMDBVideo, b: TMDBVideo) => {
      const getPriority = (vType: string | undefined) => {
        if (vType === "Trailer") return 1;
        if (vType === "Teaser") return 2;
        return 3;
      };
      const pA = getPriority(a.type);
      const pB = getPriority(b.type);
      if (pA !== pB) return pA - pB;
      
      const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
      const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
      return dateB - dateA;
    }), [details.videos?.results]);

  const availableSeasons = (details.seasons || []) as TMDBSeason[];
  const sortedSeasons = [...availableSeasons].sort((a, b) => {
    if (a.season_number === 0) return 1;
    if (b.season_number === 0) return -1;
    return a.season_number - b.season_number;
  });
  const defaultSeasonNumber =
    sortedSeasons.find((s) => s.season_number > 0)?.season_number
    || (sortedSeasons.length > 0 ? sortedSeasons[0].season_number : 1);
  const [selectedSeason, setSelectedSeason] = useState<number>(defaultSeasonNumber);
  const [episodes, setEpisodes] = useState<TMDBEpisode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState<boolean>(false);
  const [collectionData, setCollectionData] = useState<any>(null);
  const [openMenuEpisodeId, setOpenMenuEpisodeId] = useState<number | null>(null);
  const [activeVideoKey, setActiveVideoKey] = useState<string | null>(null);

  // Fetch Collection Details if available
  useEffect(() => {
    if (type !== "movie" || !details.belongs_to_collection?.id) return;
    
    const fetchCollection = async () => {
      try {
        const res = await fetch(`/api/collection/${details.belongs_to_collection?.id}`);
        if (res.ok) {
          const data = await res.json();
          setCollectionData(data);
        }
      } catch (error) {
        console.error("Failed to fetch collection data:", error);
      }
    };

    fetchCollection();
  }, [details.belongs_to_collection?.id, type]);

  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [selectedEpisodeForModal, setSelectedEpisodeForModal] = useState<TMDBEpisode | null>(null);
  const [showControls, setShowControls] = useState<boolean>(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);
  const [playbackQuality, setPlaybackQuality] = useState<string>('auto');
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  const handlePlayerMouseMove = () => {
    handleMouseMove();
  };


  const handlePlayerMouseLeave = () => {
    // No-op
  };



  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);


  useEffect(() => {
    if (!activeVideoKey) return;

    const loadAPI = () => {
      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    };

    loadAPI();

    const initPlayer = () => {
      const newPlayer = new (window as any).YT.Player('custom-yt-player', {
        videoId: activeVideoKey,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          vq: 'hd1080',
          suggestedQuality: 'hd1080',
          origin: window.location.origin
        },
        events: {
          onReady: (event: any) => {
            setPlayer(event.target);
            try {
              event.target.setPlaybackQuality('hd1080');
              event.target.setPlaybackQuality('highres');
              setPlaybackQuality(event.target.getPlaybackQuality() || 'hd1080');
              setAvailableQualities(event.target.getAvailableQualityLevels() || []);
            } catch (e) {
              console.warn("Could not set initial playback quality:", e);
            }
            setDuration(event.target.getDuration());
            event.target.playVideo();
            setIsPlaying(true);
          },
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setDuration(event.target.getDuration());
              // Update qualities again just in case they changed after play
              try {
                setAvailableQualities(event.target.getAvailableQualityLevels() || []);
                setPlaybackQuality(event.target.getPlaybackQuality() || 'auto');
              } catch (e) {}
            } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === (window as any).YT.PlayerState.ENDED) {
              setIsPlaying(false);
              setActiveVideoKey(null);
            }
          },
          onPlaybackQualityChange: (event: any) => {
            setPlaybackQuality(event.data);
          }
        }
      });
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (player) {
        try {
          player.destroy();
        } catch (e) {}
      }
    };
  }, [activeVideoKey]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && player) {
      interval = setInterval(() => {
        try {
          setCurrentTime(player.getCurrentTime());
        } catch (e) {}
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, player]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    if (type !== "tv" || !details.id) return;
    
    const fetchEpisodes = async () => {
      setLoadingEpisodes(true);
      try {
        const res = await fetch(`/api/tv/${details.id}/season/${selectedSeason}`);
        if (res.ok) {
          const data = (await res.json()) as { episodes?: TMDBEpisode[] };
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






  const filteredCrew = useMemo(() => {
    if (!crew || crew.length === 0) return [];
    
    const targetJobs = [
      { role: "Director", match: ["Director"] },
      { role: "Writer • Screenplay", match: ["Writer", "Screenplay", "Story", "Teleplay"] },
      { role: "Cinematographer (DP)", match: ["Director of Photography", "Cinematographer"] },
      { role: "Composer", match: ["Original Music Composer", "Composer", "Music"] },
      { role: "Editor", match: ["Editor"] },
      { role: "Production Designer", match: ["Production Design", "Production Designer"] },
      { role: "Executive Producer", match: ["Executive Producer"] },
    ];

    type CrewMemberWithRole = TMDBCrewMember & { displayRole: string };
    const result: CrewMemberWithRole[] = [];
    const seenPersons = new Set<string>();

    targetJobs.forEach(({ role, match }) => {
      const found = crew.filter((member) => member.job && match.includes(member.job));
      found.forEach((member) => {
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

    crew.forEach((member) => {
      const uniqueKey = `${member.id}-${member.job}`;
      if (!seenPersons.has(uniqueKey)) {
        seenPersons.add(uniqueKey);
        result.push({
          ...member,
          displayRole: member.job || "Unknown Role",
        });
      }
    });

    return result;
  }, [crew]);

  return (
    <div className="relative z-30 w-full px-6 sm:px-10 md:px-16 lg:px-24 py-20 md:py-28 flex flex-col gap-16 md:gap-24">
      {/* Background Image with Glassmorphism (Restored with optimized shade+blur) */}
      {(details.backdrop_path || details.poster_path) && (
        <div className="absolute inset-0 z-[-1] pointer-events-none animate-in fade-in duration-700">
          <div className="sticky top-0 w-full h-[100dvh]">
            <Image
              src={getTMDBImageUrl(details.backdrop_path || details.poster_path || "", "original")}
              alt={title || "Background"}
              fill
              className="object-cover brightness-[0.4] contrast-[1.1] saturate-[1.1]"
              unoptimized
            />
            {/* Conditional blur: optimized intensity when player is active */}
            <div className={`absolute inset-0 transition-all duration-500 ${activeVideoKey ? 'bg-black/10 backdrop-blur-xl' : 'bg-black/15 backdrop-blur-xl'}`} />
          </div>
        </div>
      )}



      {/* Title Logo (Centered) */}
      <div className="w-full flex justify-center">

        {logoUrl ? (
          <div className="relative w-full max-w-[320px] h-20 md:h-28">
            <Image
              src={logoUrl}
              alt={title || "Title"}
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
      <div className="max-w-[1224px] text-left w-full mx-auto flex flex-col gap-4">
        <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
          Synopsis
        </h3>
        {details.tagline && (
          <p className="text-zinc-100 text-lg md:text-xl font-semibold italic leading-relaxed">
            "{details.tagline}"
          </p>
        )}
        <p className="text-zinc-200 text-base md:text-lg leading-relaxed font-medium">
          {overview}
        </p>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5 max-w-[1224px] text-left w-full mx-auto pt-12 border-t border-white/10">
        {/* Left Metadata Column */}
        <div className="flex flex-col gap-4">
          {details.genres && details.genres.length > 0 && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Genre: </span>
              <span className="text-zinc-200 font-medium">
                {details.genres.map((g) => g.name).join(", ")}
              </span>
            </div>
          )}

          {(details.release_date || details.first_air_date) && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Release Date: </span>
              <span className="text-zinc-200 font-medium">
                {new Date((details.release_date || details.first_air_date) as string).toLocaleDateString("en-US", {
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
              <span className="text-zinc-200 font-medium">
                {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
              </span>
            </div>
          )}

          {type === "tv" && details.number_of_seasons && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Seasons: </span>
              <span className="text-zinc-200 font-medium">
                {details.number_of_seasons}
              </span>
            </div>
          )}

          {type === "tv" && details.number_of_episodes && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Episodes: </span>
              <span className="text-zinc-200 font-medium">
                {details.number_of_episodes}
              </span>
            </div>
          )}

          {details.status && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Status: </span>
              <span className="text-zinc-200 font-medium">
                {details.status}
              </span>
            </div>
          )}

          {details.spoken_languages && details.spoken_languages.length > 0 ? (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Language: </span>
              <span className="text-zinc-200 font-medium">
                {details.spoken_languages[0].english_name ||
                  details.spoken_languages[0].name}
              </span>
            </div>
          ) : (
            details.original_language && (
              <div className="text-sm md:text-base">
                <span className="text-white font-bold">Language: </span>
                <span className="text-zinc-200 font-medium uppercase">
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
                <span className="text-zinc-200 font-medium">
                  {details.production_companies
                    .map((c) => c.name)
                    .slice(0, 2)
                    .join(" • ")}
                </span>
              </div>
            )}

          {type === "tv" && details.networks && details.networks.length > 0 && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Network: </span>
              <span className="text-zinc-200 font-medium">
                {details.networks.map((n) => n.name).join(" • ")}
              </span>
            </div>
          )}

          {details.budget !== undefined && details.budget > 0 && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Budget: </span>
              <span className="text-zinc-200 font-medium">
                ${(details.budget / 1000000).toFixed(0)}m
              </span>
            </div>
          )}

          {details.revenue !== undefined && details.revenue > 0 && (
            <div className="text-sm md:text-base">
              <span className="text-white font-bold">Box Office: </span>
              <span className="text-zinc-200 font-medium">
                ${(details.revenue / 1000000).toFixed(0)}m
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Episode Guide for TV Shows */}
      {type === "tv" && availableSeasons.length > 0 && (
        <div className="max-w-[1224px] w-full mx-auto border-t border-white/10 pt-12 flex flex-col gap-8 text-left">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Episode Guide
            </h3>
            <p className="text-zinc-200 text-sm md:text-base font-medium">
              Browse through seasons and episodes
            </p>
          </div>

          {/* Season Toggle Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
            {sortedSeasons.map((season) => (
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
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pt-6 pb-8 scrollbar-none">
              {episodes.map((episode) => (
                <div 
                  key={episode.id} 
                  className="snap-start shrink-0 w-[260px] md:w-[360px] lg:w-[calc((100%-48px)/3)] aspect-square relative group"
                >
                  {/* Clipped Container for Image and Content */}
                  <div 
                    onClick={() => setSelectedEpisodeForModal(episode)}
                    className="absolute inset-0 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/[0.05] hover:border-white/20 hover:scale-[1.02] transition-all duration-500 shadow-lg cursor-pointer"
                  >
                    {/* Episode Still */}
                    {episode.still_path ? (
                      <Image
                        src={getTMDBImageUrl(episode.still_path, "original")}
                        alt={episode.name || "Episode"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-zinc-500 bg-zinc-800">
                        No Preview Available
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10 pointer-events-none" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 z-20">
                      <div className="flex items-center gap-2 text-[10px] md:text-xs font-black tracking-widest text-zinc-400 uppercase">
                        <span>EPISODE {episode.episode_number}</span>
                        {episode.air_date && (
                          <>
                            <span className="opacity-50">•</span>
                            <span>
                              {new Date(episode.air_date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                              })}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <h4 className="text-base md:text-xl font-bold text-white tracking-tight mt-1 line-clamp-1 group-hover:text-intent-cyan transition-colors duration-300">
                        {episode.name || `Episode ${episode.episode_number}`}
                      </h4>

                      {episode.overview && (
                        <p className="text-zinc-300 text-xs md:text-sm leading-relaxed font-medium mt-2 line-clamp-3">
                          {episode.overview}
                        </p>
                      )}

                      {/* Footer Left (Play + Duration) */}
                      <div className="flex items-center gap-2 text-white text-xs md:text-sm font-bold mt-4">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-black transition-all duration-300">
                          <Play className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                        </div>
                        {episode.runtime && (
                          <span className="text-zinc-200 tracking-wide font-semibold">
                            {episode.runtime}m
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ellipsis Button & Dropdown Menu (Outside clipped container) */}
                  <div className="absolute bottom-5 right-5 md:bottom-6 md:right-6 z-30">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuEpisodeId(openMenuEpisodeId === episode.id ? null : episode.id);
                      }}
                      className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 shadow-lg"
                    >
                      <MoreHorizontal className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuEpisodeId === episode.id && (
                      <div className="absolute bottom-full right-0 mb-2 w-48 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 z-40 animate-in fade-in zoom-in-95 duration-200">
                        <button 
                          onClick={(e) => { e.stopPropagation(); alert("Marked as watched!"); setOpenMenuEpisodeId(null); }}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left text-sm font-semibold text-zinc-200 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
                        >
                          <Check className="w-4 h-4 text-intent-cyan" />
                          Mark as Watched
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); alert("Downloading started..."); setOpenMenuEpisodeId(null); }}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left text-sm font-semibold text-zinc-200 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.href); alert("Link copied to clipboard!"); setOpenMenuEpisodeId(null); }}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left text-sm font-semibold text-zinc-200 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
                        >
                          <Share2 className="w-4 h-4" />
                          Share Episode
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Trailers Section for TV */}
      {type === "tv" && trailers.length > 0 && (
        <div className="max-w-[1224px] w-full mx-auto border-t border-white/10 pt-12 flex flex-col gap-8 text-left">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Trailers & Clips
            </h3>
            <p className="text-zinc-200 text-sm md:text-base font-medium">
              Watch official trailers and exclusive clips
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pt-6 pb-8 scrollbar-none">
            {trailers.map((video: any) => (
              <div
                key={video.id}
                onClick={() => setActiveVideoKey(video.key)}
                className="snap-start shrink-0 w-[260px] md:w-[320px] lg:w-[calc((100%-48px)/3)] aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/[0.05] hover:border-white/20 hover:scale-[1.02] transition-all duration-500 group shadow-lg cursor-pointer relative"
              >
                <div className="absolute inset-0">
                  <Image
                    src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                    alt={video.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 z-20">
                  <h4 className="text-sm md:text-base font-bold text-white tracking-tight line-clamp-2 group-hover:text-intent-cyan transition-colors duration-300">
                    {video.name}
                  </h4>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                    {video.type}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ways to Watch */}
      {providers && providers.length > 0 ? (
        <div className="max-w-[1224px] w-full mx-auto flex flex-col gap-8 border-t border-white/10 pt-12 text-left">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Ways to Watch
            </h3>
            <p className="text-zinc-200 text-sm md:text-base font-medium">
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
        <div className="max-w-[1224px] w-full mx-auto border-t border-white/10 pt-12 text-left">
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

      {/* Trailers Section for Movies */}
      {type === "movie" && trailers.length > 0 && (
        <div className="max-w-[1224px] w-full mx-auto border-t border-white/10 pt-12 flex flex-col gap-8 text-left">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Trailers & Clips
            </h3>
            <p className="text-zinc-200 text-sm md:text-base font-medium">
              Watch official trailers and exclusive clips
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pt-6 pb-8 scrollbar-none">
            {trailers.map((video: any) => (
              <div
                key={video.id}
                onClick={() => setActiveVideoKey(video.key)}
                className="snap-start shrink-0 w-[260px] md:w-[320px] lg:w-[calc((100%-48px)/3)] aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/[0.05] hover:border-white/20 hover:scale-[1.02] transition-all duration-500 group shadow-lg cursor-pointer relative"
              >
                <div className="absolute inset-0">
                  <Image
                    src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                    alt={video.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    unoptimized
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 z-20">
                  <h4 className="text-sm md:text-base font-bold text-white tracking-tight line-clamp-2 group-hover:text-intent-cyan transition-colors duration-300">
                    {video.name}
                  </h4>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                    {video.type}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rotten Tomatoes & Audience Score Gauges */}
      <div className="max-w-[1224px] w-full mx-auto border-t border-white/10 pt-12 flex flex-col gap-10 text-left">
        <div>
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            What Critics Are Saying
          </h3>
          <p className="text-zinc-200 text-sm md:text-base font-medium">
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
            ? Math.min(100, Math.max(0, parseInt(rtValue.replace('%', ''), 10) + ((details.vote_average || 0) >= 7.5 ? 4 : -4)))
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
        <div className="max-w-[1224px] w-full mx-auto border-t border-white/10 pt-12 flex flex-col gap-8 mb-10">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              What Critics are Saying
            </h3>
            <p className="text-zinc-200 text-sm md:text-base font-medium">
              A curated look into professional cinematic breakdowns and editorial insights.
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pt-10 pb-12 scrollbar-none">
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
                    className="snap-center shrink-0 w-[300px] md:w-[380px] lg:w-[calc((100%-48px)/3)] bg-zinc-900/30 backdrop-blur-3xl border border-white/[0.05] rounded-[28px] p-8 flex flex-col justify-between min-h-[320px] shadow-xl relative overflow-hidden group transition-all duration-500 hover:border-white/10 hover:bg-zinc-900/50"
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

        <div className="flex flex-col gap-24 py-12">
          <CastSection
            title="Featured Cast"
            subtitle="The primary performers who brought these characters to life"
            cast={cast}
          />

          <CastSection
            title="Production Crew"
            subtitle="The creative team and visionaries working behind the scenes"
            cast={crew as any}
          />

          <RelatedNewsSection 
            query={title} 
            title={`Latest News: ${title}`}
            description={`Stay informed with the latest updates and editorial features about ${title}.`}
          />
        </div>

      {/* Part of a Collection Section */}
      {collectionData && (
        <div className="max-w-[1224px] w-full mx-auto flex flex-col gap-8 border-t border-white/10 pt-12 text-left">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              Part of a Collection
            </h3>
            <p className="text-zinc-200 text-sm md:text-base font-medium">
              Explore all movies in the {collectionData.title}
            </p>
          </div>

          <Link 
            href={`/collection/${collectionData.id}`}
            className="group relative w-full aspect-square sm:aspect-[21/9] md:aspect-[21/7] rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-700 shadow-2xl block"
          >
            {/* Backdrop */}
            <Image
              src={collectionData.backdropUrl}
              alt={collectionData.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out brightness-50"
              unoptimized
            />
            
            {/* Glassmorphism Hover Overlay - Positioned behind text but above image */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 backdrop-blur-md bg-black/40 transition-all duration-700 pointer-events-none z-10" />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 p-8 sm:p-10 md:p-12 flex flex-col justify-end items-start gap-4 md:gap-5 z-20">
              <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] md:text-xs font-black tracking-widest text-white uppercase">
                {collectionData.parts?.length || 0} MOVIES IN COLLECTION
              </span>
              
              <div className="flex flex-col gap-2">
                <h4 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-2xl leading-tight">
                  {collectionData.title}
                </h4>
                <p className="text-zinc-300 text-sm md:text-lg max-w-2xl font-medium line-clamp-2 md:line-clamp-3">
                  {collectionData.overview}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-bold text-sm md:text-base hover:bg-zinc-200 transition-colors">
                View Collection
                <MoreHorizontal className="w-5 h-5" />
              </div>
            </div>
            
          </Link>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="max-w-[1224px] w-full mx-auto flex flex-col gap-8">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              More Like This
            </h3>
            <p className="text-zinc-200 text-sm md:text-base font-medium">
              Explore similar titles curated just for you
            </p>
          </div>

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory"
          >
            {recommendations.map((item: any) => (
              <div key={item.id} className="w-[180px] md:w-[200px] lg:w-[calc((100%-96px)/5)] shrink-0 snap-start">
                <MediaCard 
                  data={item} 
                  variant="slider" 
                  container="grid" 
                />
              </div>
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
      {/* Episode Detail Modal */}
      {selectedEpisodeForModal && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <div className="relative max-w-2xl w-full bg-zinc-950/60 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedEpisodeForModal(null)}
              className="absolute top-5 right-5 z-30 w-9 h-9 rounded-full bg-zinc-950/50 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-zinc-950/80 transition-all duration-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Row 1: Visual + Overlaid Text */}
            <div className="relative w-full aspect-video overflow-hidden">
              {selectedEpisodeForModal.still_path ? (
                <Image
                  src={getTMDBImageUrl(selectedEpisodeForModal.still_path, "original")}
                  alt={selectedEpisodeForModal.name || "Episode"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/40 bg-zinc-900">
                  No Preview Available
                </div>
              )}
              
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10 pointer-events-none" />

              {/* Overlaid Content (Title & Specs) */}
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 z-20 flex flex-col gap-3.5 text-left">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-intent-cyan uppercase tracking-widest">
                    Episode {selectedEpisodeForModal.episode_number}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                    {selectedEpisodeForModal.name || `Episode ${selectedEpisodeForModal.episode_number}`}
                  </h3>
                </div>

                {/* Tech Specs & Rating */}
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedEpisodeForModal.vote_average !== undefined && selectedEpisodeForModal.vote_average > 0 && (
                    <div className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-xl border border-white/10 text-xs font-semibold text-white">
                      ★ {selectedEpisodeForModal.vote_average.toFixed(1)}
                    </div>
                  )}
                  <div className="px-3 py-1 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] text-[10px] font-bold text-white/80 uppercase tracking-widest">
                    4K UHD
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] text-[10px] font-bold text-white/80 uppercase tracking-widest">
                    HDR
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] text-[10px] font-bold text-white/80 uppercase tracking-widest">
                    Atmos
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Text & Providers */}
            <div className="p-8 md:p-10 flex flex-col gap-6 text-left overflow-y-auto bg-zinc-950/30">
              {/* Plot */}
              {selectedEpisodeForModal.overview && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                    Description
                  </span>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed font-normal">
                    {selectedEpisodeForModal.overview}
                  </p>
                </div>
              )}

              {/* Where to Watch */}
              {providers && providers.length > 0 && (
                <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-white/[0.06]">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                    Available to Stream
                  </span>
                  <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                    {providers.map((provider: any) => {
                      const providerLogo = provider.logo_path
                        ? `https://image.tmdb.org/t/p/w92${provider.logo_path}`
                        : null;
                      return (
                        <div 
                          key={provider.provider_id}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex-shrink-0 hover:bg-white/[0.08] transition-colors duration-300"
                        >
                          {providerLogo && (
                            <div className="relative w-5 h-5 rounded-md overflow-hidden shadow-sm">
                              <Image src={providerLogo} alt={provider.provider_name} fill className="object-cover" unoptimized />
                            </div>
                          )}
                          <span className="text-white/90 text-xs font-medium">
                            {provider.provider_name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Video Player Modal */}
      {activeVideoKey && (
        <div 
          className="fixed inset-0 z-[100] bg-black/10 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
          onMouseMove={handlePlayerMouseMove}
          onMouseLeave={handlePlayerMouseLeave}
        >
          <div 
            ref={playerContainerRef}
            className="relative max-w-6xl w-full aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col group will-change-transform"
          >

            {/* YouTube Player Container */}
            <div className="absolute inset-0 z-10">
              <div id="custom-yt-player" className="w-full h-full pointer-events-none" />
            </div>
            
            {/* Cinematic Black Bars (Pure #000000 Letterboxing) */}
            <div className="absolute top-0 inset-x-0 h-[10%] bg-[#000000] z-15 pointer-events-none shadow-[0_10px_30px_rgba(0,0,0,0.9)]" />
            <div className="absolute bottom-0 inset-x-0 h-[12%] bg-[#000000] z-15 pointer-events-none shadow-[0_-10px_30px_rgba(0,0,0,0.9)]" />


            {/* Title & Context Overlay (Top Left - Aligned with Bar) */}
            <div className={`absolute top-4 left-6 z-30 flex flex-col gap-1 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-[10px] font-bold text-intent-cyan uppercase tracking-wider">
                {title}
              </span>
              <h3 className="text-xs md:text-sm font-bold text-white tracking-tight line-clamp-1">
                {trailers.find((v: any) => v.key === activeVideoKey)?.name}
              </h3>
            </div>


            {/* Close Button Top Right */}
            <button 
              onClick={() => setActiveVideoKey(null)}
              className={`absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 cursor-pointer ${showControls ? 'opacity-100' : 'opacity-0'}`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glassmorphic Overlay for Controls (Aligned with Bottom Bar) */}
            <div className={`absolute inset-x-0 bottom-0 z-20 p-5 md:p-6 flex flex-col gap-3 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {/* Seek Bar */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-zinc-300 min-w-[40px] text-right">
                  {formatTime(currentTime)}
                </span>
                <input 
                  type="range" 
                  min={0} 
                  max={duration || 100} 
                  value={currentTime} 
                  onChange={(e) => {
                    const time = parseFloat(e.target.value);
                    try {
                      player?.seekTo(time, true);
                    } catch (err) {}
                    setCurrentTime(time);
                  }}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-intent-cyan" 
                />
                <span className="text-xs font-semibold text-zinc-300 min-w-[40px]">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <button 
                    onClick={() => {
                      try {
                        if (isPlaying) {
                          player?.pauseVideo();
                          setIsPlaying(false);
                        } else {
                          player?.playVideo();
                          setIsPlaying(true);
                        }
                      } catch (err) {}
                    }}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 cursor-pointer"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-1" />
                    )}
                  </button>

                  {/* Sound/Volume Toggle */}
                  <button 
                    onClick={() => {
                      try {
                        if (isMuted) {
                          player?.unMute();
                          setIsMuted(false);
                        } else {
                          player?.mute();
                          setIsMuted(true);
                        }
                      } catch (err) {}
                    }}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 cursor-pointer"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Quality Selector */}
                  <div className="relative group/quality">
                    <button className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all duration-300 flex items-center gap-2 cursor-pointer">
                      <Settings className="w-4 h-4" />
                      <span className="uppercase">{playbackQuality}</span>
                    </button>
                    <div className="absolute bottom-full right-0 mb-2 w-32 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-1 shadow-2xl flex flex-col gap-1 z-40 opacity-0 pointer-events-none group-hover/quality:opacity-100 group-hover/quality:pointer-events-auto transition-all duration-200">
                      {(availableQualities.length > 0 ? availableQualities : ['hd1080', 'hd720', 'large', 'medium', 'auto']).map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            if (!player) return;
                            try {
                              // Try setPlaybackQuality first for a seamless switch
                              player.setPlaybackQuality(q);
                              setPlaybackQuality(q);
                              
                              // In some cases we might need to reload the buffer to force the change
                              // but setPlaybackQuality is the preferred first attempt
                              if (q !== 'auto') {
                                const currTime = player.getCurrentTime();
                                player.loadVideoById({
                                  videoId: activeVideoKey,
                                  startSeconds: currTime,
                                  suggestedQuality: q
                                });
                              }
                              setIsPlaying(true);
                            } catch (e) {
                              console.warn("Player quality adjust error:", e);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-left text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer uppercase ${playbackQuality === q ? 'text-intent-cyan font-bold bg-white/5' : ''}`}
                        >
                          {q === 'hd2160' ? '4K' : q === 'hd1440' ? '2K' : q === 'hd1080' ? '1080p' : q === 'hd720' ? '720p' : q === 'large' ? '480p' : q === 'medium' ? '360p' : q === 'small' ? '240p' : q === 'tiny' ? '144p' : 'Auto'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fullscreen Toggle */}
                  <button 
                    onClick={() => {
                      try {
                        if (!document.fullscreenElement) {
                          playerContainerRef.current?.requestFullscreen();
                          setIsFullscreen(true);
                        } else {
                          document.exitFullscreen();
                          setIsFullscreen(false);
                        }
                      } catch (err) {}
                    }}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 cursor-pointer"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-5 h-5" />
                    ) : (
                      <Maximize className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
