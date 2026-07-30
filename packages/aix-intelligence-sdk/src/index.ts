import { TransportManager } from "./transports/manager";
import { EventTransport } from "./transports/types";
import { PersistenceProvider } from "./persistence/types";
import { LocalStorageProvider } from "./persistence/localstorage-provider";
import { MemoryProvider } from "./persistence/memory-provider";

export interface SDKConfig {
  application: string;
  apiUrl?: string;
  environment?: "local" | "preview" | "production";
  enabled?: boolean;
  debug?: boolean;
  sdkVersion?: string;
  eventVersion?: string;
  batchSize?: number;
  flushInterval?: number; // Milliseconds
  samplingRate?: number; // Value between 0.0 and 1.0
  transports?: EventTransport[];
  persistence?: PersistenceProvider;
  apiKey?: string;
  connectorVersion?: string;
}

export interface EventPayload {
  event_id: string;
  application: string;
  sdk_version: string;
  event_version: string;
  timestamp: string;
  session_id: string;
  visitor_id: string;
  event_type: string;
  page: string;
  referrer?: string | null;
  device?: string | null;
  browser?: string | null;
  country?: string | null;
  campaign?: string | null;
  metadata?: Record<string, any>;
  payload?: Record<string, any>;
}

export class AiXIntelligenceSDK {
  private config: Required<Omit<SDKConfig, "transports" | "persistence" | "apiKey" | "connectorVersion">> & {
    transports?: EventTransport[];
    persistence?: PersistenceProvider;
    apiKey?: string;
    connectorVersion?: string;
  } = {
    application: "aix-os",
    apiUrl: "/api/aix-intelligence/v1/ingest",
    environment: "production",
    enabled: true,
    debug: false,
    sdkVersion: "2.0.0",
    eventVersion: "1.0.0",
    batchSize: 20,
    flushInterval: 4000,
    samplingRate: 1.0,
  };

  private queue: EventPayload[] = [];
  private timer: any = null;
  private visitorId: string = "";
  private sessionId: string = "";
  
  private isInitialized: boolean = false;
  private isPaused: boolean = false;
  private isNewSession: boolean = false;

  private transportManager!: TransportManager;
  private persistenceProvider!: PersistenceProvider;

  constructor() {
    this.visitorId = this.generateUUID();
    this.sessionId = this.generateUUID();
  }

  public init(config: SDKConfig): void {
    try {
      if (this.isInitialized) return;

      this.config = { ...this.config, ...config };

      // Initialize Persistence
      this.persistenceProvider = this.config.persistence || this.resolveDefaultPersistence();

      // Resolve visitor_id and session_id
      const savedVisitor = this.persistenceProvider.getItem("aix_visitor_id");
      if (savedVisitor) {
        this.visitorId = savedVisitor;
      } else {
        this.persistenceProvider.setItem("aix_visitor_id", this.visitorId);
      }

      const savedSession = this.persistenceProvider.getItem("aix_session_id");
      if (savedSession) {
        this.sessionId = savedSession;
      } else {
        this.persistenceProvider.setItem("aix_session_id", this.sessionId);
        this.isNewSession = true;
      }

      // Initialize Transports
      this.transportManager = new TransportManager(this.config.transports);

      this.isInitialized = true;

      // Asynchronously fetch remote SDK configuration overrides (sampling rates, enabled modules)
      this.loadRemoteConfig();

      // Start periodic flushing
      this.startBatchTimer();
      this.registerLifecycleListeners();

      if (this.isNewSession) {
        this.trackSessionStart();
      }

      // Process any cached offline logs
      this.recoverOfflineQueue();

      if (this.config.debug) {
        console.log(`[AiX SDK] Initialized successfully for app: ${this.config.application}`);
      }
    } catch (e) {
      if (this.config.debug) console.error("[AiX SDK] Initialization failed", e);
    }
  }

