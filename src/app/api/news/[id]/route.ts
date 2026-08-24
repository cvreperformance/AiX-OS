// src/app/api/news/[id]/route.ts
// Single Article Fetch Endpoint for AiX OS™ Real Estate News Engine

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Search by ID or slug
    const { data: byId } = await supabaseAdmin
      .from("real_estate_news")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (byId) {
      return NextResponse.json({ article: byId });
    }

    const { data: bySlug } = await supabaseAdmin
      .from("real_estate_news")
      .select("*")
      .eq("slug", id)
      .maybeSingle();

    if (bySlug) {
      return NextResponse.json({ article: bySlug });
    }

    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
