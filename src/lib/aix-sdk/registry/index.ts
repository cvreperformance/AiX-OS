export class ApplicationRegistry {
  private static registeredApps = new Set<string>(["aix-os", "home-find", "insurance"]);

  /**
   * Registers a new application context in the ecosystem registry.
   */
  public static register(appName: string): void {
    if (appName && typeof appName === "string") {
      this.registeredApps.add(appName.toLowerCase().trim());
    }
  }

  /**
   * Validates if an application is registered.
   */
  public static isRegistered(appName: string): boolean {
    return this.registeredApps.has(appName.toLowerCase().trim());
  }

  /**
   * Lists all registered apps.
   */
  public static getApps(): string[] {
    return Array.from(this.registeredApps);
  }
}
export default ApplicationRegistry;
