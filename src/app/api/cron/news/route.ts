// src/app/api/cron/news/route.ts

import { NextResponse } from "next/server";
import { NewsRssProvider } from "../../../../lib/providers/newsRss.provider";
import { supabaseAdmin } from "../../../../lib/supabase/admin";

export async function POST(req: Request) {
  // Protect the endpoint with a secret header
  const secret = req.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const feedUrl = process.env.NEXT_PUBLIC_RSS_FEED_URL;
  if (!feedUrl) {
    return new NextResponse("RSS feed URL not configured", { status: 500 });
  }

  const provider = new NewsRssProvider(feedUrl);
  await provider.fetchAndStore();

  // Count total rows after ingestion (admin client bypasses RLS)
  const { count, error } = await supabaseAdmin
    .from("news")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("Cron news count error:", error);
    return NextResponse.json({ imported: null, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ imported: count });
}
