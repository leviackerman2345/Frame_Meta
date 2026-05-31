import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug, getLatestNews } from "@/lib/news";
import { NewsCard } from "@/components/ui/NewsCard";
import { ShareActions } from "@/components/ui/ShareActions";
import { AuthorAvatar } from "@/components/ui/AuthorAvatar";

export const revalidate = 3600;
export const fetchCache = "force-cache";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) return { title: "Article Not Found | FrameMeta" };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return {
    title: `${article.title} | FrameMeta`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: [`${baseUrl}/news/${slug}/opengraph-image`],
      type: "article",
      publishedTime: article.date,
      authors: article.author ? [article.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [`${baseUrl}/news/${slug}/opengraph-image`],
    },
    alternates: { canonical: `${baseUrl}/news/${slug}` },
  };
}

const slugResultCache = new Map<string, Awaited<ReturnType<typeof getNewsBySlug>>>();

/* ─── Skeletons ─── */

function ArticleSkeleton() {
  return (
    <div className="px-4 sm:px-6 md:px-12 pb-20 animate-pulse">
      <div className="max-w-[720px] mx-auto pt-10 space-y-6">
        <div className="h-7 w-full rounded-xl bg-white/5" />
        <div className="h-7 w-4/5 rounded-xl bg-white/5" />
        <div className="h-7 w-3/5 rounded-xl bg-white/5" />
        <div className="h-5 w-full rounded-lg bg-white/5 mt-6" />
        <div className="h-5 w-full rounded-lg bg-white/5" />
        <div className="h-5 w-11/12 rounded-lg bg-white/5" />
        <div className="h-5 w-full rounded-lg bg-white/5" />
        <div className="h-5 w-4/5 rounded-lg bg-white/5" />
        <div className="h-24 w-full rounded-2xl bg-white/5 mt-8" />
        <div className="h-5 w-full rounded-lg bg-white/5" />
        <div className="h-5 w-full rounded-lg bg-white/5" />
        <div className="h-5 w-3/4 rounded-lg bg-white/5" />
      </div>
    </div>
  );
}

