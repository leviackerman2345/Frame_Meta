export default function ClipsLoading() {
  return (
    <main className="h-screen w-full bg-black flex items-center justify-center animate-pulse">
      {/* Single full-screen video placeholder */}
      <div className="relative w-full h-full max-w-lg mx-auto bg-zinc-900/30">
        {/* Gradient overlays mimicking ClipOverlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Bottom content skeleton */}
        <div className="absolute bottom-8 left-6 right-6 space-y-3">
          <div className="w-48 h-5 rounded-lg bg-white/[0.08]" />
          <div className="w-32 h-3 rounded bg-white/[0.05]" />
          <div className="flex gap-2 pt-2">
            <div className="w-16 h-6 rounded-full bg-white/[0.06]" />
            <div className="w-16 h-6 rounded-full bg-white/[0.06]" />
          </div>
        </div>

        {/* Side action buttons skeleton */}
        <div className="absolute right-4 bottom-24 flex flex-col gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-11 h-11 rounded-full bg-white/[0.06]" />
          ))}
        </div>
      </div>
    </main>
  );
}
