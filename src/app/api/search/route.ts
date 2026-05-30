import { NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";
import { enforceRateLimit, sanitizePage, sanitizeQuery } from "@/lib/api-guard";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET(request: Request) {
  const rateLimited = enforceRateLimit(request, "api:search", 45, 60_000);
  if (rateLimited) return rateLimited;

  const { searchParams } = new URL(request.url);
  const query = sanitizeQuery(searchParams.get("query"));
  const page = sanitizePage(searchParams.get("page"));

  if (!query) {
    return NextResponse.json(
      { error: "Invalid or empty query." },
      { status: 400 }
    );
  }

  try {
    const data = await searchMulti(query, page);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
