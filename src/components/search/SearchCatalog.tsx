"use client";

import { MovieCard } from "@/types/types";
import { Info } from "lucide-react";
import { MediaCard } from "@/components/ui/MediaCard";

interface SearchCatalogProps {
  titles: MovieCard[];
  title: string;
}

export function SearchCatalog({ titles, title }: SearchCatalogProps) {


  if (titles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6 border border-white/5">
          <Info className="h-10 w-10 text-zinc-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">No titles found</h3>
        <p className="text-zinc-500 max-w-md">
          We couldn&apos;t find any results for your current selection. Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10 px-4 md:px-10 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
        {titles.map((item) => (
          <MediaCard
            key={item.id}
            data={item}
            variant="catalog"
            container="grid"
          />
        ))}
      </div>
    </div>
  );
}
