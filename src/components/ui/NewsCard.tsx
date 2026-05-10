"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NewsArticle } from "@/types/types";
import { AuthorAvatar } from "./AuthorAvatar";

interface NewsCardProps {
  item: NewsArticle;
  // FIX 1 — articleUrl is threaded in from the page.tsx carousel so this
  // client component can handle keyboard navigation without the parent needing
  // to become a client component or use useRouter itself.
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

  // FIX 1 — Keyboard handler for carousel card wrappers.
  // The parent <div role="listitem" tabIndex={0}> in page.tsx is focusable
  // but has no native interaction behaviour. This handler fires when a
  // keyboard user presses Enter or Space on the focused card, navigating to
  // the article — matching the behaviour mouse users get by clicking the
  // <Link> inside. e.preventDefault() suppresses the default Space scroll.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(articleUrl || item.url || "#");
    }
  };

  return (
    // The onKeyDown is applied to the outer article so it captures focus
    // events from the parent tabIndex={0} div via event bubbling.
    <article
      className="w-full h-full flex flex-col cursor-pointer"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
      onKeyDown={handleKeyDown}
    >
      <Link href={item.url || "#"} className="h-full flex flex-col">
        <div className="relative flex flex-col h-full bg-zinc-900/40 backdrop-blur-3xl shadow-2xl border border-zinc-800 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] outline outline-1 outline-transparent [transform:translateZ(0)] rounded-[2.5rem] p-6 pb-8 transition-all duration-500">

          <div className="relative aspect-16/10 w-full rounded-[1.8rem] overflow-hidden bg-zinc-950 mb-8 border border-zinc-800 shadow-inner shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] outline outline-1 outline-transparent [transform:translateZ(0)]">
            {item.thumbnailUrl && (
              <>
                <div className="absolute top-0 inset-x-0 h-[calc(100%+1px)] z-0">
                  {/*
                    FIX 3 — alt text: background blur image is purely decorative.
                    An empty alt="" instructs screen readers to skip this element
                    entirely — it carries no information beyond the foreground image.
                    aria-hidden="true" adds a second layer of hiding so AT that
                    ignores alt="" (some older implementations) also skips it.
                    Without these, screen readers would read the same title twice.
                  */}
                  <Image
                    src={item.thumbnailUrl}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover blur-2xl opacity-20"
                  />
                </div>
                {/*
                  FIX 3 — alt text: foreground card thumbnail.
                  alt={item.title} gives screen readers a meaningful description
                  of the image content — it should match what the image depicts.
                  item.title is the article headline, which is always the most
                  accurate fallback when a dedicated image caption is unavailable.
                  Never use alt="" here — this image IS the primary visual content.
                */}
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className="relative z-10 object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

            <div className="mt-auto pt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AuthorAvatar src={item.authorAvatar} name={item.author || "Editorial"} size={36} />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-white leading-none mb-1">{item.author || "FrameMeta"}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Writer</span>
                </div>
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
