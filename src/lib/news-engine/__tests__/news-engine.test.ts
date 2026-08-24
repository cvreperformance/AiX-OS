import { describe, it, expect } from "vitest";
import { generateContentHash, normalizeUrl, slugifyTitle, stripHtml } from "../normalizer";
import { classifyCategory, extractIntelligence, isRelevantRealEstateNews, calculateScores } from "../classifier";
import { generateStructuredSummary } from "../summarizer";

describe("News Engine — Normalizer Tests", () => {
  it("normalizes URLs and strips tracking parameters", () => {
    const raw = "https://www.zf.ro/imobiliare/stire?utm_source=rss&utm_medium=feed&oc=5";
    const clean = normalizeUrl(raw);
    expect(clean).toBe("https://www.zf.ro/imobiliare/stire");
  });

  it("generates deterministic content hash", () => {
    const hash1 = generateContentHash("Preturi imobile Bucuresti 2026", "https://zf.ro/stire1");
    const hash2 = generateContentHash("Preturi imobile Bucuresti 2026", "https://zf.ro/stire1?utm_source=test");
    expect(hash1).toBe(hash2);
  });

  it("generates URL slugs clean of special characters", () => {
    const slug = slugifyTitle("Prețurile la apartamentele vechi au crescut cu 27%!");
    expect(slug).toContain("preturile-la-apartamentele-vechi-au-crescut-cu-27");
  });

  it("strips HTML tags clean", () => {
    const html = "<p>Test <strong>bold</strong> <a href='#'>link</a></p>";
    expect(stripHtml(html)).toBe("Test bold link");
  });
});

describe("News Engine — Classifier & Relevance Tests", () => {
  it("accepts real estate relevant articles", () => {
    const title = "BNR: ROBOR 3M scade la 6.85%, iar preturile la apartamentele noi inregistreaza ajustari";
    const summary = "Piața rezidențială din București și Cluj-Napoca evoluează sub impactul noilor dobânzi bancare.";
    expect(isRelevantRealEstateNews(title, summary)).toBe(true);
  });

  it("rejects non-relevant or sports articles", () => {
    const title = "Handbal feminin: Campioana Gloria Bistrita castiga meciul din liga 1";
    const summary = "Meci spectaculos disputat in sala polivalenta.";
    expect(isRelevantRealEstateNews(title, summary)).toBe(false);
  });

  it("classifies categories correctly", () => {
    expect(classifyCategory("TVA crescut la cladiri noi", "")).toBe("TAX");
    expect(classifyCategory("ROBOR 3M scade la creditul ipotecar", "")).toBe("MORTGAGES");
    expect(classifyCategory("One United Properties lanseaza un nou ansamblu", "")).toBe("DEVELOPERS");
    expect(classifyCategory("Cladire de birouri clasa A in Floreasca", "")).toBe("OFFICE");
  });

  it("extracts locations and price metrics accurately", () => {
    const title = "Apartamente de lux in Herastrau Sector 1 Bucuresti la 2.650 euro/mp";
    const summary = "Proiect dezvoltat de One United Properties cu TVA 21%.";
    const intel = extractIntelligence(title, summary);

    expect(intel.location?.city).toBe("Bucharest");
    expect(intel.location?.district).toBe("Sector 1");
    expect(intel.location?.neighborhood).toBe("Herastrau");
    expect(intel.developer).toBe("One United Properties");
    expect(intel.metrics?.sqm_price_eur).toBe(2650);
    expect(intel.metrics?.vat_pct).toBe(21);
  });

  it("calculates realistic AiX scores", () => {
    const scores = calculateScores("Record pe piata imobiliara din Bucuresti", "Preturile au atins un nou maxim", 9.5);
    expect(scores.aix_score).toBeGreaterThanOrEqual(7.0);
    expect(scores.aix_score).toBeLessThanOrEqual(10.0);
  });
});

describe("News Engine — Summarizer Tests", () => {
  it("formats structured 3-part Romanian summary", () => {
    const summary = generateStructuredSummary("Preturi apartamente Bucuresti", "Preturile la apartamentele vechi au intrecut pe cele noi. Cauza principala este diferenta de TVA pe constructii noi.", "PRICES");
    expect(summary).toContain("CE S-A ÎNTÂMPLAT");
    expect(summary).toContain("DE CE CONTEAZĂ");
    expect(summary).toContain("IMPACT ASUPRA PIEȚEI");
  });
});
