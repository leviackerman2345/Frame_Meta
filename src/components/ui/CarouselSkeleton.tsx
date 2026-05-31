interface CarouselSkeletonProps {
  count?: number;
}

export function CarouselSkeleton({ count = 5 }: CarouselSkeletonProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Section header skeleton */}
      <div className="mb-6 space-y-2">
        <div className="w-48 h-6 rounded-xl bg-zinc-900/60 skeleton-shimmer" />
        <div className="w-32 h-4 rounded-lg bg-zinc-900/40 skeleton-shimmer" />
      </div>

      {/* Card rail */}
      <div className="flex gap-4 md:gap-5 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-[calc((100%-1rem)/2)] sm:w-[calc((100%-2*1rem)/3)] md:w-[calc((100%-4*1.25rem)/5)] aspect-[2/3] rounded-[1.75rem] bg-zinc-900/40 skeleton-shimmer"
          />
        ))}
      </div>
    </section>
  );
}
