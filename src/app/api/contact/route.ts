import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendTelegramAlert, sendEmailAlert } from "@/lib/notifications";
import { validateName, validateEmail, validatePhone } from "@/lib/validation";

// Simple in-memory rate limiter
// Tracks IP address -> array of timestamps of requests
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;

interface ContactPayload {
  service: string;
  page: string;
  name: string;
  email?: string;
  phone: string;
  message?: string;
  source: string;
  botfield?: string;
}

export async function POST(request: Request) {
  try {
    // 1. Get Client IP for Rate Limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const now = Date.now();
    let clientTimestamps = rateLimitMap.get(ip) || [];
    
    // Filter timestamps to keep only those within the active window
    clientTimestamps = clientTimestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW);
    
    if (clientTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before submitting again." },
        { status: 429 }
      );
    }
    
    // Add current timestamp to rate limiter list
    clientTimestamps.push(now);
    rateLimitMap.set(ip, clientTimestamps);

    // 2. Parse and Validate Body
    const body = (await request.json()) as ContactPayload;

    // Honeypot spam check
    if (body.botfield && body.botfield.trim() !== "") {
      console.info("[Honeypot Triggered] Ignored spam bot lead submission:", body.name);
      return NextResponse.json({
        success: true,
        message: "Request processed successfully.",
        bot: true,
      });
    }

    // Required fields check
    if (!body.name || !body.phone || !body.service) {
      return NextResponse.json(
        { error: "Name, phone, and service type are required fields." },
        { status: 400 }
      );
    }

    const name = body.name?.trim() || "";
    const phone = body.phone?.trim() || "";
    const email = body.email?.trim() || "";
    const message = body.message?.trim() || "";
    const service = body.service?.trim() || "";
    const page = body.page?.trim() || "/";
    const source = body.source?.trim() || "unknown";

    // Validate using central validation logic

    
    const nameError = validateName(name);
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 });
    }

    const phoneError = validatePhone(phone);
    if (phoneError) {
      return NextResponse.json({ error: phoneError }, { status: 400 });
    }

    if (email) {
      const emailError = validateEmail(email);
      if (emailError) {
        return NextResponse.json({ error: emailError }, { status: 400 });
      }
    }

    if (!service) {
      return NextResponse.json({ error: "Service type is required." }, { status: 400 });
    }

    const lead = {
      created_at: new Date().toISOString(),
      service,
      page,
      name,
      email: email || null,
      phone,
      message: message || null,
      status: "new",
      source,
    };

    let storedInSupabase = false;

    // 3. Store in Supabase
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("leads").insert(lead);
      if (!error) {
        storedInSupabase = true;
        console.info("[AiX Leads] Stored in Supabase.");
      } else {
        console.warn("[AiX Leads] Supabase insert failed:", error.message);
      }
    } catch (supabaseErr) {
      console.warn("[AiX Leads] Supabase database connection failed:", supabaseErr);
    }



    // 5. Telegram Dispatch
    try {
      await sendTelegramAlert(lead);
    } catch (tgErr) {
      console.error("[AiX Contact Route] Telegram alert promise exception:", tgErr);
    }

    // 6. Email Dispatch (Resend API)
    try {
      await sendEmailAlert(lead);
    } catch (emailErr) {
      console.error("[AiX Contact Route] Email alert promise exception:", emailErr);
    }

    return NextResponse.json({
      success: true,
      storedInSupabase,
      message: "Lead processed and logged.",
    });
  } catch (err) {
    console.error("[AiX Contact Route Error]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
