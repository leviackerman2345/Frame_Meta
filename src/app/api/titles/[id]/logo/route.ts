import { NextResponse } from "next/server";
import { getTitleLogo } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get("type") as "movie" | "tv") || "movie";
  const id = parseInt(idStr);

  try {
    const logoUrl = await getTitleLogo(id, type);
    return NextResponse.json({ logoUrl });
  } catch (error) {
    return NextResponse.json({ logoUrl: null }, { status: 500 });
  }
}
