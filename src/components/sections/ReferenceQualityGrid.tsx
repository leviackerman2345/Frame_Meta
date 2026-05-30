"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MediaCard } from "@/components/ui/MediaCard";
import type { MovieCard } from "@/types/types";
import {
  getFormatTags,
  type FormatFilter,
} from "@/components/sections/ReferenceQualitySection";

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

function updateParams(current: URLSearchParams, key: string, value: string) {
  const next = new URLSearchParams(current.toString());
  if (value === "all") next.delete(key);
  else next.set(key, value);
  return next.toString();
}

interface ReferenceQualityGridProps {
  items: MovieCard[];
}

export function ReferenceQualityGrid({ items }: ReferenceQualityGridProps) {
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

  const filtered =
    activeFormat === "all"
      ? items
      : items.filter((item) => getFormatTags(item).includes(activeFormat));

  return (
    <>
      {/* Format filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-8">
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

      {/* Results count */}
      <p className="text-sm text-white/40 mb-6">
        {filtered.length} {filtered.length === 1 ? "title" : "titles"} found
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {filtered.map((item) => (
            <MediaCard key={item.id} data={item} variant="catalog" container="grid" />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-12 text-center text-sm text-white/45">
          No titles match the selected format.
        </div>
      )}
    </>
  );
}
