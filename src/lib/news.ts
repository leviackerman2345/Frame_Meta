// FIX 1 — server-only guard.
// This import causes a hard build error if any "use client" module (or anything
// transitively imported by one) tries to import this file.  Without it the
// NYT_API_KEY, base-URL, and Lucene query structure would be silently bundled
// into the client JavaScript when a developer adds the import by mistake.
import "server-only";

import { NewsItem } from "@/types/types";
// FIX 3 — import isFallbackStale so we can warn developers when stale fallback
// data is being served and annotate returned articles with isArchived: true.
import { newsContent, isFallbackStale } from "@/constants/news";

const NYT_API_KEY = process.env.NYT_API_KEY;
const NYT_BASE_URL = "https://api.nytimes.com/svc";

// ---------------------------------------------------------------------------
// FIX 2 — Slug sanitization.
// The slug arrives from an untrusted URL parameter and was previously embedded
// raw inside a Lucene fq= filter string:
//   fq=_id:("${nytId}")
// A crafted slug such as  article--")(injected:*  can break out of the quoted
// Lucene term and alter the query sent to the NYT API (Lucene injection).
// This function strips every character that is not alphanumeric, a hyphen, or
// an underscore before the slug is used in any URL construction.
// ---------------------------------------------------------------------------
function sanitizeSlug(slug: string): string {
  // Only allow alphanumeric, hyphens, underscores — everything else is stripped.
  const cleaned = slug.replace(/[^a-zA-Z0-9\-_]/g, "");
  if (!cleaned) throw new Error("Invalid slug: empty after sanitization");
  if (cleaned.length > 200) throw new Error("Invalid slug: exceeds maximum length");
  return cleaned;
}

/**
 * Helper to slugify a string or generate a stable ID from NYT _id
 */
function getSlugFromId(nytId: string): string {
  // NYT IDs look like nyt://article/uuid or nyt://interactive/2024/...
  // We transform them to a URL-safe format: article--uuid
  return nytId.replace("nyt://", "").replace(/\//g, "--");
}

// ---------------------------------------------------------------------------
// FIX 3 — fetchWithTimeout.
// Every raw fetch() call in this file is replaced with fetchWithTimeout() so
// that a slow or hung NYT API connection cannot stall the Next.js server
// indefinitely.  The AbortController timer is always cleared in .finally() to
// prevent the timer from holding references and leaking memory in long-lived
// server processes.
// ---------------------------------------------------------------------------
async function fetchWithTimeout(
  url: string,
  options: RequestInit & { next?: NextFetchRequestConfig } = {},
  timeoutMs: number = 5000
): Promise<Response> {
  const controller = new AbortController();
  // Start the deadline timer.
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    // Always clear the timer — prevents memory leaks if the request resolves
    // before the deadline.
    clearTimeout(timer);
  }
}

/**
 * Fetch latest movie and cinema news from the New York Times Article Search API.
 */
