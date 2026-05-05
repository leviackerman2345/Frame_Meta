import React from "react";
import { getLatestNews } from "@/lib/news";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { NewsCard } from "@/components/ui/NewsCard";
import { NewsItem } from "@/types/types";

export default async function NewsListingPage() {
  const news = await getLatestNews(20);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent">
            Cinema Daily
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
            The latest headlines, exclusive features, and industry analysis from the world of film.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {news.map((item) => {
            const newsArticle = {
              id: item.id.toString(),
              title: item.title,
              excerpt: item.description || "",
              url: item.slug ? `/news/${item.slug}` : (item.url || "#"),
              source: item.source,
              publishedAt: item.date,
              thumbnailUrl: item.imageUrl || "",
            };
            return <NewsCard key={item.slug} item={newsArticle} />;
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}
