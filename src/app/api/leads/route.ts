import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  budget?: string;
  interest?: string;
  message?: string;
  source?: string; // "popup" | "contact-form" | "inline"
  page?: string;
}

/**
 * POST /api/leads
 *
 * Accepts lead data from:
 * - ConsultationPopup
 * - ContactForm
 * - Any inline forms across the site
 *
 * Stores in Supabase `leads` table if available,
 * otherwise logs to console as fallback.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload;

    // Basic validation
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const lead = {
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: body.email?.trim() ?? null,
      subject: body.subject ?? body.interest ?? null,
      budget: body.budget ?? null,
      message: body.message ?? null,
      source: body.source ?? "unknown",
      page: body.page ?? null,
      created_at: new Date().toISOString(),
      status: "new",
    };

    // Try Supabase first
    try {
      const supabase = createClient();
      const { error } = await supabase.from("leads").insert(lead);
      if (!error) {
        return NextResponse.json({ success: true, stored: "supabase" });
      }
      // If table doesn't exist yet, fall through to console log
      console.warn("[AiX Leads] Supabase insert failed:", error.message);
    } catch (supabaseErr) {
      console.warn("[AiX Leads] Supabase unavailable:", supabaseErr);
    }

    // Fallback: log to console (visible in server logs / Vercel logs)
    console.log("[AiX OS LEAD]", JSON.stringify(lead, null, 2));

    return NextResponse.json({
      success: true,
      stored: "console",
      message: "Lead logged. Connect Supabase leads table to persist.",
    });
  } catch (err) {
    console.error("[AiX Leads] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    info: "AiX OS Lead Capture API",
    version: "1.0",
    methods: ["POST"],
    fields: {
      required: ["name", "phone"],
      optional: ["email", "subject", "budget", "interest", "message", "source", "page"],
    },
  });
}
