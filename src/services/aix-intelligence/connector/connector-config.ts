import { ApplicationRegistry } from "./application-registry";

export class ConnectorConfig {
  /**
   * Retrieves specific feature flags and sampling parameters per application connector.
   */
  public static getFlags(applicationId: string) {
    try {
      const contract = ApplicationRegistry.getApp(applicationId);
      if (contract) {
        return contract.feature_flags;
      }
    } catch (e) {}
    // Return standard defaults if registry fails
    return {
      sampling: 1.0,
      realtime: true,
      telegram: true,
      knowledge: true,
      prediction: true,
    };
  }
}
export default ConnectorConfig;
