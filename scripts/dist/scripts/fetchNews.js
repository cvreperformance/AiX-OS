// scripts/fetchNews.ts
import { NewsRssProvider } from "../src/lib/providers/newsRss.provider";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
async function main() {
    const rssUrl = process.env.NEXT_PUBLIC_RSS_FEED_URL;
    if (!rssUrl) {
        console.error("NEXT_PUBLIC_RSS_FEED_URL not set");
        process.exit(1);
    }
    // Admin client for background script
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Supabase URL or Service Role Key not set");
        process.exit(1);
    }
    const supabase = createSupabaseClient(supabaseUrl, supabaseServiceKey);
    const provider = new NewsRssProvider(rssUrl);
    await provider.fetchAndStore();
    // Count rows in news table
    const { count, error } = await supabase
        .from("news")
        .select("id", { count: "exact", head: true });
    if (error) {
        console.error("Error counting news rows:", error);
    }
    else {
        console.log(`Total news rows in Supabase: ${count}`);
    }
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
