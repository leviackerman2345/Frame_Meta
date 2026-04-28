"use client";

import { motion } from "framer-motion";

interface SkeletonCardGridProps {
  /** Number of skeleton rows to show */
  rows?: number;
  /** Whether to show the section title skeleton */
  showTitle?: boolean;
  /** Number of columns (auto-detected from CSS grid if not provided) */
  columns?: number;
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: "easeOut" }}
      className="skeleton-card relative aspect-[2/3] rounded-3xl overflow-hidden"
    >
      {/* Base */}
      <div className="absolute inset-0 bg-zinc-900/60 border border-white/[0.04] rounded-3xl" />

      {/* Shimmer sweep */}
      <div className="absolute inset-0 skeleton-shimmer rounded-3xl" />

      {/* Faux content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center gap-2">
        {/* Badge placeholder */}
        <div className="w-16 h-4 rounded-full bg-white/[0.04]" />

        {/* Title placeholder */}
        <div className="w-3/4 h-4 rounded-lg bg-white/[0.06]" />

        {/* Meta placeholder */}
        <div className="flex items-center gap-2 mt-1">
          <div className="w-10 h-3 rounded bg-white/[0.04]" />
          <div className="w-1 h-1 rounded-full bg-white/[0.06]" />
          <div className="w-14 h-3 rounded bg-white/[0.04]" />
        </div>
      </div>

      {/* Rating pill placeholder (top-right) */}
      <div className="absolute top-3 right-3 w-12 h-6 rounded-lg bg-white/[0.04]" />
    </motion.div>
  );
}

export function SkeletonCardGrid({ rows = 3, showTitle = true, columns = 6 }: SkeletonCardGridProps) {
  const cardCount = rows * columns;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full space-y-10 px-4 md:px-10 pb-20"
    >
      {/* Title skeleton */}
      {showTitle && (
        <div className="flex items-center gap-4">
          <div className="skeleton-shimmer-inline w-56 h-9 rounded-2xl bg-zinc-900/60" />
        </div>
      )}

      {/* Card grid — same responsive grid as SearchCatalog */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
        {Array.from({ length: cardCount }).map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
