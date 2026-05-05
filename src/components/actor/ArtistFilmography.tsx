"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MediaCard } from "@/components/ui/MediaCard";
import { Credit, MovieCard } from "@/types/types";

interface ArtistFilmographyProps {
  movieCredits: { cast: Credit[]; crew: Credit[] };
  tvCredits: { cast: Credit[]; crew: Credit[] };
}

type FilmographyFilter = "movies" | "tv" | "director" | "writer" | "producer" | "upcoming";

export function ArtistFilmography({ movieCredits, tvCredits }: ArtistFilmographyProps) {
  const [filterState, setFilterState] = useState<{ index: number; direction: number }>({ index: 0, direction: 0 });

  const { movieCast, movieCrew, tvCast, tvCrew } = useMemo(() => {
    return {
      movieCast: movieCredits?.cast || [],
      movieCrew: movieCredits?.crew || [],
      tvCast: tvCredits?.cast || [],
      tvCrew: tvCredits?.crew || [],
    };
  }, [movieCredits, tvCredits]);

  const isUpcoming = (credit: Credit) => {
    const d = credit.release_date || credit.first_air_date;
    if (!d) return true; // Missing date usually implies unreleased
    return new Date(d) > new Date();
  };

  const filters = useMemo(() => {
    const allCredits = [...movieCast, ...tvCast, ...movieCrew, ...tvCrew];
    const hasUpcoming = allCredits.some(isUpcoming);

    const list: { label: string; value: FilmographyFilter }[] = [
      { label: "Feature Films", value: "movies" },
      { label: "Television", value: "tv" },
    ];
    
    if ([...movieCrew, ...tvCrew].some((c) => c.job === "Director" && !isUpcoming(c))) {
      list.push({ label: "Directed", value: "director" });
    }
    if ([...movieCrew, ...tvCrew].some((c) => ["Writer", "Screenplay", "Story"].includes(c.job || "") && !isUpcoming(c))) {
      list.push({ label: "Written", value: "writer" });
    }
    if ([...movieCrew, ...tvCrew].some((c) => ["Producer", "Executive Producer"].includes(c.job || "") && !isUpcoming(c))) {
      list.push({ label: "Produced", value: "producer" });
    }
    if (hasUpcoming) {
      list.push({ label: "Coming Soon", value: "upcoming" });
    }
    return list;
  }, [movieCast, tvCast, movieCrew, tvCrew]);
  
  // Safe bounds check just in case
  const fIndex = Math.min(filterState.index, filters.length - 1 < 0 ? 0 : filters.length - 1);
  const activeFilter = filters[fIndex]?.value || "movies";

  const changeFilter = (newIndex: number) => {
    setFilterState({
      index: newIndex,
      direction: newIndex > fIndex ? 1 : -1,
    });
  };

  // Filter and Sort Logic for main grid
  const filteredCredits = useMemo(() => {
    let list: Credit[] = [];

    switch (activeFilter) {
      case "movies":
        list = movieCast.filter((c) => (c.media_type === "movie" || !c.media_type) && !isUpcoming(c));
        break;
      case "tv":
        list = tvCast.filter((c) => (c.media_type === "tv" || !c.media_type) && !isUpcoming(c));
        break;
      case "director":
        list = [...movieCrew, ...tvCrew].filter((c) => c.job === "Director" && !isUpcoming(c));
        break;
      case "writer":
        list = [...movieCrew, ...tvCrew].filter((c) => 
          ["Writer", "Screenplay", "Story"].includes(c.job || "") && !isUpcoming(c)
        );
        break;
      case "producer":
        list = [...movieCrew, ...tvCrew].filter((c) => 
          ["Producer", "Executive Producer"].includes(c.job || "") && !isUpcoming(c)
        );
        break;
      case "upcoming":
        list = [...movieCast, ...tvCast, ...movieCrew, ...tvCrew].filter(isUpcoming);
        break;
    }

    // Deduplicate main grid results
    const unique = Array.from(new Map(list.map(c => [c.id, c])).values());

    // Sort by newness and popularity
    return unique.sort((a, b) => {
      // 1. Prioritize popularity for better relevance
      const popA = a.popularity || 0;
      const popB = b.popularity || 0;
      
      // 2. Tie break/influence with year
      const yearA = parseInt((a.release_date || a.first_air_date || "").substring(0, 4)) || 0;
      const yearB = parseInt((b.release_date || b.first_air_date || "").substring(0, 4)) || 0;

      // 3. For 'upcoming', sort chronologically ascending (closest to release first)
      if (activeFilter === "upcoming") {
        if (yearA !== yearB) return yearA - yearB;
        return popB - popA; // For same year, popular first
      }

      // 4. Heavily weight popularity but keep recent popular things high
      // Combine year and popularity into a score if desired, but typically descending popularity is best for "essential" works
      // Let's sort by Year first, then Popularity within that year? No, the prompt asks for "new and popularity. extras or non essential should be rank below"
      // We can use a weighted score or simply popularity as primary, then year as secondary.
      // Wait, let's sort by year DESC as chunk block, and if year is same or diff by 1, order by popularity. 
      // Actually standard TMDB 'top' logic is a mix. Let's do:
      const scoreA = yearA * 10 + Math.min(popA, 500); 
      const scoreB = yearB * 10 + Math.min(popB, 500);
      
      if (Math.abs(yearA - yearB) < 3) {
         return popB - popA; // Within 2-3 years, sort by popularity exactly.
      }

      return scoreB - scoreA;
    });
  }, [activeFilter, movieCast, movieCrew, tvCast, tvCrew]);

  const mapToMovieCard = (credit: Credit, forceType?: "movie" | "tv"): MovieCard => {
    const isTV = forceType === "tv" || credit.media_type === "tv" || !!credit.first_air_date;
    const typeLabel = isTV ? "Series" : "Movie";
    const title = credit.title || credit.name || "";
    const yearStr = credit.release_date || credit.first_air_date || "";
    const year = parseInt(yearStr.substring(0, 4)) || 0;
    
    return {
      id: credit.id,
      title: title,
      genre: typeLabel,
      posterUrl: credit.poster_path ? `https://image.tmdb.org/t/p/w500${credit.poster_path}` : "",
      year: year,
      rating: credit.vote_average,
    };
  };

  const tabContainerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        staggerChildren: 0.05
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <section className="w-full max-w-360 mx-auto px-6 md:px-12 py-10 md:py-16 flex flex-col gap-12 overflow-hidden md:overflow-visible" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      
      {/* Filter Tab Bar and Grid */}
      <div className="flex flex-col gap-8 pt-8">
        <h3 className="text-xl md:text-3xl font-black text-white tracking-tight">
          Filmography
        </h3>

        {/* Filter Tab Bar */}
        <div className="w-full overflow-x-auto scrollbar-hide pb-2 -mb-2">
            <motion.div
            variants={tabContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-fit p-1.5 backdrop-blur-[20px] bg-white/6 border border-white/10 rounded-full flex flex-nowrap items-center gap-1"
          >
            {filters.map((f, idx) => (
              <button
                key={f.value}
                onClick={() => changeFilter(idx)}
                className={`shrink-0 px-4 md:px-8 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeFilter === f.value
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Filtered Grid */}
      <div className="min-h-100 relative overflow-hidden">
        <AnimatePresence mode="popLayout" custom={filterState.direction}>
          {filteredCredits.length > 0 ? (
            <motion.div
              key={activeFilter}
              custom={filterState.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex md:grid md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 w-full overflow-x-auto md:overflow-visible pb-6 snap-x snap-mandatory scrollbar-hide"
            >
              {filteredCredits.map((credit, idx) => (
                <motion.div key={`${activeFilter}-${credit.id}-${idx}`} variants={cardVariants} className="w-40 sm:w-50 md:w-full shrink-0 snap-start">
                  <MediaCard 
                    data={mapToMovieCard(credit, activeFilter === "tv" ? "tv" : undefined)} 
                    variant="catalog" 
                    container="grid"
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full py-32 flex items-center justify-center text-center"
            >
              <p className="text-zinc-500 font-medium text-sm md:text-lg">
                No credits found in this category.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
