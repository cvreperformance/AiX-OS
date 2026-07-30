import { RealtimeConfigManager } from "./config";

type EventHandler = (data: any) => void;

export class RealtimeEventBus {
  private static instance: RealtimeEventBus;
  private handlers = new Map<string, Set<EventHandler>>();
  private maxHandlersPerTopic = 50;

  private constructor() {}

  public static getInstance(): RealtimeEventBus {
    if (!this.instance) {
      this.instance = new RealtimeEventBus();
    }
    return this.instance;
  }

  public subscribe(topic: string, handler: EventHandler): void {
    try {
      const flags = RealtimeConfigManager.getFlags();
      if (!flags.realtime_event_bus) return;

      if (!this.handlers.has(topic)) {
        this.handlers.set(topic, new Set());
      }
      const set = this.handlers.get(topic)!;
      if (set.size >= this.maxHandlersPerTopic) {
        // Evict oldest handler to prevent memory leaks
        const first = set.values().next().value;
        if (first) set.delete(first);
      }
      set.add(handler);
    } catch (e) {
      // Fail silently
    }
  }

  public unsubscribe(topic: string, handler: EventHandler): void {
    try {
      const set = this.handlers.get(topic);
      if (set) {
        set.delete(handler);
        if (set.size === 0) {
          this.handlers.delete(topic);
        }
      }
    } catch (e) {
      // Fail silently
    }
  }

  public publish(topic: string, data: any): void {
    try {
      const flags = RealtimeConfigManager.getFlags();
      if (!flags.realtime_event_bus) return;

      const set = this.handlers.get(topic);
      if (set) {
        set.forEach((handler) => {
          try {
            handler(data);
          } catch (err) {
            // Fail silently on single handler errors
          }
        });
      }
    } catch (e) {
      // Fail silently
    }
  }
}

export const eventBus = RealtimeEventBus.getInstance();
export default eventBus;
