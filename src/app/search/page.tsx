"use client";

import { Suspense, useState, useEffect, useMemo, useRef, useCallback } from "react";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchCatalog } from "@/components/search/SearchCatalog";
import { SkeletonCardGrid } from "@/components/ui/SkeletonCardGrid";
import { MovieCard } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

/** Max API pages to fetch per query/genre */
const MAX_PAGES = 10;

/** Minimum time (ms) the loader must stay visible to avoid jitter */
const MIN_LOADER_MS = 600;

/** Rows to reveal per chunk */
const ROWS_PER_CHUNK = 3;

/** Returns a promise that resolves after `ms` milliseconds */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Get the number of grid columns based on window width.
 * Mirrors the Tailwind breakpoints in SearchCatalog:
 *   grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
 */
function getColumnCount(): number {
  if (typeof window === "undefined") return 6;
  const w = window.innerWidth;
  if (w >= 1280) return 6;
  if (w >= 1024) return 5;
  if (w >= 768) return 4;
  if (w >= 640) return 3;
  return 2;
}

/**
 * Preload all poster images for a batch of titles.
 * Resolves only after every image is fully loaded (or errored).
 */
function preloadImages(titles: MovieCard[]): Promise<void> {
  const urls = titles
    .map((t) => t.posterUrl)
    .filter((url): url is string => !!url && !url.includes("placeholder"));

  if (urls.length === 0) return Promise.resolve();

  return new Promise((resolve) => {
    let loaded = 0;
    const total = urls.length;

    const done = () => {
      loaded++;
      if (loaded >= total) resolve();
    };

    urls.forEach((url) => {
      const img = new Image();
      img.onload = done;
      img.onerror = done;
      img.src = url;
    });

    // Safety timeout
    setTimeout(resolve, 8000);
  });
}

/**
 * Deduplicate titles by ID, keeping the first occurrence.
 */
function deduplicateById(titles: MovieCard[]): MovieCard[] {
  const seen = new Set<number>();
  return titles.filter((t) => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });
}

/**
 * Build the API endpoint for a given page based on the current filters.
 */
