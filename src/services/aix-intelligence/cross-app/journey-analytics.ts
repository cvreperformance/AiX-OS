import { JourneyEntry } from "./journey-builder";

export interface JourneyMetrics {
  journey_length: number;
  entry_application: string;
  exit_application: string;
  transitions_count: number;
  time_span_seconds: number;
  path_sequence: string[];
}

export class JourneyAnalytics {
  /**
   * Evaluates metrics and pathways for a visitor journey.
   */
  public static calculate(journey: JourneyEntry[]): JourneyMetrics {
    try {
      if (!journey || journey.length === 0) {
        return {
          journey_length: 0,
          entry_application: "unknown",
          exit_application: "unknown",
          transitions_count: 0,
          time_span_seconds: 0,
          path_sequence: [],
        };
      }

      const journey_length = journey.length;
      const entry_application = journey[0].application;
      const exit_application = journey[journey.length - 1].application;

      // Calculate application transitions
      let transitions_count = 0;
      const path_sequence: string[] = [entry_application];

      for (let i = 1; i < journey.length; i++) {
        const prevApp = journey[i - 1].application;
        const currApp = journey[i].application;
        if (prevApp !== currApp) {
          transitions_count++;
          path_sequence.push(currApp);
        }
      }

      const start = new Date(journey[0].timestamp).getTime();
      const end = new Date(journey[journey.length - 1].timestamp).getTime();
      const time_span_seconds = Math.round((end - start) / 1000);

      return {
        journey_length,
        entry_application,
        exit_application,
        transitions_count,
        time_span_seconds,
        path_sequence,
      };
    } catch (e) {
      return {
        journey_length: 0,
        entry_application: "unknown",
        exit_application: "unknown",
        transitions_count: 0,
        time_span_seconds: 0,
        path_sequence: [],
      };
    }
  }
}
export default JourneyAnalytics;
