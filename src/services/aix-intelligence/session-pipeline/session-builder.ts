import { NormalizedEvent, ReconstructedSession } from "./types";

export class SessionBuilder {
  /**
   * Reconstructs sessions by grouping normalized events by session_id and sorting them chronologically.
   */
  public static build(events: NormalizedEvent[]): ReconstructedSession[] {
    const sessionMap = new Map<string, NormalizedEvent[]>();

    events.forEach((event) => {
      const sessionId = event.session_id || "anonymous_session";
      const list = sessionMap.get(sessionId) || [];
      list.push(event);
      sessionMap.set(sessionId, list);
    });

    const sessions: ReconstructedSession[] = [];

    sessionMap.forEach((sessionEvents, sessionId) => {
      // Sort events chronologically (ascending)
      sessionEvents.sort((a, b) => a.normalized_timestamp - b.normalized_timestamp);
      
      const firstEvent = sessionEvents[0];

      sessions.push({
        session_id: sessionId,
        visitor_id: firstEvent.visitor_id || "unknown_visitor",
        application: firstEvent.application || "unknown_app",
        events: sessionEvents,
      });
    });

    return sessions;
  }
}
