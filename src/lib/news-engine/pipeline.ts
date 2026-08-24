// src/lib/news-engine/pipeline.ts
// Production Ingestion Pipeline for AiX OS™ Real Estate News Engine

import { supabaseAdmin } from "../supabase/admin";
import { RECOMMENDED_NEWS_SOURCES } from "./sourceRegistry";
import { fetchAndParseFeed } from "./parser";
import { generateContentHash, normalizeUrl, parsePublishedDate, slugifyTitle } from "./normalizer";
import { calculateScores, classifyCategory, extractIntelligence, isRelevantRealEstateNews } from "./classifier";
import { generateStructuredSummary } from "./summarizer";
import { IngestionResult, RealEstateNewsArticle } from "./types";

export async function runNewsIngestionPipeline(): Promise<IngestionResult> {
  const startTime = Date.now();
  const runAt = new Date().toISOString();
  const errors: string[] = [];

  let totalIngested = 0;
  let totalRejected = 0;
  let totalDeduplicated = 0;

  console.log("==================================================");
  console.log("STARTING AiX OS™ REAL ESTATE NEWS INGESTION ENGINE");
  console.log("==================================================");

  for (const source of RECOMMENDED_NEWS_SOURCES) {
    const sourceStartTime = Date.now();
    try {
      console.log(`\nFetching source: [${source.name}] -> ${source.feed_url}`);
      const { items, durationMs } = await fetchAndParseFeed(source);

      let sourceIngestedCount = 0;
      let sourceRejectedCount = 0;

      for (const item of items) {
        // 1. Relevance check
        if (!isRelevantRealEstateNews(item.title, item.content)) {
          sourceRejectedCount++;
          totalRejected++;
          continue;
        }

        const normalizedSourceUrl = normalizeUrl(item.sourceUrl);
        const contentHash = generateContentHash(item.title, normalizedSourceUrl);
        const slug = slugifyTitle(item.title);
        const publishedAt = parsePublishedDate(item.publishedAt);

        // 2. Classify & Extract Intelligence
        const category = classifyCategory(item.title, item.content);
        const intelligence = extractIntelligence(item.title, item.content);
        const scores = calculateScores(item.title, item.content, source.credibility_score);
        const structuredSummary = generateStructuredSummary(item.title, item.content, category);

        const articleRecord: RealEstateNewsArticle = {
          source: source.source_key,
          source_name: source.name,
          source_url: normalizedSourceUrl,
          canonical_url: normalizedSourceUrl,
          title: item.title,
          original_title: item.title,
          slug,
          excerpt: item.excerpt,
          content: item.content,
          summary: structuredSummary,
          image_url: item.imageUrl || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
          author: item.author || source.name,
          published_at: publishedAt,

          category,
          subcategory: category.toLowerCase(),

          country: intelligence.location?.country || "Romania",
          city: intelligence.location?.city || "Bucharest",
          district: intelligence.location?.district || null,
          neighborhood: intelligence.location?.neighborhood || null,

          property_segment: intelligence.property_segment || category,
          market_segment: intelligence.market_segment || "Romania Real Estate",

          importance_score: scores.importance_score,
          relevance_score: scores.relevance_score,
          credibility_score: scores.credibility_score,
          aix_score: scores.aix_score,

          is_featured: scores.aix_score >= 8.5,
          is_breaking: scores.importance_score >= 8.0,
          is_published: true,
          is_archived: false,

          tags: intelligence.tags,
          metadata: {
            developer: intelligence.developer || null,
            metrics: intelligence.metrics || {},
            extracted_at: new Date().toISOString(),
          },
          content_hash: contentHash,
        };

        // 3. Upsert into real_estate_news
        const { error: upsertErr, data: upsertData } = await supabaseAdmin
          .from("real_estate_news")
          .upsert(articleRecord, {
            onConflict: "slug",
            ignoreDuplicates: false,
          })
          .select("id");

        if (upsertErr) {
          // Log and skip duplicate slug
          if (upsertErr && upsertErr.message && upsertErr.message.toLowerCase().includes('duplicate')) {
            totalDeduplicated++;
          } else {
            console.error(`❌ Upsert error for "${item.title}":`, upsertErr?.message);
            errors.push(`Upsert error: ${upsertErr?.message}`);
          }
        } else {
          sourceIngestedCount++;
          totalIngested++;
        }

        // 4. Backwards compatibility upsert into `news` table
        try {
          await supabaseAdmin.from("news").upsert({
            slug: articleRecord.slug,
            title: articleRecord.title,
            summary: articleRecord.summary,
            content: articleRecord.content,
            category: articleRecord.category,
            source: articleRecord.source_name,
            source_url: articleRecord.source_url,
            published_at: articleRecord.published_at,
            image_url: articleRecord.image_url,
            aix_score: articleRecord.aix_score,
            country: articleRecord.country,
            status: "published",
          }, { onConflict: "slug", ignoreDuplicates: true });
        } catch {
          // Ignore legacy table errors
        }
      }

      // Update source status in `news_sources`
      const sourceResponseTime = Date.now() - sourceStartTime;
      await supabaseAdmin.from("news_sources").upsert({
        name: source.name,
        source_key: source.source_key,
        feed_url: source.feed_url,
        website_url: source.website_url,
        category_default: source.category_default,
        credibility_score: source.credibility_score,
        status: "ONLINE",
        last_successful_fetch: new Date().toISOString(),
        failure_count: 0,
        response_time_ms: sourceResponseTime,
        articles_count: sourceIngestedCount,
        updated_at: new Date().toISOString(),
      }, { onConflict: "source_key" });

      console.log(`✅ [${source.name}] Ingested: ${sourceIngestedCount}, Filtered: ${sourceRejectedCount}`);
    } catch (err: any) {
      console.error(`❌ Error ingesting source [${source.name}]:`, err.message || err);
      errors.push(`Source ${source.name} failed: ${err.message || err}`);

      // Log failure in `news_sources`
      await supabaseAdmin.from("news_sources").upsert({
        name: source.name,
        source_key: source.source_key,
        feed_url: source.feed_url,
        website_url: source.website_url,
        category_default: source.category_default,
        credibility_score: source.credibility_score,
        status: "DEGRADED",
        last_failed_fetch: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "source_key" });
    }
  }

  const durationMs = Date.now() - startTime;
  const status = errors.length === 0 ? "SUCCESS" : errors.length < RECOMMENDED_NEWS_SOURCES.length ? "DEGRADED" : "FAILURE";

  // Log overall ingestion run
  await supabaseAdmin.from("news_ingestion_logs").insert({
    run_at: runAt,
    duration_ms: durationMs,
    articles_ingested: totalIngested,
    articles_rejected: totalRejected,
    articles_deduplicated: totalDeduplicated,
    status,
    error_details: errors.length > 0 ? errors.join("; ") : null,
  });

  console.log("\n==================================================");
  console.log(`AiX OS™ INGESTION COMPLETED in ${durationMs}ms`);
  console.log(`- Status: ${status}`);
  console.log(`- Articles Ingested: ${totalIngested}`);
  console.log(`- Articles Filtered: ${totalRejected}`);
  console.log(`- Articles Deduplicated: ${totalDeduplicated}`);
  console.log("==================================================");

  return {
    runAt,
    durationMs,
    articlesIngested: totalIngested,
    articlesRejected: totalRejected,
    articlesDeduplicated: totalDeduplicated,
    status,
    errors,
  };
}
