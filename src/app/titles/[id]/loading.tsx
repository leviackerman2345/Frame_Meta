export default function TitleDetailLoading() {
  return (
    <main className="min-h-screen bg-black pb-24 text-white animate-pulse">
      {/* Backdrop hero */}
      <section className="relative w-full h-[60vh] md:h-[70vh]">
        <div className="absolute inset-0 bg-zinc-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex gap-6 items-end">
          {/* Poster */}
          <div className="hidden md:block w-44 aspect-[2/3] rounded-2xl bg-zinc-800/50 skeleton-shimmer shrink-0" />

          {/* Info */}
          <div className="flex-1 space-y-3 max-w-2xl">
            <div className="w-32 h-12 rounded-xl bg-zinc-800/40" /> {/* Logo placeholder */}
            <div className="w-20 h-4 rounded-full bg-zinc-800" />
            <div className="flex gap-3 items-center">
              <div className="w-12 h-5 rounded bg-zinc-800" />
              <div className="w-1 h-1 rounded-full bg-zinc-700" />
              <div className="w-16 h-5 rounded bg-zinc-800" />
              <div className="w-1 h-1 rounded-full bg-zinc-700" />
              <div className="w-14 h-5 rounded bg-zinc-800" />
            </div>
            <div className="flex gap-2">
              <div className="w-16 h-7 rounded-full bg-zinc-800" />
              <div className="w-16 h-7 rounded-full bg-zinc-800" />
            </div>
            <div className="space-y-2 pt-1">
              <div className="w-full h-3 rounded bg-zinc-800/60" />
              <div className="w-5/6 h-3 rounded bg-zinc-800/60" />
              <div className="w-4/6 h-3 rounded bg-zinc-800/60" />
            </div>
            <div className="flex gap-3 pt-2">
              <div className="w-32 h-10 rounded-full bg-zinc-800" />
              <div className="w-32 h-10 rounded-full bg-zinc-800/60" />
            </div>
          </div>
        </div>
      </section>

      {/* Watch providers */}
      <section className="px-6 md:px-12 py-8 max-w-6xl mx-auto">
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-12 h-12 rounded-xl bg-zinc-900/60" />
          ))}
        </div>
      </section>

      {/* Cast section */}
      <section className="px-6 md:px-12 py-8 max-w-6xl mx-auto space-y-5">
        <div className="w-24 h-6 rounded-xl bg-zinc-900/60" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="shrink-0 w-28 space-y-2">
              <div className="w-28 h-28 rounded-full bg-zinc-800/40" />
              <div className="w-20 h-3 rounded bg-zinc-800/60 mx-auto" />
              <div className="w-16 h-3 rounded bg-zinc-800/40 mx-auto" />
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      <section className="px-6 md:px-12 py-8 max-w-6xl mx-auto space-y-5">
        <div className="w-40 h-6 rounded-xl bg-zinc-900/60" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shrink-0 w-[160px] md:w-[200px] aspect-[2/3] rounded-2xl bg-zinc-900/40 skeleton-shimmer" />
          ))}
        </div>
      </section>
    </main>
  );
}
