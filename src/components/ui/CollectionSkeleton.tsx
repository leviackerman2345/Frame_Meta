import React from "react";

export function CollectionSkeleton() {
  return (
    <div className="w-full aspect-[16/11] rounded-[2.5rem] overflow-hidden bg-zinc-900/50 animate-pulse relative">
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full p-8 space-y-4">
        {/* Badge Skeleton */}
        <div className="w-24 h-5 bg-white/10 rounded-full" />
        
        {/* Title/Logo Skeleton */}
        <div className="w-48 h-10 bg-white/10 rounded-xl" />
        
        {/* Meta Info Skeleton */}
        <div className="flex gap-2">
          <div className="w-12 h-6 bg-white/10 rounded-lg" />
          <div className="w-20 h-6 bg-white/10 rounded-lg" />
          <div className="w-16 h-6 bg-white/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function CollectionGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 9 }).map((_, i) => (
        <CollectionSkeleton key={i} />
      ))}
    </div>
  );
}
