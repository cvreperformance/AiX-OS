import { supabaseAdmin } from "@/lib/supabase/admin";

export class IntelligenceDeduplicator {
  public static async isDuplicate(
    visitorId: string,
    sessionId: string,
    category: string,
    windowMinutes: number = 30
  ): Promise<boolean> {
    if (!sessionId && !visitorId) return false;

    try {
      const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

      const { data: existingLogs } = await supabaseAdmin
        .from("notification_delivery_log")
        .select("event_type, created_at")
        .gte("created_at", windowStart)
        .eq("telegram_status", "sent");

      if (!existingLogs || existingLogs.length === 0) return false;

      // Group lead categories to prevent duplicate notifications for same session
      const leadCategories: Record<string, string[]> = {
        buyer: ["buyer_request", "property_contact_submit"],
        seller: ["seller_request"],
        insurance: ["insurance_quote_submit", "callback_request", "contact_request"],
        ai: ["ai_prompt_sent", "ai_interactions"]
      };

      const matchedTypes = leadCategories[category] || [category];
      const found = existingLogs.find((l) => matchedTypes.includes(l.event_type));

      if (found) {
        return true;
      }
    } catch (e) {
      console.warn("[IntelligenceDeduplicator] Error checking deduplication:", e);
    }

    return false;
  }
}
