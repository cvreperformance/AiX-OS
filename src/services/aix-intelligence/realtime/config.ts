import fs from "fs";
import path from "path";

export interface RealtimeFlags {
  realtime_event_bus: boolean;
  live_monitor: boolean;
  telegram_notifications: boolean;
  activity_scoring: boolean;
  live_dashboard: boolean;
  knowledge_live_updates: boolean;
  debug_mode: boolean;
  sampling_rate: number;
}

const FLAGS_FILE_PATH = path.join(process.cwd(), "src/services/aix-intelligence/realtime/flags.json");

export class RealtimeConfigManager {
  private static defaultFlags: RealtimeFlags = {
    realtime_event_bus: true,
    live_monitor: true,
    telegram_notifications: true,
    activity_scoring: true,
    live_dashboard: true,
    knowledge_live_updates: true,
    debug_mode: false,
    sampling_rate: 1.0,
  };

  public static getFlags(): RealtimeFlags {
    try {
      if (fs.existsSync(FLAGS_FILE_PATH)) {
        const fileContent = fs.readFileSync(FLAGS_FILE_PATH, "utf-8");
        return { ...this.defaultFlags, ...JSON.parse(fileContent) };
      }
    } catch (e) {
      // Fail silently and return defaults
    }
    return this.defaultFlags;
  }

  public static updateFlags(updates: Partial<RealtimeFlags>): RealtimeFlags {
    try {
      const current = this.getFlags();
      const updated = { ...current, ...updates };
      const dir = path.dirname(FLAGS_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(FLAGS_FILE_PATH, JSON.stringify(updated, null, 2), "utf-8");
      return updated;
    } catch (e) {
      return this.defaultFlags;
    }
  }
}
export default RealtimeConfigManager;