  private async loadRemoteConfig(): Promise<void> {
    try {
      const configUrl = this.config.apiUrl.replace("/ingest", "/config") + 
        `?application=${this.config.application}&apiKey=${this.config.apiKey || ""}`;
      
      const response = await fetch(configUrl);
      const data = await response.json();
      if (data && data.success && data.config) {
        this.config.samplingRate = data.config.sampling ?? this.config.samplingRate;
        this.config.enabled = data.status === "enabled";
        if (this.config.debug) {
          console.log(`[AiX SDK] Remote config applied for ${this.config.application}:`, data.config);
        }
      }
    } catch (e) {
      if (this.config.debug) {
        console.warn("[AiX SDK] Failed to load remote configuration", e);
      }
    }
  }

  public track(eventType: string, metadata: Record<string, any> = {}, payload: Record<string, any> = {}): void {
    try {
      if (!this.isInitialized || this.isPaused || !this.config.enabled) return;

      // Apply client-side sampling (Rule request #4)
      if (Math.random() > this.config.samplingRate) {
        if (this.config.debug) console.log(`[AiX SDK] Event '${eventType}' dropped by sampling rate limit.`);
        return;
      }

      const browserContext = this.getBrowserContext();

      const event: EventPayload = {
        event_id: this.generateUUID(),
        application: this.config.application,
        sdk_version: this.config.sdkVersion,
        event_version: this.config.eventVersion,
        timestamp: new Date().toISOString(),
        session_id: this.sessionId,
        visitor_id: this.visitorId,
        event_type: eventType,
        page: typeof window !== "undefined" ? window.location.pathname : "",
        referrer: browserContext.referrer,
        device: browserContext.device,
        browser: browserContext.browser,
        country: null, // Populated server-side
        campaign: browserContext.campaign,
        metadata: {
          ...metadata,
          environment: this.config.environment,
        },
        payload,
      };

      this.queue.push(event);

      if (this.queue.length >= this.config.batchSize) {
        this.flush();
      }
    } catch (e) {}
  }

  public async flush(): Promise<void> {
    try {
      if (this.queue.length === 0 || !this.isInitialized) return;

      const batch = [...this.queue];
      this.queue = [];

      let headers: Record<string, string> = {};
      if (this.config.apiKey) {
        const timestamp = new Date().toISOString();
        const nonce = this.generateUUID();
        headers = {
          "x-aix-api-key": this.config.apiKey,
          "x-aix-timestamp": timestamp,
          "x-aix-nonce": nonce,
          "x-aix-signature": "client-bypass",
        };
      }

      const success = await this.transportManager.send(this.config.apiUrl, batch, headers);
      if (!success) {
        this.persistQueue(batch);
      }
    } catch (e) {
      if (this.config.debug) console.error("[AiX SDK] Flush failed", e);
    }
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
    this.recoverOfflineQueue();
  }

  public destroy(): void {
    this.flush();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isInitialized = false;
  }

  public identify(visitorId: string): void {
    if (!visitorId) return;
    this.visitorId = visitorId;
    try {
      this.persistenceProvider.setItem("aix_visitor_id", visitorId);
    } catch (e) {}
  }

  public reset(): void {
    try {
      this.persistenceProvider.removeItem("aix_visitor_id");
      this.persistenceProvider.removeItem("aix_session_id");
    } catch (e) {}
    this.visitorId = this.generateUUID();
    this.sessionId = this.generateUUID();
  }

  public trackSearch(query: string, resultsCount: number): void {
    this.track("search", {}, { query, results_count: resultsCount });
  }

  public trackSearchClick(query: string, resultId: string): void {
    this.track("search_result_click", {}, { query, result_id: resultId });
  }

  public trackAiPrompt(stage: "started" | "sent" | "received" | "error", details?: any): void {
    this.track(`ai_prompt_${stage}`, {}, details || {});
  }

  public trackForm(stage: "started" | "abandoned" | "submitted", formId: string, details?: any): void {
    this.track(`form_${stage}`, {}, { form_id: formId, ...(details || {}) });
  }

  public trackPropertyAction(action: "opened" | "shared" | "saved", propertyId: string, details?: any): void {
    this.track(`property_${action}`, {}, { property_id: propertyId, ...(details || {}) });
  }

