"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { brand, navLinks } from "@/constants/navigation";
import { MovieCard } from "@/types/types";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<MovieCard[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  if (pathname.startsWith("/titles/") || pathname.startsWith("/collection/")) {
    return null;
  }

  const toggleSearch = () => {
    setIsSearchActive(true);
    if (pathname !== "/search") {
      router.push("/search");
    }
  };

  const closeSearch = () => {
    setIsSearchActive(false);
    setShowSuggestions(false);
    setSearchValue("");
    if (pathname === "/search") {
      router.push("/");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setIsSearchActive(false);
      setShowSuggestions(false);
      setSearchValue("");
    }
  };

  // Fetch suggestions
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
          setSuggestions(results.slice(0, 8));
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

    const timer = setTimeout(() => fetchSuggestions(searchValue), 300);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchValue]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchParams = useSearchParams();

  // Sync search state with URL
  useEffect(() => {
    setIsSearchActive(pathname === "/search");
    const q = searchParams.get("q");
    if (pathname === "/search" && q) {
      setSearchValue(q);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (isSearchActive) {
      inputRef.current?.focus();
    }
  }, [isSearchActive]);

  return (
    <nav className="fixed top-6 left-1/2 z-[100] w-full max-w-6xl -translate-x-1/2 px-4">
      {/* Main Container - Liquid glass effect */}
      <div className="flex w-full items-center justify-between rounded-[2rem] bg-zinc-950/20 backdrop-blur-3xl border border-white/10 px-3 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Logo */}
        <AnimatePresence mode="wait">
          {!isSearchActive && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pl-6 flex items-center"
            >
              <Link href={brand.href} className="text-2xl tracking-tight text-white drop-shadow-md flex items-center">
                <span className="font-medium">{brand.nameStart}</span>
                <span className="font-bold">{brand.nameEnd}</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Section: Nav Links or Search Bar */}
        <div className="flex-1 flex justify-center px-4 relative h-12 overflow-hidden">
          <AnimatePresence mode="wait">
            {!isSearchActive ? (
              <motion.div 
                key="nav-links"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="hidden md:flex items-center space-x-1 rounded-full bg-zinc-900/60 backdrop-blur-md border border-white/5 px-2 py-2"
              >
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`relative px-5 py-1.5 text-sm font-medium transition-colors duration-300 tracking-wide rounded-full ${
                        isActive ? "text-black" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-white rounded-full shadow-lg"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{link.name}</span>
                    </Link>
                  );
                })}
              </motion.div>
            ) : (
              <motion.form 
                key="search-bar"
                onSubmit={handleSearchSubmit}
                initial={{ opacity: 0, width: "0%", x: 40 }}
                animate={{ opacity: 1, width: "100%", x: 0 }}
                exit={{ opacity: 0, width: "0%", x: 40 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center w-full max-w-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/20 rounded-full px-6 relative"
              >
                <Search className="h-4 w-4 text-zinc-500 mr-4 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search movies, collection, news..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => searchValue.length >= 2 && setShowSuggestions(true)}
                  className="w-full bg-transparent border-none outline-none text-white text-sm font-medium placeholder-zinc-500 py-3"
                />
                <button 
                  type="button"
                  onClick={closeSearch}
                  className="ml-4 p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-zinc-400" />
                </button>

                {/* Glassmorphism Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 z-[110] mt-4"
                      ref={suggestionsRef}
                    >
                      <div className="overflow-hidden rounded-[2rem] bg-zinc-950/40 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <div className="py-3">
                          <div className="px-5 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-2">
                            Quick Results
                          </div>
                          <div className="grid gap-1 px-2">
                            {suggestions.map((suggestion) => (
                              <Link
                                key={suggestion.id}
                                href={`/titles/${suggestion.id}?type=${suggestion.genre?.includes("Series") ? "tv" : "movie"}`}
                                onClick={closeSearch}
                                className="flex items-center gap-4 rounded-2xl p-2.5 hover:bg-white/5 transition-colors group"
                              >
                                <div className="relative h-14 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800 border border-white/5">
                                  <Image
                                    src={suggestion.posterUrl && !suggestion.posterUrl.includes('placeholder') ? suggestion.posterUrl : `https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop`}
                                    alt={suggestion.title || ""}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors truncate">
                                    {suggestion.title}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500 font-medium">
                                    <span>{suggestion.year}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                    <span className="truncate">{suggestion.genre?.split(',')[0]}</span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-3 pr-2">
          {!isSearchActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <button 
                onClick={toggleSearch}
                className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl bg-white text-black hover:bg-zinc-200 transition-all shadow-sm active:scale-95"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <button className="hidden sm:block h-10 md:h-11 rounded-full bg-black px-5 md:px-7 text-xs md:text-sm font-semibold text-white border border-white/10 hover:bg-zinc-900 transition-colors shadow-md">
                Login
              </button>
            </motion.div>
          )}
          
          {/* Mobile Toggle */}
          <button 
            onClick={toggleMenu}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-colors border border-white/10"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>


      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden mt-4 w-full rounded-[2rem] bg-zinc-900/95 backdrop-blur-2xl border border-white/10 p-4 shadow-2xl overflow-hidden"
            id="mobile-nav"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`relative px-6 py-4 text-lg font-medium transition-colors duration-300 rounded-2xl ${
                      isActive ? "text-black" : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavMobile"
                        className="absolute inset-0 bg-white rounded-2xl shadow-lg"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
              
              {/* Extra Mobile Actions */}
              <div className="pt-4 mt-2 border-t border-white/5 sm:hidden">
                <button className="w-full py-4 rounded-2xl bg-black text-white font-semibold border border-white/10 hover:bg-zinc-800 transition-colors">
                  Login
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
