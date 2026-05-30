import Link from "next/link";
import { MediaCard } from "@/components/ui/MediaCard";
import { MediaSpecs } from "@/components/ui/MediaSpecs";
import { SectionHeader } from "@/components/sections/SectionHeader";
import type { MovieCard } from "@/types/types";

interface HardwareRailSectionProps {
  items: MovieCard[];
  title?: string;
  subtitle?: string;
}

export function HardwareRailSection({
  items,
  title = "Hardware hub",
  subtitle = "A reference shelf of titles that feel built for premium home theaters.",
}: HardwareRailSectionProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10 relative z-20">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        layout="split"
        action={
          <Link
            href="/search?q=4k"
            className="hidden md:flex items-center gap-2 text-xs font-semibold text-white/55 hover:text-white transition-colors"
          >
            See reference picks <span aria-hidden="true">+</span>
          </Link>
        }
      />

      {items.length > 0 ? (
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory px-1 scroll-smooth">
          {items.map((item) => (
            <div key={item.id} className="w-[calc((100%-1rem)/2)] md:w-[220px] shrink-0 snap-start">
              <MediaCard data={item} variant="catalog" container="grid" />
              <div className="mt-3 px-2">
                <MediaSpecs
                  year={item.year}
                  voteAverage={item.rating}
                  popularity={item.popularity || 0}
                  genres={item.genre ? [item.genre] : []}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-8 text-sm text-white/45">
          No titles match the current filters.
        </div>
      )}
    </section>
  );
}
