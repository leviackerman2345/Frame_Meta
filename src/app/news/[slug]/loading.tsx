// loading.tsx — Next.js App Router route-level loading UI.
//
// WHY THIS FILE EXISTS:
// Next.js App Router automatically renders this component as an instant
// skeleton while the async Server Component (page.tsx) is resolving on the
// server. It is placed at the same directory level as page.tsx so it applies
// only to the /news/[slug] route segment.
//
// Unlike <Suspense> boundaries inside page.tsx (which stream in sections after
// the initial shell), loading.tsx covers the very first navigation to the
// route — i.e. the full-page skeleton shown before ANY server HTML has arrived.
//
// The layout mirrors the real page structure (category badge → headline →
// hero image → meta bar) so the skeleton collapses into the real content
// without a jarring layout shift.

export default function NewsArticleLoading() {
  return (
    <main
      className="min-h-screen bg-black text-white animate-pulse"
      style={{ fontFamily: "'Inters', 'Inter', sans-serif" }}
    >
      {/* Navbar placeholder */}
      <div className="h-16 w-full bg-white/5" />

      {/* Hero section */}
      <section className="pt-32 md:pt-48 pb-16 px-6 md:px-12 max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-12">

          {/* Category badge */}
          <div className="flex flex-col gap-6">
            <div className="h-5 w-28 rounded-sm bg-white/5" />

            {/* Headline — three lines at decreasing widths */}
            <div className="space-y-4">
              <div className="h-14 md:h-20 w-full rounded-2xl bg-white/5" />
              <div className="h-14 md:h-20 w-5/6 rounded-2xl bg-white/5" />
              <div className="h-14 md:h-20 w-3/5 rounded-2xl bg-white/5" />
            </div>

            {/* Description */}
            <div className="h-6 w-4/5 rounded-xl bg-white/5" />
          </div>

          {/* Hero image placeholder — matches aspect-[21/9] on desktop */}
          <div className="aspect-[16/10] md:aspect-[21/9] w-full rounded-[3rem] bg-white/5" />

          {/* Author meta bar */}
          <div className="py-10 px-8 md:px-12 rounded-[2.5rem] bg-zinc-900/40 flex flex-wrap items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-[1.2rem] bg-white/5" />
              {/* Name + role */}
              <div className="space-y-2">
                <div className="h-4 w-32 rounded-lg bg-white/5" />
                <div className="h-3 w-20 rounded-lg bg-white/5" />
              </div>
            </div>
            {/* Date / read time */}
            <div className="flex gap-8">
              <div className="h-8 w-20 rounded-xl bg-white/5" />
              <div className="h-8 w-20 rounded-xl bg-white/5" />
            </div>
            {/* Share buttons */}
            <div className="flex gap-3">
              <div className="h-10 w-28 rounded-2xl bg-white/5" />
              <div className="h-10 w-10 rounded-2xl bg-white/5" />
              <div className="h-10 w-10 rounded-2xl bg-white/5" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

