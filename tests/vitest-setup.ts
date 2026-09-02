import ws from "ws";

if (typeof (globalThis as unknown as { WebSocket: unknown }).WebSocket === "undefined") {
  (globalThis as unknown as { WebSocket: unknown }).WebSocket = ws;
}
