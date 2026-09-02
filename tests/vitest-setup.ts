// @ts-ignore
import ws from "ws";

if (typeof globalThis.WebSocket === "undefined") {
  // @ts-ignore
  globalThis.WebSocket = ws;
}
