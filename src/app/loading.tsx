export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-300">Loading</p>
        </div>
      </div>
    </div>
  );
}
