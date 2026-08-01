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
  "route_change",
  "internal_navigation",
  "heartbeat",
  "scroll_depth",
  "scroll_milestone",
  "sdk_initialized",
  "component_loaded",
  "performance_metric",
  "performance",
  "navigation",
  "visibility_change",
  "focus",
  "blur",
  "resize",
  "mouse_move",
  "mousemove",
  "debug",
  "trace",
  "unknown",
  "governance_warning"
];

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

    // Extended Hard Blocklist Check (Immediate Return)
    if (HARD_BLOCKLIST.includes(eventType)) {
      return { allowed: false, reason: "Hard blocklist event", template: "business" };
    }

    const config = NotificationConfigManager.getConfig();
    const isBusinessMode = config.notification_mode !== "developer";
    const isLeadEvent = ["contact_request", "property_contact_submit", "insurance_quote_submit", "buyer_request", "seller_request", "callback_request"].includes(eventType);

    if (!isBusinessMode) {
      return {
        allowed: true,
        reason: "Developer mode active",
        template: isLeadEvent ? "lead" : "developer"
      };
    }

    // Business Mode Whitelists
    if (app === "home-find") {
      const whitelist = [
        "property_opened", "property_view", "property_viewed",
        "property_contact_start", "property_contact_submit",
        "buyer_request", "seller_request",
        "search", "property_search", "property_filter_change",
        "download_started", "guide_download",
        "ai_prompt_started", "ai_prompt_sent", "ai_prompt_received",
        "session_start", "session_end"
      ];
      if (whitelist.includes(eventType)) {
        return {
          allowed: true,
          reason: "Matched home-find business whitelist",
          template: isLeadEvent ? "lead" : "business"
        };
      }
      if (eventType === "app_start") {
        const priorEvents = sessionEvents.filter(e => e.id !== event.id);
        if (priorEvents.length === 0) {
          return { allowed: true, reason: "First app_start in session", template: "business" };
        }
        return { allowed: false, reason: "app_start not first in session", template: "business" };
      }
      return { allowed: false, reason: "Event not in home-find business whitelist", template: "business" };
    }

    if (app === "insurance") {
      const whitelist = [
        "insurance_quote_start", "quote_started", "insurance_quote_submit",
        "insurance_form_start", "insurance_form_submit", "insurance_form_abandon", "form_abandoned",
        "callback_request", "contact_request", "consultation_request",
        "guide_download", "download_started",
        "ai_opened", "ai_prompt_started", "ai_prompt_sent", "ai_prompt_received",
        "session_start", "session_end"
      ];
      if (whitelist.includes(eventType)) {
        return {
          allowed: true,
          reason: "Matched insurance business whitelist",
          template: isLeadEvent ? "lead" : "business"
        };
      }
      if (eventType === "app_start") {
        const priorEvents = sessionEvents.filter(e => e.id !== event.id);
        if (priorEvents.length === 0) {
          return { allowed: true, reason: "First app_start in session", template: "business" };
        }
        return { allowed: false, reason: "app_start not first in session", template: "business" };
      }
      return { allowed: false, reason: "Event not in insurance business whitelist", template: "business" };
    }

    if (app === "aix-os") {
      const whitelist = [
        "ai_interaction", "ai_interactions", "ai_prompt_started", "ai_prompt_sent", "ai_prompt_received",
        "decision_generated", "decision_created", "decision_updated",
        "learning_score_changed", "learning_updated", "learning_update",
        "opportunity_detected", "high_intent_detected",
        "dashboard_action", "dashboard_actions", "knowledge_query", "contact_request",
        "session_start", "session_end"
      ];
      if (whitelist.includes(eventType)) {
        return {
          allowed: true,
          reason: "Matched aix-os business whitelist",
          template: isLeadEvent ? "lead" : "business"
        };
      }
      if (eventType === "app_start") {
        const priorEvents = sessionEvents.filter(e => e.id !== event.id);
        if (priorEvents.length === 0) {
          return { allowed: true, reason: "First app_start in session", template: "business" };
        }
        return { allowed: false, reason: "app_start not first in session", template: "business" };
      }
      return { allowed: false, reason: "Event not in aix-os business whitelist", template: "business" };
    }

    return { allowed: false, reason: `Unknown application: ${app}`, template: "business" };
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
