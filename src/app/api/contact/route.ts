import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import fs from "fs";
import path from "path";

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
      console.log("[Honeypot Triggered] Ignored spam bot lead submission:", body.name);
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

    const name = body.name.trim();
    const phone = body.phone.trim();
    const email = body.email?.trim() || "";
    const message = body.message?.trim() || "";
    const service = body.service.trim();
    const page = body.page?.trim() || "/";
    const source = body.source?.trim() || "unknown";

    // Simple email regex validation
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Please enter a valid email address." },
          { status: 400 }
        );
      }
    }

    // Simple phone regex validation (allow +, digits, spaces, hyphens, min 6 digits)
    const phoneRegex = /^\+?[0-9\s\-]{6,20}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
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
      const supabase = createClient();
      const { error } = await supabase.from("leads").insert(lead);
      if (!error) {
        storedInSupabase = true;
        console.log("[AiX Leads] Stored in Supabase.");
      } else {
        console.warn("[AiX Leads] Supabase insert failed:", error.message);
      }
    } catch (supabaseErr) {
      console.warn("[AiX Leads] Supabase database connection failed:", supabaseErr);
    }

    // 4. Fallback Local Storage Write (No lead is lost)
    try {
      const backupPath = path.join(process.cwd(), "src/data/leads_backup.json");
      const dir = path.dirname(backupPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      let currentList = [];
      if (fs.existsSync(backupPath)) {
        const raw = fs.readFileSync(backupPath, "utf8");
        currentList = JSON.parse(raw);
      }
      currentList.push(lead);
      fs.writeFileSync(backupPath, JSON.stringify(currentList, null, 2), "utf8");
      console.log("[AiX Leads] Stored in local backup file.");
    } catch (fsErr) {
      console.error("[AiX Leads] Local backup file write failed:", fsErr);
    }

    // 5. Telegram Dispatch
    const tgToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;
    if (tgToken && tgChatId) {
      try {
        const text = `🔥 *NEW LEAD RECEIVED ON AiX OS*\n\n*Service:* ${lead.service}\n*Page:* ${lead.page}\n*Name:* ${lead.name}\n*Phone:* ${lead.phone}\n*Email:* ${lead.email ?? "N/A"}\n*Message:* ${lead.message ?? "N/A"}\n*Source:* ${lead.source}\n*Time:* ${lead.created_at}`;
        
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChatId,
            text,
            parse_mode: "Markdown",
          }),
        });
        console.log("[AiX Leads Telegram] Notification sent.");
      } catch (tgErr) {
        console.error("[AiX Leads Telegram] Failed to dispatch notification:", tgErr);
      }
    } else {
      console.log("[AiX Leads Telegram] Credentials missing. Skip notification.");
    }

    // 6. Email Dispatch (Resend API direct fetch call)
    const resendKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL || "contact@cristianvaduva.com";
    if (resendKey) {
      try {
        const emailBody = `
          <h2>🔥 NEW LEAD RECEIVED ON AiX OS</h2>
          <p><strong>Service:</strong> ${lead.service}</p>
          <p><strong>Page:</strong> ${lead.page}</p>
          <p><strong>Name:</strong> ${lead.name}</p>
          <p><strong>Phone:</strong> ${lead.phone}</p>
          <p><strong>Email:</strong> ${lead.email ?? "N/A"}</p>
          <p><strong>Message:</strong> ${lead.message ?? "N/A"}</p>
          <p><strong>Source:</strong> ${lead.source}</p>
          <p><strong>Time:</strong> ${lead.created_at}</p>
        `;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "AiX OS Leads <onboarding@resend.dev>",
            to: [contactEmail],
            subject: `🔥 NEW LEAD - ${lead.service}`,
            html: emailBody,
          }),
        });
        console.log("[AiX Leads Resend] Email notification dispatched.");
      } catch (emailErr) {
        console.error("[AiX Leads Resend] Email dispatch failed:", emailErr);
      }
    } else {
      console.log("[AiX Leads Resend] Credentials missing. Skip email notification.");
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
