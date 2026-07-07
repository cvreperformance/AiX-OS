/**
 * AiX OS™ — Server-Side Notification Hub
 *
 * Handles Telegram and Email alert dispatch for every contact form submission.
 * Rules:
 *   - Credentials are ONLY read from process.env (server-side, never exposed to client)
 *   - Telegram failure NEVER fails the user's form submission
 *   - Retries with exponential backoff; aborts after TIMEOUT_MS per attempt
 *   - Uses MarkdownV2 with proper escaping to prevent Telegram parse errors
 */

export interface LeadData {
  service: string;
  page: string;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  source: string;
  created_at: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_RETRIES = 2;         // total attempts (1 immediate + 1 retry)
const INITIAL_BACKOFF_MS = 800;
const TIMEOUT_MS = 6000;       // 6 s per attempt — keeps total < 15 s

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * fetch() wrapped in an AbortController timeout.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}



/**
 * Format a UTC ISO timestamp to a human-readable local string.
 */
function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ro-RO", {
      timeZone: "Europe/Bucharest",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

/**
 * Build the MarkdownV2-formatted Telegram message body.
 *
 * Layout:
 *   🔥 NEW LEAD — <Service>
 *   ─────────────────────
 *   👤 Name     · Phone     · Email
 *   📍 Page · Source
 *   💬 Message (if any)
 *   🕒 Timestamp
 */
function buildTelegramMessage(lead: LeadData): string {
  const service  = lead.service || "N/A";
  const name     = lead.name || "N/A";
  const phone    = lead.phone || "N/A";
  const email    = lead.email || "N/A";
  const message  = lead.message || "—";
  const page     = lead.page || "N/A";
  const time     = formatTime(lead.created_at);

  return [
    `🧠 AiX OS™ Lead`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    `Message: ${message}`,
    `Page URL: ${page}`,
    `Timestamp: ${time}`,
  ].join("\n");
}

// ─── Telegram ─────────────────────────────────────────────────────────────────

/**
 * Send a formatted lead notification to the configured Telegram chat.
 *
 * - Reads TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID from process.env (server-side only)
 * - Retries up to MAX_RETRIES times with exponential backoff
 * - Returns true on success, false on all failures
 * - NEVER throws — callers must not let Telegram failure block the form response
 */
export async function sendTelegramAlert(lead: LeadData): Promise<boolean> {
  const token  = process.env.TELEGRAM_BOT_TOKEN || "";
  const chatId = process.env.TELEGRAM_CHAT_ID || "";

  const url  = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = JSON.stringify({
    chat_id:    chatId,
    text:       buildTelegramMessage(lead),
  });

  let attempt = 0;
  let backoff  = INITIAL_BACKOFF_MS;

  while (attempt < MAX_RETRIES) {
    attempt++;
    try {
      console.log(`[AiX Telegram] Attempt ${attempt}/${MAX_RETRIES} — dispatching alert for "${lead.service}" from ${lead.name}…`);

      const response = await fetchWithTimeout(
        url,
        { method: "POST", headers: { "Content-Type": "application/json" }, body },
        TIMEOUT_MS
      );

      if (response.ok) {
        console.log(`[AiX Telegram] ✓ Delivered on attempt ${attempt}.`);
        return true;
      }

      // Non-200 from Telegram: log the error body for debugging
      const errBody = await response.text().catch(() => "(unreadable)");
      console.warn(
        `[AiX Telegram] HTTP ${response.status} on attempt ${attempt}: ${errBody}`
      );
    } catch (err: any) {
      if (err?.name === "AbortError") {
        console.error(`[AiX Telegram] Timed out on attempt ${attempt} (>${TIMEOUT_MS}ms).`);
      } else {
        console.error(`[AiX Telegram] Network error on attempt ${attempt}:`, err?.message ?? err);
      }
    }

    if (attempt < MAX_RETRIES) {
      console.log(`[AiX Telegram] Retrying in ${backoff}ms…`);
      await sleep(backoff);
      backoff *= 2;
    }
  }

  console.error(`[AiX Telegram] ✗ Failed after ${MAX_RETRIES} attempt(s). Lead NOT lost — stored in Supabase/backup.`);
  return false;
}

// ─── Email (Resend) ───────────────────────────────────────────────────────────

/**
 * Send an HTML email lead alert via the Resend API.
 *
 * - Reads RESEND_API_KEY and ADMIN_EMAIL from process.env (server-side only)
 * - Same retry/timeout pattern as Telegram
 * - NEVER throws
 */
