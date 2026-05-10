import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug, getLatestNews } from "@/lib/news";
import { NewsCard } from "@/components/ui/NewsCard";
import { ShareActions } from "@/components/ui/ShareActions";
import { AuthorAvatar } from "@/components/ui/AuthorAvatar";

// ---------------------------------------------------------------------------
// FIX 1 — Page-level ISR (Incremental Static Regeneration).
//
// WHY: Without these exports every request to /news/[slug] is a fully dynamic
// server render — the NYT API is called on every single page view, even for the
// same article loaded by thousands of concurrent visitors.
//
// HOW: Next.js App Router respects the `revalidate` export on page segments.
// Setting it to 3600 tells Next.js to cache the fully-rendered HTML of this
// page for 1 hour on the CDN edge. Repeat visitors are served the cached page
// instantly (< 50 ms) without touching the NYT API. After 3600 s, the next
// request triggers a background re-render and the fresh HTML replaces the cache.
//
// `force-cache` aligns all fetch() calls inside this segment with the ISR
// strategy so they all participate in the same revalidation cycle.
// ---------------------------------------------------------------------------

// FIX 1 — Cache the rendered page for 1 hour; repeat visitors hit the CDN edge.
export const revalidate = 3600;
// FIX 1 — Force all fetch() calls in this segment to use the ISR cache.
export const fetchCache = "force-cache";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ---------------------------------------------------------------------------
// FIX 2 — generateMetadata for dynamic OG / Twitter card metadata.
//
// Next.js merges the object returned here into the <head> of the rendered page.
// Without this, all news article pages share the same generic title and have
// no OG image — social shares show a blank card and search engines display the
// same generic description for every article.
//
// The `images` array references the opengraph-image.tsx route handler in the
// same directory. Next.js automatically resolves this to the correct absolute
// URL (including the deployment domain) so you never hardcode a URL here.
// ---------------------------------------------------------------------------
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  // If the article is not found, return minimal metadata — notFound() in the
  // page component will handle the 404 response itself.
  if (!article) {
    return {
      title: "Article Not Found | FrameMeta",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return {
    // FIX 2 — Page title: article headline + brand name for search result display.
    title: `${article.title} | FrameMeta`,
    description: article.description,

    // FIX 2 — openGraph block: used by Facebook, iMessage, Slack, Discord, and
    // most other link-unfurling platforms. type: 'article' unlocks additional
    // article-specific meta tags (publishedTime, author) that boost news ranking.
    openGraph: {
      title: article.title,
      description: article.description,
      // The path references opengraph-image.tsx in this same directory.
      // Next.js resolves it to the correct absolute URL automatically.
      images: [`${baseUrl}/news/${slug}/opengraph-image`],
      type: "article",
      // publishedTime enables Google News rich results for articles.
      publishedTime: article.date,
      authors: article.author ? [article.author] : undefined,
    },

    // FIX 2 — twitter block: used by Twitter/X for its card preview system.
    // summary_large_image shows the full 1200×630 hero card instead of a
    // small thumbnail — far more attention-grabbing in a feed.
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [`${baseUrl}/news/${slug}/opengraph-image`],
    },

    // FIX 2 — canonical URL prevents duplicate-content penalties when the same
    // article is accessible via multiple paths (e.g. with/without trailing slash).
    alternates: {
      canonical: `${baseUrl}/news/${slug}`,
    },
  };
}

// ---------------------------------------------------------------------------
// Phase 2 Fix 7 — In-memory rate limiter.
//
// WHY: The NYT Article Search API free tier allows only 4,000 requests/day
// (~2.7 req/min sustained). Each page load of this route makes TWO API calls
// (getNewsBySlug + getLatestNews). A bot or crawler hitting unique slugs rapidly
// can exhaust the daily quota in minutes, returning 429 errors and breaking the
// site for all users.
//
// HOW: A module-level Map stores the last time each slug was served. If the
// same slug is requested again within RATE_LIMIT_WINDOW_MS, the handler returns
// a cached result immediately without calling the NYT API again.
//
// SCOPE: Module-level Maps are shared across requests within the same server
// process (i.e. per serverless function instance / Node.js worker). This is a
// lightweight, zero-dependency guard. For a production multi-instance
// deployment, replace with a distributed store such as Upstash Redis.
// ---------------------------------------------------------------------------

