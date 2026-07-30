import { ReconstructedSession, SessionScores } from "./types";

export interface ScoringWeights {
  click: number;
  scroll25: number;
  scroll50: number;
  scroll75: number;
  scroll100: number;
  aiChatOpen: number;
  aiPromptSent: number;
  formStarted: number;
  search: number;
  propertyView: number;
  formSubmitted: number;
  download: number;
  authSuccess: number;
}

// Single location for scoring config values (Rule request #1)
export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  click: 1,
  scroll25: 1,
  scroll50: 2,
  scroll75: 3,
  scroll100: 4,
  aiChatOpen: 2,
  aiPromptSent: 5,
  formStarted: 3,
  search: 2,
  propertyView: 4,
  formSubmitted: 15,
  download: 8,
  authSuccess: 5,
};

export class ScoringEngine {
  /**
   * Computes engagement and completion indexes using external config parameters.
   */
  public static score(
    session: ReconstructedSession,
    weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
  ): SessionScores {
    let engagement_score = 0;
    let completion_score = 0;

    session.events.forEach((evt) => {
      const type = evt.event_type;
      const p = evt.payload || {};

      // 1. Engagement Index Calculations
      if (type === "button_clicked" || type === "click") {
        engagement_score += weights.click;
      }
      if (type === "scroll_depth") {
        const pct = p.depth_percentage;
        if (pct >= 100) engagement_score += weights.scroll100;
        else if (pct >= 75) engagement_score += weights.scroll75;
        else if (pct >= 50) engagement_score += weights.scroll50;
        else if (pct >= 25) engagement_score += weights.scroll25;
      }
      if (type === "ai_prompt_started") {
        engagement_score += weights.aiChatOpen;
      }
      if (type === "ai_prompt_sent") {
        engagement_score += weights.aiPromptSent;
      }
      if (type === "form_started") {
        engagement_score += weights.formStarted;
      }
      if (type === "search") {
        engagement_score += weights.search;
      }
      if (type === "property_opened") {
        engagement_score += weights.propertyView;
      }

      // 2. Completion Index Calculations
      if (type === "form_submitted") {
        completion_score += weights.formSubmitted;
      }
      if (type === "download_started") {
        completion_score += weights.download;
      }
      if (type === "authentication_success") {
        completion_score += weights.authSuccess;
      }
    });

    return {
      engagement_score,
      completion_score,
    };
  }
}
