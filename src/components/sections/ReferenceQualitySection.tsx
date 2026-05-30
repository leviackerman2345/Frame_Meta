"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MediaCard } from "@/components/ui/MediaCard";
import { SectionHeader } from "@/components/sections/SectionHeader";
import type { MovieCard } from "@/types/types";
import Link from "next/link";

export type FormatFilter =
  | "all"
  | "4k"
  | "4k-hdr"
  | "dolby-vision"
  | "dolby-atmos"
  | "dolby-atmos-vision";

interface FormatOption {
  key: FormatFilter;
  label: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  { key: "all", label: "All" },
  { key: "4k", label: "4K" },
  { key: "4k-hdr", label: "4K HDR" },
  { key: "dolby-vision", label: "Dolby Vision" },
  { key: "dolby-atmos", label: "Dolby Atmos" },
  { key: "dolby-atmos-vision", label: "Atmos + Vision" },
];

/**
 * Assigns format tags to a MovieCard based on the same heuristics as MediaSpecs.
 */
export function getFormatTags(item: MovieCard): FormatFilter[] {
  const tags: FormatFilter[] = [];
  const year = item.year || 0;
  const rating = item.rating || 0;
  const popularity = item.popularity || 0;
  const genre = (item.genre || "").toLowerCase();

  const isHighAction =
    genre.includes("action") ||
    genre.includes("sci-fi") ||
    genre.includes("animation") ||
    genre.includes("adventure") ||
    genre.includes("fantasy");

  // 4K
  if (year >= 2014 || popularity > 50) {
    tags.push("4k");
  }

  // HDR
  if (year >= 2015) {
    if (rating >= 7.5 || popularity > 100) {
      tags.push("dolby-vision");
    }
    if (year >= 2015) {
      tags.push("4k-hdr");
    }
  }

  // Dolby Atmos
  if (year >= 2012 && (isHighAction || popularity > 80)) {
    tags.push("dolby-atmos");
  }

  // Dolby Atmos + Vision (both present)
  if (tags.includes("dolby-vision") && tags.includes("dolby-atmos")) {
    tags.push("dolby-atmos-vision");
  }

  return tags;
}

function updateParams(current: URLSearchParams, key: string, value: string) {
  const next = new URLSearchParams(current.toString());
  if (value === "all") next.delete(key);
  else next.set(key, value);
  return next.toString();
}

interface ReferenceQualitySectionProps {
  items: MovieCard[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

export function ReferenceQualitySection({
  items,
  title = "Reference Quality",
  subtitle = "Masterful production built for premium displays.",
  showViewAll = true,
}: ReferenceQualitySectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeFormat = (searchParams.get("format") || "all").toLowerCase() as FormatFilter;

  const go = (value: FormatFilter) => {
    const query = updateParams(
      new URLSearchParams(searchParams.toString()),
      "format",
      value
    );
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const filtered = (activeFormat === "all"
    ? items
    : items.filter((item) => getFormatTags(item).includes(activeFormat))
  ).slice(0, 20);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10 relative z-20">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        layout="split"
        action={
          showViewAll ? (
            <Link
              href="/reference-quality"
              className="hidden md:flex items-center gap-2 text-xs font-semibold text-white/55 hover:text-white transition-colors"
            >
              View all <span aria-hidden="true">+</span>
            </Link>
          ) : undefined
        }
      />

      {/* Format filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6">
        {FORMAT_OPTIONS.map((opt) => {
          const active = activeFormat === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => go(opt.key)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 cursor-pointer ${
                active
                  ? "border-white/30 bg-white text-black"
                  : "border-white/8 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Carousel — 5 cards visible per scroll on desktop */}
      {filtered.length > 0 ? (
        <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory px-1 scroll-smooth">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2*1rem)/3)] md:w-[calc((100%-4*1.25rem)/5)] shrink-0 snap-start"
            >
              <MediaCard data={item} variant="catalog" container="grid" />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-8 text-sm text-white/45">
          No titles match the selected format.
        </div>
      )}
    </section>
  );
}
