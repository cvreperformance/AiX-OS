import fs from "fs";
import path from "path";
import { aix } from "@aix/intelligence-sdk";

export interface NotificationConfig {
  enabled: boolean;
  mode: "development" | "production";
  applications: {
    "aix-os": boolean;
    "home-find": boolean;
    "insurance": boolean;
    [key: string]: boolean;
  };
  eventTypes: {
    page_view: boolean;
    ai: boolean;
    forms: boolean;
    properties: boolean;
    insurance: boolean;
    [key: string]: boolean;
  };
}

const CONFIG_FILE_PATH = path.join(process.cwd(), "src/services/aix-intelligence/realtime/notification_config.json");

export class NotificationConfigManager {
  private static defaultConfig: NotificationConfig = {
    enabled: true,
    mode: "development",
    applications: {
      "aix-os": true,
      "home-find": true,
      "insurance": true,
    },
    eventTypes: {
      page_view: true,
      ai: true,
      forms: true,
      properties: true,
      insurance: true,
    },
  };

  public static getConfig(): NotificationConfig {
    try {
      if (fs.existsSync(CONFIG_FILE_PATH)) {
        const fileContent = fs.readFileSync(CONFIG_FILE_PATH, "utf-8");
        return { ...this.defaultConfig, ...JSON.parse(fileContent) };
      }
    } catch (e) {
      // Fail silently and return defaults
    }
    return this.defaultConfig;
  }

  public static updateConfig(updates: Partial<NotificationConfig>): NotificationConfig {
    try {
      const current = this.getConfig();
      const updated = {
        ...current,
        ...updates,
        applications: { ...current.applications, ...updates.applications },
        eventTypes: { ...current.eventTypes, ...updates.eventTypes },
      };
      const dir = path.dirname(CONFIG_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");
      aix.track("settings_changed", {}, { type: "notifications", enabled: updated.enabled, mode: updated.mode });
      return updated;
    } catch (e) {
      return this.defaultConfig;
    }
  }
}
export default NotificationConfigManager;
