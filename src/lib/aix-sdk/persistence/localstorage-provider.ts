import { PersistenceProvider } from "./types";

export class LocalStorageProvider implements PersistenceProvider {
  public name = "localstorage";

  public getItem(key: string): string | null {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {}
    return null;
  }

  public setItem(key: string, value: string): boolean {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
        return true;
      }
    } catch (e) {}
    return false;
  }

  public removeItem(key: string): boolean {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
        return true;
      }
    } catch (e) {}
    return false;
  }
}
