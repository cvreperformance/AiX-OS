import { supabaseAdmin } from "@/lib/supabase/admin";

export interface UserMemoryProfile {
  visitorId: string;
  applicationsUsed: string[];
  totalActions: number;
  frequentPages: string[];
  lastActive: string;
  inferredInterests: string[];
}

class KnowledgeMemoryService {
  /**
   * Dynamically compiles a user profile by analyzing behavior telemetry
   */
  public async getVisitorProfile(visitorId: string): Promise<UserMemoryProfile | null> {
    try {
      const { data: events, error } = await supabaseAdmin
        .from("aix_events")
        .select("application, event_type, page, timestamp, metadata")
        .eq("visitor_id", visitorId)
        .order("timestamp", { ascending: false });

      if (error || !events || events.length === 0) {
        return null;
      }

      const applicationsUsed = new Set<string>();
      const pageHits: Record<string, number> = {};
      const inferredInterests = new Set<string>();

      events.forEach((evt) => {
        if (evt.application) applicationsUsed.add(evt.application);
        if (evt.page) pageHits[evt.page] = (pageHits[evt.page] || 0) + 1;

        // Foundational heuristics for interest inference
        const lowerPage = evt.page ? evt.page.toLowerCase() : "";
        if (lowerPage.includes("buyer") || lowerPage.includes("cumpara")) {
          inferredInterests.add("buyer_intent");
        }
        if (lowerPage.includes("seller") || lowerPage.includes("vinde")) {
          inferredInterests.add("seller_intent");
        }
        if (lowerPage.includes("opportunity") || lowerPage.includes("oportunitat")) {
          inferredInterests.add("investment_intent");
        }
        if (lowerPage.includes("insurance") || lowerPage.includes("asigurari")) {
          inferredInterests.add("insurance_intent");
        }
      });

      const frequentPages = Object.entries(pageHits)
        .sort((a, b) => b[1] - a[1])
        .map(([page]) => page)
        .slice(0, 5);

      return {
        visitorId,
        applicationsUsed: Array.from(applicationsUsed),
        totalActions: events.length,
        frequentPages,
        lastActive: events[0].timestamp,
        inferredInterests: Array.from(inferredInterests),
      };
    } catch (error) {
      console.error("[AiX Knowledge Service] Profile resolution error:", error);
      return null;
    }
  }
}

export const knowledge = new KnowledgeMemoryService();
export default knowledge;
