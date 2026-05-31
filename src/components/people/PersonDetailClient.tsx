"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  BookOpen, 
  Link2, 
  MoreHorizontal,
  Users
} from "lucide-react";
import { MediaCard } from "@/components/ui/MediaCard";
import type { CuratedPerson } from "@/constants/people";
import type { Credit, MovieCard } from "@/types/types";

interface PersonDetailClientProps {
  person: any; // TMDB basic person info
  movieCredits: { cast: Credit[]; crew: Credit[] };
  tvCredits: { cast: Credit[]; crew: Credit[] };
  curatedData?: CuratedPerson;
}

// Scalloped verification checkmark matching Instagram's exact verified badge
export function BlueBadge() {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/3840px-Twitter_Verified_Badge.svg.png"
      alt="Verified Account"
      className="w-5 h-5 md:w-6 md:h-6 shrink-0 select-none drop-shadow-[0_2px_8px_rgba(0,149,246,0.3)] object-contain"
    />
  );
}

export function PersonDetailClient({ person, movieCredits, tvCredits, curatedData }: PersonDetailClientProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Profile link copied to clipboard!");
  const [visibleCount, setVisibleCount] = useState(18);
  const [activeRole, setActiveRole] = useState<"all" | "director" | "producer" | "actor" | "writer">("all");

  // Options Modal State
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isRankCardOpen, setIsRankCardOpen] = useState(false);

  // Story Viewer State
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const castCredits = useMemo(() => [...(movieCredits?.cast || []), ...(tvCredits?.cast || [])], [movieCredits, tvCredits]);
  const crewCredits = useMemo(() => [...(movieCredits?.crew || []), ...(tvCredits?.crew || [])], [movieCredits, tvCredits]);
  
  // Deduplicate and aggregate all credits
  const allUniqueCredits = useMemo(() => {
    const map = new Map<number, Credit>();
    [...castCredits, ...crewCredits].forEach((c) => {
      if (!map.has(c.id)) {
        map.set(c.id, c);
      }
    });
    return Array.from(map.values()).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }, [castCredits, crewCredits]);

  // Determine available roles for filter buttons
  const availableRoles = useMemo(() => {
    const roles: Array<{ label: string; value: "all" | "director" | "producer" | "actor" | "writer" }> = [
      { label: "All Works", value: "all" },
    ];

    const hasDirected = crewCredits.some((c) => c.job === "Director");
    const hasProduced = crewCredits.some((c) => ["Producer", "Executive Producer"].includes(c.job || ""));
    const hasWritten = crewCredits.some((c) => ["Writer", "Screenplay", "Story"].includes(c.job || ""));
    const hasActed = castCredits.length > 0;

    if (hasDirected) roles.push({ label: "Directed", value: "director" });
    if (hasActed) roles.push({ label: "Acted", value: "actor" });
    if (hasProduced) roles.push({ label: "Produced", value: "producer" });
    if (hasWritten) roles.push({ label: "Written", value: "writer" });

    return roles;
  }, [castCredits, crewCredits]);

  // Filter and sort work credits
  const filteredCredits = useMemo(() => {
    let list: Credit[] = [];
    if (activeRole === "all") {
      list = allUniqueCredits;
    } else if (activeRole === "director") {
      list = crewCredits.filter((c) => c.job === "Director");
    } else if (activeRole === "producer") {
      list = crewCredits.filter((c) => ["Producer", "Executive Producer"].includes(c.job || ""));
    } else if (activeRole === "writer") {
      list = crewCredits.filter((c) => ["Writer", "Screenplay", "Story"].includes(c.job || ""));
    } else if (activeRole === "actor") {
      list = castCredits;
    }

    // Deduplicate
    const unique = Array.from(new Map(list.map((c) => [c.id, c])).values());

    // Sort: top popularity films first
    return unique.sort((a, b) => {
      const yearA = parseInt((a.release_date || a.first_air_date || "").substring(0, 4)) || 0;
      const yearB = parseInt((b.release_date || b.first_air_date || "").substring(0, 4)) || 0;
      return (b.popularity || 0) - (a.popularity || 0) || yearB - yearA;
    });
  }, [activeRole, allUniqueCredits, castCredits, crewCredits]);

  // Map Credit to MovieCard structure
  const mapToMovieCard = (credit: Credit): MovieCard => {
    const isTV = credit.media_type === "tv" || !!credit.first_air_date;
    return {
      id: credit.id,
      title: credit.title || credit.name || "",
      genre: isTV ? "Series" : "Movie",
      posterUrl: credit.poster_path ? `https://image.tmdb.org/t/p/w500${credit.poster_path}` : "",
      year: parseInt((credit.release_date || credit.first_air_date || "").substring(0, 4)) || undefined,
      rating: credit.vote_average,
    };
  };

  // Select top 3 works with valid posters to act as stories slides
  const storySlides = useMemo(() => {
    const worksWithPosters = allUniqueCredits
      .filter((c) => c.poster_path)
      .slice(0, 3)
      .map((c) => ({
        title: c.title || c.name || "Untitled Film",
        url: `https://image.tmdb.org/t/p/original${c.poster_path}`,
        year: (c.release_date || c.first_air_date || "").substring(0, 4),
        rating: c.vote_average ? c.vote_average.toFixed(1) : "8.0",
      }));
      
    // Fallbacks if no posters found
    if (worksWithPosters.length === 0) {
      return [
        { title: "Masterpieces of Cinema", url: "/images/poster-placeholder.jpg", year: "2026", rating: "9.5" }
      ];
    }
    return worksWithPosters;
  }, [allUniqueCredits]);

  // Vibe tag block: Curated or Smart Auto-generated tags
  const vibeTags = useMemo(() => {
    if (curatedData?.signatureAesthetics) {
      return curatedData.signatureAesthetics;
    }
    const tags = [];
    if (person.known_for_department === "Directing") {
      tags.push("Auteur Visuals", "Directorial Control");
    } else if (person.known_for_department === "Camera") {
      tags.push("Atmospheric Lighting", "Dynamic Framing", "Masters of Light");
    } else if (person.known_for_department === "Writing") {
      tags.push("Complex Narratives", "Dialogue Driven");
    } else {
      tags.push("Character Devotion", "Screen Presence");
    }

    const topGenres: string[] = allUniqueCredits
      .slice(0, 5)
      .map((c) => c.media_type === "tv" ? "Drama" : "Feature Cinema")
      .filter(Boolean);
    
    if (topGenres.includes("Sci-Fi") || allUniqueCredits.some(c => c.title?.includes("Star") || c.title?.includes("Dune"))) {
      tags.push("High-Concept Sci-Fi");
    }
    tags.push("Cinematic Detail");

    return Array.from(new Set(tags)).slice(0, 3);
  }, [curatedData, person, allUniqueCredits]);

  // Frequent collaborators: Curated or dynamically calculated
  const collaborators = useMemo(() => {
    if (curatedData?.frequentCollaborators && curatedData.frequentCollaborators.length > 0) {
      return curatedData.frequentCollaborators;
    }
    const defaults = [
      { id: 525, name: "Christopher Nolan", role: "Director", profilePath: "/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg" },
      { id: 137427, name: "Denis Villeneuve", role: "Director", profilePath: "/zdDx9Xs93UIrJFWYApYR28J8M6b.jpg" },
      { id: 2037, name: "Cillian Murphy", role: "Actor", profilePath: "/ycZpLjHxsNPvsB6ndu2D9qsx94X.jpg" },
      { id: 1190668, name: "Timothée Chalamet", role: "Actor", profilePath: "/dFxpwRpmzpVfP1zjluH68DeQhyj.jpg" }
    ];
    return defaults.filter(d => d.id !== person.id).slice(0, 3);
  }, [curatedData, person]);

  const profileImg = person.profile_path
    ? `https://image.tmdb.org/t/p/original${person.profile_path}`
    : "/images/poster-placeholder.jpg";

  // Lifespan calculate helper
  const birthYear = person.birthday ? person.birthday.substring(0, 4) : "";
  const deathYear = person.deathday ? person.deathday.substring(0, 4) : "";
  const location = person.place_of_birth || "Worldwide";

  // Realistic Instagram stat calculations from TMDB popularity score (updates on follow)
  const followerCount = useMemo(() => {
    const pop = person.popularity || 10;
    let baseCount = 0;
    let unit = "K";
    if (pop > 100) {
      baseCount = pop / 10;
      unit = "M";
    } else if (pop > 10) {
      baseCount = pop * 10;
    } else {
      baseCount = pop * 1.5;
    }
    
    // Add 1 dynamically if following
    const total = isFollowing ? baseCount + (unit === "M" ? 0.0001 : 1) : baseCount;
    return unit === "M" ? `${total.toFixed(1)}M` : `${Math.round(total)}K`;
  }, [person.popularity, isFollowing]);

  const followingCount = useMemo(() => {
    return Math.round((person.popularity || 10) * 0.8) + 42;
  }, [person.popularity]);

  // Dynamic share copying to clipboard
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setToastMessage("Profile link copied to clipboard!");
        setShowToast(true);
        setIsOptionsOpen(false);
        setTimeout(() => setShowToast(false), 2500);
      });
    }
  };

  const handleSimulateDM = () => {
    setToastMessage("Shared successfully with connections!");
    setShowToast(true);
    setIsOptionsOpen(false);
    setTimeout(() => setShowToast(false), 2500);
  };

  // Story Viewer Timer Logic
  useEffect(() => {
    if (isStoryOpen) {
      // Pause browser scrolling when stories are active
      document.body.style.overflow = "hidden";
      
      storyTimerRef.current = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            // Next Slide
            setStoryIndex((prevIdx) => {
              if (prevIdx >= storySlides.length - 1) {
                // End of stories
                setIsStoryOpen(false);
                return 0;
              }
              return prevIdx + 1;
            });
            return 0;
          }
          return prev + 2.5; // Increment to fill 100% in 4 seconds (2.5 * 40 = 100)
        });
      }, 100);
    } else {
      document.body.style.overflow = "unset";
      if (storyTimerRef.current) {
        clearInterval(storyTimerRef.current);
      }
      setStoryProgress(0);
      setStoryIndex(0);
    }

    return () => {
      if (storyTimerRef.current) {
        clearInterval(storyTimerRef.current);
      }
    };
  }, [isStoryOpen, storySlides.length]);

  const handleStoryNext = () => {
    if (storyIndex >= storySlides.length - 1) {
      setIsStoryOpen(false);
    } else {
      setStoryIndex((prev) => prev + 1);
      setStoryProgress(0);
    }
  };

  const handleStoryPrev = () => {
    if (storyIndex === 0) {
      setStoryProgress(0);
    } else {
      setStoryIndex((prev) => prev - 1);
      setStoryProgress(0);
    }
  };

  return (
    <div className="w-full bg-black text-white selection:bg-brand-accent/30 selection:text-white pb-20">
      
      {/* Background Soft Interactive Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-[#0095f6]/5 via-transparent to-transparent pointer-events-none blur-[140px] z-0" />

      {/* Breadcrumb Back Arrow */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 md:pt-28 pb-4 z-10 relative">
        <Link
          href="/people"
          className="group w-fit flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Visionaries Hub
        </Link>
      </div>

      {/* Instagram Header Section */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 pt-6 pb-6">
          
          {/* Avatar Area with Instagram Gradient ring (Click to view Story!) */}
          <div className="shrink-0 relative group">
            <button
              onClick={() => setIsStoryOpen(true)}
              className="relative w-36 h-36 md:w-44 md:h-44 rounded-full p-[4px] bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#962fbf] shadow-2xl transition-transform duration-500 hover:scale-[1.03] cursor-pointer"
              title="Click to view cinematic stories"
            >
              <div className="relative w-full h-full rounded-full overflow-hidden border-[4px] border-black bg-zinc-950">
                <Image
                  src={profileImg}
                  alt={person.name}
                  fill
                  priority
                  className="object-cover object-center filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  unoptimized
                />
              </div>
              
              {/* Tap Stories hint badge */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#d62976] text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-black shadow-lg scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Tap story
              </div>
            </button>
          </div>

          {/* Bio Box / Stats details */}
          <div className="flex-1 flex flex-col gap-5 text-left w-full mt-2">
            
            {/* Username Row: Name, Verification Badge, Actions */}
            <div className="flex flex-wrap items-center gap-4.5">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white select-all">
                  {person.name.toLowerCase().replace(/\s+/g, "_")}
                </h1>
                <BlueBadge />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all duration-300 active:scale-95 cursor-pointer shadow-sm ${
                    isFollowing
                      ? "bg-zinc-800 text-white hover:bg-zinc-700/80"
                      : "bg-[#0095f6] text-white hover:bg-[#1877f2]"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
                
                <a
                  href={`https://www.themoviedb.org/person/${person.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-300 font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
                >
                  TMDB Profile
                  <Link2 className="w-3 h-3" />
                </a>

                <button 
                  onClick={() => setIsOptionsOpen(true)}
                  className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer"
                  aria-label="Options menu"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats row: Posts, Followers, Following */}
            <div className="flex items-center gap-10 border-t border-b border-zinc-900 md:border-none py-3 md:py-0 text-sm md:text-base">
              <div>
                <span className="font-bold text-white">{allUniqueCredits.length}</span>{" "}
                <span className="text-zinc-400">works</span>
              </div>
              <div>
                <span className="font-bold text-white">{followerCount}</span>{" "}
                <span className="text-zinc-400">followers</span>
              </div>
              <div>
                <span className="font-bold text-white">{followingCount}</span>{" "}
                <span className="text-zinc-400">following</span>
              </div>
            </div>

            {/* Curated Instagram-Style Bio */}
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col">
                <span className="font-bold text-white text-base leading-tight select-all">
                  {person.name}
                </span>
                <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-0.5">
                  {curatedData?.role || person.known_for_department || "Artist"}
                </span>
              </div>

              {/* Bullet bio items */}
              <div className="text-zinc-300 text-sm leading-relaxed space-y-1.5 font-normal max-w-2xl">
                {person.birthday && (
                  <p className="flex items-center gap-2 select-all">
                    <span>🎂</span> Born {person.birthday} {deathYear && `— Passed away ${person.deathday}`}
                  </p>
                )}
                <p className="flex items-center gap-2 select-all">
                  <span>📍</span> {location}
                </p>
                
                {/* Awards bullet */}
                <p className="flex items-center gap-2 select-all text-brand-accent font-semibold">
                  <span>🏆</span> {curatedData?.awardsBadge || "Oscar Class Cinematic Contributor"}
                </p>

                {/* Aesthetics tags bullet */}
                <div className="flex items-center gap-2 flex-wrap pt-1.5 select-none">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Aesthetics:</span>
                  {vibeTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded bg-zinc-900 border border-white/5 text-[10px] font-bold text-zinc-300"
                    >
                      #{tag.replace(/\s+/g, "")}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instagram bio link */}
              {person.homepage && (
                <a
                  href={person.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0095f6] hover:underline text-sm font-semibold flex items-center gap-1 mt-1 w-fit select-all"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  {person.homepage.replace(/https?:\/\/(www\.)?/, "")}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Unified Layout Flow (No Toggles) */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-16 pt-6 relative z-10">
        
        {/* SECTION 1: Biography & Artist Facts (First in Hierarchy) */}
        <section className="border-t border-zinc-900 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Detailed bio text */}
            <div className="md:col-span-2 flex flex-col gap-6 p-6 rounded-3xl bg-zinc-950/60 backdrop-blur-md border border-zinc-900 shadow-md">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#0095f6] mb-1 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Biography & Profile
              </h3>
              <div className="text-zinc-300 text-sm leading-relaxed space-y-4 font-normal">
                {person.biography ? (
                  person.biography.split("\n\n").map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <p className="italic text-zinc-500">
                    Detailed documentary biography is currently being curated for the FrameMeta archives.
                  </p>
                )}
              </div>
            </div>

            {/* Profile Details Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Meta details list */}
              <div className="p-6 rounded-3xl bg-zinc-950/60 backdrop-blur-md border border-zinc-900 flex flex-col gap-5 shadow-md">
                <h4 className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
                  Artist Facts
                </h4>
                <div className="flex flex-col gap-4 text-xs font-semibold">
                  
                  {person.known_for_department && (
                    <div className="flex flex-col">
                      <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-black">Department</span>
                      <span className="text-zinc-200 mt-1">{person.known_for_department}</span>
                    </div>
                  )}

                  {person.birthday && (
                    <div className="flex flex-col">
                      <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-black">Date of Birth</span>
                      <span className="text-zinc-200 mt-1">{person.birthday}</span>
                    </div>
                  )}

                  {person.place_of_birth && (
                    <div className="flex flex-col">
                      <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-black">Place of Birth</span>
                      <span className="text-zinc-200 mt-1">{person.place_of_birth}</span>
                    </div>
                  )}

                  {person.popularity && (
                    <div className="flex flex-col">
                      <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-black">TMDB Popularity Rating</span>
                      <span className="text-zinc-200 mt-1 flex items-center gap-1">
                        ★ {(person.popularity / 10).toFixed(1)} / 10
                        <span className="text-zinc-500 font-medium">({person.popularity.toFixed(0)} score)</span>
                      </span>
                    </div>
                  )}

                  {person.imdb_id && (
                    <div className="flex flex-col">
                      <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-black">IMDb Index</span>
                      <a
                        href={`https://www.imdb.com/name/${person.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0095f6] hover:underline mt-1 w-fit flex items-center gap-1"
                      >
                        View IMDb ID
                        <Link2 className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Ambient aesthetic callout */}
              <div className="p-6 rounded-3xl bg-linear-to-br from-[#0095f6]/10 to-transparent border border-[#0095f6]/20 flex flex-col gap-2.5 shadow-md">
                <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">
                  Cinematic Class
                </span>
                <p className="text-zinc-300 text-xs font-medium leading-relaxed text-left">
                  Recognized as a visionary contributor by the FrameMeta Academy of Cinematic Curation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Frequent Collaborators / Cinematic Connections */}
        {collaborators.length > 0 && (
          <section className="border-t border-zinc-900 pt-10 text-left">
            <div className="mb-6">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#0095f6] mb-1 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Cinematic Connections
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Visionaries, actors, and producers who collaborated with {person.name} across productions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
              {collaborators.map((collab) => {
                const img = collab.profilePath
                  ? (collab.profilePath.startsWith("http") ? collab.profilePath : `https://image.tmdb.org/t/p/w185${collab.profilePath}`)
                  : "/images/poster-placeholder.jpg";

                return (
                  <Link
                    key={collab.id}
                    href={`/people/${collab.id}`}
                    className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-950/60 hover:bg-zinc-900/60 border border-white/5 hover:border-brand-accent/20 transition-all duration-300 cursor-pointer shadow-md select-none"
                  >
                    <div className="flex items-center gap-4.5">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                        <Image
                          src={img}
                          alt={collab.name}
                          fill
                          className="object-cover object-center filter grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
                          unoptimized
                        />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-bold text-zinc-200 group-hover:text-brand-accent transition-colors line-clamp-1">
                          {collab.name}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-0.5">
                          {collab.role}
                        </span>
                      </div>
                    </div>
                    
                    <span className="px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-[9px] font-black uppercase tracking-wider text-zinc-400 group-hover:text-white group-hover:bg-[#0095f6] group-hover:border-[#0095f6] transition-all duration-300">
                      View
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 3: The Filmography Hub using our standard cards */}
        <section className="border-t border-zinc-900 pt-10 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-base font-black text-[#0095f6] tracking-widest uppercase">
                The Filmography Hub
              </h2>
              <div className="h-[2px] w-12 bg-brand-accent mt-2 rounded-full" />
            </div>

            {/* Filter buttons */}
            {availableRoles.length > 1 && (
              <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-950 border border-zinc-900 rounded-xl w-fit">
                {availableRoles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => {
                      setActiveRole(role.value);
                      setVisibleCount(18);
                    }}
                    className={`px-4.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      activeRole === role.value
                        ? "bg-white text-black font-extrabold shadow-md"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Catalog grid of works using MediaCard */}
          <div className="min-h-[300px]">
            {filteredCredits.length > 0 ? (
              <div className="flex flex-col gap-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-1">
                  {filteredCredits.slice(0, visibleCount).map((credit, idx) => (
                    <div
                      key={`${activeRole}-${credit.id}-${idx}`}
                      className="w-full shrink-0"
                    >
                      <MediaCard 
                        data={mapToMovieCard(credit)} 
                        variant="catalog" 
                        container="grid"
                      />
                    </div>
                  ))}
                </div>

                {visibleCount < filteredCredits.length && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 18)}
                      className="px-10 py-4 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-all duration-300 cursor-pointer active:scale-95"
                    >
                      Load More Works ({filteredCredits.length - visibleCount} Left)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full py-24 flex items-center justify-center text-center">
                <p className="text-zinc-500 font-semibold uppercase tracking-widest text-xs">
                  No cinematic works found under this filter.
                </p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* ─────────────────────────────────────────────────────────────────
          MODALS & OVERLAYS (Instagram Visual Style)
          ───────────────────────────────────────────────────────────────── */}

      {/* A. INSTAGRAM STORY VIEWER MODAL */}
      <AnimatePresence>
        {isStoryOpen && (
          <div className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center backdrop-blur-md select-none">
            
            {/* Story frame wrapper */}
            <div className="relative w-full max-w-[420px] aspect-[9/16] h-[92vh] max-h-[820px] rounded-3xl overflow-hidden bg-zinc-950 flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.85)] border border-white/5">
              
              {/* Background active image */}
              <div className="absolute inset-0">
                <Image
                  src={storySlides[storyIndex]?.url}
                  alt={storySlides[storyIndex]?.title}
                  fill
                  priority
                  className="object-cover object-center filter brightness-[0.82] contrast-[1.05]"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 pointer-events-none" />
              </div>

              {/* Segmented Top Progress Bars */}
              <div className="absolute top-4 inset-x-4 flex gap-1.5 z-50">
                {storySlides.map((_, idx) => (
                  <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                      style={{
                        width:
                          idx === storyIndex
                            ? `${storyProgress}%`
                            : idx < storyIndex
                            ? "100%"
                            : "0%",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Story Header (Avatar, Name, Time, Close) */}
              <div className="absolute top-8 inset-x-4 flex items-center justify-between z-50">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                    <Image
                      src={profileImg}
                      alt={person.name}
                      fill
                      className="object-cover object-center"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">
                      {person.name.toLowerCase().replace(/\s+/g, "_")}
                    </span>
                    <span className="text-[8px] text-zinc-300 font-bold tracking-widest uppercase">
                      Visionary Story
                    </span>
                  </div>
                </div>
                
                {/* Close Stories Button */}
                <button
                  onClick={() => setIsStoryOpen(false)}
                  className="p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
                  title="Close stories"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>

              {/* Click triggers (Left 30% goes back, Right 70% goes forward) */}
              <div className="absolute inset-y-0 left-0 w-[30%] z-40 cursor-w-resize" onClick={handleStoryPrev} />
              <div className="absolute inset-y-0 right-0 w-[70%] z-40 cursor-e-resize" onClick={handleStoryNext} />

              {/* Story Bottom Details (Movie Card overlay overlaying the story poster) */}
              <div className="absolute bottom-10 inset-x-4 z-50 p-5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/5 text-left flex flex-col gap-2">
                <span className="text-[8px] font-black text-brand-accent uppercase tracking-widest">
                  Featured Masterpiece
                </span>
                <h3 className="text-lg font-black text-white tracking-tight line-clamp-1">
                  {storySlides[storyIndex]?.title}
                </h3>
                <div className="flex items-center gap-3.5 text-xs text-zinc-300 font-semibold">
                  <span className="flex items-center gap-1 text-brand-accent">
                    ★ {storySlides[storyIndex]?.rating}
                  </span>
                  <span>•</span>
                  <span>{storySlides[storyIndex]?.year}</span>
                </div>
              </div>

            </div>

          </div>
        )}
      </AnimatePresence>

      {/* B. INSTAGRAM OPTIONS MODAL SHEET */}
      <AnimatePresence>
        {isOptionsOpen && (
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-xs z-[999] flex items-center justify-center p-6"
            onClick={() => setIsOptionsOpen(false)}
          >
            <div 
              className="w-full max-w-[340px] bg-zinc-950/95 backdrop-blur-2xl rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-200 text-left"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
            >
              {/* Modal Title Header */}
              <div className="p-5 border-b border-zinc-900 flex flex-col gap-1 select-none">
                <span className="text-[9px] font-black text-brand-accent uppercase tracking-widest">Connect</span>
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Social Channels</h3>
              </div>

              {/* Social Channels List */}
              <div className="flex flex-col p-4 gap-2">
                
                {/* Instagram Link */}
                <a
                  href={`https://instagram.com/${person.name.toLowerCase().replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/40 hover:bg-[#e1306c]/10 border border-white/5 hover:border-[#e1306c]/30 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <svg className="w-5 h-5 text-[#e1306c] fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">Instagram</span>
                      <span className="text-[9px] font-bold text-zinc-500 mt-0.5 select-all">@{person.name.toLowerCase().replace(/\s+/g, "_")}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase text-zinc-500 group-hover:text-[#e1306c] tracking-widest transition-colors select-none">Visit</span>
                </a>

                {/* X / Twitter Link */}
                <a
                  href={`https://x.com/${person.name.toLowerCase().replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/40 hover:bg-white/5 border border-white/5 hover:border-white/20 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">Twitter / X</span>
                      <span className="text-[9px] font-bold text-zinc-500 mt-0.5 select-all">@{person.name.toLowerCase().replace(/\s+/g, "_")}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase text-zinc-500 group-hover:text-white tracking-widest transition-colors select-none">Visit</span>
                </a>

                {/* Facebook Link */}
                <a
                  href={`https://facebook.com/${person.name.toLowerCase().replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/40 hover:bg-[#1877f2]/10 border border-white/5 hover:border-[#1877f2]/30 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <svg className="w-5 h-5 text-[#1877f2] fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">Facebook</span>
                      <span className="text-[9px] font-bold text-zinc-500 mt-0.5 select-all">@{person.name.toLowerCase().replace(/\s+/g, "_")}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase text-zinc-500 group-hover:text-[#1877f2] tracking-widest transition-colors select-none">Visit</span>
                </a>

              </div>

              {/* Utility actions */}
              <div className="p-4 bg-zinc-950/80 border-t border-zinc-900 flex gap-2.5">
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 rounded-2xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-white font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer select-none"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => setIsOptionsOpen(false)}
                  className="flex-1 py-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900/30 text-rose-500 font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer select-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* C. ABOUT VERIFIED STATUS POPUP */}
      <AnimatePresence>
        {isRankCardOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-xs z-[999] flex items-center justify-center p-6"
            onClick={() => setIsRankCardOpen(false)}
          >
            <div 
              className="w-full max-w-sm bg-zinc-900 rounded-3xl border border-white/10 p-6 flex flex-col gap-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center gap-3">
                <BlueBadge />
                <h3 className="text-base font-black uppercase tracking-wider text-white">
                  Verified Visionary
                </h3>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                  The verified badge indicates that FrameMeta has authenticated this account as an official director, creator, or performer in modern cinema history.
                </p>
              </div>

              <div className="flex flex-col gap-3 text-xs text-left bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500 font-bold">Account Status</span>
                  <span className="text-brand-accent font-extrabold uppercase">Verified</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500 font-bold">Rank Level</span>
                  <span className="text-zinc-200 font-extrabold">{person.popularity > 50 ? "Oscar Class auteur" : "Visionary contributor"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-bold">Popularity Index</span>
                  <span className="text-zinc-200 font-extrabold">{person.popularity?.toFixed(1) || "12.0"} score</span>
                </div>
              </div>

              <button
                onClick={() => setIsRankCardOpen(false)}
                className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Copy Glass Toast Notification */}
      <div className={`fixed bottom-8 right-8 z-[9999] transform transition-all duration-500 flex items-center gap-3 bg-zinc-950/90 backdrop-blur-xl border border-white/10 px-5 py-3.5 rounded-2xl shadow-2xl text-[10px] font-black uppercase tracking-widest ${showToast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}`}>
        <span className="w-2.5 h-2.5 rounded-full bg-[#0095f6] animate-pulse" />
        <span className="text-zinc-200">{toastMessage}</span>
      </div>

    </div>
  );
}
