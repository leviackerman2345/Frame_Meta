export default function MoviesLoading() {
  return (
    <main className="min-h-screen bg-black pb-24 text-white animate-pulse">
      {/* Hero skeleton */}
      <section className="relative w-full min-h-[80vh] flex items-end p-8 md:p-16">
        <div className="absolute inset-0 bg-zinc-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="w-20 h-5 rounded-full bg-zinc-800" />
          <div className="w-3/4 h-10 rounded-xl bg-zinc-800" />
          <div className="w-full h-4 rounded bg-zinc-800/60" />
          <div className="w-5/6 h-4 rounded bg-zinc-800/60" />
          <div className="flex gap-3 pt-2">
            <div className="w-28 h-10 rounded-full bg-zinc-800" />
            <div className="w-28 h-10 rounded-full bg-zinc-800/60" />
          </div>
        </div>
      </section>

      {/* Carousel skeletons */}
      {[1, 2, 3, 4].map((i) => (
        <section key={i} className="px-4 md:px-10 py-10 space-y-5">
          <div className="w-48 h-7 rounded-xl bg-zinc-900/60" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="shrink-0 w-[160px] md:w-[200px] aspect-[2/3] rounded-2xl bg-zinc-900/40 skeleton-shimmer" />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
