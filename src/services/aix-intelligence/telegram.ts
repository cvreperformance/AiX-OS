import { supabaseAdmin } from "@/lib/supabase/admin";
import { NotificationConfigManager } from "@/services/aix-intelligence/realtime/notification-config";

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

const BUSINESS_MAPPINGS: Record<string, Record<string, string>> = {
  "home-find": {
    "property_opened": "🏡 Property Opened",
    "property_view": "🏡 Property Opened",
    "property_viewed": "🏡 Property Opened",
    "search": "🔍 Property Search",
    "property_filter_change": "🎯 Filter Applied",
    "property_contact_start": "📞 Contact Started",
    "property_contact_submit": "📞 Contact Submitted",
    "buyer_request": "🔥 Buyer Request",
    "seller_request": "🔥 Seller Request",
    "download_started": "📥 Guide Download",
    "ai_prompt_started": "🤖 AI Conversation Started",
    "ai_prompt_sent": "🤖 AI Question",
    "ai_prompt_received": "🤖 AI Response",
    "session_end": "👋 Visitor Left",
  },
  "insurance": {
    "insurance_quote_start": "🛡 Quote Started",
    "insurance_quote_submit": "✅ Quote Submitted",
    "insurance_form_start": "📝 Form Started",
    "insurance_form_submit": "✅ Form Submitted",
    "insurance_form_abandon": "⚠ Form Abandoned",
    "contact_request": "📞 Contact Request",
    "consultation_request": "📅 Consultation Request",
    "callback_request": "☎ Callback Request",
    "guide_download": "📥 Guide Download",
    "ai_opened": "🤖 AI Conversation",
    "ai_prompt_started": "🤖 AI Conversation",
    "ai_prompt_sent": "🤖 AI Conversation",
    "ai_prompt_received": "🤖 AI Conversation",
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
    "dashboard_opened": "📊 Dashboard Opened",
    "dashboard_action": "⚙ Dashboard Action",
    "knowledge_query": "🔍 Knowledge Query",
    "search_performed": "🔍 Search Performed",
    "session_end": "👋 Visitor Left",
  }
};

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
   * Helper to check if an event is allowed for Telegram notifications in Developer Mode.
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

    try {
      const app = this.normalizeApp(rawApp);
      const eventType = this.normalizeEventType(rawEventType);

      // 1. Hard database protection:
      // Reject specified technical events from entering notification_delivery_log regardless of mode.
      const forbiddenTypes = [
        "page_view",
        "page_leave",
        "route_change",
        "internal_navigation",
        "scroll_milestone",
        "scroll_depth",
        "heartbeat",
        "sdk_initialized",
        "component_loaded"
      ];
      if (forbiddenTypes.includes(eventType)) {
        console.log(`BLOCKED TECHNICAL EVENT:
application: ${app}
event: ${eventType}
reason: technical event`);
        return;
      }

      const config = NotificationConfigManager.getConfig();
      const isBusinessMode = config.notification_mode !== "developer";

      // Fetch prior events in this session to determine if it is the first event
      let sessionEvents: any[] = [];
      try {
        const { data: sEvts } = await supabaseAdmin
          .from("aix_events")
          .select("*")
          .eq("session_id", event.session_id)
          .order("timestamp", { ascending: true });
        if (sEvts) {
          sessionEvents = sEvts;
        }
      } catch (e) {}

      // 2. Perform Filtering checks BEFORE database-first notification log insert and duplicate checking
      let allowed = false;
      let reason = "technical event";

      if (isBusinessMode) {
        if (app === "home-find") {
          const whitelist = [
            "property_opened", "property_view", "property_viewed",
            "search", "property_filter_change",
            "property_contact_start", "property_contact_submit",
            "buyer_request", "seller_request",
            "download_started",
            "ai_prompt_started", "ai_prompt_sent", "ai_prompt_received",
            "session_end"
          ];
          if (whitelist.includes(eventType)) {
            allowed = true;
          } else if (eventType === "app_start") {
            const priorEvents = sessionEvents.filter(e => e.id !== eventId);
            if (priorEvents.length === 0) {
              allowed = true;
            } else {
              reason = "app_start entry event but not first in session";
            }
          }
        } else if (app === "insurance") {
          const whitelist = [
            "insurance_quote_start", "insurance_quote_submit",
            "insurance_form_start", "insurance_form_submit", "insurance_form_abandon",
            "contact_request", "consultation_request", "callback_request",
            "guide_download",
            "ai_opened", "ai_prompt_started", "ai_prompt_sent", "ai_prompt_received",
            "session_end"
          ];
          if (whitelist.includes(eventType)) {
            allowed = true;
          } else if (eventType === "app_start") {
            const priorEvents = sessionEvents.filter(e => e.id !== eventId);
            if (priorEvents.length === 0) {
              allowed = true;
            } else {
              reason = "app_start entry event but not first in session";
            }
          }
        } else if (app === "aix-os") {
          const whitelist = [
            "ai_interaction", "ai_interactions", "ai_prompt_started", "ai_prompt_sent", "ai_prompt_received",
            "decision_generated", "decision_created",
            "learning_score_changed", "learning_updated",
            "opportunity_detected", "high_intent_detected",
            "dashboard_action", "knowledge_query",
            "session_end"
          ];
          if (whitelist.includes(eventType)) {
            allowed = true;
          } else if (eventType === "app_start") {
            const priorEvents = sessionEvents.filter(e => e.id !== eventId);
            if (priorEvents.length === 0) {
              allowed = true;
            } else {
              reason = "app_start but not first in session";
            }
          }
        }
      } else {
        const filter = this.isAllowedEvent(app, eventType);
        allowed = filter.allowed;
        reason = filter.reason;
      }

      if (!allowed) {
        if (isBusinessMode) {
          console.log(
            "BUSINESS FILTERED EVENT",
            event.application,
            event.event_type,
            "reason:",
            "technical event"
          );
          console.log(`BUSINESS FILTERED EVENT:
application: ${app}
event: ${eventType}
reason: ${reason}`);
        }
        return; // Return immediately, no DB insert, no duplicate check, no Telegram call
      }

      // Log allowed event
      console.log(`BUSINESS EVENT SENT:
application: ${app}
event: ${eventType}`);

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
          .select("session_id", { count: "exact", head: true })
          .eq("visitor_id", event.visitor_id)
          .neq("session_id", event.session_id);

        if (!countError && count && count > 0) {
          visitorStatus = "Returning Visitor";
        }
      } catch (e) {}

      // Intent Score & Profile Lookup
      let intentScore = "";
      let profile: any = null;
      let buyIntent = 0;
      let sellIntent = 0;
      let insIntent = 0;
      let luxuryScore = 0;
      let opportunityScore = 0;

      try {
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
      } catch (e) {}

      // Check for High Intent Alert
      let triggerHighIntent = false;
      let highIntentType = "";
      let highIntentScore = 0;

      if (buyIntent > 90) {
        triggerHighIntent = true;
        highIntentType = "Buying";
        highIntentScore = buyIntent;
      } else if (sellIntent > 90) {
        triggerHighIntent = true;
        highIntentType = "Selling";
        highIntentScore = sellIntent;
      } else if (insIntent > 90) {
        triggerHighIntent = true;
        highIntentType = "Insurance";
        highIntentScore = insIntent;
      } else if (luxuryScore > 90) {
        triggerHighIntent = true;
        highIntentType = "Luxury";
        highIntentScore = luxuryScore;
      } else if (opportunityScore > 90) {
        triggerHighIntent = true;
        highIntentType = "Opportunity";
        highIntentScore = opportunityScore;
      }

      if (isBusinessMode && triggerHighIntent) {
        const highIntentEventId = `${eventId}_high`;
        const { error: insertHighError } = await supabaseAdmin
          .from("notification_delivery_log")
          .insert({
            event_id: highIntentEventId,
            application: app,
            event_type: "high_intent_alert",
            telegram_status: "pending",
            attempts: 0,
            queued_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (!insertHighError) {
          this.sendPromiseChain = this.sendPromiseChain.then(async () => {
            const now = Date.now();
            const elapsed = now - this.lastSendTime;
            if (elapsed < 1000) {
              await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
            }

            let interest = "General Interest";
            if (profile) {
              if (profile.favorite_property_types && profile.favorite_property_types.length > 0) {
                interest = profile.favorite_property_types.join(", ");
              } else if (profile.favorite_locations && profile.favorite_locations.length > 0) {
                interest = `Properties in ${profile.favorite_locations.join(", ")}`;
              } else if (app === "insurance") {
                interest = "Insurance quotes";
              }
            }

            const appLabel = app === "home-find" ? "Home Find" : app === "insurance" ? "Insurance" : "AiX OS";
            const highIntentMsg = `🔥 HIGH INTENT VISITOR

Application:
${appLabel}

Intent:
${highIntentType}

Score:
${highIntentScore}%

Interest:
${interest}

Action:
Contact visitor now.`;

            await this.sendTelegramNotification(highIntentEventId, highIntentMsg, app, "high_intent_alert");
            this.lastSendTime = Date.now();
          });
        }
      }

      // Serialize and throttle Telegram deliveries
      this.sendPromiseChain = this.sendPromiseChain.then(async () => {
        // Enforce maximum 1 Telegram message per second (1000ms delay between calls)
        const now = Date.now();
        const elapsed = now - this.lastSendTime;
        if (elapsed < 1000) {
          await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
        }

        const formattedMessage = this.formatTelegramMessage(event, visitorStatus, intentScore, sessionEvents, profile);
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
      // Developer Mode: keep raw feed
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

      if (intentScore) {
        msg += `\n\nIntent Score:\n${intentScore}`;
      }

      return msg;
    }

    // Business Mode
    const appLabel = app === "home-find" ? "Home Find" : app === "insurance" ? "Insurance" : "AiX OS";
    const isReturning = visitorStatus.toLowerCase().includes("returning");

    // 1. Is it a visitor entry?
    const isEntryEvent = ["page_view", "route_change", "sdk_initialized", "app_start"].includes(eventType);
    const priorEntryEvents = sessionEvents.filter(e => 
      e.id !== event.id && 
      ["page_view", "route_change", "sdk_initialized", "app_start"].includes(e.event_type)
    );
    const isFirstEntry = isEntryEvent && priorEntryEvents.length === 0;

    const eventTime = new Date(event.timestamp || event.created_at || Date.now());
    const hours = String(eventTime.getHours()).padStart(2, '0');
    const minutes = String(eventTime.getMinutes()).padStart(2, '0');
    const hh_mm = `${hours}:${minutes}`;

    if (isFirstEntry) {
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

    const mappedAction = BUSINESS_MAPPINGS[app]?.[eventType] || eventType;

    // 2. Specific Templates
    if (mappedAction === "🏡 Property Opened") {
      const name = payload.property_title || metadata.property_title || payload.title || metadata.title || payload.property_name || metadata.property_name || "Unknown Property";
      const price = payload.price || metadata.price || payload.property_price || metadata.property_price || "Unknown Price";

      let durationStr = "0s";
      if (sessionEvents.length > 0) {
        const timestamps = sessionEvents.map(e => new Date(e.timestamp || e.created_at).getTime()).filter(t => !isNaN(t));
        const minTime = Math.min(...timestamps);
        const maxTime = Math.max(...timestamps);
        const diffMs = Math.max(0, maxTime - minTime);
        const diffSec = Math.floor(diffMs / 1000);
        const mins = Math.floor(diffSec / 60);
        const secs = diffSec % 60;
        durationStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
      }

      return `🏡 Property Opened

Application:
${appLabel}

Property:
${name}

Price:
${price}

Visitor:
${isReturning ? "Returning" : "First Visit"}

Session:
${durationStr}`;
    }

    if (["📞 Contact Request", "📞 Contact Started", "📞 Contact Submitted", "✅ Quote Submitted", "🛡 Quote Started"].includes(mappedAction)) {
      const name = payload.property_title || metadata.property_title || payload.title || metadata.title || payload.property_name || metadata.property_name || payload.insurance_type || metadata.insurance_type || "General Inquiry";
      
      let buyIntent = 0;
      let insIntent = 0;
      if (profile) {
        buyIntent = profile.learning?.adaptiveScores?.buyingIntent || profile.predictions?.intents?.buying_intent?.confidence || profile.buying_intent || 0;
        insIntent = profile.learning?.adaptiveScores?.insuranceIntent || profile.predictions?.intents?.insurance_interest?.confidence || profile.insurance_interest || 0;
      }
      const scoreNum = app === "insurance" ? insIntent : buyIntent;
      const scoreStr = scoreNum > 0 ? `${scoreNum}%` : "Undetermined";

      let recommendedAction = "Follow up via email.";
      if (scoreNum > 90) {
        recommendedAction = "Call immediately.";
      } else if (scoreNum > 60) {
        recommendedAction = "Call within 15 minutes.";
      }

      return `${mappedAction}

Application:
${appLabel}

Property:
${name}

Visitor:
${isReturning ? "Returning" : "First Visit"}

Intent:
${scoreStr}

Recommended Action:
${recommendedAction}`;
    }

    if (["🤖 AI Conversation Started", "🤖 AI Question", "🤖 AI Response", "🤖 AI Conversation"].includes(mappedAction)) {
      const question = payload.message || metadata.message || payload.prompt || metadata.prompt || payload.question || metadata.question || payload.text || metadata.text || "AI conversation active";
      return `🤖 AI Conversation

Application:
${appLabel}

Question:
${question}

Page:
${page}`;
    }

    if (mappedAction === "👋 Visitor Left") {
      let durationStr = "0 min";
      let pageViewsCount = 0;
      let propertyViewsCount = 0;
      let aiMessagesCount = 0;
      let formsCount = 0;

      if (sessionEvents.length > 0) {
        const timestamps = sessionEvents.map(e => new Date(e.timestamp || e.created_at).getTime()).filter(t => !isNaN(t));
        const minTime = Math.min(...timestamps);
        const maxTime = Math.max(...timestamps);
        const diffMs = Math.max(0, maxTime - minTime);
        const diffMins = Math.round(diffMs / 60000);
        durationStr = `${diffMins} min`;

        pageViewsCount = sessionEvents.filter(e => e.event_type === "page_view" || e.event_type === "route_change").length;
        propertyViewsCount = sessionEvents.filter(e => ["property_opened", "property_view", "property_viewed"].includes(e.event_type)).length;
        aiMessagesCount = sessionEvents.filter(e => ["ai_prompt_sent", "ai_prompt_received", "ai_prompt_started", "ai_interaction", "ai_interactions"].includes(e.event_type)).length;
        formsCount = sessionEvents.filter(e => ["property_contact_submit", "insurance_quote_submit", "insurance_form_submit", "contact_request", "consultation_request", "callback_request", "buyer_request", "seller_request"].includes(e.event_type)).length;
      }

      return `👋 Visitor Left

Application:
${appLabel}

Duration:
${durationStr}

Pages:
${pageViewsCount}

Properties:
${propertyViewsCount}

AI Messages:
${aiMessagesCount}

Forms:
${formsCount}`;
    }

    // Default business action formatting
    let details = "";
    if (mappedAction === "🔍 Property Search") {
      const queryStr = payload.query || metadata.query || payload.search || metadata.search || "None";
      details = `\n\nSearch:\n"${queryStr}"`;
    } else if (mappedAction === "🎯 Filter Applied") {
      const filters = payload.filters || metadata.filters || "None";
      details = `\n\nFilters:\n${typeof filters === "object" ? JSON.stringify(filters) : filters}`;
    } else if (mappedAction === "📥 Guide Download") {
      const guide = payload.guide_title || metadata.guide_title || payload.guide || metadata.guide || "Guide Document";
      details = `\n\nGuide:\n${guide}`;
    }

    return `${mappedAction}

Application:
${appLabel}

Visitor:
${isReturning ? "Returning" : "First Visit"}${details}`;
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
            .select("session_id", { count: "exact", head: true })
            .eq("visitor_id", event.visitor_id)
            .neq("session_id", event.session_id);

          if (!countError && count && count > 0) {
            visitorStatus = "Returning Visitor";
          }
        } catch (e) {}

        let intentScore = "";
        let profile: any = null;
        try {
          const { data: profileData } = await supabaseAdmin
            .from("aix_visitor_knowledge")
            .select("profile")
            .eq("visitor_id", event.visitor_id)
            .maybeSingle();

          if (profileData?.profile) {
            profile = profileData.profile;
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

        let sessionEvents: any[] = [];
        try {
          const { data: sEvts } = await supabaseAdmin
            .from("aix_events")
            .select("*")
            .eq("session_id", event.session_id)
            .order("timestamp", { ascending: true });
          if (sEvts) {
            sessionEvents = sEvts;
          }
        } catch (e) {}

        // Throttle and serialize retries through the same chain
        this.sendPromiseChain = this.sendPromiseChain.then(async () => {
          const now = Date.now();
          const elapsed = now - this.lastSendTime;
          if (elapsed < 1000) {
            await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
          }

          const formattedMessage = this.formatTelegramMessage(event, visitorStatus, intentScore, sessionEvents, profile);
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