function getEndpoint(searchQuery: string, activeGenre: string | null, page: number): string {
  if (searchQuery) {
    return `/api/search?query=${encodeURIComponent(searchQuery)}&page=${page}`;
  }
  if (activeGenre) {
    return `/api/discover?genre=${encodeURIComponent(activeGenre)}&page=${page}`;
  }
  return `/api/trending?page=${page}`;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialGenre = searchParams.get("genre");
  
  const [activeGenre, setActiveGenre] = useState<string | null>(initialGenre);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Sync state with URL params
  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    setActiveGenre(searchParams.get("genre"));
  }, [searchParams]);

  // ── Data pool: ALL fetched titles ──
  const [allTitles, setAllTitles] = useState<MovieCard[]>([]);

  // ── Progressive reveal ──
  const [visibleCount, setVisibleCount] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isFetchingPage, setIsFetchingPage] = useState(false);

  // ── Column-aware chunk sizing ──
  const [columns, setColumns] = useState(6);

  const observerTarget = useRef<HTMLDivElement>(null);
  const cooldownRef = useRef(false);
  const requestTokenRef = useRef(0);

  const chunkSize = ROWS_PER_CHUNK * columns;

  const genres = useMemo(
    () => [
      "Movie", "Series", "Action", "Adventure", "Animation", "Comedy", "Crime",
      "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller",
    ],
    []
  );

  // ── Track viewport columns ──
  useEffect(() => {
    const update = () => setColumns(getColumnCount());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Round down visible count to nearest multiple of columns for even rows
  const evenVisibleCount = useMemo(() => {
    const clamped = Math.min(visibleCount, allTitles.length);
    return Math.floor(clamped / columns) * columns;
  }, [visibleCount, allTitles.length, columns]);

  const visibleTitles = useMemo(
    () => allTitles.slice(0, evenVisibleCount),
    [allTitles, evenVisibleCount]
  );

  const hasMoreVisible = evenVisibleCount < allTitles.length;
  const hasMore = hasMoreVisible || hasMorePages;

  const fetchPage = useCallback(
    async (page: number, options?: { initial?: boolean; token?: number }) => {
      const token = options?.token ?? requestTokenRef.current;
      const isInitial = options?.initial === true;

      setIsFetchingPage(true);

      try {
        const endpoint = getEndpoint(searchQuery, activeGenre, page);
        const response = await fetch(endpoint);
        if (!response.ok) {
          setHasMorePages(false);
          return;
        }
        const data = await response.json();

        const rawResults: MovieCard[] = Array.isArray(data)
          ? data
          : data.results || [];

        if (token !== requestTokenRef.current) return;

        if (rawResults.length === 0) {
          setHasMorePages(false);
          if (isInitial) {
            setAllTitles([]);
            setVisibleCount(0);
            setIsReady(true);
            cooldownRef.current = false;
          }
          return;
        }

        if (page >= MAX_PAGES) {
          setHasMorePages(false);
        } else {
          setHasMorePages(true);
        }

        if (isInitial) {
          const deduped = deduplicateById(rawResults);
          setAllTitles(deduped);

          const cols = getColumnCount();
          const firstChunkSize = ROWS_PER_CHUNK * cols;
          const firstChunk = deduped.slice(0, firstChunkSize);
          // Speed up: don't wait for ALL images if they are taking too long
          Promise.all([preloadImages(firstChunk)]);
          await delay(MIN_LOADER_MS);

          if (token !== requestTokenRef.current) return;

          setVisibleCount(firstChunk.length);
          setIsReady(true);

          setTimeout(() => {
            cooldownRef.current = false;
          }, 800);
        } else {
          setAllTitles((prev) => deduplicateById([...prev, ...rawResults]));
        }

        setCurrentPage(page);
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        if (token === requestTokenRef.current) {
          setIsFetchingPage(false);
        }
      }
    },
    [searchQuery, activeGenre]
  );

  // ── Unified fetch: triggers on search query OR genre change ──
  useEffect(() => {
    requestTokenRef.current += 1;
    const token = requestTokenRef.current;

    setIsReady(false);
    setVisibleCount(0);
    setAllTitles([]);
    setCurrentPage(0);
    setHasMorePages(true);
    cooldownRef.current = true;

    const timer = setTimeout(() => {
      fetchPage(1, { initial: true, token });
    }, searchQuery ? 500 : 0);

    return () => clearTimeout(timer);
  }, [searchQuery, activeGenre, fetchPage]);

  // ── Reveal next chunk with image preloading ──
  const revealNextChunk = useCallback(async () => {
    if (isPreloading || cooldownRef.current) return;

    if (visibleCount >= allTitles.length) {
      if (hasMorePages && !isFetchingPage) {
        await fetchPage(currentPage + 1, { token: requestTokenRef.current });
      }
      return;
    }

    if (visibleCount + chunkSize >= allTitles.length && hasMorePages && !isFetchingPage) {
      fetchPage(currentPage + 1, { token: requestTokenRef.current });
    }

    setIsPreloading(true);
    cooldownRef.current = true;

    const nextChunk = allTitles.slice(
      visibleCount,
      visibleCount + chunkSize
    );

    // Speed up: trigger preload but only wait for the artificial delay
    Promise.all([preloadImages(nextChunk)]);
    await delay(MIN_LOADER_MS);

    setVisibleCount((prev) =>
      Math.min(prev + chunkSize, allTitles.length)
    );
    setIsPreloading(false);

    // Cooldown: prevent the observer from immediately re-triggering
    setTimeout(() => {
      cooldownRef.current = false;
    }, 800);
  }, [
    isPreloading,
    visibleCount,
    allTitles,
    chunkSize,
    hasMorePages,
    isFetchingPage,
    currentPage,
    fetchPage,
  ]);

  // ── Infinite scroll observer ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isPreloading &&
          !cooldownRef.current &&
          isReady
        ) {
          revealNextChunk();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isPreloading, isReady, revealNextChunk]);

  const pageTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : activeGenre
      ? `${activeGenre} Collection`
      : "Full Catalog";

  const showSkeleton = !isReady;

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Atmospheric Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-lime/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-lime/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <SearchHeader
          genres={genres}
          activeGenre={activeGenre}
          onGenreSelect={(genre) => setActiveGenre(genre)}
          onSearch={(query) => setSearchQuery(query)}
        />

        <div className="min-h-[400px] relative pb-20">
          {/* ── Crossfade layer: skeleton sits on top, fades out while content fades in ── */}
          <AnimatePresence>
            {showSkeleton && (
              <motion.div
                key="skeleton-overlay"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }}
                className="absolute inset-0 z-20"
              >
                <SkeletonCardGrid rows={3} showTitle columns={columns} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Content layer: always mounted once ready, fades in beneath the skeleton ── */}
          <AnimatePresence mode="wait">
            {isReady && (
              <motion.div
                key={`content-${activeGenre || "all"}-${searchQuery}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="space-y-0"
              >
                <SearchCatalog titles={visibleTitles} title={pageTitle} />

                {visibleTitles.length > 0 && (
                  <>
                    {/* Load-more skeleton (below current cards) */}
                    <AnimatePresence>
                      {isPreloading && (
                        <motion.div
                          key="skeleton-more"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        >
                          <SkeletonCardGrid
                            rows={3}
                            showTitle={false}
                            columns={columns}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Sentinel: triggers observer when user reaches end */}
                    <div ref={observerTarget} className="w-full">
                      {!hasMore && !isPreloading && (
                        <motion.p
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                          className="text-center text-zinc-600 font-medium py-10"
                        >
                          You&apos;ve reached the end of the archives.
                        </motion.p>
                      )}
                    </div>

                    {/* Buffer spacer: keeps footer away while more content can load */}
                    {hasMore && !isPreloading && (
                      <div
                        className="w-full pointer-events-none"
                        style={{ height: `calc(2 * (100vw / ${columns} * 1.5 + 2rem))` }}
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black" />}>
      <SearchPageContent />
    </Suspense>
  );
}
