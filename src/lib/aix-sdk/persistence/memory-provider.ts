import { PersistenceProvider } from "./types";

export class MemoryProvider implements PersistenceProvider {
  public name = "memory";
  private store = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.store.get(key) || null;
  }

  public setItem(key: string, value: string): boolean {
    this.store.set(key, value);
    return true;
  }

  public removeItem(key: string): boolean {
    return this.store.delete(key);
  }
}
