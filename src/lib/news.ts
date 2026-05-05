import { NewsItem } from "@/types/types";
import { newsContent } from "@/constants/news";

const NYT_API_KEY = process.env.NYT_API_KEY;
const NYT_BASE_URL = "https://api.nytimes.com/svc";

/**
 * Helper to slugify a string or generate a stable ID from NYT _id
 */
function getSlugFromId(nytId: string): string {
  // NYT IDs look like nyt://article/uuid or nyt://interactive/2024/...
  // We transform them to a URL-safe format: article--uuid
  return nytId.replace("nyt://", "").replace(/\//g, "--");
}

/**
 * Fetch latest movie and cinema news from the New York Times Article Search API.
 */
export async function getLatestNews(limit: number = 10): Promise<NewsItem[]> {
  if (!NYT_API_KEY) {
    console.warn("[News] NYT_API_KEY is not defined in environment variables. Falling back to local data.");
    return newsContent.featured.items.slice(0, limit);
  }

  try {
    const q = encodeURIComponent("movies OR cinema OR Hollywood OR streaming OR \"box office\"");
    const url =
      `${NYT_BASE_URL}/search/v2/articlesearch.json` +
      `?q=${q}` +
      `&sort=newest` +
      `&page=0` +
      `&api-key=${NYT_API_KEY}`;

    const response = await fetch(url, {
      next: { revalidate: 600 }, // Cache for 10 minutes (was 4 hours)
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
        const hasImage = Array.isArray(article.multimedia) && article.multimedia.length > 0;
        return !!article.abstract && hasImage;
      })
      .slice(0, limit);

    return validArticles.map((article: any, index: number) => {
      // Find the highest quality image available
      const multimedia = article.multimedia;
      const isArr = Array.isArray(multimedia);
      const bestImage = isArr ? (
        multimedia.find((m: any) => m.subtype === "superJumbo") || 
        multimedia.find((m: any) => m.subtype === "xlarge") || 
        multimedia[0]
      ) : null;
      
      const imageUrl = bestImage?.url ? `https://static01.nyt.com/${bestImage.url}` : undefined;
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
        authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=random&color=fff`,
        description: article.abstract,
        content: article.lead_paragraph || article.abstract,
        url: article.web_url,
      } satisfies NewsItem;
    });
  } catch (error) {
    console.error("[News] Error fetching news:", error);
    return newsContent.featured.items.slice(0, limit);
  }
}

/**
 * Fetch news articles based on a specific query (e.g., artist name).
 */
export async function getNewsByQuery(query: string, limit: number = 6): Promise<NewsItem[]> {
  if (!NYT_API_KEY) return newsContent.featured.items.slice(0, limit);

  try {
    const q = encodeURIComponent(`"${query}" OR ${query}`);
    const url =
      `${NYT_BASE_URL}/search/v2/articlesearch.json` +
      `?q=${q}` +
      `&sort=newest` +
      `&page=0` +
      `&api-key=${NYT_API_KEY}`;

    const response = await fetch(url, {
      next: { revalidate: 600 },
    });

    if (!response.ok) return newsContent.featured.items.slice(0, limit);

    const data = await response.json();
    const docs: any[] = data?.response?.docs || [];

    if (docs.length === 0) return newsContent.featured.items.slice(0, limit);

    const validArticles = docs
      .filter((article: any) => {
        const hasImage = Array.isArray(article.multimedia) && article.multimedia.length > 0;
        return !!article.abstract && hasImage;
      })
      .slice(0, limit);

    return validArticles.map((article: any, index: number) => {
      const multimedia = article.multimedia;
      const isArr = Array.isArray(multimedia);
      const bestImage = isArr ? (
        multimedia.find((m: any) => m.subtype === "superJumbo") || 
        multimedia.find((m: any) => m.subtype === "xlarge") || 
        multimedia[0]
      ) : null;
      
      const imageUrl = bestImage?.url ? `https://static01.nyt.com/${bestImage.url}` : undefined;
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
    return newsContent.featured.items.slice(0, limit);
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
    // Search by the specific NYT ID
    // Reconstruct the full NYT ID from the slug (e.g., article--uuid -> nyt://article/uuid)
    let nytId = slug;
    if (slug.includes("--")) {
      nytId = "nyt://" + slug.replace(/--/g, "/");
    } else {
      nytId = `nyt://article/${slug}`;
    }

    const url = `${NYT_BASE_URL}/search/v2/articlesearch.json?fq=_id:("${nytId}")&api-key=${NYT_API_KEY}`;

    const response = await fetch(url, { next: { revalidate: 600 } });
    if (!response.ok) return null;

    const data = await response.json();
    const article = data?.response?.docs?.[0];

    if (!article) return null;

    const multimedia = article.multimedia;
    const isArr = Array.isArray(multimedia);
    const bestImage = isArr ? (
      multimedia.find((m: any) => m.subtype === "superJumbo") || 
      multimedia.find((m: any) => m.subtype === "xlarge") || 
      multimedia[0]
    ) : null;
    
    const imageUrl = bestImage?.url ? `https://static01.nyt.com/${bestImage.url}` : undefined;
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
