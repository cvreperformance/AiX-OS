import { PersistenceProvider } from "./types";

export class MemoryProvider implements PersistenceProvider {
  private store = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.store.get(key) || null;
  }

  public setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  public removeItem(key: string): void {
    this.store.delete(key);
  }
}
export default MemoryProvider;
