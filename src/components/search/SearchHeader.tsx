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
  const [activeIndex, setActiveIndex] = useState(-1);
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
          setSuggestions(results.slice(0, 10));
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

    const timer = setTimeout(() => fetchSuggestions(query), 300);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
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

  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions, showSuggestions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      if (!showSuggestions && suggestions.length > 0) {
        setShowSuggestions(true);
      }
      if (suggestions.length > 0) {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % suggestions.length);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      if (suggestions.length > 0) {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      }
      return;
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
      return;
    }

    if (e.key === "Enter") {
      if (showSuggestions && activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSuggestionClick(suggestions[activeIndex].title || "");
        return;
      }
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
      {/* Search Bar Removed - Now in Navbar */}

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
