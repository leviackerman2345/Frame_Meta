import React from "react";
import { getLatestNews } from "@/lib/news";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import Link from "next/link";
import Image from "next/image";

export default async function NewsListingPage() {
  const news = await getLatestNews(20);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Cinema Daily
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
            The latest headlines, exclusive features, and industry analysis from the world of film.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {news.map((item) => (
            <Link 
              key={item.slug} 
              href={`/news/${item.slug}`}
              className="group flex flex-col h-full bg-zinc-900/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-zinc-900/40 hover:border-white/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative aspect-[16/9] w-full">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    sizes="(max-width: 1024px) 100vw, 400px"
                  />
                )}
                <div className="absolute top-6 left-6">
                  <span className="px-3 py-1 text-[10px] font-black bg-red-600 text-white rounded-lg shadow-xl uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
                  <span>{item.author}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-800" />
                  <span>{item.readTime}</span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight line-clamp-3 group-hover:text-red-500 transition-colors tracking-tight">
                  {item.title}
                </h2>

                <p className="text-zinc-400 text-sm md:text-base line-clamp-3 font-medium leading-relaxed mb-8">
                  {item.description}
                </p>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{item.date}</span>
                  <div className="flex items-center gap-2 text-white/40 group-hover:text-white transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest">Read Article</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
