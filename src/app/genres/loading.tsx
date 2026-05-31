export default function GenresLoading() {
  return (
    <main className="min-h-screen bg-black pb-24 text-white">
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-16 space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="w-24 h-4 rounded-full bg-zinc-800" />
        <div className="w-64 h-10 rounded-xl bg-zinc-800" />
        <div className="w-96 max-w-full h-4 rounded bg-zinc-800/60" />

        {/* Genre grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-white/[0.06] bg-zinc-900/30 p-6 h-28 skeleton-shimmer"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-zinc-800" />
                <div className="space-y-2 flex-1">
                  <div className="w-24 h-5 rounded bg-zinc-800" />
                  <div className="w-40 h-3 rounded bg-zinc-800/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
