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

  // Simple local slugify matching utils.ts
  function localSlugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/ă|â/g, "a")
      .replace(/î/g, "i")
      .replace(/ș|ş/g, "s")
      .replace(/ț|ţ/g, "t")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Simple local news scoring matching aiScoreEngine.ts
  function localComputeScore(title, summary) {
    const combined = `${title} ${summary}`.toLowerCase();
    let score = 7.0;

    const positiveCues = [
      "scade robor", "scadere robor", "scădere robor", "scade ircc", "scadere ircc", "scădere ircc",
      "reducere dobândă", "reducere dobanda", "scădere dobânzi", "scadere dobanzi", "ieftinire credite",
      "creștere tranzacții", "crestere tranzactii", "record tranzacții", "investiții record",
      "yield ridicat", "apreciere prețuri", "apreciere preturi", "creștere economică", "crestere economica",
      "stabilizare piață", "stabilizare piata", "oportunitate de investiție", "oportunitati de investitii",
      "profit in crestere", "crestere profit", "fonduri europene", "convergenta ue"
    ];

    const negativeCues = [
      "crește robor", "creste robor", "crește ircc", "creste ircc", "majorare taxe", "creștere taxe",
      "majorare tva", "creștere tva", "scumpire apartamente", "scădere tranzacții", "scadere tranzactii",
      "scădere prețuri", "scadere preturi", "criză imobiliară", "criza imobiliara", "risc de blocaj",
      "inflație mare", "inflatie mare", "penurie materiale", "creștere dobânzi", "crestere dobanzi",
      "penurie de locuinte", "scumpiri materiale"
    ];

    for (const cue of positiveCues) {
      if (combined.includes(cue)) score += 0.5;
    }
    for (const cue of negativeCues) {
      if (combined.includes(cue)) score -= 0.5;
    }

    score = Math.max(5.0, Math.min(9.5, score));
    score = Math.round(score * 10) / 10;

    let explanation = "Acest semnal indică o dinamică de piață favorabilă, caracterizată de condiții îmbunătățite de finanțare sau de interes puternic pe segmentul de dezvoltare.";
    let insight = "Oportunitate optimă pentru plasarea capitalului. Recomandăm focalizarea pe achiziții în zone premium cu perspective clare de apreciere.";

    if (score < 7.5 && score >= 6.5) {
      explanation = "Articolul prezintă semnale neutre. Piața locală traversează o perioadă de consolidare, unde evoluțiile depind de politicile monetare viitoare.";
      insight = "Menține o abordare selectivă. Monitorizează îndeaproape indicii de preț locali și negociază marjele de profit.";
    } else if (score < 6.5) {
      explanation = "Semnalul evidențiază o creștere a costurilor sau modificări legislative cu impact direct asupra randamentului imobiliar.";
      insight = "Recomandăm prudență maximă în planificarea noilor proiecte și recalibrarea așteptărilor de yield în funcție de noile taxe.";
    }

    return { score, explanation, insight };
  }

  // Transform RSS items to the shape expected by the `news` table
  const records = [];
  for (const item of feed.items) {
    const title = item.title ?? "Untitled";
    const summary = item.contentSnippet ?? item.content ?? "";
    const categories = (item.categories ?? []).map(c => c.toLowerCase());

    // 1. Validation: Block generic test content
    if (/^(test\b|dummy\b|demo\b)/i.test(title.trim()) || /^(test\b|dummy\b|demo\b)/i.test(summary.trim())) {
      continue;
    }

    // 2. Reject explicit irrelevant categories
    const rejectCategories = ["sport", "fotbal", "monden", "divertisment", "lifestyle", "showbiz", "vedete", "horoscop", "timp liber", "auto"];
    if (categories.some(cat => rejectCategories.includes(cat))) {
      continue;
    }

    // 3. Relevance check
    const combined = `${title} ${summary} ${categories.join(" ")}`.toLowerCase();
    const relevanceKeywords = [
      "imobiliar", "apartament", "casă", "case", "rezidențial", "clădire", "locuință",
      "dobândă", "dobânzi", "credit", "credite", "ipotecar", "robor", "ircc", "bnr",
      "inflație", "inflatie", "fiscal", "impozit", "buget", "finanțe", "finante",
      "economic", "economie", "construcții", "constructii", "asigurare", "asigurări",
      "investiții", "investitii", "euro", "leul", "valută", "bce", "fed", "storia", "olx"
    ];
    const isRelevant = relevanceKeywords.some(keyword => combined.includes(keyword));
    const strictRejectKeywords = ["fotbal", "campionatul mondial", "semifinală", "sportiv", "liga 1", "tenis", "olimpiada", "bătălia de", "meciul dintre"];
    const containsStrictReject = strictRejectKeywords.some(keyword => combined.includes(keyword));

    if (!isRelevant || containsStrictReject) {
      continue;
    }

    const published = item.isoDate ?? item.pubDate ?? new Date().toISOString();
    const slug = localSlugify(title);
    const scoreResult = localComputeScore(title, summary);

    // Determine category mapping
    let category = "Markets";
    if (combined.includes("imobiliar") || combined.includes("apartament") || combined.includes("locuință")) {
      category = "Real Estate";
    } else if (combined.includes("construc")) {
      category = "Construction";
    } else if (combined.includes("asigur")) {
      category = "Insurance";
    } else if (combined.includes("finan") || combined.includes("dobân") || combined.includes("robor") || combined.includes("ircc")) {
      category = "Finance";
    } else if (combined.includes("investi")) {
      category = "Investments";
    }

    records.push({
      slug,
      title,
      summary,
      content: item.content ?? summary,
      category,
      source_url: item.link ?? "",
      published_at: published,
      aix_score: scoreResult.score,
      score_explanation: scoreResult.explanation,
      investment_insight: scoreResult.insight,
      status: "published"
    });
  }

  if (records.length === 0) {
    console.log("No relevant records found to upsert.");
    return;
  }

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
