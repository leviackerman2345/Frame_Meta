"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MovieCard } from "@/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchHeaderProps {
  query: string;
  onSearch: (query: string) => void;
  onGenreSelect: (genre: string | null) => void;
  activeGenre: string | null;
  genres: string[];
}

export function SearchHeader({ query, onSearch, onGenreSelect, activeGenre, genres }: SearchHeaderProps) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<MovieCard[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suggestions debounced
  useEffect(() => {
    const controller = new AbortController();
    const fetchSuggestions = async (q: string) => {
      if (q.length >= 2) {
        try {
          const response = await fetch(`/api/search?query=${encodeURIComponent(q)}`, {
            signal: controller.signal,
          });
          if (!response.ok) return;
          const data = await response.json();
          const results = Array.isArray(data) ? data : data.results || [];
          setSuggestions(results.slice(0, 5));
          setShowSuggestions(true);
        } catch (error) {
          if ((error as Error).name !== "AbortError") {
            console.error("Suggestion fetch failed:", error);
          }
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timer = setTimeout(() => fetchSuggestions(query), 200);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query]);

  // Click outside listener to close autocomplete list
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (val: string) => {
    onSearch(val); // Propagate to parent state in real time
  };

  const handleClear = () => {
    onSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (item: MovieCard) => {
    setShowSuggestions(false);
    router.push(`/titles/${item.id}?type=${item.genre?.includes("Series") ? "tv" : "movie"}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      if (!showSuggestions && suggestions.length > 0) {
        setShowSuggestions(true);
      }
      if (suggestions.length > 0) {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % suggestions.length);
      }
    } else if (e.key === "ArrowUp") {
      if (suggestions.length > 0) {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter") {
      if (showSuggestions && activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        handleSuggestionClick(suggestions[activeIndex]);
      } else {
        onSearch(query);
        setShowSuggestions(false);
      }
    }
  };

  return (
    <div className="w-full pt-44 pb-12 px-4 flex flex-col items-center">
      {/* Decorative Brand Accent Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px] bg-brand-lime/10 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* Modern Minimalist Headline */}
      <div className="text-center mb-10 max-w-2xl relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
          Explore the <span className="text-zinc-500">Archives.</span>
        </h1>
        <p className="text-zinc-500 mt-2.5 text-xs md:text-sm font-semibold tracking-wide uppercase">
          Search over thousands of reference grade physical media scans.
        </p>
      </div>

      {/* High-Fidelity Command Search Input Container */}
      <div ref={containerRef} className="w-full max-w-2xl mb-12 relative z-30">
        <div className="relative group">
          <div className="absolute -inset-0.5 rounded-[1.8rem] bg-gradient-to-r from-white/10 to-brand-lime/10 group-focus-within:from-brand-lime/30 group-focus-within:to-brand-lime/20 blur opacity-75 group-focus-within:opacity-100 transition duration-500" />
          
          <div className="relative flex items-center bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-[1.75rem] px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus-within:border-brand-lime/40 transition-all duration-300">
            <Search className="h-5 w-5 text-zinc-500 mr-4 shrink-0 transition-colors group-focus-within:text-brand-lime" />
            
            <input
              ref={inputRef}
              type="text"
              placeholder="Search movies, TV series, actors, physical scans..."
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query.length >= 2 && setShowSuggestions(true)}
              className="w-full bg-transparent border-none outline-none text-white text-base font-semibold placeholder-zinc-500 py-0.5"
            />

            {query ? (
              <button
                onClick={handleClear}
                className="p-1 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors mr-1 cursor-pointer"
                aria-label="Clear query"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1 rounded bg-zinc-900 border border-white/5 px-2 py-1 text-[9px] font-mono text-zinc-500 tracking-wider">
                <span>⌘</span>
                <span>K</span>
              </div>
            )}
          </div>
        </div>

        {/* Command Palette-style Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 z-50 mt-4 overflow-hidden rounded-[2rem] bg-zinc-950/90 backdrop-blur-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
            >
              <div className="py-3.5">
                <div className="px-5 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-2.5 flex items-center justify-between">
                  <span>Autocomplete Results</span>
                  <span className="flex items-center gap-1 text-[9px] text-zinc-600 lowercase font-medium">
                    use keys <CornerDownLeft className="h-2.5 w-2.5 inline" /> to select
                  </span>
                </div>
                <div className="grid gap-1 px-2.5">
                  {suggestions.map((suggestion, idx) => {
                    const isSelected = activeIndex === idx;
                    return (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`flex items-center w-full text-left gap-4 rounded-2xl p-2.5 transition-colors duration-200 group cursor-pointer ${
                          isSelected ? "bg-white/5 border-white/5" : "border-transparent"
                        }`}
                      >
                        <div className="relative h-12 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-900 border border-white/5">
                          <Image
                            src={suggestion.posterUrl && !suggestion.posterUrl.includes("placeholder") ? suggestion.posterUrl : "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"}
                            alt={suggestion.title || ""}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-bold transition-colors truncate ${
                            isSelected ? "text-white" : "text-zinc-200 group-hover:text-white"
                          }`}>
                            {suggestion.title}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500 font-medium">
                            <span>{suggestion.year}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-800" />
                            <span className="truncate">{suggestion.genre?.split(",")[0]}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mr-2">
                          <span className="text-[10px] font-bold text-brand-lime bg-brand-lime/10 border border-brand-lime/20 rounded px-1.5 py-0.5 uppercase tracking-wide">
                            {suggestion.rating || "8.5"}
                          </span>
                          <div className={`text-[10px] font-medium transition-all duration-200 px-3 py-1.5 rounded-full border border-white/5 bg-zinc-900 text-zinc-400 group-hover:text-black group-hover:bg-white group-hover:border-white ${
                            isSelected ? "text-black bg-white border-white scale-102 shadow-lg" : ""
                          }`}>
                            Jump to...
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Genre Filter Buttons */}
      <div className="w-full max-w-4xl px-4 overflow-x-auto pb-4 scrollbar-hide relative z-20">
        <div className="flex gap-2.5 justify-center min-w-max">
          <button
            onClick={() => onGenreSelect(null)}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
              activeGenre === null
                ? "bg-brand-lime text-brand-black border-brand-lime shadow-[0_0_20px_var(--color-brand-lime-glow)]"
                : "bg-zinc-900/60 text-zinc-500 border-white/5 hover:border-white/10 hover:text-white hover:bg-zinc-900"
            }`}
          >
            All Collections
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => onGenreSelect(genre)}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                activeGenre === genre
                  ? "bg-brand-lime text-brand-black border-brand-lime shadow-[0_0_20px_var(--color-brand-lime-glow)]"
                  : "bg-zinc-900/60 text-zinc-500 border-white/5 hover:border-white/10 hover:text-white hover:bg-zinc-900"
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
