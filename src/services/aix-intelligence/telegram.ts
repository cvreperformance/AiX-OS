import fs from "fs";
import path from "path";
import { NotificationConfigManager as CustomConfig } from "./realtime/notification-config";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { aix } from "@aix/intelligence-sdk";

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

const QUEUE_FILE = path.join(process.cwd(), "src/services/aix-intelligence/realtime/notification_queue.json");
const STATS_FILE = path.join(process.cwd(), "src/services/aix-intelligence/realtime/notification_stats.json");

class TelegramNotificationService {
  private botToken: string | null = null;
  private chatId: string | null = null;
  private queue: QueueItem[] = [];
  private stats: QueueStats = { total: 0, sent: 0, failed: 0, latency_ms: 0, last_notification_time: "" };
  private isProcessing = false;
  private workerInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || null;
    this.chatId = process.env.TELEGRAM_CHAT_ID || null;
    this.loadQueue();
    this.loadStats();
    
    // Start background processing queue
    if (typeof setInterval !== "undefined") {
      this.workerInterval = setInterval(() => this.processQueue(), 3000);
    }
  }

  private loadQueue() {
    try {
      if (fs.existsSync(QUEUE_FILE)) {
        this.queue = JSON.parse(fs.readFileSync(QUEUE_FILE, "utf-8"));
      }
    } catch (e) {
      this.queue = [];
    }
  }

  private saveQueue() {
    try {
      const dir = path.dirname(QUEUE_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(QUEUE_FILE, JSON.stringify(this.queue, null, 2), "utf-8");
    } catch (e) {}
  }

  private loadStats() {
    try {
      if (fs.existsSync(STATS_FILE)) {
        this.stats = JSON.parse(fs.readFileSync(STATS_FILE, "utf-8"));
      }
    } catch (e) {
      this.stats = { total: 0, sent: 0, failed: 0, latency_ms: 0, last_notification_time: "" };
    }
  }

  private saveStats() {
    try {
      const dir = path.dirname(STATS_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(STATS_FILE, JSON.stringify(this.stats, null, 2), "utf-8");
    } catch (e) {}
  }

  public getQueue(): QueueItem[] {
    return this.queue;
  }

  public getStats(): QueueStats {
    return this.stats;
  }

  public clearFailedNotifications(): void {
    this.queue = this.queue.filter((item) => item.status !== "failed");
    this.saveQueue();
  }

  /**
   * Evaluates incoming events and decides whether to queue a Telegram notification.
   */
  public evaluateEventRules(event: any): void {
    try {
      const config = CustomConfig.getConfig();
      if (!config.enabled) return;

      const app = event.application || "aix-os";
      if (config.applications[app] === false) return;

      const mappedType = this.mapEventTypeGroup(event.event_type);
      if (config.eventTypes[mappedType] === false) return;

      // Duplicate prevention
      if (this.queue.some((item) => item.id === event.id)) {
        return;
      }

      // Check if it matches Development or Production mode
      if (config.mode === "production") {
        // Production Mode: Send only important alerts / high value opportunities / high score items
        this.checkProductionHighValue(event);
      } else {
        // Development Mode: Send every event
        this.enqueue(event);
      }
    } catch (e) {
      // Fail silently
    }
  }

  private mapEventTypeGroup(type: string): string {
    const t = type.toLowerCase();
    if (t.includes("page_view") || t.includes("page_leave") || t.includes("route")) return "page_view";
    if (t.includes("ai_") || t.includes("ai")) return "ai";
    if (t.includes("form_") || t.includes("contact") || t.includes("quote") || t.includes("request")) return "forms";
    if (t.includes("property_") || t.includes("search") || t.includes("download") || t.includes("filter")) return "properties";
    if (t.includes("insurance")) return "insurance";
    return "properties";
  }

  private async checkProductionHighValue(event: any) {
    try {
      // Fetch current visitor profile to check intents, luxury preference, etc.
      const { data: profileData } = await supabaseAdmin
        .from("aix_visitor_knowledge")
        .select("*")
        .eq("visitor_id", event.visitor_id)
        .single();

      if (!profileData) return;

      const p = profileData.profile || {};
      const stats = profileData.statistics || {};
      const signals = profileData.signals || {};

      const buyIntent = p.predictions?.intents?.buying_intent?.confidence || 0;
      const sellIntent = p.predictions?.intents?.selling_intent?.confidence || 0;
      const insIntent = p.predictions?.intents?.insurance_interest?.confidence || 0;
      const luxuryScore = p.predictions?.luxury_buyer?.confidence || (p.luxury_preference ? 95 : 0);
      const oppScore = p.decisions?.opportunityRank || 0;

      // Calculate high-value triggers
      const isHighValue =
        buyIntent > 90 ||
        sellIntent > 90 ||
        insIntent > 90 ||
        luxuryScore > 90 ||
        oppScore > 90 ||
        (stats.total_sessions || 0) >= 5 ||
        (signals.interests && signals.interests.length > 2);

      if (isHighValue) {
        this.enqueue(event, true, { buyIntent, sellIntent, insIntent, luxuryScore, oppScore, profileData });
      }
    } catch (e) {}
  }

  private enqueue(event: any, isHighValue = false, highValueDetails?: any) {
    const message = this.formatEventMessage(event, isHighValue, highValueDetails);
    
    const newItem: QueueItem = {
      id: event.id || Math.random().toString(36).substring(2, 15),
      event,
      status: "pending",
      retry_count: 0,
      created_at: new Date().toISOString(),
      formatted_message: message,
    };

    this.queue.push(newItem);
    this.stats.total += 1;
    this.saveQueue();
    this.saveStats();
  }

  private formatEventMessage(event: any, isHighValue = false, highValueDetails?: any): string {
    const app = event.application || "aix-os";
    const visitorShort = event.visitor_id ? `${event.visitor_id.substring(0, 8)}...` : "unknown";
    const sessionShort = event.session_id ? `${event.session_id.substring(0, 4)}` : "xxxx";
    const timeFormatted = new Date(event.timestamp || event.created_at || Date.now()).toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    let actionDescription = "Triggered event action";
    let metadataStr = "";

    const payload = event.payload || {};
    const meta = event.metadata || {};

    if (event.event_type === "page_view") {
      actionDescription = `Viewed path: ${event.page}`;
    } else if (event.event_type === "search" || event.event_type === "property_search") {
      actionDescription = `Performed search query: "${payload.query || meta.query || ""}"`;
      metadataStr = `Keywords: ${payload.query || ""}\nResults: ${payload.results_count || 0}`;
    } else if (event.event_type === "ai_prompt_sent" || event.event_type === "ai_prompt") {
      actionDescription = `Asked AI Advisor: "${payload.prompt || meta.prompt || ""}"`;
    } else if (event.event_type === "download_started" || event.event_type === "guide_download") {
      actionDescription = `Downloaded file: ${payload.filename || "guide.pdf"}`;
    } else if (event.event_type === "form_submitted" || event.event_type === "property_contact_submit" || event.event_type === "insurance_form_submit") {
      actionDescription = `Submitted form: ${payload.form_id || "Contact Form"}`;
    } else if (event.event_type === "form_abandoned" || event.event_type === "insurance_form_abandon") {
      actionDescription = `Abandoned form: ${payload.form_id || "Contact Form"}`;
    } else if (event.event_type === "property_viewed" || event.event_type === "property_view" || event.event_type === "property_opened") {
      actionDescription = `Viewed listing: ${payload.property_title || payload.property_id || "Property Detail"}`;
      metadataStr = `ID: ${payload.property_id || ""}\nPrice: ${payload.price || ""}\nCity: ${payload.city || ""}`;
    }

    if (!metadataStr && Object.keys(payload).length > 0) {
      metadataStr = Object.entries(payload)
        .slice(0, 4)
        .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
        .join("\n");
    }

    let msg = `
🚀 *AiX Ecosystem Event*

*Application:*
${app.toUpperCase()}

*Visitor:*
\`${visitorShort}\`

*Session:*
\`${sessionShort}\`

*Event:*
\`${event.event_type}\`

*Time:*
${timeFormatted}

*Page:*
\`${event.page || "/"}\`

*Action:*
${actionDescription}
${metadataStr ? `\n*Metadata:*\n\`\`\`\n${metadataStr}\n\`\`\`` : ""}
*Event ID:*
\`${event.id || ""}\`
`.trim();

    if (isHighValue && highValueDetails) {
      const { buyIntent, sellIntent, insIntent, luxuryScore, oppScore } = highValueDetails;
      msg = `
🔥 *HIGH VALUE OPPORTUNITY DETECTED*

*Visitor:* \`${visitorShort}\`
*Application:* ${app.toUpperCase()}
*Opportunity Score:* \`${oppScore}/100\`

*Intent & Affinity Indicators:*
- Buying Intent: \`${buyIntent}%\`
- Selling Intent: \`${sellIntent}%\`
- Insurance Intent: \`${insIntent}%\`
- Luxury Preference: \`${luxuryScore}%\`

*Recommended Action:*
Contact visitor within 30 minutes / Trigger high-intent conversion follow-up.

---
${msg}
`.trim();
    }

    return msg;
  }

  private async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const pendingItems = this.queue.filter((item) => item.status === "pending" || item.status === "retrying");
      if (pendingItems.length === 0) {
        this.isProcessing = false;
        return;
      }

      for (const item of pendingItems) {
        if (!this.botToken || !this.chatId) {
          item.status = "failed";
          item.last_error = "Telegram Bot credentials missing";
          this.stats.failed += 1;
          continue;
        }

        const startTime = Date.now();
        try {
          const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: this.chatId,
              text: item.formatted_message || "Ingested event notification",
              parse_mode: "Markdown",
            }),
          });

          if (response.ok) {
            item.status = "sent";
            item.sent_at = new Date().toISOString();
            this.stats.sent += 1;
            this.stats.latency_ms = Date.now() - startTime;
            this.stats.last_notification_time = item.sent_at;
            aix.track("notification_sent", {}, { event_id: item.id });
          } else {
            const errBody = await response.text();
            throw new Error(`Telegram error HTTP ${response.status}: ${errBody}`);
          }
        } catch (error: any) {
          item.retry_count += 1;
          item.last_error = error.message;

          if (item.retry_count >= 5) {
            item.status = "failed";
            this.stats.failed += 1;
            aix.track("notification_failed", {}, { event_id: item.id, error: error.message });
          } else {
            item.status = "retrying";
          }
        }
      }

      this.saveQueue();
      this.saveStats();
    } catch (e) {
      // Fail silently
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Retries all currently failed notifications.
   */
  public retryFailedNotifications(): void {
    this.queue.forEach((item) => {
      if (item.status === "failed") {
        item.status = "pending";
        item.retry_count = 0;
      }
    });
    this.saveQueue();
    this.processQueue();
  }
}

export const telegram = new TelegramNotificationService();
export default telegram;
