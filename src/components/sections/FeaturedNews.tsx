import React from "react";
import Image from "next/image";
import { featuredNewsHeading, featuredNewsData } from "@/config/site-content";
import { getLatestNews } from "@/lib/news";

export async function FeaturedNews() {
  const dynamicNews = await getLatestNews(10);
  const newsItems = dynamicNews.length > 0 ? dynamicNews : featuredNewsData.slice(0, 10);

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

        <button className="flex items-center gap-2 px-0 md:px-4 py-2 text-[10px] md:text-xs font-semibold text-zinc-400 hover:text-white transition-colors duration-300">
          <span className="whitespace-nowrap">See All News</span>
          <svg className="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Glassmorphic Horizontal News Carousel */}
      <div className="relative -mx-4 md:-mx-12 px-4 md:px-12 group/carousel">
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-10 custom-scrollbar snap-x no-scrollbar">
          {newsItems.map((item) => (
            <article 
              key={item.id} 
              className="w-[85vw] sm:w-[420px] shrink-0 flex flex-col snap-start group cursor-pointer transition-all duration-500"
            >
              {/* Glassmorphic Container Wrapper */}
              <div className="relative flex flex-col h-full bg-zinc-900/30 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-5 pb-8 md:pb-10 shadow-2xl transition-all duration-500 group-hover:bg-zinc-900/50 group-hover:border-white/20 group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)]">
                
                {/* Image Container - Floating inside Glass */}
                <div className="relative aspect-[16/10] w-full rounded-[1.5rem] md:rounded-[1.8rem] overflow-hidden bg-zinc-950 mb-6 md:mb-8 border border-white/5 transition-all duration-700">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-[1.03] transition-all duration-1000 ease-out"
                    sizes="(max-width: 1024px) 100vw, 450px"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 md:top-5 md:left-5 z-10">
                    <span className="px-3 py-1 md:px-3.5 md:py-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] bg-red-600 text-white rounded-lg shadow-xl drop-shadow-lg transition-transform duration-500 group-hover:scale-105">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Typography Area - Content Padding */}
                <div className="flex flex-col px-2 md:px-4 flex-1">
                  <div className="flex flex-col gap-1 mb-4 md:mb-5">
                    <div className="flex items-center gap-2 text-[9px] md:text-[10px] lg:text-xs font-bold text-zinc-500 tracking-tight">
                      <span className="text-zinc-600 font-medium">By</span>
                      <span className="text-white/80 font-black uppercase tracking-wider">{item.author}</span>
                      <span className="opacity-20 text-[6px]">•</span>
                      <span className="text-zinc-400 font-black uppercase tracking-widest">{item.source}</span>
                    </div>
                  </div>

                  <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4 leading-tight group-hover:text-zinc-100 transition-colors tracking-tighter line-clamp-2 md:line-clamp-none">
                    {item.title}
                  </h3>

                  <p className="text-zinc-400/80 text-xs md:text-sm lg:text-base mb-6 md:mb-8 line-clamp-2 md:line-clamp-3 font-medium leading-[1.6] group-hover:text-zinc-300 transition-colors">
                    {item.description}
                  </p>

                  {/* Minimalist Footer inside Glass */}
                  <div className="mt-auto pt-5 md:pt-6 border-t border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] lg:text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      <span>{item.date}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-800" />
                      <span>{item.readTime}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 md:gap-2 text-white/40 group-hover:text-white transition-colors">
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Read More</span>
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
          
          <div className="min-w-[1px] h-full pointer-events-none" />
        </div>

        {/* Cinematic Edge Fades */}
        <div className="absolute top-0 left-0 w-24 md:w-40 h-full bg-gradient-to-r from-black via-black/20 to-transparent z-10 pointer-events-none transition-opacity duration-1000 hidden md:block" />
        <div className="absolute top-0 right-0 w-24 md:w-40 h-full bg-gradient-to-l from-black via-black/20 to-transparent z-10 pointer-events-none transition-opacity duration-1000 hidden md:block" />
      </div>
    </section>
  );
}
