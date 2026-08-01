import { supabaseAdmin } from "@/lib/supabase/admin";
import { NotificationConfigManager } from "./realtime/notification-config";
import { VisitorIntelligenceEngine } from "./visitor-intelligence";

export interface QueueItem {
  id: string;
  event: any;
  status: "pending" | "sent" | "failed" | "retrying" | "cancelled";
  retry_count: number;
  created_at: string;
  sent_at?: string;
  last_error?: string;
  formatted_message?: string;
}

export interface QueueStats {
  total: number;
  sent: number;
  failed: number;
  latency_ms: number;
  last_notification_time: string;
}

export interface FilterResult {
  allowed: boolean;
  reason: string;
  template: "business" | "developer" | "lead";
}

const HARD_BLOCKLIST = [
  "page_view",
  "page_leave",
  "session_start",
  "session_end",
  "scroll_milestone",
  "scroll",
  "mouse_move",
  "click_tracking",
  "route_change",
  "heartbeat",
  "performance_metric",
  "sdk_health",
  "debug_event",
  "governance_warning",
  "form_submitted",
  "form_started",
  "form_viewed",
  "anonymous_form"
];

export class TelegramFormatter {
  public static format(intelligence: any): string {
    const { metrics, intent, leadTemperature, journey, recommendation, estimatedLeadValue } = intelligence;
    const appName = metrics.application === "home-find" ? "Home Find" : metrics.application === "insurance" ? "Insurance" : "AiX OS";
    const categoryLabel = intent.category.toUpperCase();
    const intentScore = `${intent.score}%`;
    const leadTemp = leadTemperature || "";
    const journeySummary = journey.formattedJourney.split("\n").slice(0, 2).join(" ");
    const estimatedValue = estimatedLeadValue ? `\nEstimated Lead Value: ${estimatedLeadValue}` : "";

    // Executive CRM Template
    return `
🔥 ${leadTemp} ${categoryLabel}

Application: ${appName}
Intent Score: ${intentScore}
Lead Temperature: ${leadTemp}
Journey: ${journeySummary}${estimatedValue}
Recommendation: ${recommendation.action}`.trim();
  }
}

export class TelegramNotificationService {
  private botToken: string | null = null;
  private chatId: string | null = null;
  private lastSendTime = 0;
  private sendPromiseChain: Promise<any> = Promise.resolve();

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || null;
    this.chatId = process.env.TELEGRAM_CHAT_ID || null;
  }

  private getBotCredentials() {
    const token = this.botToken || process.env.TELEGRAM_BOT_TOKEN || null;
    const chat = this.chatId || process.env.TELEGRAM_CHAT_ID || null;
    return { token, chat };
  }

  private normalizeApp(app: string): string {
    return (app || "").toLowerCase().trim().replace(/[ _]/g, "-");
  }

  private normalizeEventType(eventType: string): string {
    return (eventType || "").toLowerCase().trim().replace(/[ -]/g, "_");
  }

  /**
   * Central Decision Engine Gatekeeper
   */
