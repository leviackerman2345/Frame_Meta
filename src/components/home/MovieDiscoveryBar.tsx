"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { movieHomeContent } from "@/constants/movie-home";
import { normalizeHomeDuration, normalizeHomePlatform } from "@/lib/movie-home";

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

export function MovieDiscoveryBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [brokenLogos, setBrokenLogos] = useState<Record<string, boolean>>({});

  const activePlatform = normalizeHomePlatform(searchParams.get("platform"));
  const activeDuration = normalizeHomeDuration(searchParams.get("budget"));

  const go = (key: string, value: string) => {
    const query = updateParams(new URLSearchParams(searchParams.toString()), key, value);
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 pt-6 md:pt-8 relative z-20">
      <div className="rounded-[2rem] border border-white/8 bg-zinc-950/80 shadow-[0_30px_80px_rgba(0,0,0,0.35)] px-4 py-4 md:px-6 md:py-5 space-y-4">
        <div>
          <p className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-white/35">
            Streamer access bar
          </p>
          <h2 className="mt-2 text-xl md:text-2xl font-semibold tracking-tight text-white">
            Filter the homepage by active subscriptions.
          </h2>
          <p className="mt-2 text-sm md:text-[15px] text-white/55 leading-relaxed max-w-2xl">
            Choose the services you have and every row below updates in sync.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {movieHomeContent.filters.platforms.map((platform) => {
            const active = activePlatform === platform.key;
            const isAll = platform.key === "all";
            const hasLogo = !isAll && platform.logo && !brokenLogos[platform.key];

            return (
              <button
                key={platform.key}
                onClick={() => go("platform", platform.key)}
                className={`group flex shrink-0 items-center gap-3 rounded-full border px-3.5 py-2.5 transition-all duration-300 ${
                  active
                    ? "border-white/30 bg-white text-black shadow-lg"
                    : "border-white/8 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {(isAll || hasLogo) && (
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
                        onError={() => {
                          setBrokenLogos((prev) => ({ ...prev, [platform.key]: true }));
                        }}
                      />
                    )}
                  </span>
                )}
                <span className={`${(isAll || hasLogo) ? "pr-1" : "px-2.5"} text-xs font-semibold tracking-wide`}>
                  {platform.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {movieHomeContent.filters.durations.map((bucket) => {
            const active = activeDuration === bucket.key;
            return (
              <button
                key={bucket.key}
                onClick={() => go("budget", bucket.key)}
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
