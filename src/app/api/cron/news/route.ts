// src/app/api/cron/news/route.ts
// Production Cron Job endpoint for AiX OS™ Real Estate News Engine

import { NextResponse } from "next/server";
import { runNewsIngestionPipeline } from "@/lib/news-engine/pipeline";

export async function GET(req: Request) {
  return handleCron(req);
}

export async function POST(req: Request) {
  return handleCron(req);
}

async function handleCron(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = req.headers.get("x-cron-secret");
  const expectedSecret = process.env.CRON_SECRET || "aix-os-cron-secret-2026";

  const isSecretValid =
    cronSecret === expectedSecret || authHeader === `Bearer ${expectedSecret}`;

  if (!isSecretValid) {
    return NextResponse.json({ error: "Forbidden: Invalid Cron Secret" }, { status: 403 });
  }

  console.log("[CRON NEWS ENGINE] Triggering automatic ingestion pipeline...");
  const result = await runNewsIngestionPipeline();

  return NextResponse.json({
    status: result.status,
    articlesIngested: result.articlesIngested,
    articlesRejected: result.articlesRejected,
    articlesDeduplicated: result.articlesDeduplicated,
    durationMs: result.durationMs,
    errors: result.errors,
  });
}
