import React from "react";
import Link from "next/link";
import { newsContent } from "@/constants/news";
import { getLatestNews } from "@/lib/news";
import { NewsCard } from "@/components/ui/NewsCard";
import { NewsArticle } from "@/types/types";

export async function FeaturedNews() {
  const dynamicNews = await getLatestNews(10);
  const validDynamic = dynamicNews.filter((n) => !!n.imageUrl);
  const newsItems = validDynamic.length > 0 ? validDynamic : newsContent.featured.items.filter((n) => !!n.imageUrl).slice(0, 10);

  const articles: NewsArticle[] = newsItems.map((item) => ({
    id: item.id.toString(),
    title: item.title,
    excerpt: item.description || "",
    url: item.slug ? `/news/${item.slug}` : ((item as any).url || "#"),
    source: item.source,
    publishedAt: item.date,
    thumbnailUrl: item.imageUrl || "",
  }));

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10 relative z-20 overflow-hidden" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      <div className="flex items-end justify-between mb-8 gap-5 px-2">
        <div className="max-w-[70%]">
          <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight drop-shadow-sm">
            {newsContent.featured.heading.title}
          </h2>
          {newsContent.featured.heading.subtitle && (
            <p className="text-[11px] md:text-sm text-zinc-400/90 mt-1 font-medium">{newsContent.featured.heading.subtitle}</p>
          )}
        </div>

        <Link href="/news" className="flex items-center gap-2 px-0 md:px-4 py-2 text-[10px] md:text-xs font-semibold text-zinc-400 hover:text-white transition-colors duration-300">
          <span className="whitespace-nowrap">See All News</span>
          <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="relative -mx-4 md:-mx-12 px-4 md:px-12 group/carousel">
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-10 custom-scrollbar snap-x snap-mandatory no-scrollbar px-1 scroll-smooth">
          {articles.map((item) => (
            <div key={item.id} className="w-[calc(100%-40px)] sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-64px)/3)] shrink-0 snap-start snap-always">
              <NewsCard item={item} />
            </div>
          ))}
          <div className="min-w-px h-full pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
