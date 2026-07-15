/* eslint-disable @typescript-eslint/no-require-imports */
const RSSParser = require("rss-parser");

async function main() {
  const rssUrl = process.env.NEXT_PUBLIC_RSS_FEED_URL;
  if (!rssUrl) {
    console.error("NEXT_PUBLIC_RSS_FEED_URL not set");
    process.exit(1);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error("Supabase URL or Service Role Key not set");
    process.exit(1);
  }

  const parser = new RSSParser();
  let feed;
  try {
    feed = await parser.parseURL(rssUrl);
  } catch (err) {
    console.error("Failed to fetch RSS feed", err);
    process.exit(1);
  }

  if (!feed?.items?.length) {
    console.log("No items found in RSS feed");
    return;
  }

  // Transform RSS items to the shape expected by the `news` table
  const records = feed.items.map((item) => {
    const published = item.isoDate ?? item.pubDate ?? new Date().toISOString();
    // Simple slug generation: lower‑case, replace non‑alphanum with hyphens
      const slug = (() => {
        if (item.title) {
          return item.title
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        }
        if (item.link) {
          return item.link
            .toString()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        }
        return `slug-${Date.now()}`;
      })();
    return {
      slug: slug,
      title: item.title ?? "Untitled",
      summary: item.contentSnippet ?? "",
      content: item.content ?? item.contentSnippet ?? "",
      category: feed.title?.toLowerCase().includes("real estate")
        ? "Real Estate"
        : feed.title?.toLowerCase().includes("construction")
        ? "Construction"
        : "General",
      source_url: item.link ?? "",
      published_at: published,
    };
  });

    console.log('First record to be upserted:', records[0]);
  const upsertUrl = `${supabaseUrl}/rest/v1/news?on_conflict=slug`;
  const upsertResponse = await fetch(upsertUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "application/json",
      // Tell Supabase to merge duplicates based on the on_conflict column
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(records),
  });

  if (!upsertResponse.ok) {
    const errText = await upsertResponse.text();
    console.error("Upsert request failed", upsertResponse.status, errText);
    process.exit(1);
  }

  // Supabase may return an empty body for upsert with merge‑duplicates.
  // Safely parse if there is JSON content, otherwise treat as empty array.
  let inserted = [];
  const upsertText = await upsertResponse.text();
  if (upsertText) {
    try {
      inserted = JSON.parse(upsertText);
    } catch (e) {
      console.warn("Upsert response not JSON, treating as empty array");
    }
  }
  console.log(`Upserted ${Array.isArray(inserted) ? inserted.length : 0} records (duplicates ignored).`);

  // Count total rows in the news table (HEAD request returns content‑range header)
  const countUrl = `${supabaseUrl}/rest/v1/news?select=id&limit=0`;
  const countResponse = await fetch(countUrl, {
    method: "HEAD",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
    },
  });

  const rangeHeader = countResponse.headers.get("content-range");
  const match = rangeHeader?.match(/\*\/(\d+)/);
  const totalRows = match ? parseInt(match[1], 10) : "unknown";
  console.log(`Total news rows in Supabase: ${totalRows}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
