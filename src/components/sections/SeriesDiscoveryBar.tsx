"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { seriesHomeContent } from "@/constants/series-home";

function normalizePlatform(input?: string | null): string {
  const value = (input || "all").toLowerCase();
  if (seriesHomeContent.filters.platforms.some((p) => p.key === value)) return value;
  return "all";
}

function normalizeBinge(input?: string | null): string {
  const value = (input || "all").toLowerCase();
  if (seriesHomeContent.filters.binge.some((b) => b.key === value)) return value;
  return "all";
}

function updateParams(
  current: URLSearchParams,
  key: string,
  value: string
) {
  const next = new URLSearchParams(current.toString());
  if (value === "all") next.delete(key);
  else next.set(key, value);
  return next.toString();
}

export function SeriesDiscoveryBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activePlatform = normalizePlatform(searchParams.get("platform"));
  const activeBinge = normalizeBinge(searchParams.get("binge"));

  const go = (key: string, value: string) => {
    const query = updateParams(new URLSearchParams(searchParams.toString()), key, value);
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 pt-6 md:pt-8 relative z-20">
      <div className="rounded-[2rem] border border-white/8 bg-zinc-950/50 backdrop-blur-3xl shadow-[0_30px_80px_rgba(0,0,0,0.35)] px-4 py-4 md:px-6 md:py-5 space-y-4">
        <div>
          <p className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-white/35">
            Streamer access bar
          </p>
          <h2 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight text-white">
            Filter by your active subscriptions.
          </h2>
          <p className="mt-2 text-sm md:text-[15px] text-white/55 leading-relaxed max-w-2xl">
            Choose the services you have and every row below updates in sync.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {seriesHomeContent.filters.platforms.map((platform) => {
            const active = activePlatform === platform.key;
            const isAll = platform.key === "all";

            return (
              <button
                key={platform.key}
                onClick={() => go("platform", platform.key)}
                className={`group flex shrink-0 items-center gap-3 rounded-full border px-3 py-2.5 transition-all duration-300 ${
                  active
                    ? "border-white/30 bg-white text-black shadow-lg"
                    : "border-white/8 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-black/20">
                  {isAll ? (
                    <span className="text-[10px] font-black tracking-[0.25em] uppercase">
                      All
                    </span>
                  ) : (
                    <Image
                      src={platform.logo}
                      alt={platform.label}
                      width={28}
                      height={28}
                      className="h-7 w-7 object-contain"
                      unoptimized
                    />
                  )}
                </span>
                <span className="pr-1 text-xs font-semibold tracking-wide">
                  {platform.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
