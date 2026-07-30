import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

import { SchemaValidator } from "@/services/aix-intelligence/governance/validator";
import { EventNormalizer } from "@/services/aix-intelligence/governance/normalizer";
import { EventClassifier } from "@/services/aix-intelligence/governance/classifier";

import { ConnectorAuth } from "@/services/aix-intelligence/connector/connector-auth";
import { ConnectorHealth } from "@/services/aix-intelligence/connector/connector-health";

export const runtime = "nodejs";

// CORS headers to enable other applications in the ecosystem to communicate with the engine
function getCorsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-SDK-Version, X-API-Version, x-aix-api-key, x-aix-timestamp, x-aix-nonce, x-aix-signature",
    "Access-Control-Max-Age": "86400",
  };
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return NextResponse.json({}, { headers: getCorsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  const apiKey = request.headers.get("x-aix-api-key");
  const timestamp = request.headers.get("x-aix-timestamp");
  const nonce = request.headers.get("x-aix-nonce");
  const signature = request.headers.get("x-aix-signature");

  try {
    const rawEvents = await request.json();
    console.log("[AiX Ingest DEBUG] Request received. Event batch count:", Array.isArray(rawEvents) ? rawEvents.length : "Not an array");

    if (!Array.isArray(rawEvents)) {
      console.log("[AiX Ingest DEBUG] Ingestion failed: Request body is not an array");
      return NextResponse.json(
        { success: false, error: "Invalid payload: Expected an array of events" },
        { status: 400, headers: corsHeaders }
      );
    }

    const testApp = rawEvents[0]?.application || "aix-os";

    // 1. Authenticate if headers are present (maintains backward compatibility if missing)
    if (apiKey && timestamp && nonce && signature) {
      const authResult = ConnectorAuth.validateRequest(testApp, apiKey, timestamp, nonce, signature);
      if (!authResult.valid) {
        console.warn(`[AiX Ingest] Unauthorized connector request: ${authResult.error}`);
        console.log("[AiX Ingest DEBUG] Connector authentication failed:", authResult.error);
        ConnectorHealth.updateStats(testApp, { failed_requests: 1, dropped_events: rawEvents.length });
        return NextResponse.json(
          { success: false, error: "Unauthorized: Invalid credentials" },
          { status: 401, headers: corsHeaders }
        );
      }

      console.log("[AiX Ingest DEBUG] Connector authenticated successfully");
      // Track health metrics
      const latency = Date.now() - new Date(timestamp).getTime();
      ConnectorHealth.updateStats(testApp, { 
        latency_ms: latency > 0 ? latency : 10,
        sdk_version: rawEvents[0]?.sdk_version || "2.0.0"
      });
    } else {
      console.log("[AiX Ingest DEBUG] Ingesting without connector signature headers (backward compatibility mode)");
    }

    try {
      const visitorId = rawEvents[0]?.visitor_id || "";
      ConnectorHealth.updateStats(testApp, {
        events_today: rawEvents.length,
        visitor_id: visitorId,
      });
    } catch (e) {}

    const validatedEvents = [];
    const errors: string[] = [];
    const vercelCountry = request.headers.get("x-vercel-ip-country") || null;

    for (let i = 0; i < rawEvents.length; i++) {
      const item = rawEvents[i];

      // 1. Structural Schema Validation
      const valResult = SchemaValidator.validate(item);
      if (valResult.status === "invalid") {
        errors.push(`Event at index ${i} failed validation: ${valResult.error}`);
        continue;
      }

      // 2. Normalization
      const normResult = EventNormalizer.normalize(item);
      let eventPayload = normResult.event;

      // Ensure country info is populated
      if (!eventPayload.country) {
        eventPayload.country = typeof item.country === "string" ? item.country : vercelCountry;
      }

      // 3. Central Event Registry Classification
      const classResult = EventClassifier.classify(eventPayload);
      eventPayload = classResult.event;

      validatedEvents.push(eventPayload);
    }

    console.log(`[AiX Ingest DEBUG] Events normalized. Validated: ${validatedEvents.length}, Errors: ${errors.length}`);

    if (validatedEvents.length === 0) {
      console.log("[AiX Ingest DEBUG] Ingestion failed: No valid events in batch");
      return NextResponse.json(
        { success: false, error: "Validation failed for all events in batch", details: errors },
        { status: 422, headers: corsHeaders }
      );
    }

    // Insert events using the admin client
    console.log("[AiX Ingest DEBUG] Attempting database insert using supabaseAdmin...");
    const { error: dbError } = await supabaseAdmin
      .from("aix_events")
      .insert(validatedEvents);

    if (dbError) {
      console.error("[AiX Intelligence Engine] Database insertion error:", dbError);
      console.log("[AiX Ingest DEBUG] Database insert failed:", dbError.message);
      return NextResponse.json(
        { success: false, error: "Database ingestion failed" },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log("[AiX Ingest DEBUG] Database insert succeeded");

    // Publish ingested events to the Event Bus, Live Monitor, and Telegram alert rules asynchronously (silent fallbacks)
    try {
      const { eventBus } = await import("@/services/aix-intelligence/realtime/event-bus");
      const { liveSessionMonitor } = await import("@/services/aix-intelligence/realtime/live-monitor");
      const { telegram } = await import("@/services/aix-intelligence/telegram");

      validatedEvents.forEach((evt) => {
        liveSessionMonitor.registerActivity(evt);
        eventBus.publish("ingest:event", evt);
        telegram.evaluateEventRules(evt);
      });
    } catch (e) {}

    // Trigger visitor profile recomputation in the background (fire-and-forget)
    try {
      const { knowledgeEngine } = await import("@/services/aix-intelligence/knowledge-engine/engine");
      const flags = (await import("@/services/aix-intelligence/realtime/config")).RealtimeConfigManager.getFlags();
      
      if (flags.knowledge_live_updates) {
        const visitorIds = Array.from(new Set(validatedEvents.map((e) => e.visitor_id)));
        console.log("[AiX Ingest DEBUG] Triggering knowledge rebuild for visitors:", visitorIds);
        visitorIds.forEach((vId) => {
          knowledgeEngine.rebuildProfile(vId)
            .then(() => console.log(`[AiX Ingest DEBUG] Knowledge rebuild succeeded for visitor ${vId}`))
            .catch((err) => console.log(`[AiX Ingest DEBUG] Knowledge rebuild failed for visitor ${vId}:`, err.message));
        });
      } else {
        console.log("[AiX Ingest DEBUG] Knowledge live updates are disabled in configuration");
      }
    } catch (e) {}

    // 202 Accepted status for async ingestion
    return NextResponse.json(
      { success: true, ingested: validatedEvents.length, errors: errors.length > 0 ? errors : undefined },
      { status: 202, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("[AiX Intelligence Engine] Ingestion error:", error);
    console.log("[AiX Ingest DEBUG] Ingestion error caught:", error.message);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
