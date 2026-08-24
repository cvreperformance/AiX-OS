// src/app/api/admin/news/sync/route.ts
// Production Admin News Sync Endpoint for AiX OS™

import { NextResponse } from "next/server";
import { runNewsIngestionPipeline } from "@/lib/news-engine/pipeline";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const cronSecret = req.headers.get("x-cron-secret");
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET || "aix-os-cron-secret-2026";

    const isCronAuthed =
      cronSecret === expectedSecret || authHeader === `Bearer ${expectedSecret}`;

    let isAdminAuthed = false;
    if (!isCronAuthed) {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          isAdminAuthed = true;
        }
      } catch {
        isAdminAuthed = false;
      }
    }

    if (!isCronAuthed && !isAdminAuthed) {
      return NextResponse.json({ error: "Unauthorized access to news sync" }, { status: 401 });
    }

    console.log("[API /admin/news/sync] Triggering live ingestion pipeline...");
    const result = await runNewsIngestionPipeline();

    return NextResponse.json({
      success: true,
      message: `Ingestion completed with status: ${result.status}`,
      data: result,
    });
  } catch (err: any) {
    console.error("[API /admin/news/sync] Sync error:", err);
    return NextResponse.json({ error: err.message || "Ingestion pipeline error" }, { status: 500 });
  }
}
