"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { NewsArticle } from "@/types/types";
import { NewsCard } from "@/components/ui/NewsCard";

interface ArtistFeaturedNewsProps {
  name: string;
  articles: NewsArticle[];
}

export function ArtistFeaturedNews({ name, articles: initialArticles }: ArtistFeaturedNewsProps) {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles || []);
  const [loading, setLoading] = useState(false);

  // Note: Client-side fetch removed as /api/news does not exist.
  // We rely on server-side prop injection.
  
  const sortedArticles = [...articles]
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return isNaN(dateB) || isNaN(dateA) ? 0 : dateB - dateA;
    })
    .slice(0, 6);
    
  if (!loading && sortedArticles.length === 0) {
    return (
      <section className="w-full max-w-360 mx-auto px-6 md:px-12 py-10 md:py-16 flex flex-col gap-8 opacity-50">
        <h3 className="text-xl md:text-3xl font-black text-white tracking-tight">
          {name} in the News
        </h3>
        <p className="text-zinc-500 font-medium">No recent headlines found for this artist.</p>
      </section>
    );
  }

  const featuredArticle = sortedArticles[0];
  const remainingArticles = sortedArticles.slice(1);

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as any }
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as any }
    }
  };

  return (
    <section className="w-full max-w-360 mx-auto px-6 md:px-12 py-10 md:py-16 flex flex-col gap-12" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      
      {/* Featured Article Highlight */}
      {featuredArticle && (
        <div className="flex flex-col gap-10">
          <motion.div 
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-3"
          >
            <span className="text-red-500 font-black uppercase tracking-[0.3em] text-[10px]">Featured Story</span>
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
              {name} Spotlight
            </h3>
          </motion.div>
          
          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full"
          >
            <NewsCard item={featuredArticle} />
          </motion.div>
        </div>
      )}

      {/* Remaining News Carousel */}
      {remainingArticles.length > 0 && (
        <div className="flex flex-col gap-12">
          <motion.div 
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex items-center justify-between"
          >
            <h4 className="text-xl md:text-2xl font-black text-white tracking-tight">
              Latest Headlines
            </h4>
            <div className="h-px flex-1 bg-white/5 mx-8 hidden md:block" />
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-zinc-500 font-bold uppercase tracking-widest text-xs">
              Loading news...
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex gap-4 md:gap-8 overflow-x-auto pb-10 custom-scrollbar snap-x snap-mandatory no-scrollbar scroll-smooth w-full"
            >
              {remainingArticles.map((article) => (
                <motion.div 
                  key={article.id}
                  variants={cardVariants}
                  className="w-[calc(100%-40px)] sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-64px)/3)] shrink-0 snap-start snap-always"
                >
                  <NewsCard item={article} />
                </motion.div>
              ))}
              <div className="min-w-px h-full pointer-events-none" />
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
}