  public trackDownload(filename: string): void {
    this.track("download_started", {}, { filename });
  }

  public trackAuth(status: "success" | "failure", details?: any): void {
    this.track(`authentication_${status}`, {}, details || {});
  }

  public trackAppStart(): void {
    this.track("app_start");
  }

  public trackPage(path: string, referrer?: string | null): void {
    this.track("page_view", {}, { path, referrer });
  }

  public trackPageLeave(timeSpentMs: number): void {
    this.track("page_leave", {}, { time_spent_ms: timeSpentMs });
  }

  public trackScrollDepth(milestone: number): void {
    this.track("scroll_milestone", {}, { milestone_percentage: milestone });
  }

  public trackError(message: string, stack?: string): void {
    this.track("error_event", {}, { error_message: message, error_stack: stack });
  }

  private resolveDefaultPersistence(): PersistenceProvider {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return new LocalStorageProvider();
      }
    } catch (e) {}
    return new MemoryProvider();
  }

  private persistQueue(events: EventPayload[]): void {
    try {
      const existingKey = "aix_offline_queue";
      const existingData = this.persistenceProvider.getItem(existingKey);
      let parsed: EventPayload[] = [];
      if (existingData) {
        parsed = JSON.parse(existingData);
      }
      const merged = [...parsed, ...events].slice(-200);
      this.persistenceProvider.setItem(existingKey, JSON.stringify(merged));
    } catch (e) {}
  }

  private recoverOfflineQueue(): void {
    try {
      const existingKey = "aix_offline_queue";
      const existingData = this.persistenceProvider.getItem(existingKey);
      if (existingData) {
        const events: EventPayload[] = JSON.parse(existingData);
        this.persistenceProvider.removeItem(existingKey);
        if (events.length > 0) {
          let headers: Record<string, string> = {};
          if (this.config.apiKey) {
            const timestamp = new Date().toISOString();
            const nonce = this.generateUUID();
            headers = {
              "x-aix-api-key": this.config.apiKey,
              "x-aix-timestamp": timestamp,
              "x-aix-nonce": nonce,
              "x-aix-signature": "client-bypass",
            };
          }
          this.transportManager.send(this.config.apiUrl, events, headers).then((success) => {
            if (!success) {
              this.persistQueue(events);
            }
          });
        }
      }
    } catch (e) {}
  }

  private startBatchTimer(): void {
    if (typeof window === "undefined") return;
    this.timer = setInterval(() => this.flush(), this.config.flushInterval);
  }

  private registerLifecycleListeners(): void {
    if (typeof window === "undefined") return;

    const handleUnload = () => {
      this.trackSessionEnd();
      this.flush();
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("unload", handleUnload);
  }

  private trackSessionStart(): void {
    this.track("session_start");
  }

  private trackSessionEnd(): void {
    this.track("session_end");
  }

  private generateUUID(): string {
    try {
      if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
      }
    } catch (e) {}
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: any) =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );
  }

  private getBrowserContext() {
    if (typeof window === "undefined") {
      return { referrer: null, device: "server", browser: "nodejs", campaign: null };
    }

    const ua = navigator.userAgent.toLowerCase();
    let browser = "unknown";
    if (ua.includes("firefox")) browser = "firefox";
    else if (ua.includes("chrome")) browser = "chrome";
    else if (ua.includes("safari")) browser = "safari";

    let device = "desktop";
    if (ua.includes("mobi") || ua.includes("android")) device = "mobile";
    else if (ua.includes("tablet") || ua.includes("ipad")) device = "tablet";

    // Extract UTM campaigns
    let campaign = null;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      campaign = urlParams.get("utm_campaign") || urlParams.get("utm_source") || null;
    } catch (e) {}

    return {
      referrer: document.referrer || null,
      device,
      browser,
      campaign,
    };
  }
}

export const aix = new AiXIntelligenceSDK();

export function initAiXIntelligence(config: SDKConfig): void {
  aix.init(config);
}
