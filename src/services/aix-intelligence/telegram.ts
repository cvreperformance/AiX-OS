import { supabaseAdmin } from "@/lib/supabase/admin";

export interface TelegramAlert {
  title: string;
  message: string;
  severity: "info" | "warning" | "error" | "critical";
  application: string;
  metadata?: Record<string, any>;
}

export interface QueueItem {
  id: string; // event_id / uuid
  event: any;
  status: "pending" | "sent" | "failed" | "retrying";
  retry_count: number;
  last_error?: string;
  created_at: string;
  sent_at?: string;
  formatted_message?: string;
}

export interface QueueStats {
  total: number;
  sent: number;
  failed: number;
  latency_ms: number;
  last_notification_time: string;
}

class TelegramNotificationService {
  private botToken: string | null = null;
  private chatId: string | null = null;
  
  // Throttle state
  private lastSendTime = 0;
  private sendPromiseChain: Promise<any> = Promise.resolve();

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || null;
    this.chatId = process.env.TELEGRAM_CHAT_ID || null;
  }

  /**
   * Dynamically fetch credentials from memory or process environment
   * to ensure compatibility with serverless environments.
   */
  private getBotCredentials() {
    const token = this.botToken || process.env.TELEGRAM_BOT_TOKEN || null;
    const chat = this.chatId || process.env.TELEGRAM_CHAT_ID || null;
    return { token, chat };
  }

  /**
   * Internal normalization for application names.
   */
  private normalizeApp(app: string): string {
    return (app || "").toLowerCase().trim().replace(/[ _]/g, "-");
  }

  /**
   * Internal normalization for event types (converts spaces/hyphens to underscores).
   */
  private normalizeEventType(eventType: string): string {
    return (eventType || "").toLowerCase().trim().replace(/[ -]/g, "_");
  }

  /**
   * Helper to check if an event is allowed for Telegram notifications.
   */
  private isAllowedEvent(app: string, eventType: string): { allowed: boolean; reason: string } {
    const a = this.normalizeApp(app);
    const e = this.normalizeEventType(eventType);

    if (a === "home-find") {
      const allowed = [
        "property_view", "property_opened", "property_viewed",
        "property_search", "search",
        "property_filter_change",
        "property_contact_start", "property_contact_submit",
        "buyer_request", "seller_request",
        "guide_download", "download_started",
        "ai_opened", "ai_prompt_started", "ai_prompt_sent", "ai_prompt_received"
      ];
      const match = allowed.includes(e);
      return { allowed: match, reason: match ? "Matched home-find allowed event list" : "Event not in home-find allowed list" };
    }

    if (a === "insurance") {
      const allowed = [
        "insurance_quote_start", "quote_started",
        "insurance_quote_submit",
        "insurance_form_start",
        "insurance_form_submit",
        "insurance_form_abandon", "form_abandoned",
        "contact_request",
        "consultation_request",
        "callback_request",
        "guide_download", "download_started",
        "login_success", "login_failure",
        "profile_update",
        "ai_opened", "ai_prompt_started", "ai_prompt_sent", "ai_prompt_received"
      ];
      const match = allowed.includes(e);
      return { allowed: match, reason: match ? "Matched insurance allowed event list" : "Event not in insurance allowed list" };
    }

    if (a === "aix-os") {
      const allowed = [
        "ai_interactions", "ai_interaction",
        "ai_prompt_sent", "ai_prompt_received",
        "decision_generated", "decision_updated",
        "learning_score_changed", "learning_update",
        "opportunity_detected",
        "dashboard_actions"
      ];
      const match = allowed.includes(e);
      return { allowed: match, reason: match ? "Matched aix-os allowed event list" : "Event not in aix-os allowed list" };
    }

    return { allowed: false, reason: `Unknown application: ${a}` };
  }

  /**
   * Enqueues and delivers a notification in real-time.
   */
  public async enqueue(event: any): Promise<void> {
    const rawApp = event.application || "aix-os";
    const rawEventType = event.event_type || "unknown";
    const eventId = event.id;

    // EVENT RECEIVED Debug Log
    console.log(`EVENT RECEIVED:\napplication: ${rawApp}\nevent_type: ${rawEventType}\nevent_id: ${eventId}`);

    try {
      const app = this.normalizeApp(rawApp);
      const eventType = this.normalizeEventType(rawEventType);

      // Event Filtering
      const filter = this.isAllowedEvent(app, eventType);
      
      // FILTER RESULT Debug Log
      console.log(`FILTER RESULT:\nallowed: ${filter.allowed}\nreason: ${filter.reason}`);

      if (!filter.allowed) {
        return;
      }

      // Database-First Notification Log Creation
      const { error: insertError } = await supabaseAdmin
        .from("notification_delivery_log")
        .insert({
          event_id: eventId,
          application: app,
          event_type: eventType,
          telegram_status: "pending",
          attempts: 0,
          queued_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        // Unique constraint violation (code 23505) -> skip duplicate send
        if (insertError.code === "23505") {
          return;
        }
        throw new Error(`Failed to create delivery log: ${insertError.message}`);
      }

      // DELIVERY CREATED Debug Log
      console.log(`DELIVERY CREATED:\nevent_id: ${eventId}`);

      // Visitor Tracking
      let visitorStatus = "First Visit";
      try {
        const { count, error: countError } = await supabaseAdmin
          .from("aix_events")
          .select("id", { count: "exact", head: true })
          .eq("visitor_id", event.visitor_id)
          .neq("session_id", event.session_id);

        if (!countError && count && count > 0) {
          visitorStatus = "Returning Visitor";
        }
      } catch (e) {}

      // Intent Score Lookup
      let intentScore = "";
      try {
        const { data: profileData } = await supabaseAdmin
          .from("aix_visitor_knowledge")
          .select("profile")
          .eq("visitor_id", event.visitor_id)
          .maybeSingle();

        if (profileData?.profile) {
          const p = profileData.profile as any;
          const buyIntent = p.predictions?.intents?.buying_intent?.confidence || p.buying_intent || 0;
          const sellIntent = p.predictions?.intents?.selling_intent?.confidence || p.selling_intent || 0;
          const insIntent = p.predictions?.intents?.insurance_interest?.confidence || p.insurance_interest || 0;
          
          if (app === "home-find") {
            if (buyIntent > 0 || sellIntent > 0) {
              intentScore = `Buying: ${buyIntent}%, Selling: ${sellIntent}%`;
            }
          } else if (app === "insurance") {
            if (insIntent > 0) {
              intentScore = `${insIntent}%`;
            }
          } else {
            const max = Math.max(buyIntent, sellIntent, insIntent);
            if (max > 0) {
              intentScore = `${max}%`;
            }
          }
        }
      } catch (e) {}

      // Serialize and throttle Telegram deliveries
      this.sendPromiseChain = this.sendPromiseChain.then(async () => {
        // Enforce maximum 1 Telegram message per second (1000ms delay between calls)
        const now = Date.now();
        const elapsed = now - this.lastSendTime;
        if (elapsed < 1000) {
          await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
        }

        const formattedMessage = this.formatTelegramMessage(event, visitorStatus, intentScore);
        await this.sendTelegramNotification(eventId, formattedMessage, app, eventType);
        this.lastSendTime = Date.now();
      });

    } catch (error: any) {
      console.error("[AiX Telegram] Error in enqueue:", error.message);
    }
  }

  /**
   * Format the notification string exactly as requested.
   */
  private formatTelegramMessage(event: any, visitorStatus: string, intentScore: string): string {
    const app = this.normalizeApp(event.application || "aix-os");
    const action = this.normalizeEventType(event.event_type || "unknown");
    const visitor = event.visitor_id || "unknown";
    const session = event.session_id || "unknown";
    const page = event.page || "/";
    const timestamp = new Date(event.timestamp || event.created_at || Date.now()).toISOString();

    const payload = event.payload || {};
    const metadata = event.metadata || {};

    const detailsObj: Record<string, any> = {};
    if (payload.property_id || metadata.property_id) {
      detailsObj.property_id = payload.property_id || metadata.property_id;
    }
    if (payload.form_id || metadata.form_id) {
      detailsObj.form_id = payload.form_id || metadata.form_id;
    }

    Object.keys(payload).forEach((k) => {
      if (!["property_id", "form_id", "visitor_id", "session_id"].includes(k)) {
        detailsObj[k] = payload[k];
      }
    });

    Object.keys(metadata).forEach((k) => {
      if (!["property_id", "form_id", "visitor_id", "session_id", "governance_status", "governance_warnings", "governance_checked_at"].includes(k)) {
        detailsObj[k] = metadata[k];
      }
    });

    let detailsStr = "None";
    if (Object.keys(detailsObj).length > 0) {
      detailsStr = Object.entries(detailsObj)
        .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
        .join("\n");
    }

    let msg = `🚀 Visitor Action
Application:
${app}

Action:
${action}

Visitor:
${visitor} (${visitorStatus})

Session:
${session}

Time:
${timestamp}

Page:
${page}

Details:
${detailsStr}`;

    if (intentScore) {
      msg += `\n\nIntent Score:\n${intentScore}`;
    }

    return msg;
  }

  /**
   * Helper to invoke Telegram Bot API and update database.
   * Incorporates 429 retry-after handling.
   */
  private async sendTelegramNotification(eventId: string, message: string, app: string, eventType: string, currentAttempts = 0): Promise<boolean> {
    const nextAttempts = currentAttempts + 1;
    const { token, chat } = this.getBotCredentials();
    
    // TELEGRAM RETRY START / SEND START Log
    console.log(`TELEGRAM RETRY START:\nevent_id: ${eventId}`);
    // TELEGRAM REQUEST Debug Log
    console.log(`TELEGRAM REQUEST:\napplication: ${app}\nevent_type: ${eventType}`);

    if (!token || !chat) {
      const errMsg = "Telegram Bot credentials missing";
      await supabaseAdmin
        .from("notification_delivery_log")
        .update({
          telegram_status: "failed",
          attempts: nextAttempts,
          error: errMsg,
          last_attempt_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("event_id", eventId);
      
      console.log(`TELEGRAM RESPONSE:\nstatus: credentials_missing\nbody: ${errMsg}`);
      console.log("TELEGRAM FAILED", eventId, errMsg);
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chat,
          text: message
        })
      });

      let responseBody = await response.text();

      // Respect Telegram 429 retry_after response
      if (response.status === 429) {
        let retryAfterSec = 10; // fallback
        try {
          const parsed = JSON.parse(responseBody);
          if (parsed?.parameters?.retry_after) {
            retryAfterSec = Number(parsed.parameters.retry_after);
          }
        } catch (e) {}

        console.log(`TELEGRAM RATE LIMIT:\nretry_after: ${retryAfterSec}`);
        
        // Wait exactly that amount of seconds
        await new Promise((resolve) => setTimeout(resolve, retryAfterSec * 1000));

        // Update database with failed attempt state
        await supabaseAdmin
          .from("notification_delivery_log")
          .update({
            telegram_status: "failed",
            attempts: nextAttempts,
            error: `Rate limited: HTTP 429. Retrying after ${retryAfterSec}s`,
            last_attempt_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("event_id", eventId);

        // Perform immediate retry
        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chat,
            text: message
          })
        });
        responseBody = await response.text();
      }

      // TELEGRAM RESPONSE Debug Log
      console.log(`TELEGRAM RESPONSE:\nstatus: ${response.status}\nbody: ${responseBody}`);

      if (response.ok) {
        await supabaseAdmin
          .from("notification_delivery_log")
          .update({
            telegram_status: "sent",
            sent_at: new Date().toISOString(),
            error: null,
            last_attempt_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("event_id", eventId);
        
        console.log(`TELEGRAM DELIVERED:\nevent_id: ${eventId}`);
        return true;
      } else {
        throw new Error(`Telegram HTTP ${response.status}: ${responseBody}`);
      }
    } catch (err: any) {
      const errMsg = err.message || "Unknown error";
      await supabaseAdmin
        .from("notification_delivery_log")
        .update({
          telegram_status: "failed",
          attempts: nextAttempts,
          error: errMsg,
          last_attempt_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("event_id", eventId);
      console.log("TELEGRAM FAILED", eventId, errMsg);
      return false;
    }
  }

  /**
   * Retries maximum 5 failed notifications per request.
   */
  public async retryFailedNotifications(): Promise<void> {
    try {
      // Fetch oldest eligible failed notifications
      const { data: failedLogs, error: logsError } = await supabaseAdmin
        .from("notification_delivery_log")
        .select("*")
        .eq("telegram_status", "failed")
        .lt("attempts", 5)
        .order("created_at", { ascending: true })
        .limit(5);

      if (logsError || !failedLogs || failedLogs.length === 0) {
        return;
      }

      for (const log of failedLogs) {
        // Fetch corresponding event
        const { data: event, error: eventError } = await supabaseAdmin
          .from("aix_events")
          .select("*")
          .eq("id", log.event_id)
          .maybeSingle();

        if (eventError || !event) {
          continue;
        }

        // Determine visitor status and intent score
        let visitorStatus = "First Visit";
        try {
          const { count, error: countError } = await supabaseAdmin
            .from("aix_events")
            .select("id", { count: "exact", head: true })
            .eq("visitor_id", event.visitor_id)
            .neq("session_id", event.session_id);

          if (!countError && count && count > 0) {
            visitorStatus = "Returning Visitor";
          }
        } catch (e) {}

        let intentScore = "";
        try {
          const { data: profileData } = await supabaseAdmin
            .from("aix_visitor_knowledge")
            .select("profile")
            .eq("visitor_id", event.visitor_id)
            .maybeSingle();

          if (profileData?.profile) {
            const p = profileData.profile as any;
            const buyIntent = p.predictions?.intents?.buying_intent?.confidence || p.buying_intent || 0;
            const sellIntent = p.predictions?.intents?.selling_intent?.confidence || p.selling_intent || 0;
            const insIntent = p.predictions?.intents?.insurance_interest?.confidence || p.insurance_interest || 0;
            
            const app = this.normalizeApp(event.application);
            if (app === "home-find") {
              if (buyIntent > 0 || sellIntent > 0) {
                intentScore = `Buying: ${buyIntent}%, Selling: ${sellIntent}%`;
              }
            } else if (app === "insurance") {
              if (insIntent > 0) {
                intentScore = `${insIntent}%`;
              }
            } else {
              const max = Math.max(buyIntent, sellIntent, insIntent);
              if (max > 0) {
                intentScore = `${max}%`;
              }
            }
          }
        } catch (e) {}

        // Throttle and serialize retries through the same chain
        this.sendPromiseChain = this.sendPromiseChain.then(async () => {
          const now = Date.now();
          const elapsed = now - this.lastSendTime;
          if (elapsed < 1000) {
            await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
          }

          const formattedMessage = this.formatTelegramMessage(event, visitorStatus, intentScore);
          await this.sendTelegramNotification(event.id, formattedMessage, log.application, log.event_type, log.attempts);
          this.lastSendTime = Date.now();
        });
      }
    } catch (error: any) {
      console.error("[AiX Telegram] Error in retry:", error.message);
    }
  }

  // Backward compatibility methods for admin dashboard controls
  public getQueue(): QueueItem[] {
    return [];
  }

  public getStats(): QueueStats {
    return { total: 0, sent: 0, failed: 0, latency_ms: 0, last_notification_time: "" };
  }

  public clearFailedNotifications(): void {
    // Left as stub to prevent compilation issues
  }
}

export const notificationService = new TelegramNotificationService();
export const telegram = notificationService;
export default telegram;
