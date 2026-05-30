import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getLatestNews } from "@/lib/news";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { NewsCard } from "@/components/ui/NewsCard";
import { AuthorAvatar } from "@/components/ui/AuthorAvatar";

export default async function NewsListingPage() {
  const news = await getLatestNews(20);
  const featuredArticle = news[0];
  const remainingNews = news.slice(1);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="pt-32 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="mb-16 md:mb-24">
          <span className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-white/35">
            Editorial
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.05]">
            Cinema Daily
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/45 max-w-xl leading-relaxed">
            The latest headlines, exclusive features, and industry analysis from the world of film.
          </p>
        </header>

        {/* Featured Article */}
        {featuredArticle && (
          <Link
            href={`/news/${featuredArticle.slug}`}
            className="group block mb-16 md:mb-24"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-center rounded-[2rem] md:rounded-[2.5rem] border border-white/8 bg-zinc-950/50 backdrop-blur-3xl overflow-hidden transition-all duration-500 hover:border-white/15">
              {/* Image */}
              <div className="relative aspect-video lg:aspect-[4/3] overflow-hidden">
                {featuredArticle.imageUrl && (
                  <Image
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] bg-white text-black rounded-full">
                    Featured
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col px-6 md:px-10 pb-8 md:pb-10 lg:py-10">
                <div className="flex items-center gap-3 text-[11px] font-medium text-white/40 mb-4">
                  <span>{featuredArticle.source}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{featuredArticle.date}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight transition-colors duration-300 group-hover:text-white/80">
                  {featuredArticle.title}
                </h2>

                <p className="mt-4 text-sm md:text-base text-white/40 leading-relaxed line-clamp-3">
                  {featuredArticle.description}
                </p>

                <div className="mt-6 pt-6 border-t border-white/8 flex items-center gap-3">
                  <AuthorAvatar
                    src={featuredArticle.authorAvatar}
                    name={featuredArticle.author || "Editorial"}
                    size={36}
                  />
                  <div>
                    <span className="text-sm font-medium text-white">
                      {featuredArticle.author || "FrameMeta"}
                    </span>
                    <span className="block text-[10px] text-white/35 mt-0.5">
                      Writer
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {remainingNews.map((item) => {
            const newsArticle = {
              id: item.id.toString(),
              title: item.title,
              excerpt: item.description || "",
              url: item.slug ? `/news/${item.slug}` : item.url || "#",
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
