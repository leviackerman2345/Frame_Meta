import { NextResponse } from "next/server";
import { discoverByGenre } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get("genre") || "";
  const page = parseInt(searchParams.get("page") || "1");

  if (!genre) {
    return NextResponse.json([]);
  }

  try {
    const data = await discoverByGenre(genre, page);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to discover titles:", error);
    return NextResponse.json(
      { error: "Failed to discover titles" },
      { status: 500 }
    );
  }
}
