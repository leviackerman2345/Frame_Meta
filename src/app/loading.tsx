export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
      {/* Brand name — simplified (no Framer Motion in server component) */}
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl tracking-[-0.02em] text-white">
          <span className="font-medium">Frame</span>
          <span className="font-bold">Meta</span>
        </h1>
        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.04] overflow-hidden">
        <div className="h-full bg-gradient-to-r from-white/10 via-white/25 to-white/10 origin-left animate-[progress-fill_2s_linear_forwards]" />
      </div>
    </div>
  );
}
