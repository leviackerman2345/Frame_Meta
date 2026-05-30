"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { seriesHomeContent } from "@/constants/series-home";

function updateParams(current: URLSearchParams, key: string, value: string) {
  const next = new URLSearchParams(current.toString());
  if (value === "all") next.delete(key);
  else next.set(key, value);
  return next.toString();
}

export function BingeTrackerSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeBinge = (searchParams.get("binge") || "all").toLowerCase();

  const go = (value: string) => {
    const query = updateParams(new URLSearchParams(searchParams.toString()), "binge", value);
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 pt-4 md:pt-6 relative z-20">
      <div className="rounded-[2rem] border border-white/8 bg-zinc-950/50 backdrop-blur-3xl shadow-[0_30px_80px_rgba(0,0,0,0.35)] px-4 py-4 md:px-6 md:py-5">
        <p className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-white/35">
          Smart sessions
        </p>
        <h2 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight text-white">
          The Binge Tracker
        </h2>
        <p className="mt-2 text-sm md:text-[15px] text-white/55 leading-relaxed max-w-2xl">
          Pick a time commitment and every row below adjusts to fit your schedule.
        </p>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-4">
          {seriesHomeContent.filters.binge.map((bucket) => {
            const active = activeBinge === bucket.key;
            return (
              <button
                key={bucket.key}
                onClick={() => go(bucket.key)}
                className={`shrink-0 rounded-full border px-4 py-2 transition-all duration-300 ${
                  active
                    ? "border-white/30 bg-white text-black"
                    : "border-white/8 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="text-xs font-semibold">{bucket.label}</div>
                <div className={`text-[10px] ${active ? "text-black/60" : "text-white/40"}`}>
                  {bucket.hint}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