export async function getLatestNews(limit: number = 10): Promise<NewsItem[]> {
  if (!NYT_API_KEY) {
    console.warn("[News] NYT_API_KEY is not defined in environment variables. Falling back to local data.");
    // FIX 3 — Staleness warning: if the fallback articles are older than
    // FALLBACK_MAX_AGE_DAYS, log a developer alert so this is visible in
    // build logs and monitoring dashboards. isArchived is set on every
    // item so the UI can render the "From our archive" banner.
    if (isFallbackStale()) {
      console.warn("[FrameMeta] Fallback news data is stale (>30 days old). Update src/constants/news.ts");
    }
    return newsContent.featured.items.slice(0, limit).map(item => ({
      ...item,
      // Only mark as archived when the fallback is actually stale.
      isArchived: isFallbackStale() ? true : item.isArchived,
    }));
  }

  try {
    const q = encodeURIComponent("movies OR cinema OR Hollywood OR streaming OR \"box office\"");
    const url =
      `${NYT_BASE_URL}/search/v2/articlesearch.json` +
      `?q=${q}` +
      `&sort=newest` +
      `&page=0` +
      `&api-key=${NYT_API_KEY}`;

    // FIX 3 — replaced raw fetch() with fetchWithTimeout() (5 s deadline).
    const response = await fetchWithTimeout(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour — news doesn't change that fast
    });

    if (!response.ok) {
      return newsContent.featured.items.slice(0, limit);
    }

    const data = await response.json();
    const docs: any[] = data?.response?.docs || [];

    if (docs.length === 0) return newsContent.featured.items.slice(0, limit);

    const cinemaKeywords = /movie|film|cinema|hollywood|streaming|series|netflix|disney|hbo|box.?office|director|actor|actress|oscars?|emmy|award/i;
    const cinemaDocs = docs.filter((article: any) => {
      const section = (article.section_name || "").toLowerCase();
      const headline = article.headline?.main || "";
      const abstract = article.abstract || "";
      return (
        section === "movies" ||
        section === "arts" ||
        cinemaKeywords.test(headline) ||
        cinemaKeywords.test(abstract)
      );
    });

    const sourceDocs = cinemaDocs.length >= 5 ? cinemaDocs : docs;

    const validArticles = sourceDocs
      .filter((article: any) => {
        const multimedia = article.multimedia;
        // Handle both Array and Object formats for multimedia
        const hasImage = (Array.isArray(multimedia) && multimedia.length > 0) ||
                        (multimedia && typeof multimedia === "object" && (multimedia.url || multimedia.default?.url));
        return !!article.abstract && hasImage;
      })
      .slice(0, limit);

    return validArticles.map((article: any, index: number) => {
      const multimedia = article.multimedia;
      let imageUrl: string | undefined;

      if (Array.isArray(multimedia)) {
        const bestImage = multimedia.find((m: any) => m.subtype === "superJumbo") ||
                         multimedia.find((m: any) => m.subtype === "xlarge") ||
                         multimedia.find((m: any) => m.type === "image") ||
                         multimedia[0];
        if (bestImage?.url) {
          imageUrl = bestImage.url.startsWith("http") ? bestImage.url : `https://static01.nyt.com/${bestImage.url}`;
        }
      } else if (multimedia && typeof multimedia === "object") {
        // Handle object format (sometimes used in specific NYT responses)
        const url = multimedia.superJumbo?.url || multimedia.xlarge?.url || multimedia.default?.url || multimedia.url;
        if (url) {
          imageUrl = url.startsWith("http") ? url : `https://static01.nyt.com/${url}`;
        }
      }

      const textToRead = (article.abstract || "") + (article.lead_paragraph || "");
      const wordCount = textToRead.split(/\s+/).length;
      const readTimeMinutes = Math.max(3, Math.ceil(wordCount / 200) + 2);
      const rawByline: string = article.byline?.original || "";
      const author = rawByline.replace(/^By\s+/i, "").split(",")[0].trim() || "FrameMeta Editorial";

      return {
        id: index + 5000,
        slug: getSlugFromId(article._id),
        title: article.headline?.main || article.abstract,
        category: article.section_name || "Cinema Daily",
        source: "The New York Times",
        sourceLogo: "https://www.vectorlogo.zone/logos/nytimes/nytimes-icon.svg",
        date: new Date(article.pub_date).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        }),
        readTime: `${readTimeMinutes} min read`,
        imageUrl,
        author,
        description: article.abstract,
        content: article.lead_paragraph || article.abstract,
        url: article.web_url,
      } satisfies NewsItem;
    });
  } catch (error) {
    console.error("[News] Error fetching news:", error);
    // FIX 3 — Staleness warning on catch path (API call failed at runtime).
    if (isFallbackStale()) {
      console.warn("[FrameMeta] Fallback news data is stale (>30 days old). Update src/constants/news.ts");
    }
    return newsContent.featured.items.slice(0, limit).map(item => ({
      ...item,
      isArchived: isFallbackStale() ? true : item.isArchived,
    }));
  }
}

/**
 * Fetch news articles based on a specific query (e.g., artist name).
 */
