"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NewsArticle } from "@/types/types";
import { AuthorAvatar } from "./AuthorAvatar";

interface NewsCardProps {
  item: NewsArticle;
  articleUrl?: string;
}

export function NewsCard({ item, articleUrl }: NewsCardProps) {
  const router = useRouter();

  const dateStr = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(articleUrl || item.url || "#");
    }
  };

  return (
    <article
      className="w-full h-full flex flex-col cursor-pointer group"
      onKeyDown={handleKeyDown}
    >
      <Link href={item.url || "#"} className="h-full flex flex-col">
        <div className="relative flex flex-col h-full rounded-[2rem] border border-white/8 bg-zinc-950/80 overflow-hidden transition-all duration-500 hover:border-white/15">
          {/* Thumbnail */}
          <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
            {item.thumbnailUrl && (
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.2em] bg-white/90 text-black rounded-full">
                {item.source}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 px-5 pt-5 pb-6">
            <div className="flex items-center gap-2 text-[10px] text-white/35 mb-3">
              <span>{item.source}</span>
              {dateStr && (
                <>
                  <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                  <span>{dateStr}</span>
                </>
              )}
            </div>

            <h3 className="text-base md:text-lg font-semibold text-white leading-snug tracking-tight line-clamp-2 mb-3 transition-colors duration-300 group-hover:text-white/80">
              {item.title}
            </h3>

            <p className="text-sm text-white/35 leading-relaxed line-clamp-2 mb-5">
              {item.excerpt}
            </p>

            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <AuthorAvatar src={item.authorAvatar} name={item.author || "Editorial"} size={28} />
                <span className="text-[11px] font-medium text-white/60">
                  {item.author || "FrameMeta"}
                </span>
              </div>

              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider group-hover:text-white/60 transition-colors duration-300">
                Read
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
