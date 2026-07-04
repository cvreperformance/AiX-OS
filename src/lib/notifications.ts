/**
 * Reusable notification utilities for Telegram and Resend Email alerts.
 * Implements exponential backoff retries and timeout abort controllers to prevent route hanging.
 */

interface LeadData {
  service: string;
  page: string;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  source: string;
  created_at: string;
}

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 500;
const TIMEOUT_MS = 5000;

/**
 * Utility function to sleep for a given duration.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Perform a fetch request with a strict timeout using AbortController.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Dispatches a lead notification alert to Telegram.
 * Retries up to 3 times with exponential backoff on failure or timeout.
 */
export async function sendTelegramAlert(lead: LeadData): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "[AiX Notification Hub] Telegram credentials missing. Skipping Telegram notification dispatch."
    );
    return false;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const text = `🔥 *NEW LEAD RECEIVED ON AiX OS*\n\n*Service:* ${lead.service}\n*Page:* ${lead.page}\n*Name:* ${lead.name}\n*Phone:* ${lead.phone}\n*Email:* ${lead.email ?? "N/A"}\n*Message:* ${lead.message ?? "N/A"}\n*Source:* ${lead.source}\n*Time:* ${lead.created_at}`;

  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
  };

  let attempt = 0;
  let backoff = INITIAL_BACKOFF_MS;

  while (attempt < MAX_RETRIES) {
    attempt++;
    try {
      console.log(`[AiX Telegram Alert] Attempt ${attempt} to dispatch notification...`);
      const response = await fetchWithTimeout(
        url,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
        TIMEOUT_MS
      );

      if (response.ok) {
        console.log(`[AiX Telegram Alert] Dispatched successfully on attempt ${attempt}.`);
        return true;
      }

      const errText = await response.text();
      console.warn(
        `[AiX Telegram Alert] Bad response (status ${response.status}) on attempt ${attempt}: ${errText}`
      );
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.error(`[AiX Telegram Alert] Dispatch timed out on attempt ${attempt}.`);
      } else {
        console.error(`[AiX Telegram Alert] Error on attempt ${attempt}:`, err.message || err);
      }
    }

    if (attempt < MAX_RETRIES) {
      console.log(`[AiX Telegram Alert] Retrying in ${backoff}ms...`);
      await sleep(backoff);
      backoff *= 2;
    }
  }

  console.error(`[AiX Telegram Alert] Failed to send notification after ${MAX_RETRIES} attempts.`);
  return false;
}

/**
 * Dispatches a lead notification alert to Email via Resend API.
 * Retries up to 3 times with exponential backoff on failure or timeout.
 */
export async function sendEmailAlert(lead: LeadData): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL || "contact@cristianvaduva.com";

  if (!apiKey) {
    console.warn(
      "[AiX Notification Hub] Resend API Key is missing. Skipping Email notification dispatch."
    );
    return false;
  }

  const url = "https://api.resend.com/emails";
  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; background-color: #0c0c0c; color: #ffffff; border-radius: 16px; border: 1px solid #1f1f1f; max-width: 600px; margin: 0 auto;">
      <h2 style="font-size: 20px; font-weight: 300; border-bottom: 1px solid #27272a; padding-bottom: 12px; color: #f59e0b; margin-top: 0;">
        🔥 NEW LEAD RECEIVED ON AiX OS
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; line-height: 1.6; margin-top: 16px;">
        <tr>
          <td style="padding: 6px 0; color: #71717a; width: 120px;">Service:</td>
          <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${lead.service}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #71717a;">Page:</td>
          <td style="padding: 6px 0; color: #ffffff; font-family: monospace;">${lead.page}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #71717a;">Name:</td>
          <td style="padding: 6px 0; color: #ffffff;">${lead.name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #71717a;">Phone:</td>
          <td style="padding: 6px 0; color: #ffffff;">${lead.phone}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #71717a;">Email:</td>
          <td style="padding: 6px 0; color: #ffffff;">${lead.email ?? "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #71717a;">Source:</td>
          <td style="padding: 6px 0; color: #ffffff; font-family: monospace; font-size: 11px;">${lead.source}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #71717a;">Time:</td>
          <td style="padding: 6px 0; color: #71717a; font-family: monospace;">${lead.created_at}</td>
        </tr>
      </table>
      <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #27272a;">
        <p style="font-size: 11px; color: #71717a; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em;">Message / Details:</p>
        <div style="background-color: #18181b; padding: 12px 16px; border-radius: 8px; border: 1px solid #27272a; font-size: 13px; color: #e4e4e7; white-space: pre-wrap; line-height: 1.5;">${lead.message ?? "No additional message."}</div>
      </div>
      <p style="font-size: 10px; color: #3f3f46; text-align: center; margin-top: 24px; margin-bottom: 0;">
        AiX OS Transaction Operating System &bull; Secured Notification Network
      </p>
    </div>
  `;

  const payload = {
    from: "AiX OS Leads <onboarding@resend.dev>",
    to: [toEmail],
    subject: `🔥 NEW LEAD - ${lead.service}`,
    html: emailHtml,
  };

  let attempt = 0;
  let backoff = INITIAL_BACKOFF_MS;

  while (attempt < MAX_RETRIES) {
    attempt++;
    try {
      console.log(`[AiX Email Alert] Attempt ${attempt} to dispatch email notification...`);
      const response = await fetchWithTimeout(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
        },
        TIMEOUT_MS
      );

      if (response.ok) {
        console.log(`[AiX Email Alert] Dispatched successfully on attempt ${attempt}.`);
        return true;
      }

      const errText = await response.text();
      console.warn(
        `[AiX Email Alert] Bad response (status ${response.status}) on attempt ${attempt}: ${errText}`
      );
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.error(`[AiX Email Alert] Dispatch timed out on attempt ${attempt}.`);
      } else {
        console.error(`[AiX Email Alert] Error on attempt ${attempt}:`, err.message || err);
      }
    }

    if (attempt < MAX_RETRIES) {
      console.log(`[AiX Email Alert] Retrying in ${backoff}ms...`);
      await sleep(backoff);
      backoff *= 2;
    }
  }

  console.error(`[AiX Email Alert] Failed to send email after ${MAX_RETRIES} attempts.`);
  return false;
}
