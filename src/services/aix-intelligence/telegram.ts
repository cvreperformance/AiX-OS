import { supabaseAdmin } from "@/lib/supabase/admin";
import { RealtimeConfigManager } from "./realtime/config";
import { NotificationConfigManager } from "./realtime/notification-config";
import { ApplicationRegistry } from "./connector/application-registry";
import { EventClassifier } from "./governance/classifier";

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
  "governance_warning",
  "unknown",
  "debug",
  "trace"
];

const BUSINESS_MAPPINGS: Record<string, Record<string, string>> = {
  "home-find": {
    "property_opened": "🏡 Property Opened",
    "property_view": "🏡 Property Opened",
    "property_viewed": "🏡 Property Opened",
    "search": "🔍 Property Search",
    "property_search": "🔍 Property Search",
    "property_filter_change": "🎯 Filter Applied",
    "property_contact_start": "📞 Contact Started",
    "property_contact_submit": "📞 Contact Submitted",
    "buyer_request": "🔥 Buyer Request",
    "seller_request": "🔥 Seller Request",
    "download_started": "📥 Guide Download",
    "guide_download": "📥 Guide Download",
    "ai_prompt_started": "🤖 AI Conversation Started",
    "ai_prompt_sent": "🤖 AI Question",
    "ai_prompt_received": "🤖 AI Response",
    "session_start": "👤 Session Started",
    "session_end": "👋 Visitor Left",
  },
  "insurance": {
    "insurance_quote_start": "🛡 Quote Started",
    "quote_started": "🛡 Quote Started",
    "insurance_quote_submit": "✅ Quote Submitted",
    "insurance_form_start": "📝 Form Started",
    "insurance_form_submit": "✅ Form Submitted",
    "insurance_form_abandon": "⚠ Form Abandoned",
    "form_abandoned": "⚠ Form Abandoned",
    "contact_request": "📞 Contact Request",
    "consultation_request": "📅 Consultation Request",
    "callback_request": "☎ Callback Request",
    "guide_download": "📥 Guide Download",
    "download_started": "📥 Guide Download",
    "ai_opened": "🤖 AI Conversation",
    "ai_prompt_started": "🤖 AI Conversation",
    "ai_prompt_sent": "🤖 AI Conversation",
    "ai_prompt_received": "🤖 AI Conversation",
    "session_start": "👤 Session Started",
    "session_end": "👋 Visitor Left",
  },
  "aix-os": {
    "ai_interactions": "🤖 AI Usage",
    "ai_interaction": "🤖 AI Usage",
    "ai_prompt_started": "🤖 AI Conversation Started",
    "ai_prompt_sent": "🤖 AI Question",
    "ai_prompt_received": "🤖 AI Response",
    "opportunity_detected": "🔥 Opportunity Detected",
    "high_intent_detected": "🔥 Opportunity Detected",
    "decision_generated": "🎯 Decision Generated",
    "decision_created": "🎯 Decision Generated",
    "learning_score_changed": "📈 Learning Updated",
    "learning_updated": "📈 Learning Updated",
    "learning_update": "📈 Learning Updated",
    "dashboard_opened": "📊 Dashboard Opened",
    "dashboard_action": "⚙ Dashboard Action",
    "dashboard_actions": "⚙ Dashboard Action",
    "knowledge_query": "🔍 Knowledge Query",
    "search_performed": "🔍 Search Performed",
    "contact_request": "📞 Contact Request",
    "session_start": "👤 Session Started",
    "session_end": "👋 Visitor Left",
  }
};

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
   * STEP 3: Mandatory Gatekeeper Function
   * Every message candidate must pass through shouldSendNotification() before entering
   * notification_delivery_log or reaching Telegram.
   */
  public shouldSendNotification(event: any, sessionEvents: any[] = []): { allowed: boolean; reason: string } {
    const app = this.normalizeApp(event.application || "aix-os");
    const eventType = this.normalizeEventType(event.event_type || "unknown");

    // 1. STEP 7: Hard Block List Check (Immediate Return)
    if (HARD_BLOCKLIST.includes(eventType)) {
      return { allowed: false, reason: "Hard blocklist event" };
    }

    const config = NotificationConfigManager.getConfig();
    const isBusinessMode = config.notification_mode !== "developer";

    // Developer Mode: allow all non-hard-blocklisted events
    if (!isBusinessMode) {
      return { allowed: true, reason: "Developer mode active" };
    }

    // 2. STEP 6: Business Mode Whitelists
    if (app === "home-find") {
      const whitelist = [
        "property_opened", "property_view", "property_viewed",
        "search", "property_search", "property_filter_change",
        "property_contact_start", "property_contact_submit",
        "buyer_request", "seller_request",
        "download_started", "guide_download",
        "ai_prompt_started", "ai_prompt_sent", "ai_prompt_received",
        "session_start", "session_end"
      ];
      if (whitelist.includes(eventType)) {
        return { allowed: true, reason: "Matched home-find business whitelist" };
      }
      if (eventType === "app_start") {
        const priorEvents = sessionEvents.filter(e => e.id !== event.id);
        if (priorEvents.length === 0) {
          return { allowed: true, reason: "First app_start in session" };
        }
        return { allowed: false, reason: "app_start not first in session" };
      }
      return { allowed: false, reason: "Event not in home-find business whitelist" };
    }

    if (app === "insurance") {
      const whitelist = [
        "insurance_quote_start", "quote_started", "insurance_quote_submit",
        "insurance_form_start", "insurance_form_submit", "insurance_form_abandon", "form_abandoned",
        "contact_request", "consultation_request", "callback_request",
        "guide_download", "download_started",
        "ai_opened", "ai_prompt_started", "ai_prompt_sent", "ai_prompt_received",
        "session_start", "session_end"
      ];
      if (whitelist.includes(eventType)) {
        return { allowed: true, reason: "Matched insurance business whitelist" };
      }
      if (eventType === "app_start") {
        const priorEvents = sessionEvents.filter(e => e.id !== event.id);
        if (priorEvents.length === 0) {
          return { allowed: true, reason: "First app_start in session" };
        }
        return { allowed: false, reason: "app_start not first in session" };
      }
      return { allowed: false, reason: "Event not in insurance business whitelist" };
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
        return { allowed: true, reason: "Matched aix-os business whitelist" };
      }
      if (eventType === "app_start") {
        const priorEvents = sessionEvents.filter(e => e.id !== event.id);
        if (priorEvents.length === 0) {
          return { allowed: true, reason: "First app_start in session" };
        }
        return { allowed: false, reason: "app_start not first in session" };
      }
      return { allowed: false, reason: "Event not in aix-os business whitelist" };
    }

    return { allowed: false, reason: `Unknown application: ${app}` };
  }

  /**
   * Enqueues and delivers a notification in real-time.
   */
  public async enqueue(event: any): Promise<void> {
    const app = this.normalizeApp(event.application || "aix-os");
    const eventType = this.normalizeEventType(event.event_type || "unknown");
    const eventId = event.id || Math.random().toString(36).substring(2, 15);

    // STEP 8: Diagnostic Chain Logging - PIPELINE ENTRY
    console.log(`PIPELINE ENTRY
application: ${app}
event: ${eventType}`);

    const config = NotificationConfigManager.getConfig();
    const mode = config.notification_mode || "business";
    console.log(`BUSINESS MODE
mode: ${mode}`);

    // Fetch prior session events to check entry conditions if needed
    let sessionEvents: any[] = [];
    try {
      if (event.session_id) {
        const { data: sEvts } = await supabaseAdmin
          .from("aix_events")
          .select("*")
          .eq("session_id", event.session_id)
          .order("timestamp", { ascending: true });
        if (sEvts) sessionEvents = sEvts;
      }
    } catch (e) {}

    // STEP 3 & 7: Mandatory Filter Gatekeeper
    const filterResult = this.shouldSendNotification(event, sessionEvents);
    console.log(`FILTER RESULT
allowed: ${filterResult.allowed}
reason: ${filterResult.reason}`);

    if (!filterResult.allowed) {
      console.log(`BLOCKED EVENT
application: ${app}
event: ${eventType}
reason: ${filterResult.reason}`);
      return; // STOP: No DB insert, no formatting, no Telegram call
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
      if (insertError.code === "23505") return; // Duplicate check
      throw new Error(`Failed to create delivery log: ${insertError.message}`);
    }

    console.log(`DELIVERY CREATED
event_id: ${eventId}`);

    // Visitor Tracking
    let visitorStatus = "First Visit";
    try {
      if (event.visitor_id) {
        const { count, error: countError } = await supabaseAdmin
          .from("aix_events")
          .select("session_id", { count: "exact", head: true })
          .eq("visitor_id", event.visitor_id)
          .neq("session_id", event.session_id);

        if (!countError && count && count > 0) {
          visitorStatus = "Returning Visitor";
        }
      }
    } catch (e) {}

    // Profile & Intent Lookup
    let intentScore = "";
    let profile: any = null;
    let buyIntent = 0;
    let sellIntent = 0;
    let insIntent = 0;
    let luxuryScore = 0;
    let opportunityScore = 0;

    try {
      if (event.visitor_id) {
        const { data: profileData } = await supabaseAdmin
          .from("aix_visitor_knowledge")
          .select("profile")
          .eq("visitor_id", event.visitor_id)
          .maybeSingle();

        if (profileData?.profile) {
          profile = profileData.profile as any;
          buyIntent = profile.learning?.adaptiveScores?.buyingIntent || profile.predictions?.intents?.buying_intent?.confidence || profile.buying_intent || 0;
          sellIntent = profile.learning?.adaptiveScores?.sellingIntent || profile.predictions?.intents?.selling_intent?.confidence || profile.selling_intent || 0;
          insIntent = profile.learning?.adaptiveScores?.insuranceIntent || profile.predictions?.intents?.insurance_interest?.confidence || profile.insurance_interest || 0;
          luxuryScore = profile.learning?.adaptiveScores?.luxuryPreference || (profile.luxury_preference ? 85 : 0);
          opportunityScore = profile.decisions?.opportunityRank || 0;
          
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
      }
    } catch (e) {}

    // Throttle & Queue Execution
    this.sendPromiseChain = this.sendPromiseChain.then(async () => {
      const now = Date.now();
      const elapsed = now - this.lastSendTime;
      if (elapsed < 1000) {
        await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
      }

      const formattedMessage = this.formatTelegramMessage(event, visitorStatus, intentScore, sessionEvents, profile);
      await this.sendTelegramNotification(eventId, formattedMessage, app, eventType, 0);
      this.lastSendTime = Date.now();
    });
  }

  private formatTelegramMessage(
    event: any,
    visitorStatus: string,
    intentScore: string,
    sessionEvents: any[] = [],
    profile: any = null
  ): string {
    const config = NotificationConfigManager.getConfig();
    const isBusinessMode = config.notification_mode !== "developer";

    const app = this.normalizeApp(event.application || "aix-os");
    const eventType = this.normalizeEventType(event.event_type || "unknown");
    const visitor = event.visitor_id || "unknown";
    const session = event.session_id || "unknown";
    const page = event.page || "/";
    const timestamp = new Date(event.timestamp || event.created_at || Date.now()).toISOString();

    const payload = event.payload || {};
    const metadata = event.metadata || {};

    if (!isBusinessMode) {
      // Developer Mode raw format
      let detailsStr = "None";
      const detailsObj: Record<string, any> = { ...payload, ...metadata };
      if (Object.keys(detailsObj).length > 0) {
        detailsStr = Object.entries(detailsObj)
          .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
          .join("\n");
      }

      return `🚀 Visitor Action
Application:
${app}

Action:
${eventType}

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
    }

    // Business Mode Formatting
    const appLabel = app === "home-find" ? "Home Find" : app === "insurance" ? "Insurance" : "AiX OS";
    const isReturning = visitorStatus === "Returning Visitor";
    const hh_mm = new Date(event.timestamp || event.created_at || Date.now()).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    const mappedAction = BUSINESS_MAPPINGS[app]?.[eventType] || eventType;

    if (eventType === "session_start" || eventType === "app_start") {
      return `👤 ${isReturning ? "Returning Visitor" : "New Visitor"}

Application:
${appLabel}

Time:
${hh_mm}

Page:
${page}

Visitor:
${isReturning ? "Returning" : "First Visit"}${event.country ? `\n\nCountry:\n${event.country}` : ""}`;
    }

    if (mappedAction === "🏡 Property Opened") {
      const name = payload.property_title || metadata.property_title || payload.title || metadata.title || "Unknown Property";
      const price = payload.price || metadata.price || "Unknown Price";
      return `🏡 Property Opened

Application:
${appLabel}

Property:
${name}

Price:
${price}

Visitor:
${isReturning ? "Returning" : "First Visit"}`;
    }

    if (["📞 Contact Request", "📞 Contact Started", "📞 Contact Submitted", "✅ Quote Submitted", "🛡 Quote Started"].includes(mappedAction)) {
      const name = payload.name || payload.service || metadata.service || payload.property_title || metadata.property_title || "Inquiry";
      const phone = payload.phone || "N/A";
      const email = payload.email || "N/A";
      const message = payload.message || "None";
      return `${mappedAction}

Application:
${appLabel}

Name:
${name}

Contact:
Phone: ${phone} | Email: ${email}

Message:
${message}

Visitor:
${isReturning ? "Returning" : "First Visit"}`;
    }

    if (["🤖 AI Conversation Started", "🤖 AI Question", "🤖 AI Response", "🤖 AI Conversation", "🤖 AI Usage"].includes(mappedAction)) {
      const question = payload.message || metadata.message || payload.prompt || metadata.prompt || payload.question || metadata.question || "AI conversation active";
      return `🤖 AI Conversation

Application:
${appLabel}

Question/Input:
${question}

Page:
${page}`;
    }

    if (mappedAction === "👋 Visitor Left") {
      return `👋 Visitor Left

Application:
${appLabel}

Visitor:
${isReturning ? "Returning" : "First Visit"}

Page:
${page}`;
    }

    // Default business action
    return `${mappedAction}

Application:
${appLabel}

Page:
${page}

Visitor:
${isReturning ? "Returning" : "First Visit"}`;
  }

  /**
   * STEP 2: The ONE and ONLY function in the repository that calls api.telegram.org
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

      console.log(`TELEGRAM RESPONSE
status: credentials_missing
body: ${errMsg}`);
      return false;
    }

    try {
      // STEP 8: Diagnostic Chain Logging
      console.log(`TELEGRAM REQUEST
event_id: ${eventId}
application: ${application}
event_type: ${eventType}`);

      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chat,
          text: message
        })
      });

      console.log(`TELEGRAM RESPONSE
status: ${response.status}`);

      let responseBody = await response.text();

      // Rate limit retry
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
        console.log(`DELIVERED
event_id: ${eventId}`);

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
   * STEP 4: Immutable Retry Logic
   * Evaluates shouldSendNotification() before any retry attempt.
   * Updates blocked events to telegram_status='cancelled' and error='filtered_business_mode'.
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

        // STEP 4: Mandatory Retry Filter Check
        const filterCheck = this.shouldSendNotification(event);
        console.log(`RETRY EVENT
event_id: ${log.event_id}
application: ${log.application}
event_type: ${log.event_type}
allowed: ${filterCheck.allowed}
reason: ${filterCheck.reason}`);

        if (!filterCheck.allowed) {
          // Cancel blocked retries in DB and stop
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

        // Allowed retry
        this.sendPromiseChain = this.sendPromiseChain.then(async () => {
          const now = Date.now();
          const elapsed = now - this.lastSendTime;
          if (elapsed < 1000) {
            await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
          }

          const formattedMessage = this.formatTelegramMessage(event, "Returning Visitor", "", [], null);
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
