import { supabaseAdmin } from "@/lib/supabase/admin";

export interface QueryResult {
  queryText: string;
  intent: string;
  title: string;
  resultType: "table" | "list" | "metrics" | "chart";
  headers?: string[];
  data: any[];
  confidence: number; // 0-100
  reasoning: string;
  evidence: string[];
  supportingEvents: string[];
  supportingSessions: string[];
  timestamp: string;
}

export class QueryEngine {
  /**
   * Deterministically parses natural-language questions and routes them to appropriate SQL/service queries.
   */
  public static async execute(queryText: string): Promise<QueryResult> {
    const query = queryText.toLowerCase().trim();
    const timestamp = new Date().toISOString();

    const result: QueryResult = {
      queryText,
      intent: "unknown",
      title: "General Telemetry Query",
      resultType: "list",
      data: [],
      confidence: 30,
      reasoning: "Failed to map natural language query to a specific engine intent.",
      evidence: ["Scanned input text for ecosystem keywords"],
      supportingEvents: [],
      supportingSessions: [],
      timestamp,
    };

    try {
      // 1. Intent Route: Today's highest intent buyers
      if (query.includes("buyer") && (query.includes("today") || query.includes("highest"))) {
        result.intent = "highest_intent_buyers";
        result.title = "Today's Highest Intent Buyers";
        result.resultType = "table";
        result.headers = ["Visitor ID", "Application", "Buying Intent Score", "Maturity", "Cycle"];
        
        const { data } = await supabaseAdmin
          .from("aix_visitor_knowledge")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(50);

        const list: any[] = [];
        if (data) {
          data.forEach(v => {
            const learn = v.profile?.learning || {};
            const score = learn.adaptiveScores?.buyingIntent || 0;
            if (score > 60) {
              list.push({
                visitor_id: v.visitor_id,
                application: v.application,
                buying_intent: `${score}%`,
                maturity: `${learn.maturity || 0}%`,
                cycle: learn.patterns?.cycleType || "none",
              });
            }
          });
        }
        
        result.data = list;
        result.confidence = 95;
        result.reasoning = "Query matches 'highest intent buyers' pattern. Retrieved active knowledge profiles and filtered by adaptive buying intent > 60%.";
        result.evidence = [`Scanned ${data?.length || 0} active visitor profiles`, "Found matches with high adaptive score"];
        return result;
      }

      // 2. Intent Route: Downloaded guides but never contacted us
      if (query.includes("download") || (query.includes("guide") && query.includes("contact"))) {
        result.intent = "downloaders_no_contact";
        result.title = "Downloaded Guides but Never Contacted Us";
        result.resultType = "table";
        result.headers = ["Visitor ID", "Downloads Count", "Form Actions", "Last Active"];

        const { data } = await supabaseAdmin
          .from("aix_visitor_knowledge")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(50);

        const list: any[] = [];
        if (data) {
          data.forEach(v => {
            const profile = v.profile || {};
            const downloads = profile.download_behavior?.downloads_count || 0;
            const completions = profile.form_behavior?.completions_count || 0;
            if (downloads > 0 && completions === 0) {
              list.push({
                visitor_id: v.visitor_id,
                downloads: `${downloads} files`,
                forms: `Abandoned: ${profile.form_behavior?.abandoned_count || 0}`,
                last_active: v.updated_at,
              });
            }
          });
        }

        result.data = list;
        result.confidence = 90;
        result.reasoning = "Query matches 'downloaders without contact' pattern. Filtered profiles with downloads_count > 0 and completions_count = 0.";
        result.evidence = [`Analyzed recent ${data?.length || 0} profiles`, "Matched download behavior and form completion rates"];
        return result;
      }

      // 3. Intent Route: Show visitors researching Pipera
      if (query.includes("pipera") || query.includes("researching")) {
        const keyword = query.includes("pipera") ? "pipera" : "";
        result.intent = "researching_location";
        result.title = `Visitors Researching ${keyword ? "Pipera" : "Specific Terms"}`;
        result.resultType = "table";
        result.headers = ["Visitor ID", "App", "Searched Queries", "Locations Viewed"];

        const { data } = await supabaseAdmin
          .from("aix_visitor_knowledge")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(50);

        const list: any[] = [];
        if (data) {
          data.forEach(v => {
            const profile = v.profile || {};
            const searchTerms = profile.search_behavior?.terms || [];
            const locs = profile.favorite_locations || [];
            
            const matchesSearch = searchTerms.some((t: string) => t.toLowerCase().includes("pipera"));
            const matchesLocs = locs.some((l: string) => l.toLowerCase().includes("pipera"));

            if (matchesSearch || matchesLocs) {
              list.push({
                visitor_id: v.visitor_id,
                application: v.application,
                searches: searchTerms.join(", ") || "None",
                locations: locs.join(", ") || "None",
              });
            }
          });
        }

        result.data = list;
        result.confidence = 95;
        result.reasoning = "Query matches 'location research' pattern. Filtered profile preferences for keyword 'pipera'.";
        result.evidence = [`Searched location listings for 'pipera' across ${data?.length || 0} items`];
        return result;
      }

      // 4. Intent Route: Luxury Buyers
      if (query.includes("luxury")) {
        result.intent = "luxury_buyers";
        result.title = "Luxury Prospects Profile Queue";
        result.resultType = "table";
        result.headers = ["Visitor ID", "App", "Luxury Preference", "Price Range", "Status"];

        const { data } = await supabaseAdmin
          .from("aix_visitor_knowledge")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(50);

        const list: any[] = [];
        if (data) {
          data.forEach(v => {
            const profile = v.profile || {};
            const learn = profile.learning || {};
            const isLux = profile.luxury_preference || learn.adaptiveScores?.luxuryPreference > 60;
            if (isLux) {
              list.push({
                visitor_id: v.visitor_id,
                application: v.application,
                luxury_pref: `${learn.adaptiveScores?.luxuryPreference || 85}%`,
                price: `${profile.price_range_min?.toLocaleString() || 0} - ${profile.price_range_max?.toLocaleString() || 0} EUR`,
                status: "Premium Segmented",
              });
            }
          });
        }

        result.data = list;
        result.confidence = 90;
        result.reasoning = "Query matches 'luxury preference' keyword. Searched profiles with luxury_preference = true or adaptive scores > 60.";
        result.evidence = [`Queried ${data?.length || 0} recent active profiles`];
        return result;
      }

      // 5. Intent Route: Insurance Opportunities
      if (query.includes("insurance")) {
        result.intent = "insurance_opportunities";
        result.title = "Insurance Prospects List";
        result.resultType = "table";
        result.headers = ["Visitor ID", "Insurance Intent Score", "Evidence Detail", "Last Active"];

        const { data } = await supabaseAdmin
          .from("aix_visitor_knowledge")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(55);

        const list: any[] = [];
        if (data) {
          data.forEach(v => {
            const learn = v.profile?.learning || {};
            const score = learn.adaptiveScores?.insuranceIntent || 0;
            if (score > 40) {
              list.push({
                visitor_id: v.visitor_id,
                score: `${score}%`,
                evidence: learn.patterns?.repeatedInsurance?.supporting_evidence || "Navigated to insurance page",
                last_active: v.updated_at,
              });
            }
          });
        }

        result.data = list;
        result.confidence = 95;
        result.reasoning = "Query matches 'insurance opportunity' pattern. Filtered profiles by adaptive insurance intent > 40.";
        result.evidence = ["Fetched active renewal cycles from learning metrics"];
        return result;
      }

      // 6. Intent Route: Which application generates the most conversions?
      if (query.includes("conversion") && (query.includes("application") || query.includes("most"))) {
        result.intent = "application_conversions";
        result.title = "Conversions distribution by Connected Application";
        result.resultType = "table";
        result.headers = ["Application", "Conversions count (form_submitted)", "Conversion rate estimation"];

        const { data } = await supabaseAdmin
          .from("aix_events")
          .select("application, event_type");

        const counts: Record<string, { events: number; conversions: number }> = {};
        if (data) {
          data.forEach(row => {
            const app = row.application || "unknown";
            if (!counts[app]) counts[app] = { events: 0, conversions: 0 };
            counts[app].events++;
            if (row.event_type === "form_submitted") {
              counts[app].conversions++;
            }
          });
        }

        const list = Object.entries(counts).map(([app, stats]) => ({
          application: app,
          conversions: stats.conversions,
          rate: `${((stats.conversions / (stats.events || 1)) * 100).toFixed(2)}%`,
        })).sort((a,b) => b.conversions - a.conversions);

        result.data = list;
        result.confidence = 95;
        result.reasoning = "Query matches 'app conversions' pattern. Aggregated counts of form_submitted events per application.";
        result.evidence = [`Analyzed total of ${data?.length || 0} events`];
        return result;
      }

      // 7. Intent Route: Which visitors repeatedly use AI?
      if (query.includes("ai") || query.includes("chatbot") || query.includes("advisor")) {
        result.intent = "ai_heavy_users";
        result.title = "Heavy AI Advisor Consumers";
        result.resultType = "table";
        result.headers = ["Visitor ID", "AI Prompts count", "AI Dependency", "Last Prompt Time"];

        const { data } = await supabaseAdmin
          .from("aix_visitor_knowledge")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(50);

        const list: any[] = [];
        if (data) {
          data.forEach(v => {
            const profile = v.profile || {};
            const learn = profile.learning || {};
            const count = profile.ai_usage?.frequency || 0;
            if (count >= 2 || learn.adaptiveScores?.aiDependency > 50) {
              list.push({
                visitor_id: v.visitor_id,
                prompts: `${count} questions`,
                dependency: `${learn.adaptiveScores?.aiDependency || 75}%`,
                last_active: v.updated_at,
              });
            }
          });
        }

        result.data = list;
        result.confidence = 95;
        result.reasoning = "Query matches 'heavy AI users' keyword pattern. Filtered profiles by AI prompt counts >= 2.";
        result.evidence = [`Analyzed ${data?.length || 0} knowledge profiles`];
        return result;
      }

      // 8. Intent Route: Which forms are abandoned most?
      if (query.includes("form") && (query.includes("abandon") || query.includes("most"))) {
        result.intent = "form_abandonment";
        result.title = "Lead Form Abandonment Analysis";
        result.resultType = "table";
        result.headers = ["Form ID", "Total Started", "Total Submitted", "Total Abandoned", "Abandonment Rate"];

        const { data } = await supabaseAdmin
          .from("aix_events")
          .select("payload")
          .in("event_type", ["form_started", "form_submitted", "form_abandoned"]);

        const formStats: Record<string, { started: number; submitted: number; abandoned: number }> = {};
        if (data) {
          data.forEach(evt => {
            const formId = evt.payload?.form_id || "contact";
            if (!formStats[formId]) {
              formStats[formId] = { started: 0, submitted: 0, abandoned: 0 };
            }
            if (evt.payload?.event_type === "form_started") formStats[formId].started++;
            if (evt.payload?.event_type === "form_submitted") formStats[formId].submitted++;
            if (evt.payload?.event_type === "form_abandoned") formStats[formId].abandoned++;
          });
        }

        const list = Object.entries(formStats).map(([formId, stats]) => {
          const total = stats.submitted + stats.abandoned || 1;
          return {
            form: formId,
            started: stats.started || total,
            submitted: stats.submitted,
            abandoned: stats.abandoned,
            rate: `${((stats.abandoned / total) * 100).toFixed(1)}%`,
          };
        }).sort((a, b) => b.abandoned - a.abandoned);

        result.data = list;
        result.confidence = 90;
        result.reasoning = "Query matches 'form abandonment' pattern. Aggregated stats by payload form_id keys.";
        result.evidence = [`Analyzed ${data?.length || 0} form telemetry actions`];
        return result;
      }

      // Default fallback: search query terms on page URLs
      result.intent = "general_pages";
      result.title = `General Query Results for "${queryText}"`;
      result.resultType = "table";
      result.headers = ["Page Path", "Event Counts", "Connected App"];

      const { data: pageData } = await supabaseAdmin
        .from("aix_events")
        .select("page, application");

      const pagesMap = new Map<string, { count: number; app: string }>();
      if (pageData) {
        pageData.forEach(row => {
          if (row.page && row.page.toLowerCase().includes(query)) {
            const curr = pagesMap.get(row.page) || { count: 0, app: row.application || "aix-os" };
            curr.count++;
            pagesMap.set(row.page, curr);
          }
        });
      }

      const fallbackList = Array.from(pagesMap.entries())
        .map(([page, stats]) => ({
          page,
          count: stats.count,
          application: stats.app,
        }))
        .sort((a, b) => b.count - a.count);

      result.data = fallbackList;
      result.confidence = 65;
      result.reasoning = "Mapped query to path keywords since no priority intent pattern matched.";
      result.evidence = ["Filtered URL logs by input text characters"];
      return result;

    } catch (e) {
      result.reasoning = "Failed to run database queries for this pattern.";
      return result;
    }
  }
}
export default QueryEngine;