function RelatedSkeleton() {
  return (
    <div className="py-24 px-4 sm:px-6 md:px-12 border-t border-white/5 animate-pulse">
      <div className="max-w-7xl mx-auto">
        <div className="h-8 w-48 rounded-xl bg-white/5 mb-3" />
        <div className="h-4 w-64 rounded-lg bg-white/5 mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="aspect-[16/14] rounded-[2rem] bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ─── */

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const cachedArticle = slugResultCache.get(slug);
  const articlePromise = cachedArticle ? Promise.resolve(cachedArticle) : getNewsBySlug(slug);

  const [article, latestNews] = await Promise.all([
    articlePromise,
    getLatestNews(10),
  ]);

  if (!cachedArticle && article) slugResultCache.set(slug, article);
  if (!article) notFound();
  const similarArticles = latestNews
    .filter((a) => a.slug !== slug && !!a.imageUrl)
    .slice(0, 6);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return (
    <main className="min-h-screen bg-black text-white">
      {/* ─── Hero ─── */}
      <section className="pt-32 md:pt-40 pb-6 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        {/* Back link */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-xs font-medium text-white/30 hover:text-white/60 transition-colors duration-200 mb-8 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to articles
        </Link>

        {/* Header */}
        <div className="max-w-3xl mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50 rounded-full border border-white/8 bg-white/5">
              {article.category || "Cinema Daily"}
            </span>
            {article.isArchived && (
              <span className="px-3 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-white/25 rounded-full border border-white/5 bg-white/[0.02]">
                Archive
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-tight text-white leading-[1.1]">
            {article.title}
          </h1>

          {article.description && (
            <p className="mt-5 text-base md:text-lg text-white/35 leading-relaxed">
              {article.description}
            </p>
          )}
        </div>
      </section>

      {/* ─── Hero Image ─── */}
      <section className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto mb-8 md:mb-10">
        <div className="relative aspect-video md:aspect-[21/9] w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-zinc-900 border border-white/5">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              quality={95}
              priority
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/15 text-xs font-medium uppercase tracking-widest">
              No Preview Available
            </div>
          )}
        </div>
        {/* Image caption / source credit */}
        <p className="mt-3 text-[10px] text-white/20 text-right">
          {article.source || "The New York Times"}
        </p>
      </section>

      {/* ─── Author & Meta Bar ─── */}
      <section className="px-4 sm:px-6 md:px-12 max-w-7xl mx-auto mb-12 md:mb-16">
        <div className="rounded-[1.5rem] md:rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl px-5 md:px-8 py-5 md:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          {/* Author */}
          <div className="flex items-center gap-4">
            <AuthorAvatar src={article.authorAvatar} name={article.author} size={44} />
            <div>
              <span className="text-sm font-semibold text-white">
                {article.author.includes("By") || article.author.length > 5
                  ? article.author
                  : "Brooks Barnes"}
              </span>
              <div className="flex items-center gap-2 mt-1">
                {article.sourceLogo && (
                  <Image
                    src={article.sourceLogo}
                    alt={article.source}
                    width={14}
                    height={14}
                    className="rounded-sm opacity-50"
                    unoptimized
                  />
                )}
                <span className="text-[10px] text-white/30">
                  {article.source || "The New York Times"}
                </span>
              </div>
            </div>
          </div>

          {/* Meta + Share */}
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="hidden sm:block">
              <span className="block text-[9px] font-semibold uppercase tracking-widest text-white/20 mb-1">
                Published
              </span>
              <span className="text-xs text-white/45">{article.date || "May 4, 2026"}</span>
            </div>
            <div className="hidden sm:block">
              <span className="block text-[9px] font-semibold uppercase tracking-widest text-white/20 mb-1">
                Read
              </span>
              <span className="text-xs text-white/45">{article.readTime || "3 min"}</span>
            </div>
            <div className="h-6 w-px bg-white/5 hidden sm:block" />
            <ShareActions url={`${baseUrl}/news/${slug}`} title={article.title} />
          </div>
        </div>

        {/* Mobile meta row */}
        <div className="flex sm:hidden items-center gap-6 mt-4 text-[10px] text-white/30">
          <span>{article.date || "May 4, 2026"}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-white/15" />
          <span>{article.readTime || "3 min read"}</span>
        </div>
      </section>

      {/* ─── Article Body ─── */}
      <Suspense fallback={<ArticleSkeleton />}>
        <section className="px-4 sm:px-6 md:px-12 pb-16 md:pb-20">
          <article className="max-w-[720px] mx-auto">
            {/* Lead paragraph */}
            <p className="text-lg md:text-xl text-white/80 font-medium leading-[1.8] mb-10">
              {article.content || article.description}
            </p>

            {/* Body text */}
            <div className="space-y-6 text-base md:text-[17px] text-white/40 leading-[1.85]">
              <p>
                The evolution of the cinematic experience has always been driven by a tension
                between technological advancement and the core human need for storytelling.
                In today&apos;s digital landscape, that tension manifests in how we consume and
                celebrate these moments of creative ambition.
              </p>

              <p>
                Streaming platforms have fundamentally altered the economics of greenlighting
                projects that would have struggled to find studio backing a decade ago. The
                result is a golden age of risk-taking — where filmmakers can pursue deeply
                personal visions without the pressure of opening-weekend box office returns.
              </p>

              {/* Pull quote */}
              <blockquote className="my-12 md:my-16 py-8 px-6 md:px-10 border-l-2 border-white/10 rounded-r-2xl bg-white/[0.02]">
                <p className="text-lg md:text-xl text-white/60 italic leading-relaxed">
                  &ldquo;True innovation in film doesn&apos;t just come from technology, but from
                  the willingness to tell stories that demand to be heard.&rdquo;
                </p>
              </blockquote>

              <p>
                Looking ahead, the convergence of traditional editorial perspectives and digital
                accessibility continues to redefine the medium. Industry analysts suggest that
                the next decade will be defined by cross-platform synergy and a renewed focus
                on practical artistry over spectacle alone.
              </p>

              <p>
                As audiences demand more depth and authenticity, studios are finding that the most
                successful projects are those that bridge the gap between high-concept visuals and
                raw, emotional honesty. This dynamic is playing out across global markets, with
                regional cinema gaining unprecedented international visibility.
              </p>

              <p>
                The implications extend beyond the screen. How we discover, discuss, and
                recommend films is being reshaped by algorithms and social discourse — creating
                new pathways for stories that might otherwise have gone unheard.
              </p>
            </div>

            {/* Article footer / tags */}
            <div className="mt-14 pt-8 border-t border-white/5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 text-[10px] font-medium text-white/30 rounded-full border border-white/5 bg-white/[0.02]">
                  {article.category || "Cinema"}
                </span>
                <span className="px-3 py-1.5 text-[10px] font-medium text-white/30 rounded-full border border-white/5 bg-white/[0.02]">
                  Film
                </span>
                <span className="px-3 py-1.5 text-[10px] font-medium text-white/30 rounded-full border border-white/5 bg-white/[0.02]">
                  Industry
                </span>
              </div>
            </div>
          </article>
        </section>
      </Suspense>

      {/* ─── Divider ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="h-px bg-white/5" />
      </div>

      {/* ─── Related Articles ─── */}
      <Suspense fallback={<RelatedSkeleton />}>
        <section className="py-20 md:py-24 px-4 sm:px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <span className="text-[10px] font-semibold tracking-[0.25em] text-white/25">
                More to read
              </span>
              <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-white">
                Continue Reading
              </h2>
              <p className="mt-2 text-sm text-white/30 max-w-md">
                More insights and stories from the world of cinema.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {similarArticles.map((item) => {
                const articleUrl = item.slug
                  ? `/news/${item.slug}`
                  : item.url || "#";
                const newsArticle = {
                  id: item.id.toString(),
                  title: item.title,
                  excerpt: item.description || "",
                  url: articleUrl,
                  source: item.source,
                  publishedAt: item.date,
                  thumbnailUrl: item.imageUrl || "",
                };
                return (
                  <NewsCard key={item.slug} item={newsArticle} articleUrl={articleUrl} />
                );
              })}
            </div>
          </div>
        </section>
      </Suspense>
    </main>
  );
}
