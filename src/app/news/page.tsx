import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getLatestNews } from "@/lib/news";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { NewsCard } from "@/components/ui/NewsCard";
import { AuthorAvatar } from "@/components/ui/AuthorAvatar";
import { NewsItem } from "@/types/types";

export default async function NewsListingPage() {
  const news = await getLatestNews(20);
  const featuredArticle = news[0];
  const remainingNews = news.slice(1);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-20 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-[2px] bg-indigo-500"></span>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Editorial</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-none">
            Cinema Daily
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
            The latest headlines, exclusive features, and industry analysis from the world of film.
          </p>
        </header>

        {/* Featured News Section - Premium Responsive Layout */}
        {featuredArticle && (
          <div className="mb-24 group">
            <Link href={`/news/${featuredArticle.slug}`} className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="relative aspect-video lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-zinc-950 border border-white/5 shadow-2xl">
                {featuredArticle.imageUrl && (
                  <Image 
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                )}
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-white text-black rounded-full shadow-2xl">
                    Featured Story
                  </span>
                </div>
              </div>
              <div className="flex flex-col space-y-6">
                <div className="flex items-center gap-4 text-xs font-bold text-zinc-500">
                  <span>{featuredArticle.source}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                  <span>{featuredArticle.date}</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[1.1] transition-colors group-hover:text-indigo-400">
                  {featuredArticle.title}
                </h2>
                <p className="text-zinc-400 text-lg md:text-xl leading-relaxed line-clamp-3">
                  {featuredArticle.description || featuredArticle.excerpt}
                </p>
                <div className="pt-4 flex items-center gap-4">
                  <AuthorAvatar src={featuredArticle.authorAvatar} name={featuredArticle.author || "Editorial"} size={48} />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{featuredArticle.author || "FrameMeta"}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Writer</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-x-12 md:gap-y-16">
          {remainingNews.map((item) => {
            const newsArticle = {
              id: item.id.toString(),
              title: item.title,
              excerpt: item.description || "",
              url: item.slug ? `/news/${item.slug}` : (item.url || "#"),
              source: item.source,
              publishedAt: item.date,
              thumbnailUrl: item.imageUrl || "",
              author: item.author,
              authorAvatar: item.authorAvatar,
            };
            return <NewsCard key={item.slug} item={newsArticle} />;
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}
