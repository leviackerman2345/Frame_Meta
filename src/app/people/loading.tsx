export default function PeopleLoading() {
  return (
    <main className="min-h-screen bg-black pb-24 text-white animate-pulse">
      {/* Spotlight hero skeleton */}
      <section className="relative min-h-[85vh] flex items-center justify-center">
        <div className="absolute inset-0 bg-zinc-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 px-6 max-w-5xl mx-auto">
          <div className="w-56 h-72 md:w-64 md:h-80 rounded-3xl bg-zinc-800/60 shrink-0" />
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="w-20 h-4 rounded-full bg-zinc-800 mx-auto md:mx-0" />
            <div className="w-64 h-10 rounded-xl bg-zinc-800 mx-auto md:mx-0" />
            <div className="w-full h-4 rounded bg-zinc-800/60" />
            <div className="w-5/6 h-4 rounded bg-zinc-800/60" />
            <div className="flex gap-2 justify-center md:justify-start pt-2">
              <div className="w-16 h-7 rounded-full bg-zinc-800" />
              <div className="w-16 h-7 rounded-full bg-zinc-800" />
              <div className="w-16 h-7 rounded-full bg-zinc-800" />
            </div>
            <div className="w-32 h-10 rounded-full bg-zinc-800 mt-2" />
          </div>
        </div>
        {/* Dot pagination */}
        <div className="absolute bottom-8 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-white/20" />
          ))}
        </div>
      </section>

      {/* Trending talent scroll */}
      <section className="px-4 md:px-10 py-10 space-y-5">
        <div className="w-40 h-7 rounded-xl bg-zinc-900/60" />
        <div className="flex gap-6 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="shrink-0 flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-zinc-800/60" />
              <div className="w-16 h-3 rounded bg-zinc-800/60" />
            </div>
          ))}
        </div>
      </section>

      {/* Award winners grid */}
      <section className="px-4 md:px-10 py-10 space-y-5">
        <div className="w-56 h-7 rounded-xl bg-zinc-900/60" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-zinc-800/40 skeleton-shimmer" />
          ))}
        </div>
      </section>

      {/* All creators grid */}
      <section className="px-4 md:px-10 py-10 space-y-5">
        <div className="w-40 h-7 rounded-xl bg-zinc-900/60" />
        <div className="flex gap-2 overflow-hidden pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shrink-0 w-24 h-9 rounded-full bg-zinc-900/60" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-zinc-900/30">
              <div className="w-16 h-16 rounded-xl bg-zinc-800/60 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-28 h-4 rounded bg-zinc-800" />
                <div className="w-20 h-3 rounded bg-zinc-800/60" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