export async function sendEmailAlert(lead: LeadData): Promise<boolean> {
  const apiKey  = process.env.RESEND_API_KEY;
  const toEmail = process.env.ADMIN_EMAIL;

  if (!apiKey || !toEmail) {
    console.warn(
      "[AiX Email] RESEND_API_KEY or ADMIN_EMAIL not configured. Skipping email dispatch."
    );
    return false;
  }

  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; background-color: #0c0c0c; color: #ffffff; border-radius: 16px; border: 1px solid #1f1f1f; max-width: 600px; margin: 0 auto;">
      <h2 style="font-size: 20px; font-weight: 300; border-bottom: 1px solid #27272a; padding-bottom: 12px; color: #f59e0b; margin-top: 0;">
        🔥 NEW LEAD — AiX OS™
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; line-height: 1.6; margin-top: 16px;">
        <tr><td style="padding: 6px 0; color: #71717a; width: 110px;">Service:</td><td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${lead.service}</td></tr>
        <tr><td style="padding: 6px 0; color: #71717a;">Name:</td><td style="padding: 6px 0; color: #ffffff;">${lead.name}</td></tr>
        <tr><td style="padding: 6px 0; color: #71717a;">Phone:</td><td style="padding: 6px 0; color: #ffffff; font-family: monospace;">${lead.phone}</td></tr>
        <tr><td style="padding: 6px 0; color: #71717a;">Email:</td><td style="padding: 6px 0; color: #ffffff;">${lead.email ?? "N/A"}</td></tr>
        <tr><td style="padding: 6px 0; color: #71717a;">Page:</td><td style="padding: 6px 0; color: #ffffff; font-family: monospace; font-size: 11px;">${lead.page}</td></tr>
        <tr><td style="padding: 6px 0; color: #71717a;">Source:</td><td style="padding: 6px 0; color: #ffffff; font-family: monospace; font-size: 11px;">${lead.source}</td></tr>
        <tr><td style="padding: 6px 0; color: #71717a;">Time:</td><td style="padding: 6px 0; color: #71717a; font-family: monospace;">${formatTime(lead.created_at)}</td></tr>
      </table>
      <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #27272a;">
        <p style="font-size: 11px; color: #71717a; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Message / Details:</p>
        <div style="background-color: #18181b; padding: 12px 16px; border-radius: 8px; border: 1px solid #27272a; font-size: 13px; color: #e4e4e7; white-space: pre-wrap; line-height: 1.5;">${lead.message ?? "No additional message."}</div>
      </div>
      <p style="font-size: 10px; color: #3f3f46; text-align: center; margin-top: 24px; margin-bottom: 0;">
        AiX OS™ • Secured Notification Network
      </p>
    </div>
  `;

  const payload = JSON.stringify({
    from:    "AiX OS™ Leads <onboarding@resend.dev>",
    to:      [toEmail],
    subject: `🔥 NEW LEAD — ${lead.service}`,
    html:    emailHtml,
  });

  let attempt = 0;
  let backoff  = INITIAL_BACKOFF_MS;

  while (attempt < MAX_RETRIES) {
    attempt++;
    try {
      console.log(`[AiX Email] Attempt ${attempt}/${MAX_RETRIES} — dispatching to ${toEmail}…`);
      const response = await fetchWithTimeout(
        "https://api.resend.com/emails",
        {
          method: "POST",
          headers: {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: payload,
        },
        TIMEOUT_MS
      );

      if (response.ok) {
        console.log(`[AiX Email] ✓ Delivered on attempt ${attempt}.`);
        return true;
      }

      const errBody = await response.text().catch(() => "(unreadable)");
      console.warn(`[AiX Email] HTTP ${response.status} on attempt ${attempt}: ${errBody}`);
    } catch (err: any) {
      if (err?.name === "AbortError") {
        console.error(`[AiX Email] Timed out on attempt ${attempt} (>${TIMEOUT_MS}ms).`);
      } else {
        console.error(`[AiX Email] Network error on attempt ${attempt}:`, err?.message ?? err);
      }
    }

    if (attempt < MAX_RETRIES) {
      console.log(`[AiX Email] Retrying in ${backoff}ms…`);
      await sleep(backoff);
      backoff *= 2;
    }
  }

  console.error(`[AiX Email] ✗ Failed after ${MAX_RETRIES} attempt(s).`);
  return false;
}
