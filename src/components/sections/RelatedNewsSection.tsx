"use client";

import React, { useEffect, useState } from "react";
import { NewsCard } from "@/components/ui/NewsCard";
import { NewsItem, NewsArticle } from "@/types/types";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/SectionHeader";

interface RelatedNewsSectionProps {
  query: string;
  title?: string;
  description?: string;
}

export function RelatedNewsSection({ 
  query, 
  title = "Related News", 
  description = "Stay updated with the latest headlines and exclusive insights."
}: RelatedNewsSectionProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/news/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setNews(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch related news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query]);

  if (!loading && news.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 border-t border-white/10 pt-12 flex flex-col text-left">
      <SectionHeader
        title={title}
        subtitle={description}
      />

      {loading ? (
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shrink-0 w-[280px] md:w-[380px] aspect-[4/5] rounded-[2.5rem] bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div 
          className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory pt-6 pb-8 scrollbar-none scroll-smooth -mx-6 px-6 md:-mx-12 md:px-12 lg:mx-0 lg:px-0"
          role="list"
        >
          {news.map((item) => {
            const newsArticle: NewsArticle = {
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
            return (
              <motion.div
                key={item.id}
                role="listitem"
                className="snap-start shrink-0 w-[85%] sm:w-[45%] lg:w-[calc((100%-64px)/3)]"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <NewsCard item={newsArticle} />
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