public shouldSendNotification(event: any, sessionEvents: any[] = []): FilterResult {
  const app = this.normalizeApp(event.application || "aix-os");
  const eventType = this.normalizeEventType(event.event_type || "unknown");

  const businessWhitelists: Record<string, string[]> = {
    "home-find": [
      "property_contact_submit",
      "buyer_request",
      "seller_request",
      "guide_download"
    ],
    "insurance": [
      "insurance_quote_submit",
      "callback_request",
      "consultation_request",
      "contact_request"
    ],
    "aix-os": [
      "ai_prompt_sent",
      "ai_response_received"
    ]
  };

  const whitelist = businessWhitelists[app] ?? [];

  if (whitelist.includes(eventType)) {
    const isLeadEvent = [
      "property_contact_submit",
      "buyer_request",
      "seller_request",
      "guide_download",
      "insurance_quote_submit",
      "callback_request",
      "consultation_request",
      "contact_request",
      "ai_prompt_sent",
      "ai_response_received"
    ].includes(eventType);
    return {
      allowed: true,
      reason: "business_event_allowed",
      template: isLeadEvent ? "lead" : "business"
    };
  }

  return { allowed: false, reason: "non_business_event_blocked", template: "business" };
}

  /**
   * STEP 7: Presentation Orchestration Flow
   */
  public async enqueue(event: any): Promise<void> {
    const app = this.normalizeApp(event.application || "aix-os");
    const eventType = this.normalizeEventType(event.event_type || "unknown");
    const eventId = event.id || Math.random().toString(36).substring(2, 15);

    console.log(`PIPELINE ENTRY\napplication: ${app}\nevent: ${eventType}`);

    const config = NotificationConfigManager.getConfig();
    const mode = config.notification_mode || "business";
    console.log(`BUSINESS MODE\nmode: ${mode}`);

    // Load full session history for intelligence evaluation
    let sessionEvents: any[] = [event];
    try {
      if (event.session_id) {
        const { data: sEvts } = await supabaseAdmin
          .from("aix_events")
          .select("*")
          .eq("session_id", event.session_id)
          .order("timestamp", { ascending: true });
        if (sEvts && sEvts.length > 0) sessionEvents = sEvts;
      }
    } catch (e) {}

    // 1. Central Filter Gatekeeper
    const filterResult = this.shouldSendNotification(event, sessionEvents);
    console.log(`FILTER RESULT\nallowed: ${filterResult.allowed}\nreason: ${filterResult.reason}`);

    if (!filterResult.allowed) {
      console.log(`BLOCKED EVENT\napplication: ${app}\nevent: ${eventType}\nreason: ${filterResult.reason}`);
      return;
    }

    // 2. Visitor Status Verification
    let isReturning = false;
    try {
      if (event.visitor_id) {
        const { count } = await supabaseAdmin
          .from("aix_events")
          .select("session_id", { count: "exact", head: true })
          .eq("visitor_id", event.visitor_id)
          .neq("session_id", event.session_id);
        if (count && count > 0) isReturning = true;
      }
    } catch (e) {}

    // 3. Evaluate Visitor Intelligence Engine Profile (STEP 9)
    const intelligence = VisitorIntelligenceEngine.evaluate(sessionEvents, event.visitor_id, isReturning);

    // 4. Multi-Channel Deduplication Check (STEP 5)
    const isDup = await VisitorIntelligenceEngine.isDuplicate(event.visitor_id, event.session_id, intelligence.intent.category);
    if (isDup) {
      console.log(`BLOCKED EVENT\napplication: ${app}\nevent: ${eventType}\nreason: Deduplicated session alert`);
      return;
    }

    // Database Log Insertion (Allowed Events Only)
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
      if (insertError.code === "23505") return;
      throw new Error(`Failed to create delivery log: ${insertError.message}`);
    }

    console.log(`DELIVERY CREATED\nevent_id: ${eventId}`);

    // 5. Format Executive Presentation Output (STEP 6)
    const formattedMessage = VisitorIntelligenceEngine.formatTelegram(intelligence);

    // 6. Enqueue Telegram Transport Delivery
    this.sendPromiseChain = this.sendPromiseChain.then(async () => {
      const now = Date.now();
      const elapsed = now - this.lastSendTime;
      if (elapsed < 1000) {
        await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
      }

      await this.sendTelegramNotification(eventId, formattedMessage, app, eventType, 0);
      this.lastSendTime = Date.now();
    });
  }

  /**
   * The ONE and ONLY PRIVATE function in the repository calling api.telegram.org
   */
  private async sendTelegramNotification(
    eventId: string,
    message: string,
    application: string,
    eventType: string,
    attempts: number = 0
  ): Promise<boolean> {
    const { token, chat } = this.getBotCredentials();
    const nextAttempts = attempts + 1;

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

      console.log(`TELEGRAM RESPONSE\nstatus: credentials_missing\nbody: ${errMsg}`);
      return false;
    }

    try {
      console.log(`TELEGRAM REQUEST\nevent_id: ${eventId}\napplication: ${application}\nevent_type: ${eventType}`);

      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chat,
          text: message
        })
      });

      console.log(`TELEGRAM RESPONSE\nstatus: ${response.status}`);

      let responseBody = await response.text();

      if (response.status === 429) {
        let retryAfterSec = 10;
        try {
          const parsed = JSON.parse(responseBody);
          if (parsed?.parameters?.retry_after) {
            retryAfterSec = Number(parsed.parameters.retry_after);
          }
        } catch (e) {}

        await new Promise((resolve) => setTimeout(resolve, retryAfterSec * 1000));

        response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chat, text: message })
        });
        responseBody = await response.text();
      }

      if (response.ok) {
        console.log(`DELIVERED\nevent_id: ${eventId}`);

        await supabaseAdmin
          .from("notification_delivery_log")
          .update({
            telegram_status: "sent",
            attempts: nextAttempts,
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            error: null
          })
          .eq("event_id", eventId);

        return true;
      } else {
        await supabaseAdmin
          .from("notification_delivery_log")
          .update({
            telegram_status: "failed",
            attempts: nextAttempts,
            error: `HTTP ${response.status}: ${responseBody}`,
            last_attempt_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq("event_id", eventId);

        return false;
      }
    } catch (error: any) {
      await supabaseAdmin
        .from("notification_delivery_log")
        .update({
          telegram_status: "failed",
          attempts: nextAttempts,
          error: error.message,
          last_attempt_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("event_id", eventId);

      return false;
    }
  }

  /**
   * Immutable Retry Logic
   */
  public async retryFailedNotifications(): Promise<void> {
    try {
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
        const { data: event } = await supabaseAdmin
          .from("aix_events")
          .select("*")
          .eq("id", log.event_id)
          .maybeSingle();

        if (!event) continue;

        const filterCheck = this.shouldSendNotification(event);
        // Debug diagnostics for retry path
        if (!filterCheck.allowed && filterCheck.reason === "technical_event_blocked") {
          console.debug("Blocked technical retry", {
            event_type: event.event_type,
            reason: filterCheck.reason
          });
        }
        console.log(`RETRY EVENT\nevent_id: ${log.event_id}\napplication: ${log.application}\nevent_type: ${log.event_type}\nallowed: ${filterCheck.allowed}\nreason: ${filterCheck.reason}`);

        if (!filterCheck.allowed) {
          await supabaseAdmin
            .from("notification_delivery_log")
            .update({
              telegram_status: "cancelled",
              error: "filtered_business_mode",
              updated_at: new Date().toISOString()
            })
            .eq("event_id", log.event_id);
          continue;
        }

        this.sendPromiseChain = this.sendPromiseChain.then(async () => {
          const now = Date.now();
          const elapsed = now - this.lastSendTime;
          if (elapsed < 1000) {
            await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
          }

          const intelligence = VisitorIntelligenceEngine.evaluate([event], event.visitor_id, true);
          const formattedMessage = VisitorIntelligenceEngine.formatTelegram(intelligence);
          await this.sendTelegramNotification(event.id, formattedMessage, log.application, log.event_type, log.attempts);
          this.lastSendTime = Date.now();
        });
      }
    } catch (error: any) {
      console.error("[AiX Telegram] Error in retry:", error.message);
    }
  }

  public getQueue(): QueueItem[] {
    return [];
  }

  public getStats(): QueueStats {
    return { total: 0, sent: 0, failed: 0, latency_ms: 0, last_notification_time: "" };
  }

  public clearFailedNotifications(): void {
    // Stub
  }
}

export const notificationService = new TelegramNotificationService();
export const telegram = notificationService;
export default notificationService;
