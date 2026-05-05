import React from "react";
import { collectionsContent } from "@/constants/collections";
import { getDiscoverableCollections } from "@/lib/tmdb";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { CollectionCard } from "@/components/ui/CollectionCard";
import Link from "next/link";

export async function Collections() {
  const collections = await getDiscoverableCollections();

  if (!collections || collections.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-20">
      <SectionHeader
        title={collectionsContent.heading.title}
        subtitle={collectionsContent.heading.subtitle}
        layout="split"
        action={(
          <Link href="/collections" className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors duration-300">
            See All Collections
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      />

      {/* Horizontal Scrolling Cards */}
      <div className="flex gap-6 overflow-x-auto pb-8 custom-scrollbar snap-x px-1 scroll-smooth">
        {collections.map((collection, i) => (
          <CollectionCard key={collection.id} collection={collection} index={i} />
        ))}
      </div>
    </section>
  );
}
