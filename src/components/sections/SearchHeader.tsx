"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, TrendingUp, Zap } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { MovieCard } from "@/types/types";
import Image from "next/image";

interface SearchHeaderProps {
  onSearch: (query: string) => void;
  onGenreSelect: (genre: string | null) => void;
  activeGenre: string | null;
  genres: string[];
}

export function SearchHeader({ onSearch, onGenreSelect, activeGenre, genres }: SearchHeaderProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MovieCard[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  // Scroll-linked animations for the same bar
  const { scrollY } = useScroll();
  
  // Transition logic: 
  // Initial top position is around 400px (pt-72 + headline + mb)
  // Sticky top position is 128px (top-32)
  // We want it to reach sticky position when scrolled around 272px
  const top = useTransform(scrollY, [0, 272], [410, 128]);
  const glassOpacity = useTransform(scrollY, [150, 272], [0, 0.7]);
  const blurAmount = useTransform(scrollY, (latest: number) => {
    if (latest < 150) return "none";
    const progress = Math.min(1, Math.max(0, (latest - 150) / (272 - 150)));
    const blur = progress * 24;
    return `blur(${blur}px)`;
  });
  const borderOpacity = useTransform(scrollY, [150, 272], [0.05, 0.1]);
  const shadowOpacity = useTransform(scrollY, [150, 272], [0, 0.5]);
  const inputBgOpacity = useTransform(scrollY, [150, 272], [0.4, 0]);
  const inputBorderOpacity = useTransform(scrollY, [150, 272], [0.05, 0]);
  const iconColor = useTransform(scrollY, [150, 272], ["rgba(113, 113, 122, 1)", "rgba(255, 255, 255, 1)"]);
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsSticky(latest > 270);
  });

  useEffect(() => {
    const fetchSuggestions = async (q: string) => {
      if (q.length >= 2) {
        try {
          const response = await fetch(`/api/search?query=${encodeURIComponent(q)}`);
          const data = await response.json();
          setSuggestions(data.slice(0, 10));
          setShowSuggestions(true);
        } catch (error) {
          console.error("Suggestion fetch failed:", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(() => fetchSuggestions(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (title: string) => {
    setQuery(title);
    onSearch(title);
    setShowSuggestions(false);
  };

  return (
    <div className="w-full pt-72 pb-16">
      {/* 1. SEAMLESS SEARCH BAR (SINGLE ELEMENT) */}
      <motion.div 
        style={{ 
          top,
          backgroundColor: useTransform(glassOpacity, v => `rgba(24, 24, 27, ${v})`),
          backdropFilter: blurAmount,
          WebkitBackdropFilter: blurAmount,
          borderColor: useTransform(borderOpacity, v => `rgba(255, 255, 255, ${v})`),
          boxShadow: useTransform(shadowOpacity, v => `0 20px 50px rgba(0,0,0,${v})`),
        }}
        className="fixed left-0 right-0 mx-auto z-50 w-[600px] max-w-[calc(100vw-2rem)] rounded-full border p-1.5 transition-all duration-300 focus-within:border-brand-lime/40 focus-within:ring-4 focus-within:ring-brand-lime/10"
        ref={containerRef}
      >
        <div className="relative group w-full">
          <motion.div 
            style={{ color: iconColor }}
            className="absolute inset-y-0 left-6 flex items-center pointer-events-none"
          >
            <Search className="h-5 w-5" />
          </motion.div>
          <motion.input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            placeholder="Search movies, series, genres..."
            style={{ 
              backgroundColor: useTransform(inputBgOpacity, v => `rgba(24, 24, 27, ${v})`),
              borderColor: useTransform(inputBorderOpacity, v => `rgba(255, 255, 255, ${v})`),
            }}
            className="w-full rounded-full py-4 pl-16 pr-14 text-base font-medium text-white placeholder-zinc-500 focus:outline-none border transition-all"
          />
          {query && (
            <button 
              onClick={() => { setQuery(""); onSearch(""); }}
              className="absolute inset-y-0 right-6 flex items-center text-zinc-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 z-50 mt-4"
              >
                <div 
                  style={{ 
                    backgroundColor: 'rgba(24, 24, 27, 0.5)', 
                    backdropFilter: 'blur(40px)', 
                    WebkitBackdropFilter: 'blur(40px)' 
                  }}
                  className="overflow-hidden rounded-[2rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                <div className="py-3 space-y-2">
                  <div className="px-5 py-1 text-[11px] font-medium text-zinc-400 uppercase tracking-[0.1em]">
                    Suggestions
                  </div>
                  <div className="grid gap-1 max-h-[320px] overflow-y-auto show-scrollbar px-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion.title || "")}
                        className="flex w-full items-center gap-4 rounded-xl p-2.5 text-left hover:bg-white/5 transition-colors"
                      >
                        <div className="relative h-16 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800 border border-white/5 shadow-md">
                          <Image
                            src={suggestion.posterUrl && !suggestion.posterUrl.includes('placeholder') ? suggestion.posterUrl : `https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop`}
                            alt={suggestion.title || ""}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-zinc-200 truncate">
                            {suggestion.title}
                          </div>
                          <div className="flex items-center gap-2.5 mt-0.5">
                            <span className="text-[11px] font-medium text-zinc-500">{suggestion.year}</span>
                            <span className="h-1 w-1 rounded-full bg-zinc-800" />
                            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-md bg-white/5 text-zinc-400">
                              {suggestion.genre}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-2 pt-2 border-t border-white/5 mt-1">
                    <button 
                      onClick={() => onSearch(query)}
                      className="w-full py-2 rounded-xl text-xs font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      See all results for &quot;{query}&quot;
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Headline */}
      <div className="text-center mb-12 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
          Find your next <span className="text-zinc-500">favorite story.</span>
        </h1>
      </div>

      {/* Layout Placeholder (to keep the space where the search bar would be) */}
      <div className="h-16 mb-12" ref={placeholderRef} />

      {/* Genre Buttons */}
      <div className="px-4 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-4 justify-center min-w-max">
          <button
            onClick={() => onGenreSelect(null)}
            className={`px-8 py-3 rounded-2xl text-sm font-bold border transition-all duration-300 ${
              activeGenre === null
                ? "bg-brand-lime text-brand-black border-brand-lime shadow-[0_0_20px_var(--color-brand-lime-glow)]"
                : "bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white"
            }`}
          >
            All Titles
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => onGenreSelect(genre)}
              className={`px-8 py-3 rounded-2xl text-sm font-bold border transition-all duration-300 ${
                activeGenre === genre
                  ? "bg-brand-lime text-brand-black border-brand-lime shadow-[0_0_20px_var(--color-brand-lime-glow)]"
                  : "bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
