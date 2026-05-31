export default function PersonDetailLoading() {
  return (
    <main className="min-h-screen bg-black pb-24 text-white animate-pulse">
      {/* Back link skeleton */}
      <div className="px-6 pt-28 pb-4">
        <div className="w-16 h-4 rounded bg-zinc-800" />
      </div>

      {/* Hero: portrait + info */}
      <section className="px-6 pb-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Portrait */}
          <div className="w-full md:w-80 aspect-[3/4] rounded-3xl bg-zinc-800/40 skeleton-shimmer shrink-0 mx-auto md:mx-0" />

          {/* Info */}
          <div className="flex-1 space-y-5 py-4">
            <div className="w-24 h-4 rounded-full bg-zinc-800" />
            <div className="w-72 h-10 rounded-xl bg-zinc-800" />
            <div className="w-40 h-4 rounded bg-zinc-800/60" />
            <div className="flex gap-2">
              <div className="w-16 h-7 rounded-full bg-zinc-800" />
              <div className="w-16 h-7 rounded-full bg-zinc-800" />
              <div className="w-16 h-7 rounded-full bg-zinc-800" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="w-full h-3 rounded bg-zinc-800/60" />
              <div className="w-5/6 h-3 rounded bg-zinc-800/60" />
              <div className="w-4/6 h-3 rounded bg-zinc-800/60" />
            </div>
          </div>
        </div>
      </section>

      {/* Role filter tabs */}
      <section className="px-6 pb-6 max-w-6xl mx-auto">
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shrink-0 w-24 h-9 rounded-full bg-zinc-900/60" />
          ))}
        </div>
      </section>

      {/* Filmography grid */}
      <section className="px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-zinc-900/40 skeleton-shimmer" />
          ))}
        </div>
      </section>
    </main>
  );
}
