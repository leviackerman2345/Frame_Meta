import { NextResponse } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  if (!query) {
    return NextResponse.json([]);
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
