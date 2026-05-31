import "server-only";

import { NewsItem } from "@/types/types";
import { newsContent, isFallbackStale } from "@/constants/news";
import { fetchWithTimeout } from "@/lib/fetch-utils";

const NYT_API_KEY = process.env.NYT_API_KEY;
const NYT_BASE_URL = "https://api.nytimes.com/svc";

function sanitizeSlug(slug: string): string {
  const cleaned = slug.replace(/[^a-zA-Z0-9\-_]/g, "");
  if (!cleaned) throw new Error("Invalid slug: empty after sanitization");
  if (cleaned.length > 200) throw new Error("Invalid slug: exceeds maximum length");
  return cleaned;
}

function getSlugFromId(nytId: string): string {
  return nytId.replace("nyt://", "").replace(/\//g, "--");
}

/** Resolve the best image URL from NYT multimedia (array or object format). */
function resolveNYTImageUrl(multimedia: unknown): string | undefined {
  if (Array.isArray(multimedia)) {
    const best = multimedia.find((m: any) => m.subtype === "superJumbo") ||
                 multimedia.find((m: any) => m.subtype === "xlarge") ||
                 multimedia.find((m: any) => m.type === "image") ||
                 multimedia[0];
    if (best?.url) {
      return best.url.startsWith("http") ? best.url : `https://static01.nyt.com/${best.url}`;
    }
  } else if (multimedia && typeof multimedia === "object") {
    const m = multimedia as Record<string, any>;
    const url = m.superJumbo?.url || m.xlarge?.url || m.default?.url || m.url;
    if (url) {
      return url.startsWith("http") ? url : `https://static01.nyt.com/${url}`;
    }
  }
  return undefined;
}

/** Check if an NYT article has both an abstract and an image. */
function hasValidImage(article: any): boolean {
  const multimedia = article.multimedia;
  const hasImage = (Array.isArray(multimedia) && multimedia.length > 0) ||
                   (multimedia && typeof multimedia === "object" && (multimedia.url || multimedia.default?.url));
  return !!article.abstract && hasImage;
}

/** Extract a clean author name from NYT byline. */
function extractAuthor(article: any): string {
  return (article.byline?.original || "").replace(/^By\s+/i, "").split(",")[0].trim() || "FrameMeta Editorial";
}

/** Map a raw NYT article doc to a NewsItem. */
function mapArticleToNewsItem(
  article: any,
  index: number,
  idOffset: number,
  defaultCategory: string,
  includeReadTime = true
): NewsItem {
  const imageUrl = resolveNYTImageUrl(article.multimedia);
  const author = extractAuthor(article);

  let readTime: string;
  if (includeReadTime) {
    const textToRead = (article.abstract || "") + (article.lead_paragraph || "");
    const wordCount = textToRead.split(/\s+/).length;
    const readTimeMinutes = Math.max(3, Math.ceil(wordCount / 200) + 2);
    readTime = `${readTimeMinutes} min read`;
  } else {
    readTime = "5 min read";
  }

  return {
    id: index + idOffset,
    slug: getSlugFromId(article._id),
    title: article.headline?.main || article.abstract,
    category: article.section_name || defaultCategory,
    source: "The New York Times",
    sourceLogo: "https://www.vectorlogo.zone/logos/nytimes/nytimes-icon.svg",
    date: new Date(article.pub_date).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    }),
    readTime,
    imageUrl,
    author,
    authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=random&color=fff`,
    description: article.abstract,
    content: article.lead_paragraph || article.abstract,
    url: article.web_url,
  };
}

/** Return fallback news items with staleness annotation. */
function getFallbackNews(limit: number): NewsItem[] {
  if (isFallbackStale()) {
    console.warn("[FrameMeta] Fallback news data is stale (>30 days old). Update src/constants/news.ts");
  }
  return newsContent.featured.items.slice(0, limit).map(item => ({
    ...item,
    isArchived: isFallbackStale() ? true : item.isArchived,
  }));
}

/**
 * Fetch latest entertainment news from the New York Times Article Search API.
 * Focuses on movies, TV, streaming, and celebrity news.
 */
export async function getLatestNews(limit: number = 10): Promise<NewsItem[]> {
  if (!NYT_API_KEY) {
    console.warn("[News] NYT_API_KEY is not defined in environment variables. Falling back to local data.");
    return getFallbackNews(limit);
  }

  try {
    const q = encodeURIComponent("movies OR cinema OR Hollywood OR streaming OR \"box office\" OR television OR \"TV series\" OR Netflix OR Disney+ OR \"HBO\" OR actor OR actress OR director OR film festival OR Oscar OR Emmy OR award season");
    const url =
      `${NYT_BASE_URL}/search/v2/articlesearch.json` +
      `?q=${q}&sort=newest&page=0&api-key=${NYT_API_KEY}`;

    const response = await fetchWithTimeout(url, { next: { revalidate: 3600 } });
    if (!response.ok) return newsContent.featured.items.slice(0, limit);

    const data = await response.json();
    const docs: any[] = data?.response?.docs || [];
    if (docs.length === 0) return newsContent.featured.items.slice(0, limit);

    const entertainmentKeywords = /movie|film|cinema|hollywood|streaming|series|netflix|disney|hbo|box.?office|director|actor|actress|oscars?|emmy|award|television|tv\s|sitcom|drama\s|comedy\s|thriller|horror|blockbuster|premiere|celebrity|star\s|cast\s|sequel|franchise|marvel|dc\s|superhero|anime|documentary|screenplay|producer|studio|boxoffice|ticket|release/i;
    const entertainmentSections = new Set(["movies", "arts", "television", "culture", "magazine", "sundayarts", "fashion", "style"]);
    const entertainmentDocs = docs.filter((article: any) => {
      const section = (article.section_name || "").toLowerCase();
      const headline = article.headline?.main || "";
      const abstract = article.abstract || "";
      const leadParagraph = article.lead_paragraph || "";
      return (
        entertainmentSections.has(section) ||
        entertainmentKeywords.test(headline) ||
        entertainmentKeywords.test(abstract) ||
        entertainmentKeywords.test(leadParagraph)
      );
    });

    const sourceDocs = entertainmentDocs.length >= 5 ? entertainmentDocs : docs;
    const validArticles = sourceDocs.filter(hasValidImage).slice(0, limit);
    return validArticles.map((article, index) => mapArticleToNewsItem(article, index, 5000, "Entertainment"));
  } catch (error) {
    console.error("[News] Error fetching news:", error);
    return getFallbackNews(limit);
  }
}

/**
 * Fetch entertainment news articles based on a specific query (e.g., movie title, actor name).
 * Filters results to focus on entertainment-related content.
 */
export async function getNewsByQuery(query: string, limit: number = 6): Promise<NewsItem[]> {
  if (!NYT_API_KEY) return getFallbackNews(limit);

  try {
    const q = encodeURIComponent(`"${query}" OR ${query}`);
    const url =
      `${NYT_BASE_URL}/search/v2/articlesearch.json` +
      `?q=${q}&sort=newest&page=0&api-key=${NYT_API_KEY}`;

    const response = await fetchWithTimeout(url, { next: { revalidate: 3600 } });
    if (!response.ok) return newsContent.featured.items.slice(0, limit);

    const data = await response.json();
    const docs: any[] = data?.response?.docs || [];
    if (docs.length === 0) return newsContent.featured.items.slice(0, limit);

    // Filter for entertainment-related content
    const entertainmentKeywords = /movie|film|cinema|hollywood|streaming|series|netflix|disney|hbo|box.?office|director|actor|actress|oscars?|emmy|award|television|tv\s|sitcom|drama|comedy|thriller|horror|blockbuster|premiere|celebrity|star|cast|sequel|franchise|marvel|dc\s|superhero|anime|documentary|screenplay|producer|studio|release|trailer|episode|season/i;
    const entertainmentSections = new Set(["movies", "arts", "television", "culture", "magazine", "sundayarts", "fashion", "style"]);

    const entertainmentDocs = docs.filter((article: any) => {
      const section = (article.section_name || "").toLowerCase();
      const headline = article.headline?.main || "";
      const abstract = article.abstract || "";
      return (
        entertainmentSections.has(section) ||
        entertainmentKeywords.test(headline) ||
        entertainmentKeywords.test(abstract)
      );
    });

    // Use entertainment-filtered results if available, otherwise fall back to all results
    const sourceDocs = entertainmentDocs.length >= 3 ? entertainmentDocs : docs;
    const validArticles = sourceDocs.filter(hasValidImage).slice(0, limit);
    return validArticles.map((article, index) => mapArticleToNewsItem(article, index, 6000, "Entertainment Spotlight", false));
  } catch (error) {
    console.error("[News] Error fetching query news:", error);
    return getFallbackNews(limit);
  }
}

/**
 * Fetch a single news article by its slug (NYT UUID or static ID).
 */
export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const staticMatch = (newsContent.featured.items as NewsItem[]).find(n => n.slug === slug);
  if (staticMatch) return staticMatch;

  if (!NYT_API_KEY) return null;

  try {
    const safeSlug = sanitizeSlug(slug);
    const nytId = safeSlug.includes("--")
      ? "nyt://" + safeSlug.replace(/--/g, "/")
      : `nyt://article/${safeSlug}`;

    const url = `${NYT_BASE_URL}/search/v2/articlesearch.json?fq=_id:("${nytId}")&api-key=${NYT_API_KEY}`;
    const response = await fetchWithTimeout(url, { next: { revalidate: 600 } });
    if (!response.ok) return null;

    const data = await response.json();
    const article = data?.response?.docs?.[0];
    if (!article) return null;

    return mapArticleToNewsItem(article, 0, 5000, "Cinema Daily");
  } catch (error) {
    console.error("[News] Error fetching single article:", error);
    return null;
  }
}
