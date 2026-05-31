export function NewsCarouselSkeleton() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10">
      <div className="flex items-end justify-between mb-8 gap-5 px-2">
        <div className="space-y-2">
          <div className="w-40 h-6 rounded-xl bg-zinc-900/60 skeleton-shimmer" />
          <div className="w-28 h-4 rounded-lg bg-zinc-900/40 skeleton-shimmer" />
        </div>
      </div>
      <div className="flex gap-4 md:gap-8 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-[calc(100%-40px)] sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-64px)/3)] aspect-[16/10] rounded-2xl bg-zinc-900/40 skeleton-shimmer"
          />
        ))}
      </div>
    </section>
  );
}

export function CollectionCarouselSkeleton() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10">
      <div className="flex items-end justify-between mb-8 gap-5">
        <div className="space-y-2">
          <div className="w-48 h-6 rounded-xl bg-zinc-900/60 skeleton-shimmer" />
          <div className="w-32 h-4 rounded-lg bg-zinc-900/40 skeleton-shimmer" />
        </div>
      </div>
      <div className="flex gap-6 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-full md:w-[calc((100%-3rem)/2)] lg:w-[calc((6rem)/3)] aspect-[16/11] rounded-[2.5rem] bg-zinc-900/40 skeleton-shimmer"
          />
        ))}
      </div>
    </section>
  );
}

export function ContentSectionSkeleton() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="w-24 h-4 rounded-lg bg-zinc-900/60 skeleton-shimmer" />
        <div className="w-3/4 h-10 rounded-xl bg-zinc-900/60 skeleton-shimmer" />
        <div className="space-y-3 pt-4">
          <div className="w-full h-4 rounded bg-zinc-900/40 skeleton-shimmer" />
          <div className="w-5/6 h-4 rounded bg-zinc-900/40 skeleton-shimmer" />
          <div className="w-4/6 h-4 rounded bg-zinc-900/40 skeleton-shimmer" />
        </div>
      </div>
    </section>
  );
}
