import fs from "fs";
import path from "path";

export interface AppRegistryItem {
  application_id: string;
  display_name: string;
  version: string;
  api_key: string;
  status: "enabled" | "disabled";
  feature_flags: {
    sampling: number;
    realtime: boolean;
    telegram: boolean;
    knowledge: boolean;
    prediction: boolean;
  };
  endpoint: string;
  health_status: "online" | "offline";
  created_at: string;
  updated_at: string;
}

export interface AuditLogItem {
  timestamp: string;
  application_id: string;
  action: string;
  details: string;
}

const REGISTRY_FILE = path.join(process.cwd(), "src/services/aix-intelligence/connector/registry.json");
const AUDIT_FILE = path.join(process.cwd(), "src/services/aix-intelligence/connector/audit.json");

export class ApplicationRegistry {
  private static configCache = new Map<string, any>();

  public static load(): AppRegistryItem[] {
    try {
      if (fs.existsSync(REGISTRY_FILE)) {
        const raw = fs.readFileSync(REGISTRY_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {}
    return [];
  }

  public static save(items: AppRegistryItem[]): boolean {
    try {
      const dir = path.dirname(REGISTRY_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(REGISTRY_FILE, JSON.stringify(items, null, 2), "utf-8");
      return true;
    } catch (e) {
      return false;
    }
  }

  public static loadAudit(): AuditLogItem[] {
    try {
      if (fs.existsSync(AUDIT_FILE)) {
        const raw = fs.readFileSync(AUDIT_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {}
    return [];
  }

  public static logAudit(appId: string, action: string, details: string): void {
    try {
      const logs = this.loadAudit();
      logs.push({
        timestamp: new Date().toISOString(),
        application_id: appId,
        action,
        details,
      });
      fs.writeFileSync(AUDIT_FILE, JSON.stringify(logs.slice(-200), null, 2), "utf-8");
    } catch (e) {}
  }

  public static getApp(appId: string): AppRegistryItem | null {
    const cached = this.configCache.get(appId);
    if (cached) return cached;

    const list = this.load();
    const app = list.find((a) => a.application_id === appId) || null;
    if (app) {
      this.configCache.set(appId, app);
    }
    return app;
  }

  public static registerApp(
    appId: string,
    displayName: string,
    version: string,
    flags?: Partial<AppRegistryItem["feature_flags"]>
  ): AppRegistryItem {
    const list = this.load();
    const existing = list.find((a) => a.application_id === appId);
    
    // Idempotent check (Rule request #4)
    if (existing) {
      return existing;
    }

    const newKey = "aix-" + Math.random().toString(36).substring(2, 10) + "-" + Date.now().toString(36);
    const newItem: AppRegistryItem = {
      application_id: appId.toLowerCase().trim(),
      display_name: displayName,
      version,
      api_key: newKey,
      status: "enabled",
      feature_flags: {
        sampling: flags?.sampling ?? 1.0,
        realtime: flags?.realtime ?? true,
        telegram: flags?.telegram ?? true,
        knowledge: flags?.knowledge ?? true,
        prediction: flags?.prediction ?? true,
      },
      endpoint: "/api/aix-intelligence/v1/ingest",
      health_status: "online",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    list.push(newItem);
    this.save(list);
    this.logAudit(appId, "register", `Registered ecosystem connector: ${displayName}`);
    this.configCache.delete(appId); // Invalidate config cache
    return newItem;
  }

  public static unregisterApp(appId: string): boolean {
    let list = this.load();
    const exists = list.some((a) => a.application_id === appId);
    if (!exists) return false;

    list = list.filter((a) => a.application_id !== appId);
    this.save(list);
    this.logAudit(appId, "unregister", "Unregistered ecosystem connector");
    this.configCache.delete(appId); // Invalidate config cache
    return true;
  }

  public static updateApp(appId: string, updates: Partial<AppRegistryItem>): AppRegistryItem | null {
    const list = this.load();
    const idx = list.findIndex((a) => a.application_id === appId);
    if (idx === -1) return null;

    const updated = {
      ...list[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    list[idx] = updated;
    this.save(list);
    
    this.logAudit(appId, "update", `Updated parameters: ${JSON.stringify(updates)}`);
    this.configCache.delete(appId); // Invalidate config cache (Rule request #3)
    return updated;
  }

  public static rotateKey(appId: string): string | null {
    const newKey = "aix-" + Math.random().toString(36).substring(2, 10) + "-" + Date.now().toString(36);
    const updated = this.updateApp(appId, { api_key: newKey });
    if (updated) {
      this.logAudit(appId, "rotate_key", "Rotated API Key signature");
      this.configCache.delete(appId); // Invalidate config cache
      return newKey;
    }
    return null;
  }
}
export default ApplicationRegistry;
