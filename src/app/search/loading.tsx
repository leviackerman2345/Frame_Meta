export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-black pb-24 text-white">
      {/* Search header skeleton */}
      <section className="pt-32 pb-8 px-4 md:px-10 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="w-full h-14 rounded-2xl bg-zinc-900/60 border border-white/[0.06]" />
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="shrink-0 w-20 h-8 rounded-full bg-zinc-900/60" />
          ))}
        </div>
      </section>

      {/* Results grid skeleton */}
      <section className="px-4 md:px-10 pb-20 space-y-6">
        <div className="w-32 h-6 rounded-xl bg-zinc-900/60" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-[2/3] rounded-3xl overflow-hidden bg-zinc-900/40 skeleton-shimmer"
            >
              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
                <div className="w-3/4 h-4 rounded-lg bg-white/[0.06]" />
                <div className="flex gap-2">
                  <div className="w-10 h-3 rounded bg-white/[0.04]" />
                  <div className="w-14 h-3 rounded bg-white/[0.04]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
