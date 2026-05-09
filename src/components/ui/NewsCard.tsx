"use client";

import Image from "next/image";
import Link from "next/link";
import { NewsArticle } from "@/types/types";

interface NewsCardProps {
  item: NewsArticle;
}

export function NewsCard({ item }: NewsCardProps) {
  const dateStr = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <article className="w-full h-full flex flex-col cursor-pointer" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <Link href={item.url || "#"} className="h-full flex flex-col" target="_blank" rel="noopener noreferrer">
        <div className="relative flex flex-col h-full bg-zinc-900/40 backdrop-blur-3xl shadow-2xl border border-zinc-800 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] outline outline-1 outline-transparent [transform:translateZ(0)] rounded-[2.5rem] p-6 pb-8 transition-all duration-500">
          
          <div className="relative aspect-16/10 w-full rounded-[1.8rem] overflow-hidden bg-zinc-950 mb-8 border border-zinc-800 shadow-inner shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] outline outline-1 outline-transparent [transform:translateZ(0)]">
            {item.thumbnailUrl && (
              <>
                <div className="absolute top-0 inset-x-0 h-[calc(100%+1px)] z-0">
                  <Image
                    src={item.thumbnailUrl}
                    alt=""
                    fill
                    className="object-cover blur-2xl opacity-20"
                  />
                </div>
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className="relative z-10 object-cover"
                  sizes="(max-width: 1024px) 100vw, 450px"
                />
              </>
            )}
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] bg-white text-black rounded-lg shadow-xl">
                {item.source}
              </span>
            </div>
          </div>

          <div className="flex flex-col flex-1 px-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
                {item.source}
              </span>
              <span className="text-zinc-600 ml-auto text-[10px] font-bold">{dateStr}</span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-[1.2] tracking-tighter line-clamp-3">
              {item.title}
            </h3>

            <p className="text-zinc-400 text-sm md:text-[15px] leading-relaxed mb-8 line-clamp-3 font-medium opacity-80">
              {item.excerpt}
            </p>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white leading-none mb-1">Editor</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Contributor</span>
              </div>

              <div className="bg-white text-black px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95">
                Read more
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
