import { NextResponse } from "next/server";
import { getNewsByQuery } from "@/lib/news";
import { enforceRateLimit, sanitizeQuery } from "@/lib/api-guard";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache news search for 1 hour

export async function GET(request: Request) {
  const rateLimited = enforceRateLimit(request, "api:news:search", 30, 60_000);
  if (rateLimited) return rateLimited;

  const { searchParams } = new URL(request.url);
  const query = sanitizeQuery(searchParams.get("q"), 80);

  if (!query) {
    return NextResponse.json(
      { error: "Invalid or empty query." },
      { status: 400 }
    );
  }

  try {
    const news = await getNewsByQuery(query, 6);
    return NextResponse.json(news);
  } catch (error) {
    console.error("[API] News Search error:", error);
    return NextResponse.json(
      { error: "Failed to fetch related news" },
      { status: 500 }
    );
  }
}
