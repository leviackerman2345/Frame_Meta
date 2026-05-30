import type { ReactNode } from "react";
import Link from "next/link";
import { MediaCard } from "@/components/ui/MediaCard";
import { SectionHeader } from "@/components/sections/SectionHeader";
import type { MovieCard } from "@/types/types";

interface MovieRailProps {
  title: string;
  subtitle?: string;
  items: MovieCard[];
  action?: ReactNode;
  hrefLabel?: string;
  href?: string;
}

export function MovieRail({
  title,
  subtitle,
  items,
  action,
  href,
  hrefLabel,
}: MovieRailProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10 relative z-20">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        layout="split"
        action={
          action ||
          (href && hrefLabel ? (
            <Link
              href={href}
              className="hidden md:flex items-center gap-2 text-xs font-semibold text-white/55 hover:text-white transition-colors"
            >
              {hrefLabel}
              <span aria-hidden="true">+</span>
            </Link>
          ) : null)
        }
      />

      {items.length > 0 ? (
        <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory px-1 scroll-smooth">
          {items.map((item) => (
            <MediaCard key={item.id} data={item} variant="slider" />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-10 text-sm text-zinc-500">
          No titles match the current filters.
        </div>
      )}
    </section>
  );
}
