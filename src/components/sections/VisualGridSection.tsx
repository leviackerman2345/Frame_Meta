import Link from "next/link";
import type { ReactNode } from "react";
import { CollectionCard } from "@/components/ui/CollectionCard";
import { SectionHeader } from "@/components/sections/SectionHeader";
import type { MovieCard } from "@/types/types";

interface VisualGridSectionProps {
  title: string;
  subtitle?: string;
  items: MovieCard[];
  actionLabel?: string;
  actionHref?: string;
  footer?: ReactNode;
}

export function VisualGridSection({
  title,
  subtitle,
  items,
  actionLabel,
  actionHref,
  footer,
}: VisualGridSectionProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10 relative z-20">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        layout="split"
        action={
          actionLabel && actionHref ? (
            <Link
              href={actionHref}
              className="hidden md:flex items-center gap-2 text-xs font-semibold text-white/55 hover:text-white transition-colors"
            >
              {actionLabel}
              <span aria-hidden="true">+</span>
            </Link>
          ) : null
        }
      />

      <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 custom-scrollbar snap-x snap-mandatory px-1 scroll-smooth scrollbar-hide">
        {items.map((item, index) => (
          <CollectionCard key={item.id} collection={item} index={index} />
        ))}
      </div>

      {footer}
    </section>
  );
}

