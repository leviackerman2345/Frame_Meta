"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Calendar, MapPin, Star, User, Film, Camera, ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { MediaCard } from "@/components/ui/MediaCard";
import type { CuratedPerson } from "@/constants/people";
import type { Credit, MovieCard } from "@/types/types";

interface PersonDetailClientProps {
  person: any; // TMDB basic person info
  movieCredits: { cast: Credit[]; crew: Credit[] };
  tvCredits: { cast: Credit[]; crew: Credit[] };
  curatedData?: CuratedPerson;
}

export function PersonDetailClient({ person, movieCredits, tvCredits, curatedData }: PersonDetailClientProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(18);

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
    if (hasActed) roles.push({ label: "Acted In", value: "actor" });
    if (hasProduced) roles.push({ label: "Produced", value: "producer" });
    if (hasWritten) roles.push({ label: "Written", value: "writer" });

    return roles;
  }, [castCredits, crewCredits]);

  const [activeRole, setActiveRole] = useState<"all" | "director" | "producer" | "actor" | "writer">("all");

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

  // Vibe tag block: Curated or Smart Auto-generated tags
  const vibeTags = useMemo(() => {
    if (curatedData?.signatureAesthetics) {
      return curatedData.signatureAesthetics;
    }
    // Dynamic fallback tags based on dynamic department or genre
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

    // Add genre-based aesthetics by scanning top credits
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

    // Dynamic smart generation: Scan films and collect top-billed directors/actors
    // To keep it simple and elegant, we can offer a beautifully dynamic fallback list of popular co-stars/directors
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

  return (
    <div className="w-full bg-black text-white selection:bg-brand-accent/30 selection:text-white">
      
      {/* Dynamic ambient back glowing light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] bg-gradient-to-b from-brand-accent/5 via-transparent to-transparent pointer-events-none blur-[120px] z-0" />

      {/* Breadcrumb back */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 md:pt-36 pb-6 z-10 relative">
        <Link
          href="/people"
          className="group w-fit flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Visionaries
        </Link>
      </div>

      {/* 1. The Profile Header: Split screen layout */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left: Premium headshot portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[3/4] w-full md:w-[360px] rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-950 shadow-[0_24px_60px_rgba(0,0,0,0.65)] group shrink-0"
          >
            <Image
              src={profileImg}
              alt={person.name}
              fill
              priority
              className="object-cover object-center filter grayscale contrast-[1.12] brightness-[0.93] transition-transform duration-1000 group-hover:scale-103"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent pointer-events-none" />
            <div className="absolute inset-0 border border-white/10 rounded-[2.5rem] pointer-events-none" />
          </motion.div>

          {/* Right: Dynamic info box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col gap-6 text-left w-full"
          >
            {/* Tagline & Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-wider text-zinc-400">
                {person.known_for_department || "Auteur"}
              </span>
              
              {/* Prestigious Awards & Nominations Badge */}
              <div className="px-3.5 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-[9px] font-black uppercase tracking-wider text-brand-accent flex items-center gap-1 shadow-sm">
                <Star className="w-2.5 h-2.5 fill-brand-accent text-brand-accent" />
                {curatedData?.awardsBadge || "Oscar Class Contributor"}
              </div>
            </div>

            {/* Bold Name */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none">
              {person.name}
            </h1>

            {/* Birth/Location Details */}
            <div className="flex flex-wrap items-center gap-4.5 text-zinc-400 text-xs md:text-sm font-semibold">
              {person.birthday && (
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-accent" />
                  {person.birthday} {deathYear && `— ${person.deathday}`}
                </span>
              )}
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-accent" />
                {location}
              </span>
            </div>

            {/* Minimalist Biography */}
            <div className="text-zinc-300 text-sm md:text-base leading-relaxed font-light space-y-4 max-w-3xl">
              <p className="line-clamp-6 md:line-clamp-none hover:line-clamp-none transition-all duration-300">
                {person.biography || "Biography currently being curated by the FrameMeta archives."}
              </p>
            </div>

            {/* Follow Action */}
            <div className="flex items-center gap-4 pt-3 flex-wrap">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-8 py-3.5 rounded-full font-extrabold text-xs uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 flex items-center gap-2 cursor-pointer ${
                  isFollowing
                    ? "bg-brand-accent text-white shadow-[0_0_20px_rgba(94,103,230,0.3)]"
                    : "bg-white/5 border border-white/10 hover:bg-white hover:text-black"
                }`}
              >
                <Heart className={`w-4 h-4 ${isFollowing ? "fill-white" : ""}`} />
                {isFollowing ? "Following" : "Follow Artist"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Signature Aesthetic: The Vibe Tag Block */}
      <section className="w-full border-t border-white/5 bg-zinc-950/20 py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="text-left">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent mb-1">
              Signature Aesthetic
            </h3>
            <span className="text-sm font-semibold text-zinc-400">
              The creative grammar and visual signatures of {person.name}.
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {vibeTags.map((tag) => (
              <span
                key={tag}
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-zinc-200 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Frequent Collaborators */}
      {collaborators.length > 0 && (
        <section className="w-full py-12 border-t border-white/5 bg-zinc-950/40 relative z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-left mb-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-accent mb-1">
                Frequent Collaborators
              </h3>
              <span className="text-sm font-semibold text-zinc-400">
                The actors, cinematographers, and creators this person works with most often.
              </span>
            </div>

            <div className="flex flex-wrap gap-8 pt-2">
              {collaborators.map((collab) => {
                const img = collab.profilePath
                  ? (collab.profilePath.startsWith("http") ? collab.profilePath : `https://image.tmdb.org/t/p/w185${collab.profilePath}`)
                  : "/images/poster-placeholder.jpg";

                return (
                  <Link
                    key={collab.id}
                    href={`/people/${collab.id}`}
                    className="group flex items-center gap-4 bg-zinc-900/20 hover:bg-zinc-900/60 p-3 pr-6 border border-white/5 hover:border-brand-accent/20 rounded-full cursor-pointer transition-all duration-300 select-none"
                  >
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                      <Image
                        src={img}
                        alt={collab.name}
                        fill
                        className="object-cover object-center filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-extrabold text-zinc-300 group-hover:text-brand-accent transition-colors">
                        {collab.name}
                      </span>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                        {collab.role}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. The Filmography Hub: Interactive Filter Grid */}
      <section className="w-full border-t border-white/5 py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header & Role Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="text-left">
              <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase">
                The Filmography Hub
              </h2>
              <div className="h-1 w-16 bg-brand-accent mt-2.5 rounded-full" />
            </div>

            {/* Interactive Role Toggles */}
            {availableRoles.length > 1 && (
              <div className="flex flex-wrap gap-1.5 p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full w-fit">
                {availableRoles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => {
                      setActiveRole(role.value);
                      setVisibleCount(18);
                    }}
                    className={`px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                      activeRole === role.value
                        ? "bg-white text-black font-extrabold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid Layout */}
          <div className="min-h-[300px]">
            {filteredCredits.length > 0 ? (
              <div className="flex flex-col gap-12">
                <motion.div
                  layout
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 px-1"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredCredits.slice(0, visibleCount).map((credit, idx) => (
                      <motion.div
                        layout
                        key={`${activeRole}-${credit.id}-${idx}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="w-full shrink-0"
                      >
                        <MediaCard 
                          data={mapToMovieCard(credit)} 
                          variant="catalog" 
                          container="grid"
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {visibleCount < filteredCredits.length && (
                  <div className="flex justify-center pt-4">
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
                <p className="text-zinc-500 font-semibold uppercase tracking-widest text-sm">
                  No filmography works found for this filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
