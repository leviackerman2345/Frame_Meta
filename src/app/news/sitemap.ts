// ---------------------------------------------------------------------------
// FIX 1 — News sitemap.
//
// WHAT A SITEMAP DOES:
// A sitemap is an XML file that tells search engines (Google, Bing, etc.) the
// exact canonical URL of every page on your site, its last modification date,
// and how frequently it changes. Without it, search engines discover pages only
// by following links — a slow, unreliable process that can leave new articles
// unindexed for days or weeks. With a sitemap, Googlebot receives a direct
// inventory and can index new articles within hours of publication.
//
// WHY THIS FILE'S LOCATION MATTERS:
// Next.js App Router automatically exposes a sitemap.ts placed inside a route
// segment directory at the matching path. This file at src/app/news/sitemap.ts
// is served as /news/sitemap.xml — Google will discover it automatically when
// you submit /sitemap.xml from the root (which you should reference this from).
//
// REVALIDATION:
// This sitemap revalidates every 3 600 s (1 hour) — matching the news ISR
// window. A new NYT article published within that window will appear in the
// sitemap on the next revalidation pass without any deployment required.
// ---------------------------------------------------------------------------

import type { MetadataRoute } from "next";
import { getLatestNews } from "@/lib/news";

// Revalidate the sitemap on the same cadence as the article pages (1 hour).
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The canonical base URL for all article links.
  // Falls back to localhost if the env var is not set so local builds don't
  // error — but NEXT_PUBLIC_BASE_URL must be set correctly in production.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  // The news index page is always included as the highest-priority entry.
  // priority: 1.0 signals to Google that this is the most important page in
  // this segment. changeFrequency: 'daily' tells the crawler to re-check
  // every day for new articles listed on this index.
  const indexEntry: MetadataRoute.Sitemap[number] = {
    url: `${baseUrl}/news`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  };

  try {
    // Fetch the latest articles. Limit is generous (50) because a sitemap
    // should be comprehensive — Google supports up to 50,000 URLs per file.
    const articles = await getLatestNews(50);

    // Map each article to a sitemap entry.
    const articleEntries: MetadataRoute.Sitemap = articles
      .filter((article) => !!article.slug) // Only include articles with a routable slug.
      .map((article) => ({
        // Full canonical URL — must be absolute for search engines.
        url: `${baseUrl}/news/${article.slug}`,
        // lastModified: Use the article's publish date.  Google uses this to
        // decide whether the cached page needs re-crawling after ISR updates.
        lastModified: article.date ? new Date(article.date) : new Date(),
        // News articles can be updated with corrections or addenda within the
        // same day they're published, so 'daily' is the correct frequency.
        changeFrequency: "daily",
        // 0.8 places articles below the index page (1.0) but above generic
        // content pages — appropriate for primary editorial content.
        priority: 0.8,
      }));

    return [indexEntry, ...articleEntries];
  } catch (error) {
    // If the NYT API fails, return just the index entry rather than an empty
    // sitemap. A partial sitemap is always better than no sitemap — the index
    // page alone ensures the news section remains crawlable.
    console.error("[Sitemap] Failed to fetch articles for news sitemap:", error);
    return [indexEntry];
  }
}
