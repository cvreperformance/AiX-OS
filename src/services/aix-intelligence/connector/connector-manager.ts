import { ApplicationRegistry, AppRegistryItem } from "./application-registry";

export class ConnectorManager {
  /**
   * Registers a new application connector dynamically.
   */
  public static registerApp(
    appId: string,
    displayName: string,
    version: string,
    endpoint = "/api/aix-intelligence/v1/ingest"
  ): AppRegistryItem | null {
    try {
      const existing = ApplicationRegistry.getApp(appId);
      if (existing) return existing;

      const newKey = "aix-" + Math.random().toString(36).substring(2, 10) + "-" + Date.now().toString(36);
      const list = ApplicationRegistry.load();

      const newItem: AppRegistryItem = {
        application_id: appId.toLowerCase().trim(),
        display_name: displayName,
        version,
        api_key: newKey,
        status: "enabled",
        feature_flags: {
          sampling: 1.0,
          realtime: true,
          telegram: true,
          knowledge: true,
          prediction: true,
        },
        endpoint,
        health_status: "online",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      list.push(newItem);
      ApplicationRegistry.save(list);
      return newItem;
    } catch (e) {
      return null;
    }
  }

  public static isVersionCompatible(sdkVersion: string, requiredVersion = "2.0.0"): boolean {
    try {
      const sdkMajor = parseInt(sdkVersion.split(".")[0]);
      const reqMajor = parseInt(requiredVersion.split(".")[0]);
      return sdkMajor >= reqMajor;
    } catch (e) {
      return false;
    }
  }
}
export default ConnectorManager;
