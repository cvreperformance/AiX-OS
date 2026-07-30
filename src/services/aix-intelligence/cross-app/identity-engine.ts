import { supabaseAdmin } from "@/lib/supabase/admin";

export interface IdentityLink {
  linked_visitor_id: string;
  confidence_score: number; // 0 - 100
  matching_reasons: string[];
  evidence: {
    browser?: string;
    device?: string;
    country?: string;
    campaign?: string;
  };
  last_updated: string;
}

export class IdentityResolutionEngine {
  /**
   * Scans and resolves relationships between anonymous visitors based on fingerprint traits.
   */
  public async resolveIdentity(visitorId: string, currentProfile: any): Promise<IdentityLink[]> {
    try {
      const { data: siblingProfiles, error } = await supabaseAdmin
        .from("aix_visitor_knowledge")
        .select("visitor_id, profile, signals, statistics, metadata")
        .neq("visitor_id", visitorId)
        .limit(10); // Check nearest candidate profiles to keep it performant

      if (error || !siblingProfiles || siblingProfiles.length === 0) {
        return [];
      }

      const resolvedLinks: IdentityLink[] = [];

      for (const sibling of siblingProfiles) {
        const matchingReasons: string[] = [];
        let score = 0;
        const evidence: any = {};

        const siblingProfile = sibling.profile || {};
        const activeProfile = currentProfile.profile || {};
        const siblingSignals = sibling.signals || {};
        const activeSignals = currentProfile.signals || {};

        // 1. Check Browser Fingerprint Match
        if (
          siblingProfile.preferred_language &&
          activeProfile.preferred_language &&
          siblingProfile.preferred_language === activeProfile.preferred_language
        ) {
          score += 20;
          matchingReasons.push("Preferred languages match");
          evidence.language = activeProfile.preferred_language;
        }

        // 2. Check active hours correlation
        const siblingHours = siblingProfile.active_hours || [];
        const activeHours = activeProfile.active_hours || [];
        const intersection = siblingHours.filter((h: number) => activeHours.includes(h));
        if (intersection.length > 0) {
          score += 15;
          matchingReasons.push("Active time overlap detected");
        }

        // 3. Match locations/interests
        const siblingLocs = siblingProfile.favorite_locations || [];
        const activeLocs = activeProfile.favorite_locations || [];
        const sharedLocs = siblingLocs.filter((l: string) => activeLocs.includes(l));
        if (sharedLocs.length > 0) {
          score += 25;
          matchingReasons.push(`Common interest location matched: ${sharedLocs.join(", ")}`);
          evidence.country = sharedLocs[0];
        }

        // 4. Intent Category alignment
        if (siblingProfile.intent && activeProfile.intent && siblingProfile.intent === activeProfile.intent && activeProfile.intent !== "undetermined") {
          score += 20;
          matchingReasons.push(`Same transactional intent matched: ${activeProfile.intent}`);
        }

        // Only register if matching confidence is high
        if (score >= 60) {
          resolvedLinks.push({
            linked_visitor_id: sibling.visitor_id,
            confidence_score: score,
            matching_reasons: matchingReasons,
            evidence,
            last_updated: new Date().toISOString(),
          });
        }
      }

      return resolvedLinks;
    } catch (e) {
      return [];
    }
  }
}

export const identityResolutionEngine = new IdentityResolutionEngine();
export default identityResolutionEngine;
