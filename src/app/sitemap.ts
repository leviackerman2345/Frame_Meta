import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://framemeta.app";

  const staticRoutes = [
    "",
    "/movies",
    "/series",
    "/news",
    "/people",
    "/search",
    "/collections",
    "/genres",
    "/clips",
    "/about",
    "/partners",
    "/press",
    "/careers",
    "/terms",
    "/privacy",
    "/get-started",
    "/trends",
    "/awards",
    "/rankings/movies",
    "/rankings/tv-shows",
    "/platforms/netflix",
    "/platforms/disney-plus",
    "/platforms/max",
    "/platforms/apple-tv-plus",
  ];

  return staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
