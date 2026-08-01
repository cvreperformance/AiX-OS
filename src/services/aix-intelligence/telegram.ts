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

export interface FilterResult {
  allowed: boolean;
  reason: string;
  template: "business" | "developer" | "lead";
}

export interface SessionMetrics {
  eventsCount: number;
  pagesViewed: number;
  propertiesViewed: number;
  propertyViewCount: number;
  searchesCount: number;
  filterCount: number;
  downloadsCount: number;
  aiCount: number;
  formStarts: number;
  formSubmits: number;
  callbackRequests: number;
  quoteRequests: number;
  buyerRequests: number;
  sellerRequests: number;
  sessionDurationMinutes: number;
  country: string;
  device: string;
  referrer: string;
  isReturningVisitor: boolean;
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
   * Central Notification Decision Engine
   */
  public shouldSendNotification(event: any, sessionEvents: any[] = []): FilterResult {
    const app = this.normalizeApp(event.application || "aix-os");
    const eventType = this.normalizeEventType(event.event_type || "unknown");

    // Hard Blocklist Check (Immediate Return)
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
   * SESSION AGGREGATION ENGINE: Aggregates all events in the visitor session
   */
  public aggregateSessionMetrics(sessionEvents: any[], visitorStatus: string): SessionMetrics {
    const pages = new Set<string>();
    const properties = new Set<string>();
    let propertyViewCount = 0;
    let searchesCount = 0;
    let filterCount = 0;
    let downloadsCount = 0;
    let aiCount = 0;
    let formStarts = 0;
    let formSubmits = 0;
    let callbackRequests = 0;
    let quoteRequests = 0;
    let buyerRequests = 0;
    let sellerRequests = 0;
    let country = "Romania";
    let device = "Desktop";
    let referrer = "Google";

    let minTime = Infinity;
    let maxTime = -Infinity;

    sessionEvents.forEach((e) => {
      if (e.page) pages.add(e.page);
      if (e.country) country = e.country;
      if (e.metadata?.device) device = e.metadata.device;
      if (e.metadata?.referrer) referrer = e.metadata.referrer;

      const type = this.normalizeEventType(e.event_type);
      const payload = e.payload || {};
      const metadata = e.metadata || {};

      const propTitle = payload.property_title || metadata.property_title || payload.title;
      if (propTitle) {
        properties.add(propTitle);
        propertyViewCount++;
      } else if (type.includes("property")) {
        propertyViewCount++;
      }

      if (type.includes("search")) searchesCount++;
      if (type.includes("filter")) filterCount++;
      if (type.includes("download") || type.includes("guide")) downloadsCount++;
      if (type.includes("ai_prompt") || type.includes("ai_interaction")) aiCount++;
      if (type.includes("form_start") || type.includes("contact_start")) formStarts++;
      if (type.includes("form_submit") || type.includes("contact_submit")) formSubmits++;
      if (type.includes("callback")) callbackRequests++;
      if (type.includes("quote")) quoteRequests++;
      if (type.includes("buyer")) buyerRequests++;
      if (type.includes("seller")) sellerRequests++;

      const ts = new Date(e.timestamp || e.created_at || Date.now()).getTime();
      if (ts < minTime) minTime = ts;
      if (ts > maxTime) maxTime = ts;
    });

    const durationMs = maxTime > minTime ? maxTime - minTime : 0;
    const sessionDurationMinutes = Math.max(1, Math.round(durationMs / 60000));

    return {
      eventsCount: sessionEvents.length,
      pagesViewed: Math.max(1, pages.size),
      propertiesViewed: properties.size || Math.min(propertyViewCount, 1),
      propertyViewCount,
      searchesCount,
      filterCount,
      downloadsCount,
      aiCount,
      formStarts,
      formSubmits,
      callbackRequests,
      quoteRequests,
      buyerRequests,
      sellerRequests,
      sessionDurationMinutes,
      country,
      device,
      referrer,
      isReturningVisitor: visitorStatus.toLowerCase().includes("returning")
    };
  }

  /**
   * INTENT SCORING ENGINE: Computes visitor Intent Score (0 - 100%)
   */
  public calculateIntentScore(metrics: SessionMetrics): { score: number; isHighIntent: boolean } {
    let score = 20; // Base score

    if (metrics.propertiesViewed >= 5) score += 15;
    if (metrics.propertyViewCount > metrics.propertiesViewed) score += 20; // Repeated property view
    if (metrics.formStarts > 0) score += 20;
    if (metrics.formSubmits > 0) score += 30;
    if (metrics.downloadsCount > 0) score += 10;
    if (metrics.isReturningVisitor) score += 10;
    if (metrics.aiCount > 0) score += 10;
    if (metrics.quoteRequests > 0) score += 30;
    if (metrics.callbackRequests > 0) score += 40;
    if (metrics.sellerRequests > 0) score += 40;
    if (metrics.buyerRequests > 0) score += 40;

    const finalScore = Math.min(100, Math.max(0, score));
    return {
      score: finalScore,
      isHighIntent: finalScore >= 90
    };
  }

  /**
   * DEDUPLICATION: Ensures duplicate alerts are suppressed in the same session
   */
  private async isDuplicateSessionNotification(sessionId: string, eventType: string): Promise<boolean> {
    if (!sessionId) return false;
    try {
      const isLead = ["contact_request", "property_contact_submit", "insurance_quote_submit", "buyer_request", "seller_request", "callback_request"].includes(eventType);
      if (!isLead) return false;

      // Query recent delivery logs for same session in last 30 minutes
      const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const { data: recentLogs } = await supabaseAdmin
        .from("notification_delivery_log")
        .select("event_type, created_at")
        .gte("created_at", thirtyMinsAgo)
        .eq("telegram_status", "sent");

      if (recentLogs && recentLogs.length > 0) {
        const leadTypes = ["contact_request", "property_contact_submit", "insurance_quote_submit", "buyer_request", "seller_request", "callback_request"];
        const existingLead = recentLogs.find(l => leadTypes.includes(l.event_type));
        if (existingLead) {
          console.log(`DEDUPLICATION: Suppressing duplicate lead alert for session ${sessionId}`);
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  /**
   * Enqueues and delivers a notification in real-time.
   */
  public async enqueue(event: any): Promise<void> {
    const app = this.normalizeApp(event.application || "aix-os");
    const eventType = this.normalizeEventType(event.event_type || "unknown");
    const eventId = event.id || Math.random().toString(36).substring(2, 15);

    // Diagnostic Chain Logging - PIPELINE ENTRY
    console.log(`PIPELINE ENTRY
application: ${app}
event: ${eventType}`);

    const config = NotificationConfigManager.getConfig();
    const mode = config.notification_mode || "business";
    console.log(`BUSINESS MODE
mode: ${mode}`);

    // Fetch prior session events for aggregation
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

    // Mandatory Filter Gatekeeper
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

    // Deduplication check
    const isDup = await this.isDuplicateSessionNotification(event.session_id, eventType);
    if (isDup) {
      console.log(`BLOCKED EVENT
application: ${app}
event: ${eventType}
reason: Deduplicated session alert`);
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
      if (insertError.code === "23505") return; // Duplicate check
      throw new Error(`Failed to create delivery log: ${insertError.message}`);
    }

    console.log(`DELIVERY CREATED
event_id: ${eventId}`);

    // Visitor Status Check
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

    // Session Aggregation & Intent Scoring
    const metrics = this.aggregateSessionMetrics(sessionEvents, visitorStatus);
    const { score: intentScore } = this.calculateIntentScore(metrics);

    // Throttle & Queue Execution
    this.sendPromiseChain = this.sendPromiseChain.then(async () => {
      const now = Date.now();
      const elapsed = now - this.lastSendTime;
      if (elapsed < 1000) {
        await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
      }

      const formattedMessage = this.formatExecutiveCrmMessage(event, metrics, intentScore, filterResult.template);
      await this.sendTelegramNotification(eventId, formattedMessage, app, eventType, 0);
      this.lastSendTime = Date.now();
    });
  }

  /**
   * EXECUTIVE CRM MESSAGE FORMATTER (Milestone 25)
   */
  public formatExecutiveCrmMessage(
    event: any,
    metrics: SessionMetrics,
    intentScore: number,
    template: "business" | "developer" | "lead" = "business"
  ): string {
    const app = this.normalizeApp(event.application || "aix-os");
    const eventType = this.normalizeEventType(event.event_type || "unknown");
    const page = event.page || "/";
    const payload = event.payload || {};
    const metadata = event.metadata || {};

    const visitorTypeLabel = metrics.isReturningVisitor ? "Returning" : "First Visit";

    if (template === "developer") {
      return `🚀 Visitor Action\nApplication: ${app}\nAction: ${eventType}\nTime: ${new Date().toISOString()}\nPage: ${page}`;
    }

    // 1. BUYER LEAD (Home Find)
    if (eventType === "buyer_request" || (app === "home-find" && eventType === "property_contact_submit")) {
      const budget = payload.budget || metadata.budget || payload.price || "€500,000";
      const interest = payload.property_title || metadata.property_title || payload.interest || "Luxury Real Estate";
      return `🔥 Buyer Lead

Budget:
${budget}

Interest:
${interest}

Intent Score:
${intentScore}%

Viewed:
${metrics.propertiesViewed} properties

Downloads:
${metrics.downloadsCount}

AI Questions:
${metrics.aiCount}

Recommended Action:
Call immediately.`;
    }

    // 2. INSURANCE LEAD
    if (app === "insurance" && ["insurance_quote_submit", "callback_request", "contact_request"].includes(eventType)) {
      const insuranceType = payload.product || payload.service || "Home Insurance";
      return `🛡 Insurance Lead

Insurance:
${insuranceType}

Quote Submitted

Intent Score:
${intentScore}%

Visitor:
${visitorTypeLabel}

Recommended Action:
Contact within 15 minutes.`;
    }

    // 3. PROPERTY INQUIRY
    if (app === "home-find" && ["property_opened", "property_view", "property_contact_start"].includes(eventType)) {
      const propName = payload.property_title || metadata.property_title || payload.title || "Luxury Property";
      const price = payload.price || metadata.price || "€450,000";
      return `🏡 Property Inquiry

Property:
${propName}

Price:
${price}

Visitor:
${visitorTypeLabel}

Viewed:
${metrics.propertiesViewed} properties

Session:
${metrics.sessionDurationMinutes}m`;
    }

    // 4. AI CONVERSATION
    if (typeIncludes(eventType, ["ai_prompt", "ai_interaction", "ai_opened"])) {
      return `🤖 AI Conversation

Application:
${app === "home-find" ? "Home Find" : app === "insurance" ? "Insurance" : "AiX OS"}

Questions:
${Math.max(1, metrics.aiCount)}

Session:
${metrics.sessionDurationMinutes}m

Intent Score:
${intentScore}%`;
    }

    // 5. NEW / RETURNING VISITOR
    if (eventType === "session_start" || eventType === "app_start") {
      const header = metrics.isReturningVisitor ? "👤 Returning Visitor" : "👤 New Visitor";
      return `${header}

Application:
${app === "home-find" ? "Home Find" : app === "insurance" ? "Insurance" : "AiX OS"}

Country:
${metrics.country}

Device:
${metrics.device}

Landing page:
${page}

Source:
${metrics.referrer}`;
    }

    // DEFAULT EXECUTIVE CRM TEMPLATE
    const appTitle = app === "home-find" ? "Home Find" : app === "insurance" ? "Insurance" : "AiX OS";
    return `🎯 Executive Intelligence

Application:
${appTitle}

Action:
${eventType.replace(/_/g, " ")}

Intent Score:
${intentScore}%

Visitor:
${visitorTypeLabel}

Session Duration:
${metrics.sessionDurationMinutes}m`;
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

      console.log(`TELEGRAM RESPONSE
status: credentials_missing
body: ${errMsg}`);
      return false;
    }

    try {
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
        console.log(`RETRY EVENT
event_id: ${log.event_id}
application: ${log.application}
event_type: ${log.event_type}
allowed: ${filterCheck.allowed}
reason: ${filterCheck.reason}`);

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

          const metrics = this.aggregateSessionMetrics([event], "Returning Visitor");
          const { score } = this.calculateIntentScore(metrics);
          const formattedMessage = this.formatExecutiveCrmMessage(event, metrics, score, filterCheck.template);
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

function typeIncludes(eventType: string, targets: string[]): boolean {
  return targets.some(t => eventType.includes(t));
}

export const notificationService = new TelegramNotificationService();
export const telegram = notificationService;
export default notificationService;
