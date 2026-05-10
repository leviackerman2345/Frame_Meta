import { NextResponse } from "next/server";
import { getNewsByQuery } from "@/lib/news";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache news search for 1 hour

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
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
