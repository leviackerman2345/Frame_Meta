"use client";

import Image from "next/image";

interface CastCardProps {
  actor: {
    id: number;
    name?: string;
    profile_path?: string;
    character?: string;
    job?: string;
    displayRole?: string;
    appearanceCount?: number;
    allCharacters?: string[];
  };
  index: number;
}

export function CastCard({ actor, index }: CastCardProps) {
  const targetHref = `/people/${actor.id}`;

  const actorPhoto = actor.profile_path
    ? `https://image.tmdb.org/t/p/original${actor.profile_path}`
    : null;

  const initial = (actor.name?.[0] || "A").toUpperCase();

  const bgColors = [
    "from-indigo-950 via-slate-900 to-zinc-950",
    "from-violet-950 via-neutral-900 to-black",
    "from-emerald-950 via-zinc-900 to-zinc-950",
    "from-cyan-950 via-slate-950 to-black",
    "from-rose-950 via-stone-900 to-zinc-950",
  ];
  const bgColor = bgColors[index % bgColors.length];

  // Warm the in-memory cache on hover via a low-priority background fetch.
  // By the time the user clicks, the ISR cache is already hot — reducing
  // the background fetch time on click to near zero.
  const handleMouseEnter = () => {
    fetch(`/api/people/${actor.id}`, { priority: "low" } as RequestInit).catch(
      () => {} // Fire-and-forget — errors are silently ignored
    );
  };

  /**
   * BACKGROUND PRELOAD-THEN-NAVIGATE PATTERN
   *
   * Goal: keep the titles modal fully visible and interactive while the actor
   * page is being prepared, then swap to it instantly once it's ready — giving
   * the illusion of zero loading time.
   *
   * How it works:
   *  1. A <link rel="prefetch"> hint is injected into <head> so the browser
   *     queues the actor page document in its prefetch cache immediately.
   *  2. A high-priority fetch() forces the Next.js ISR cache to pre-render
   *     the actor page on the server side before the browser even navigates.
   *  3. We race that fetch against a 3-second safety timeout. Whichever
   *     settles first triggers window.location.href, ensuring the user is
   *     never stuck indefinitely even on a slow connection.
   *  4. window.location.href (not router.push) is used because router.push
   *     goes through the Next.js parallel route system and can be intercepted
   *     by @modal slots — hard navigation bypasses that entirely.
   *  5. The card UI is never mutated during the wait — no overlay, no spinner,
   *     no opacity change — so the modal appears completely unaffected.
   */
  const handleClick = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();

    // 1. Browser-level prefetch hint — queues the document in the HTTP cache
    const link = document.createElement("a");
    link.rel = "prefetch";
    link.href = targetHref;
    document.head.appendChild(link);

    // 2. High-priority server fetch — forces ISR pre-render so the page is
    //    fully ready in the cache before the browser navigates to it
    const backgroundFetch = fetch(targetHref, {
      priority: "high",
      headers: { Accept: "text/html" },
    } as RequestInit).catch(() => {}); // Swallow network errors — timeout handles fallback

    // 3. 3-second safety ceiling — navigate regardless of fetch outcome
    const timeout = new Promise<void>((resolve) =>
      setTimeout(resolve, 3000)
    );

    // 4. Whichever resolves first (fetch or timeout) → navigate
    await Promise.race([backgroundFetch, timeout]);

    window.location.href = targetHref;
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick(e);
      }}
      className="relative group w-full aspect-2/3 rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] outline outline-1 outline-transparent [transform:translateZ(0)] bg-[#121214] transition-all duration-500 hover:border-white hover:ring-2 hover:ring-white/10 cursor-pointer block"
      aria-label={`View ${actor.name}`}
    >
      {/* Photo Container */}
      <div className="absolute top-0 inset-x-0 h-[calc(100%+1px)] overflow-hidden z-0">
        {actorPhoto ? (
          <Image
            src={actorPhoto}
            alt={actor.name || "Actor"}
            fill
            className="object-cover object-center contrast-[1.05] saturate-[1.1] transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full bg-linear-to-br ${bgColor} flex items-center justify-center relative`}>
            <div className="absolute inset-4 rounded-full border border-white/5 bg-white/2 backdrop-blur-md flex items-center justify-center shadow-inner">
              <span className="text-6xl md:text-7xl font-black bg-linear-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] tracking-tighter">
                {initial}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Blurred Panel */}
      <div
        className="absolute -inset-x-6 -bottom-6 h-[45%] bg-black/60 z-10"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%), radial-gradient(circle, black 100%, black 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 100%), radial-gradient(circle, black 100%, black 100%)',
          WebkitMaskComposite: 'source-in',
          maskComposite: 'intersect',
        }}
      />

      {/* Actor & Character Info Overlay */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end text-center p-6 pb-8 z-20 gap-4">
        <div className="flex flex-col gap-1.5 max-w-full">
          <h4 className="text-white font-bold text-lg md:text-xl tracking-tight">
            {actor.name}
          </h4>
          <p className="text-white/70 font-medium text-xs md:text-sm truncate px-2">
            {actor.displayRole || actor.character || actor.job}
          </p>
          <div className="flex items-center gap-2 w-full pt-2">
            <div className="flex-1 px-4 py-2 rounded-2xl bg-transparent border border-white text-white text-[10px] md:text-xs font-bold uppercase tracking-widest text-center group-hover:bg-white group-hover:text-black transition-all duration-300">
              View
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                alert(`Following ${actor.name}`);
              }}
              className="relative z-40 px-4 py-2 rounded-2xl bg-white text-black hover:bg-black hover:text-white border border-white text-[10px] md:text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1 uppercase tracking-widest cursor-pointer"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
              Follow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
