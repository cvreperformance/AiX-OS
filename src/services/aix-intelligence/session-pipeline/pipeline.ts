import { RawEvent, SessionModel } from "./types";
import { EventNormalizer } from "./normalizer";
import { SessionBuilder } from "./session-builder";
import { MetricsCalculator } from "./metrics-calculator";
import { TimelineBuilder } from "./timeline-builder";
import { ScoringEngine } from "./scoring-engine";

export class SessionPipeline {
  /**
   * Transforms raw event records into completed SessionModels through modular steps.
   */
  public static process(rawEvents: RawEvent[]): SessionModel[] {
    if (rawEvents.length === 0) return [];

    // Stage 1: Normalize
    const normalizedEvents = rawEvents.map((evt) => EventNormalizer.normalize(evt));

    // Stage 2: Reconstruct Sessions
    const sessions = SessionBuilder.build(normalizedEvents);

    // Stage 3, 4, 5: Metrics, Timelines, Scores
    return sessions.map((session) => {
      const metrics = MetricsCalculator.calculate(session);
      const timeline = TimelineBuilder.build(session);
      const scores = ScoringEngine.score(session);

      return {
        session_id: session.session_id,
        visitor_id: session.visitor_id,
        application: session.application,
        metrics,
        timeline,
        scores,
      };
    });
  }
}
export default SessionPipeline;
