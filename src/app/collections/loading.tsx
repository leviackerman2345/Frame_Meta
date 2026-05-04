import React from "react";
import { CollectionGridSkeleton } from "@/components/ui/CollectionSkeleton";

export default function CollectionsLoading() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-16 space-y-4 animate-pulse">
          <div className="w-64 h-16 bg-zinc-900 rounded-2xl" />
          <div className="w-full max-w-2xl h-8 bg-zinc-900 rounded-xl" />
        </header>

        <div className="mb-12 flex gap-3 overflow-x-auto pb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-5 py-5 w-24 bg-zinc-900 rounded-full animate-pulse" />
          ))}
        </div>

        <CollectionGridSkeleton />
      </div>
    </main>
  );
}
