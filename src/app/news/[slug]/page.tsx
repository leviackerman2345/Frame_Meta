import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug, getLatestNews } from "@/lib/news";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  // Fetch similar articles
  const allNews = await getLatestNews(10);
  const similarArticles = allNews
    .filter((n) => n.slug !== slug && !!n.imageUrl)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-600/30 relative">
      <Navbar />

      {/* Immersive Background Layer */}
      {article.imageUrl && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="sticky top-0 w-full h-[100dvh]">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover brightness-[0.15] contrast-[1.2] saturate-[0.8]"
              priority
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[120px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
          </div>
        </div>
      )}

      {/* Main Content Scrollable Area */}
      <div className="relative z-10 w-full flex flex-col items-center">
        
        {/* Article Header - Apple Editorial Style */}
        <header className="w-full max-w-[1224px] px-6 md:px-12 pt-40 pb-20 flex flex-col gap-12">
          <div className="flex flex-wrap items-center gap-6">
            <Link 
              href="/news" 
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-[11px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white hover:bg-white/10 transition-all duration-500"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              News Feed
            </Link>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                {article.category}
              </span>
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                {article.readTime}
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl lg:text-[100px] font-black tracking-[-0.04em] text-white leading-[0.95] drop-shadow-sm">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 pt-10 border-t border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 font-bold overflow-hidden relative shadow-2xl">
                  {article.authorAvatar ? (
                    <Image src={article.authorAvatar} alt={article.author} fill className="object-cover" />
                  ) : (
                    <span className="text-lg">{article.author.charAt(0)}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-black uppercase tracking-widest text-white">{article.author}</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lead Editorial</span>
                </div>
              </div>
              <div className="hidden md:block w-[1px] h-10 bg-white/5" />
              <div className="flex flex-col">
                <span className="text-[13px] font-black uppercase tracking-widest text-zinc-400">{article.date}</span>
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{article.source}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Asset - Apple Vision Style */}
        <div className="w-full max-w-[1440px] px-0 md:px-12 mb-24">
          <div className="relative aspect-[21/9] w-full rounded-none md:rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] bg-zinc-900/50">
            {/* Blurred Background for Contained Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={article.imageUrl!}
                alt=""
                fill
                className="object-cover blur-3xl opacity-30 scale-110"
              />
            </div>
            <Image
              src={article.imageUrl!}
              alt={article.title}
              fill
              className="relative z-10 object-contain p-4 md:p-8"
              priority
            />
          </div>
        </div>

        {/* Reading Experience - Apple News Style */}
        <article className="w-full max-w-[840px] px-6 md:px-12 flex flex-col gap-16 pb-40">
          {article.description && (
            <p className="text-3xl md:text-4xl font-black text-white leading-[1.2] tracking-tight">
              {article.description}
            </p>
          )}

          <div className="prose prose-invert prose-zinc max-w-none">
            <p className="text-xl md:text-2xl text-zinc-300 leading-[1.7] font-medium tracking-tight">
              {article.content}
            </p>
            
            <p className="text-xl md:text-2xl text-zinc-400 leading-[1.7] font-medium tracking-tight pt-10">
              As the cinematic landscape continues to evolve, the impact of these developments resonates across both global box offices and independent streaming platforms. Industry analysts suggest that this trend marks a significant shift in how audiences consume high-stakes narratives and character-driven drama.
            </p>
            
            <blockquote className="my-20 py-2 border-l-[3px] border-white/20 pl-12">
              <p className="text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.1]">
                "The convergence of traditional theatrical experiences and modern accessibility is redefining storytelling."
              </p>
              <cite className="block mt-8 text-xs font-black uppercase tracking-[0.3em] text-red-600 not-italic">
                Global Cinema Insights
              </cite>
            </blockquote>

            <p className="text-xl md:text-2xl text-zinc-400 leading-[1.7] font-medium tracking-tight">
              We're seeing a renaissance of creative ambition that transcends conventional genre boundaries. This shift is not just about technology, but about the fundamental way stories are told and experienced by a global audience.
            </p>
          </div>

          {/* Supplemental Info - App Store Style Info Section */}
          <div className="pt-24 mt-24 border-t border-white/5">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-10">Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Publisher</span>
                <p className="text-sm font-bold text-white">{article.source}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Category</span>
                <p className="text-sm font-bold text-white">{article.category}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Published</span>
                <p className="text-sm font-bold text-white">{article.date}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Compatibility</span>
                <p className="text-sm font-bold text-white">Universal Cinema</p>
              </div>
            </div>
          </div>

          {/* Premium Interaction Block */}
          <div className="pt-20">
            <div className="relative w-full rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-3xl border border-white/10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative z-10 flex items-center gap-8">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white text-black flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-none">Recommend this story</h4>
                  <p className="text-zinc-400 text-sm md:text-base font-medium">Join our community of cinematic explorers.</p>
                </div>
              </div>
              <button className="relative z-10 px-10 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[11px] hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
                Like Article
              </button>
            </div>
          </div>
        </article>

        {/* Similar Stories Section - High Contrast Grid */}
        <section className="w-full bg-zinc-950/30 backdrop-blur-xl py-32 border-t border-white/5">
          <div className="max-w-[1224px] mx-auto px-6 md:px-12">
            <div className="flex flex-col gap-4 mb-20">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">Read Next</h2>
              <p className="text-zinc-500 text-base font-medium">Selected stories from the editorial team.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {similarArticles.map((item) => (
                <Link 
                  key={item.slug} 
                  href={`/news/${item.slug}`}
                  className="group flex flex-col gap-8"
                >
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl transition-all duration-700">
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
                      className="relative z-10 object-contain p-4 grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">{item.category}</span>
                    <h4 className="text-2xl font-black leading-tight text-white group-hover:text-red-500 transition-colors duration-300">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
