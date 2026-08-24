// src/app/api/admin/news/health/route.ts
// Production Admin Health & Monitoring Endpoint for AiX OS™ Real Estate News Engine

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    // 1. Fetch sources monitoring data
    const { data: sources } = await supabaseAdmin
      .from("news_sources")
      .select("*")
      .order("name", { ascending: true });

    // 2. Fetch last ingestion log
    const { data: lastLog } = await supabaseAdmin
      .from("news_ingestion_logs")
      .select("*")
      .order("run_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 3. Count articles today and this week
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { count: articlesToday } = await supabaseAdmin
      .from("real_estate_news")
      .select("id", { count: "exact", head: true })
      .gte("discovered_at", startOfToday);

    const { count: articlesThisWeek } = await supabaseAdmin
      .from("real_estate_news")
      .select("id", { count: "exact", head: true })
      .gte("discovered_at", startOfWeek);

    const { count: totalArticles } = await supabaseAdmin
      .from("real_estate_news")
      .select("id", { count: "exact", head: true });

    const sourcesList = sources || [];
    const onlineSourcesCount = sourcesList.filter(s => s.status === "ONLINE").length;
    const failedSources = sourcesList.filter(s => s.status === "DEGRADED" || s.status === "OFFLINE");

    let engineStatus = "ONLINE";
    if (sourcesList.length > 0 && onlineSourcesCount === 0) {
      engineStatus = "OFFLINE";
    } else if (failedSources.length > 0) {
      engineStatus = "DEGRADED";
    }

    return NextResponse.json({
      engineStatus,
      lastSyncAt: lastLog?.run_at || null,
      lastSyncStatus: lastLog?.status || "UNKNOWN",
      articlesToday: articlesToday || 0,
      articlesThisWeek: articlesThisWeek || 0,
      totalArticles: totalArticles || 0,
      sourcesOnline: `${onlineSourcesCount} / ${sourcesList.length}`,
      sources: sourcesList,
      failedSources,
      lastLog,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Health check failed" }, { status: 500 });
  }
}
