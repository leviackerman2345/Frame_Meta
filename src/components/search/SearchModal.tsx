"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Search, X, History, Info, 
  Sparkles, Flame, Ghost, Heart, Compass, 
  Swords, VenetianMask, Zap, Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MovieCard } from "@/types/types";
import { MediaCard } from "@/components/ui/MediaCard";
import { TitleLogo } from "@/components/ui/TitleLogo";

export function SearchModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MovieCard[]>([]);
  const [trending, setTrending] = useState<MovieCard[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeModalGenre, setActiveModalGenre] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchCache = useRef<Map<string, MovieCard[]>>(new Map());

  // Clean premium category toggles (No Emojis)
  const categoryToggles = [
    { name: "All", value: null },
    { name: "Action", value: "Action" },
    { name: "Sci-Fi", value: "Sci-Fi" },
    { name: "Horror", value: "Horror" },
    { name: "Comedy", value: "Comedy" },
    { name: "Drama", value: "Drama" },
    { name: "Thriller", value: "Thriller" },
    { name: "Mystery", value: "Mystery" },
    { name: "Romance", value: "Romance" },
    { name: "Adventure", value: "Adventure" },
    { name: "Fantasy", value: "Fantasy" },
  ];

  // Clean premium quick action filters (No Emojis)
  const quickFilters = [
    { name: "Action", icon: Swords, color: "text-red-400 group-hover:text-red-300" },
    { name: "Sci-Fi", icon: Compass, color: "text-blue-400 group-hover:text-blue-300" },
    { name: "Horror", icon: Ghost, color: "text-purple-400 group-hover:text-purple-300" },
    { name: "Comedy", icon: VenetianMask, color: "text-amber-400 group-hover:text-amber-300" },
    { name: "Drama", icon: Award, color: "text-emerald-400 group-hover:text-emerald-300" },
    { name: "Thriller", icon: Zap, color: "text-yellow-400 group-hover:text-yellow-300" },
    { name: "Romance", icon: Heart, color: "text-pink-400 group-hover:text-pink-300" },
    { name: "Mystery", icon: Info, color: "text-teal-400 group-hover:text-teal-300" },
  ];

  // Fetch up to 100 movies for a specific genre in parallel (5 pages x 20 results)
  const fetchGenreTitles = useCallback(async (genre: string | null) => {
    setIsLoading(true);
    try {
      const pages = [1, 2, 3, 4, 5];
      const fetchPage = async (page: number) => {
        const url = genre 
          ? `/api/discover?genre=${encodeURIComponent(genre)}&page=${page}`
          : `/api/trending?page=${page}`;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          return Array.isArray(data) ? data : data.results || [];
        }
        return [];
      };

      const resultsArray = await Promise.all(pages.map(fetchPage));
      const combined = resultsArray.flat();
      
      // Deduplicate by ID
      const seen = new Set<number>();
      const deduped = combined.filter((t) => {
        if (!t.id || seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      });
      
      setTrending(deduped.slice(0, 100)); // Load up to 100 movies!
      setActiveIndex(-1);
    } catch (error) {
      console.error("Failed to fetch titles for genre in modal:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem("framemeta_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Fetch genre content dynamically when modal opens or category is changed
  useEffect(() => {
    if (isOpen && query.length < 2) {
      fetchGenreTitles(activeModalGenre);
    }
  }, [isOpen, activeModalGenre, query, fetchGenreTitles]);

  // Listen to open event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setActiveIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    window.addEventListener("open-search", handleOpen);
    return () => window.removeEventListener("open-search", handleOpen);
  }, []);

  // Listen to keyboard shortcuts globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) {
            setActiveIndex(-1);
            setTimeout(() => inputRef.current?.focus(), 100);
          }
          return !prev;
        });
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Debounced search fetch with client-side cache
  useEffect(() => {
    if (!isOpen) return;

    const controller = new AbortController();
    const fetchResults = async (q: string) => {
      if (q.length >= 2) {
        const cacheKey = q.toLowerCase().trim();

        // Return cached results instantly
        if (searchCache.current.has(cacheKey)) {
          setSuggestions(searchCache.current.get(cacheKey)!);
          setActiveIndex(-1);
          return;
        }

        setIsLoading(true);
        try {
          const response = await fetch(`/api/search?query=${encodeURIComponent(q)}`, {
            signal: controller.signal,
          });
          if (response.ok) {
            const data = await response.json();
            const results: MovieCard[] = Array.isArray(data) ? data : data.results || [];
            const sliced = results.slice(0, 10);
            searchCache.current.set(cacheKey, sliced);
            setSuggestions(sliced);
            setActiveIndex(-1);
          }
        } catch (error) {
          if ((error as Error).name !== "AbortError") {
            console.error("Search failed in modal:", error);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setActiveIndex(-1);
      }
    };

    const timer = setTimeout(() => fetchResults(query), 250);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [query, isOpen]);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const close = () => {
    setIsOpen(false);
    setQuery("");
    setSuggestions([]);
  };

  const handleSelect = (item: MovieCard) => {
    // Add to recent searches
    if (item.title) {
      const updated = [item.title, ...recentSearches.filter((s) => s !== item.title)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("framemeta_recent_searches", JSON.stringify(updated));
    }

    close();
    router.push(`/titles/${item.id}?type=${item.genre?.includes("Series") ? "tv" : "movie"}`);
  };

  const handleRecentSearchClick = (q: string) => {
    setQuery(q);
    setActiveModalGenre(null);
    inputRef.current?.focus();
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("framemeta_recent_searches");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const list = query.length >= 2 ? suggestions : trending;
    if (list.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % list.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + list.length) % list.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < list.length) {
        handleSelect(list[activeIndex]);
      } else if (query.trim()) {
        // Save text query
        const updated = [query.trim(), ...recentSearches.filter((s) => s !== query.trim())].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("framemeta_recent_searches", JSON.stringify(updated));
        
        close();
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  // Click a Category toggle
  const handleToggleClick = (val: string | null) => {
    setActiveModalGenre(val);
    setQuery(""); // Clear search to switch directly to category catalog
  };

  const applyQuickFilter = (genre: string) => {
    setActiveModalGenre(genre);
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          {/* Dimmed Blurred Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Centered Command Palette Card (Massive 80% layout) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            ref={modalRef}
            className="relative w-[95vw] md:w-[85vw] max-w-6xl h-[85vh] md:h-[80vh] bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col z-10"
          >
            {/* Search Input Area */}
            <div className="flex items-center px-8 border-b border-white/5 relative shrink-0">
              <Search className="h-5 w-5 text-zinc-500 mr-4 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a movie title or search query..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (activeModalGenre) setActiveModalGenre(null); // Reset category filter on text search
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none text-white text-lg font-semibold placeholder-zinc-500 py-6 pr-12"
              />
              {isLoading ? (
                <div className="absolute right-16 flex h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-brand-accent" />
              ) : (
                <div className="absolute right-16 hidden sm:flex items-center gap-1 rounded bg-zinc-900 border border-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-500">
                  <span>⌘</span>
                  <span>K</span>
                </div>
              )}
              <button
                onClick={close}
                className="absolute right-6 p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category / Genre Toggles Row (Clean, No Emojis) */}
            <div className="px-8 py-3 bg-zinc-950/40 border-b border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider mr-4 select-none">
                Categories
              </span>
              <div className="flex items-center gap-2">
                {categoryToggles.map((genre) => {
                  const isActive = activeModalGenre === genre.value;
                  return (
                    <button
                      key={genre.name}
                      onClick={() => handleToggleClick(genre.value)}
                      className={`px-4.5 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-brand-accent text-white border-brand-accent shadow-[0_0_15px_var(--color-brand-glow)] font-black"
                          : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {genre.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-8 py-6 show-scrollbar space-y-8">
              
              {/* UI State 1: No Search Query - Display 5-Grid Media Cards */}
              {query.length < 2 && (
                <>
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                          Recent Searches
                        </span>
                        <button
                          onClick={clearRecent}
                          className="text-[10px] font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {recentSearches.map((search, idx) => (
                          <button
                            key={search + idx}
                            onClick={() => handleRecentSearchClick(search)}
                            className="flex items-center w-full text-left gap-4 rounded-2xl p-3 bg-zinc-900/40 hover:bg-white/5 border border-white/5 transition-all duration-200 group cursor-pointer"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 border border-white/5 group-hover:border-white/10 group-hover:bg-zinc-850 transition-all text-zinc-400 group-hover:text-white shrink-0">
                              <History className="h-4.5 w-4.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors truncate">
                                {search}
                              </div>
                              <div className="text-[10px] text-zinc-500 font-medium">
                                Search history
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5-Column Reusable Cards Grid Layout */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        {activeModalGenre ? `${activeModalGenre} Collection` : "Popular Titles"}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-555">
                        {trending.length} titles loaded
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {trending.map((item) => (
                        <MediaCard
                          key={item.id}
                          data={item}
                          variant="catalog"
                          container="grid"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Expanded Quick Action Filters */}
                  <div className="space-y-3 pt-6 border-t border-white/5">
                    <div className="px-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      More Quick Filters
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {quickFilters.map((filter) => {
                        const Icon = filter.icon;
                        return (
                          <button
                            key={filter.name}
                            onClick={() => applyQuickFilter(filter.name)}
                            className="flex items-center w-full text-left gap-3.5 rounded-2xl p-3 bg-zinc-900/30 hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-200 group cursor-pointer"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 border border-white/5 group-hover:border-white/10 group-hover:bg-zinc-900 transition-all text-zinc-400 shrink-0">
                              <Icon className={`h-4.5 w-4.5 ${filter.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-zinc-300 group-hover:text-white truncate">
                                {filter.name}
                              </div>
                              <div className="text-[9px] text-zinc-500 font-medium">
                                Filter collection
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* UI State 2: Query Entered - Display Apple-style detailed rows */}
              {query.length >= 2 && suggestions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      Search Results
                    </span>
                    <span className="text-[10px] font-bold text-zinc-555">
                      {suggestions.length} matches found
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {suggestions.map((item, idx) => {
                      const isSelected = activeIndex === idx;
                      const fallbackDesc = "A premium reference-grade physical media capture from the original release archives. Explore technical metadata, color palettes, and HDR details.";
                      const posterSrc = item.originalPosterUrl || item.posterUrl;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setActiveIndex(idx)}
                          className={`flex flex-col sm:flex-row items-stretch w-full text-left gap-8 rounded-[2rem] p-6 bg-zinc-900/30 border transition-all duration-500 group cursor-pointer relative overflow-hidden ${
                            isSelected 
                              ? "bg-white/5 border-white/15 shadow-[0_25px_50px_rgba(0,0,0,0.5)]" 
                              : "bg-zinc-900/20 border-white/5 hover:bg-white/5 hover:border-white/10"
                          }`}
                        >
                          {/* Ambient Glass Highlight Layer */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-transparent to-white/[0.03] pointer-events-none" />

                          {/* Large Poster Image Container (Using original poster with text/title if available) */}
                          <div className="relative w-full sm:w-[130px] aspect-[2/3] rounded-[1.5rem] overflow-hidden border border-white/15 shrink-0 bg-zinc-900 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                            <Image
                              src={posterSrc && !posterSrc.includes("placeholder") ? posterSrc : "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop"}
                              alt={item.title || ""}
                              fill
                              className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                              unoptimized
                            />
                          </div>

                          {/* Left-Aligned Apple Content Container */}
                          <div className="flex-1 flex flex-col justify-center py-1 min-w-0 z-10 text-left items-start">
                            
                            {/* 1. Title Logo / Branding (AT THE VERY TOP - Centered with size limit) */}
                            <div className="h-14 flex items-center justify-center mb-4 relative w-full max-w-[200px] sm:max-w-[240px] mx-auto shrink-0">
                              <TitleLogo
                                id={item.id}
                                title={item.title || ""}
                                type={item.genre?.includes("Series") ? "series" : "movie"}
                                logoClassName="h-10 md:h-12 w-auto object-contain"
                                fallbackClassName="text-xl md:text-2xl font-black tracking-tight text-white text-center w-full drop-shadow-md"
                                className="!justify-center"
                                logoUrl={item.logoUrl}
                              />
                            </div>

                            {/* 2. Metadata Bar (Underneath the logo) */}
                            <div className="flex items-center flex-wrap gap-2.5 text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-[0.2em] mb-4 select-none text-left w-full justify-start">
                              {item.year && <span className="text-zinc-350">{item.year}</span>}
                              {item.year && item.genre && <span className="text-zinc-600 font-black">•</span>}
                              {item.genre && <span className="text-brand-accent font-black tracking-[0.15em]">{item.genre.split(",")[0]}</span>}
                              {item.runtime && <span className="text-zinc-600 font-black">•</span>}
                              {item.runtime && <span className="text-zinc-350">{item.runtime} MIN</span>}
                              {item.rating && (
                                <>
                                  <span className="text-zinc-600 font-black">•</span>
                                  <span className="text-[9px] font-black text-white bg-brand-accent border border-brand-accent px-2.5 py-0.5 rounded-full select-none tracking-normal">
                                    {item.rating}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* 3. Film Description / Synopsis (Highly legible, left-aligned) */}
                            <p className="text-xs md:text-sm text-zinc-300 font-semibold leading-relaxed mt-1 line-clamp-2 md:line-clamp-3 select-none text-left w-full">
                              {item.description || fallbackDesc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Case 3: Query Entered & No Results Found */}
              {query.length >= 2 && suggestions.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="relative h-16 w-16 rounded-full bg-zinc-900/50 flex items-center justify-center mb-4 border border-white/5 overflow-hidden">
                    <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-15" />
                    <Info className="h-6 w-6 text-zinc-500" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-300 mb-1">No matches found</h3>
                  <p className="text-[11px] text-zinc-500 max-w-xs leading-relaxed mb-4">
                    &ldquo;{query}&rdquo; didn&apos;t match any archives. Try another query or refine your spelling.
                  </p>
                  <button
                    onClick={() => setQuery("")}
                    className="text-xs font-semibold px-4 py-2 bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-white rounded-full transition-all cursor-pointer"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