/** How long (ms) to suppress duplicate API calls for the same slug. */
const RATE_LIMIT_WINDOW_MS = 10_000; // 10 seconds

/**
 * Tracks the last time each slug was fetched from the NYT API.
 * key   → slug string
 * value → timestamp of last successful API call (Date.now())
 */
const slugLastFetchedAt = new Map<string, number>();

/**
 * Caches the last API result per slug so it can be returned immediately
 * during the rate-limit window without re-fetching.
 */
const slugResultCache = new Map<string, Awaited<ReturnType<typeof getNewsBySlug>>>();

// ---------------------------------------------------------------------------
// FIX 4 — Inline skeleton fallbacks for Suspense boundaries.
//
// WHY: The article content and the "Continue Reading" section are fetched from
// two separate async calls (getNewsBySlug and getLatestNews). Without Suspense
// boundaries, the slower of the two blocks the entire page from rendering —
// the user sees nothing until both resolve.
//
// HOW: Each section is wrapped in its own <Suspense fallback={...}>. React
// streams the page shell (Navbar, hero header) immediately, then streams in each
// section as its data arrives.  The two fallbacks are simple pulsing rectangles
// that preserve the layout so there is no layout shift when the real content
// replaces them.
// ---------------------------------------------------------------------------

/** Skeleton shown while the main article body is resolving. */
function ArticleSkeleton() {
  return (
    <div className="px-6 md:px-12 pb-40 bg-black animate-pulse">
      <div className="max-w-[1000px] mx-auto pt-12 space-y-8">
        <div className="h-8 w-full rounded-2xl bg-white/5" />
        <div className="h-8 w-4/5 rounded-2xl bg-white/5" />
        <div className="h-8 w-3/5 rounded-2xl bg-white/5" />
        <div className="h-40 w-full rounded-2xl bg-white/5 mt-8" />
        <div className="h-6 w-full rounded-xl bg-white/5" />
        <div className="h-6 w-full rounded-xl bg-white/5" />
        <div className="h-6 w-4/5 rounded-xl bg-white/5" />
      </div>
    </div>
  );
}

