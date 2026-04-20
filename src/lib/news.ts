import { NewsItem } from "@/types/types";

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

/**
 * Fetch latest movie and cinema news from NewsAPI.
 */
export async function getLatestNews(limit: number = 10): Promise<NewsItem[]> {
  if (!NEWS_API_KEY) {
    console.warn("NEWS_API_KEY is not defined in environment variables.");
    return [];
  }

  try {
    // Focus search on cinema, movies, and major studios
    const query = encodeURIComponent('movies OR cinema OR hollywood OR "marvel studios" OR netflix OR "disney plus" OR "hbo max"');
    const url = `${BASE_URL}/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=${limit * 2}`; // Fetch extra to filter out low-quality results

    const response = await fetch(url, {
      headers: {
        "X-Api-Key": NEWS_API_KEY,
      },
      next: { revalidate: 14400 }, // Cache for 4 hours
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      if (errorData.code === "apiKeyInvalid") {
        console.warn("News API: The API key provided in NEWS_API_KEY is invalid. Falling back to static featured news data.");
      } else {
        console.error("News API error:", errorData.message || response.statusText);
      }
      
      return [];
    }

    const data = await response.json();
    
    // Filter articles that have images and descriptions
    const validArticles = (data.articles || [])
      .filter((article: any) => article.urlToImage && article.description && !article.title.includes("Removed"))
      .slice(0, limit);

    return validArticles.map((article: any, index: number) => {
      // Calculate a rough read time based on description + content length (if available)
      const textToRead = (article.description || "") + (article.content || "");
      const wordCount = textToRead.split(/\s+/).length;
      const readTimeMinutes = Math.max(3, Math.ceil(wordCount / 200) + 1);

      return {
        id: index + 5000, // Semi-unique ID for rendering
        title: article.title,
        category: "Cinema Daily", 
        source: article.source.name || "Global News",
        date: new Date(article.publishedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        readTime: `${readTimeMinutes} min read`,
        imageUrl: article.urlToImage,
        author: article.author?.split(",")[0] || "FrameMeta Editorial", // Clean up multiple authors
        description: article.description,
      };
    });
  } catch (error) {
    console.error("Unexpected error fetching news:", error);
    return [];
  }
}
