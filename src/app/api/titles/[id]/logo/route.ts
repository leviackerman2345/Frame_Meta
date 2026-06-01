import { NextResponse } from "next/server";
import { getTitleLogo } from "@/lib/tmdb";
import { enforceRateLimit } from "@/lib/api-guard";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = enforceRateLimit(request, "titles-logo", 30);
  if (rateLimitResponse) return rateLimitResponse;

  const { id: idStr } = await params;
  const { searchParams } = new URL(request.url);
  const rawType = searchParams.get("type");
  const type = rawType === "tv" ? "tv" : "movie";
  const id = parseInt(idStr);

  if (isNaN(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid title ID" }, { status: 400 });
  }

  try {
    const logoUrl = await getTitleLogo(id, type);
    return NextResponse.json(
      { logoUrl },
      {
        headers: {
          "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ logoUrl: null }, { status: 500 });
  }
}