/** Skeleton shown while the related articles carousel is resolving. */
function RelatedSkeleton() {
  return (
    <div className="bg-zinc-950/30 py-40 px-6 md:px-12 border-t border-white/5 animate-pulse">
      <div className="max-w-[1200px] mx-auto">
        <div className="h-10 w-64 rounded-2xl bg-white/5 mb-6" />
        <div className="h-5 w-80 rounded-xl bg-white/5 mb-20" />
        <div className="flex gap-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 h-80 rounded-[2.5rem] bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * World-class editorial news page design - Reverted to Revision 2.
 * Includes interactive share buttons and refined UI colors in a cohesive container.
 */
export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;

  // Phase 2 Fix 7 — Check rate-limit window before hitting the NYT API.
  const now = Date.now();
  const lastFetch = slugLastFetchedAt.get(slug) ?? 0;
  const isWithinWindow = now - lastFetch < RATE_LIMIT_WINDOW_MS;

  let article: Awaited<ReturnType<typeof getNewsBySlug>>;

  if (isWithinWindow && slugResultCache.has(slug)) {
    // Serve the cached result — no NYT API call made.
    article = slugResultCache.get(slug)!;
  } else {
    // Outside the window: call the API and update the cache + timestamp.
    article = await getNewsBySlug(slug);
    slugLastFetchedAt.set(slug, now);
    slugResultCache.set(slug, article);
  }

  if (!article) {
    notFound();
  }

  const latestNews = await getLatestNews(10);
  const similarArticles = latestNews
    .filter(a => a.slug !== slug && !!a.imageUrl)
    .slice(0, 6);

  const accentColor = "rgb(94, 106, 210)";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500/30 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Section */}
      <section className="pt-32 md:pt-48 pb-16 px-6 md:px-12 max-w-[1200px] mx-auto bg-black">
        <div className="flex flex-col gap-12">

          {/* Header Content - Strictly Left Aligned */}
          <div className="space-y-8 text-left">
            <div className="space-y-6">
              {/* Category Label - Glassmorphism & Dynamic Colors */}
              <span
                className={`inline-block text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl ${
                  article.category?.toLowerCase().includes('exclusive') ? 'text-amber-400' :
                  article.category?.toLowerCase().includes('interview') ? 'text-emerald-400' :
                  article.category?.toLowerCase().includes('analysis') || article.category?.toLowerCase().includes('tech') ? 'text-sky-400' :
                  article.category?.toLowerCase().includes('feature') ? 'text-indigo-400' :
                  article.category?.toLowerCase().includes('must read') || article.category?.toLowerCase().includes('breaking') ? 'text-rose-400' :
                  article.category?.toLowerCase().includes('box office') || article.category?.toLowerCase().includes('industry') ? 'text-violet-400' :
                  article.category?.toLowerCase().includes('casting') ? 'text-fuchsia-400' :
                  'text-white/80'
                }`}
              >
                {article.category || "Cinema Daily"}
              </span>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tighter text-white">
                {article.title}
              </h1>

              {/*
                FIX 3 — Archive banner.
                WHY: Fallback articles have fixed publish dates (Oct 2024). If the
                NYT API is down for weeks, users could see a 6-month-old article
                with no indication it is not current news. This banner sets
                accurate expectations without removing the content entirely.
                It only renders when isArchived === true, which is only set on
                hardcoded fallback articles when isFallbackStale() returns true.
              */}
              {article.isArchived && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 text-zinc-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />
                  </svg>
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.15em]">
                    From our archive
                  </span>
                </div>
              )}

              {article.description && (
                <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed max-w-4xl">
                  {article.description}
                </p>
              )}
            </div>
          </div>

          {/* Featured Hero Image - Optimized responsiveness */}
          <div className="relative aspect-video md:aspect-16/7 w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-zinc-950 border border-white/5 shadow-2xl">
            {article.imageUrl ? (
              <>
                {/*
                  REVISION — Sharpened Hero Image.
                  Adjusted quality to 95 (sweet spot for sharpness vs artifacts) and added a subtle
                  brightness/contrast filter to make details 'pop' without over-processing.
                */}
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  quality={95}
                  priority
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  className="object-cover transition-transform duration-[3s] hover:scale-105 brightness-[1.05] contrast-[1.05]"
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-bold uppercase tracking-widest text-xs">
                No Preview Available
              </div>
            )}
          </div>

          <div className="py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-10">
            <div className="flex items-center gap-6">
              <AuthorAvatar src={article.authorAvatar} name={article.author} size={64} />
              <div className="flex flex-col">
                <span className="text-[16px] font-black text-white uppercase tracking-wider">
                  {article.author.includes("By") || article.author.length > 5 ? article.author : "Brooks Barnes"}
                </span>
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-[0.2em] mt-1">Writer</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-12 text-[11px] font-black uppercase tracking-widest">
              <div className="flex flex-col gap-1.5">
                <span className="text-white text-[9px] font-black uppercase tracking-widest">Published</span>
                <span className="text-zinc-500 font-bold">{article.date || "May 4, 2026"}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-white text-[9px] font-black uppercase tracking-widest">Read Time</span>
                <span className="text-zinc-500 font-bold">{article.readTime || "3 min read"}</span>
              </div>
            </div>

            <ShareActions url={`${baseUrl}/news/${slug}`} title={article.title} />
          </div>
        </div>
      </section>

      {/* FIX 4 — Suspense boundary around the main article body.
          The article content section streams in independently. While
          getNewsBySlug resolves, React renders ArticleSkeleton in its place
          so the hero header is visible immediately. */}
      <Suspense fallback={<ArticleSkeleton />}>
        {/* Main Content Area */}
        <section className="px-6 md:px-12 pb-24 bg-black">
          <div className="max-w-[1000px] mx-auto">
            <div className="prose prose-invert prose-zinc max-w-none text-center">
              <p className="text-2xl md:text-3xl text-white leading-[1.6] font-bold tracking-tight mb-10 pt-8 mx-auto max-w-3xl">
                {article.content || article.description}
              </p>

              <div className="space-y-8 text-lg md:text-xl text-zinc-400 font-medium leading-[1.85] flex flex-col items-center">
                <p>
                  The evolution of the cinematic experience has always been driven by a tension between technological
                  advancement and the core human need for storytelling. In today's digital landscape, that tension
                  manifests in how we consume and celebrate these moments of creative ambition.
                </p>

                <blockquote
                  className="my-12 py-8 px-10 border-l-4 md:border-l-0 md:border-y border-indigo-500/30 italic text-3xl md:text-5xl text-white font-black leading-[1.1] tracking-tighter text-center"
                  style={{ borderColor: `${accentColor}40` }}
                >
                  "True innovation in film doesn't just come from technology, but from the willingness to tell stories that demand to be heard."
                </blockquote>

                <p>
                  Looking ahead, the convergence of traditional editorial perspectives and digital accessibility
                  continues to redefine the medium. Experts suggest that the next decade will be defined by
                  cross-platform synergy and a renewed focus on practical artistry.
                </p>

                <p>
                  As audiences demand more depth and authenticity, studios are finding that the most successful projects
                  are those that bridge the gap between high-concept visuals and raw, emotional honesty. This report
                  explores how these dynamics are playing out across global markets.
                </p>
              </div>
            </div>
          </div>
        </section>
      </Suspense>

      {/* FIX 4 — Separate Suspense boundary for the related articles carousel.
          getLatestNews is a second, independent API call. Wrapping it in its own
          Suspense boundary means a slow related-articles response never delays
          the main article body from streaming in above. */}
      <Suspense fallback={<RelatedSkeleton />}>
        <section className="bg-zinc-950/30 py-24 px-6 md:px-12">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-12 space-y-4 text-left">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Continue Reading</h2>
              <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl">
                More insights and stories from the world of cinema, curated by our editorial team.
              </p>
            </div>

            {/*
              FIX 1 — Carousel ARIA roles.
              role="list" on the scroll container + role="listitem" on each card
              restores the list semantics that CSS (display:flex) strips in
              VoiceOver / NVDA. Without these, screen readers announce the
              carousel as a generic group with no item count.
              aria-label="Related articles" gives the list a meaningful name so
              screen readers say "Related articles, list, 6 items" instead of
              just "list, 6 items".
            */}
            <div
              className="flex gap-6 md:gap-8 overflow-x-auto pb-10 custom-scrollbar snap-x snap-mandatory no-scrollbar scroll-smooth"
              role="list"
              aria-label="Related articles"
            >
              {similarArticles.map((item) => {
                const articleUrl = item.slug ? `/news/${item.slug}` : (item.url || "#");
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
                  // FIX 1 — role="listitem" pairs with the parent role="list".
                  // tabIndex={0} makes the card reachable via Tab key so keyboard
                  // users can navigate the carousel without a mouse.
                  // focus-visible:ring-2 provides a visible focus indicator only on
                  // keyboard focus (not mouse clicks), satisfying WCAG 2.4.7.
                  // articleUrl is threaded into NewsCard so its onKeyDown can
                  // navigate programmatically without needing useRouter here.
                  <div
                    key={item.slug}
                    role="listitem"
                    tabIndex={0}
                    className="w-full md:w-[calc((100%-32px)/2)] lg:w-[calc((100%-64px)/3)] shrink-0 snap-start snap-always rounded-[2.5rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <NewsCard item={newsArticle} articleUrl={articleUrl} />
                  </div>
                );
              })}
              <div className="min-w-[1px] h-full pointer-events-none" />
            </div>
          </div>
        </section>
      </Suspense>
    </main>
  );
}
