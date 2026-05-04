import React from "react";
import Image from "next/image";
import Link from "next/link";
import { featuredNewsHeading, featuredNewsData } from "@/config/site-content";
import { getLatestNews } from "@/lib/news";

export async function FeaturedNews() {
  const dynamicNews = await getLatestNews(10);
  // Only render articles that have a thumbnail image
  const validDynamic = dynamicNews.filter((n) => !!n.imageUrl);
  const newsItems = validDynamic.length > 0 ? validDynamic : featuredNewsData.filter((n) => !!n.imageUrl).slice(0, 10);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-10 relative z-20 overflow-hidden">
      {/* Harmonized Section Header */}
      <div className="flex items-end justify-between mb-8 gap-5 px-2">
        <div className="max-w-[70%]">
          <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight drop-shadow-sm">
            {featuredNewsHeading.title}
          </h2>
          {featuredNewsHeading.subtitle && (
            <p className="text-[11px] md:text-sm text-zinc-400/90 mt-1 font-medium">{featuredNewsHeading.subtitle}</p>
          )}
        </div>

        <Link href="/news" className="flex items-center gap-2 px-0 md:px-4 py-2 text-[10px] md:text-xs font-semibold text-zinc-400 hover:text-white transition-colors duration-300">
          <span className="whitespace-nowrap">See All News</span>
          <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Glassmorphic Horizontal News Carousel */}
      <div className="relative -mx-4 md:-mx-12 px-4 md:px-12 group/carousel">
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-10 custom-scrollbar snap-x snap-mandatory no-scrollbar px-1 scroll-smooth">
          {newsItems.map((item) => (
            <article 
              key={item.id} 
              className="w-[calc(100%-40px)] sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-64px)/3)] shrink-0 flex flex-col snap-start snap-always cursor-pointer"
            >
              <Link href={item.slug ? `/news/${item.slug}` : (item.url || "#")} className="h-full flex flex-col">
                {/* Refined Glassmorphic Container - Hover animations removed */}
                <div className="relative flex flex-col h-full bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-6 pb-8 shadow-2xl transition-all duration-500">
                  
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] w-full rounded-[1.8rem] overflow-hidden bg-zinc-950 mb-8 border border-white/5 shadow-inner">
                    {/* Blurred Backdrop for Contained Image */}
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={item.imageUrl!}
                        alt=""
                        fill
                        className="object-cover blur-2xl opacity-20"
                      />
                    </div>
                    <Image
                      src={item.imageUrl!}
                      alt={item.title}
                      fill
                      className="relative z-10 object-contain p-4"
                      sizes="(max-width: 1024px) 100vw, 450px"
                    />
                    {/* Category Badge - Minimalist */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] bg-white text-black rounded-lg shadow-xl">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Editorial Layout */}
                  <div className="flex flex-col flex-1 px-1">
                    {/* Source Row - Text Only */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
                        {item.source}
                      </span>
                      <span className="text-zinc-600 ml-auto text-[10px] font-bold">{item.date}</span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-[1.2] tracking-tighter line-clamp-3">
                      {item.title}
                    </h3>

                    <p className="text-zinc-400 text-sm md:text-[15px] leading-relaxed mb-8 line-clamp-3 font-medium opacity-80">
                      {item.description}
                    </p>

                    {/* Footer Section - Text Only */}
                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-white leading-none mb-1">{item.author}</span>
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
          ))}
          
          <div className="min-w-[1px] h-full pointer-events-none" />
        </div>

      </div>
    </section>
  );
}