export async function getNewsByQuery(query: string, limit: number = 6): Promise<NewsItem[]> {
  if (!NYT_API_KEY) {
    // FIX 3 — Staleness warning on the no-API-key path for getNewsByQuery.
    if (isFallbackStale()) {
      console.warn("[FrameMeta] Fallback news data is stale (>30 days old). Update src/constants/news.ts");
    }
    return newsContent.featured.items.slice(0, limit).map(item => ({
      ...item,
      isArchived: isFallbackStale() ? true : item.isArchived,
    }));
  }

  try {
    const q = encodeURIComponent(`"${query}" OR ${query}`);
    const url =
      `${NYT_BASE_URL}/search/v2/articlesearch.json` +
      `?q=${q}` +
      `&sort=newest` +
      `&page=0` +
      `&api-key=${NYT_API_KEY}`;

    // FIX 3 — replaced raw fetch() with fetchWithTimeout() (5 s deadline).
    const response = await fetchWithTimeout(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour per artist query
    });

    if (!response.ok) return newsContent.featured.items.slice(0, limit);

    const data = await response.json();
    const docs: any[] = data?.response?.docs || [];

    if (docs.length === 0) return newsContent.featured.items.slice(0, limit);

    const validArticles = docs
      .filter((article: any) => {
        const multimedia = article.multimedia;
        const hasImage = (Array.isArray(multimedia) && multimedia.length > 0) ||
                        (multimedia && typeof multimedia === "object" && (multimedia.url || multimedia.default?.url));
        return !!article.abstract && hasImage;
      })
      .slice(0, limit);

    return validArticles.map((article: any, index: number) => {
      const multimedia = article.multimedia;
      let imageUrl: string | undefined;

      if (Array.isArray(multimedia)) {
        const bestImage = multimedia.find((m: any) => m.subtype === "superJumbo") ||
                         multimedia.find((m: any) => m.subtype === "xlarge") ||
                         multimedia.find((m: any) => m.type === "image") ||
                         multimedia[0];
        if (bestImage?.url) {
          imageUrl = bestImage.url.startsWith("http") ? bestImage.url : `https://static01.nyt.com/${bestImage.url}`;
        }
      } else if (multimedia && typeof multimedia === "object") {
        const url = multimedia.superJumbo?.url || multimedia.xlarge?.url || multimedia.default?.url || multimedia.url;
        if (url) {
          imageUrl = url.startsWith("http") ? url : `https://static01.nyt.com/${url}`;
        }
      }

      const author = (article.byline?.original || "").replace(/^By\s+/i, "").split(",")[0].trim() || "FrameMeta Editorial";

      return {
        id: index + 6000,
        slug: getSlugFromId(article._id),
        title: article.headline?.main || article.abstract,
        category: article.section_name || "Spotlight",
        source: "The New York Times",
        sourceLogo: "https://www.vectorlogo.zone/logos/nytimes/nytimes-icon.svg",
        date: new Date(article.pub_date).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        }),
        readTime: "5 min read",
        imageUrl,
        author,
        authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=random&color=fff`,
        description: article.abstract,
        content: article.lead_paragraph || article.abstract,
        url: article.web_url,
      } satisfies NewsItem;
    });
  } catch (error) {
    console.error("[News] Error fetching query news:", error);
    // FIX 3 — Staleness warning on catch path for getNewsByQuery.
    if (isFallbackStale()) {
      console.warn("[FrameMeta] Fallback news data is stale (>30 days old). Update src/constants/news.ts");
    }
    return newsContent.featured.items.slice(0, limit).map(item => ({
      ...item,
      isArchived: isFallbackStale() ? true : item.isArchived,
    }));
  }
}

/**
 * Fetch a single news article by its slug (NYT UUID or static ID).
 */
export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  // Check static fallback first
  const staticMatch = (newsContent.featured.items as NewsItem[]).find(n => n.slug === slug);
  if (staticMatch) return staticMatch;

  if (!NYT_API_KEY) return null;

  try {
    // FIX 2 — sanitize the slug before using it in any URL construction.
    // Without this, a crafted slug can inject arbitrary characters into the
    // Lucene fq= query string and manipulate which NYT documents are returned.
    const safeSlug = sanitizeSlug(slug);

    // Reconstruct the full NYT ID from the slug (e.g., article--uuid -> nyt://article/uuid)
    let nytId = safeSlug;
    if (safeSlug.includes("--")) {
      nytId = "nyt://" + safeSlug.replace(/--/g, "/");
    } else {
      nytId = `nyt://article/${safeSlug}`;
    }

    // FIX 2 — nytId is now built from the sanitized slug, safe to embed in fq=.
    const url = `${NYT_BASE_URL}/search/v2/articlesearch.json?fq=_id:("${nytId}")&api-key=${NYT_API_KEY}`;

    // FIX 3 — replaced raw fetch() with fetchWithTimeout() (5 s deadline).
    const response = await fetchWithTimeout(url, { next: { revalidate: 600 } });
    if (!response.ok) return null;

    const data = await response.json();
    const article = data?.response?.docs?.[0];

    if (!article) return null;

    const multimedia = article.multimedia;
    let imageUrl: string | undefined;

    if (Array.isArray(multimedia)) {
      const bestImage = multimedia.find((m: any) => m.subtype === "superJumbo") ||
                       multimedia.find((m: any) => m.subtype === "xlarge") ||
                       multimedia.find((m: any) => m.type === "image") ||
                       multimedia[0];
      if (bestImage?.url) {
        imageUrl = bestImage.url.startsWith("http") ? bestImage.url : `https://static01.nyt.com/${bestImage.url}`;
      }
    } else if (multimedia && typeof multimedia === "object") {
      const url = multimedia.superJumbo?.url || multimedia.xlarge?.url || multimedia.default?.url || multimedia.url;
      if (url) {
        imageUrl = url.startsWith("http") ? url : `https://static01.nyt.com/${url}`;
      }
    }

    const textToRead = (article.abstract || "") + (article.lead_paragraph || "");
    const wordCount = textToRead.split(/\s+/).length;
    const readTimeMinutes = Math.max(3, Math.ceil(wordCount / 200) + 2);
    const author = (article.byline?.original || "").replace(/^By\s+/i, "").split(",")[0].trim() || "FrameMeta Editorial";

    return {
      id: 5000,
      slug: getSlugFromId(article._id),
      title: article.headline?.main || article.abstract,
      category: article.section_name || "Cinema Daily",
      source: "The New York Times",
      sourceLogo: "https://www.vectorlogo.zone/logos/nytimes/nytimes-icon.svg",
      date: new Date(article.pub_date).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
      readTime: `${readTimeMinutes} min read`,
      imageUrl,
      author,
      authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=random&color=fff`,
      description: article.abstract,
      content: article.lead_paragraph || article.abstract,
      url: article.web_url,
    };
  } catch (error) {
    console.error("[News] Error fetching single article:", error);
    return null;
  }
}
