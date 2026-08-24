// src/lib/news-engine/classifier.ts
// Production Classifier & Intelligence Extractor for AiX OS™ Real Estate News Engine

import { ExtractedIntelligence, TaxonomyCategory } from "./types";

const RELEVANCE_KEYWORDS = [
  "imobiliar", "imobiliare", "apartament", "apartamente", "casă", "case", "rezidențial",
  "clădire", "locuință", "locuințe", "ansamblu rezidențial", "teren", "terenuri",
  "dobândă", "dobânzi", "credit", "credite", "ipotecar", "robor", "ircc", "bnr", "bce",
  "dezvoltator", "dezvoltatori", "construcții", "constructii", "șantier", "autorizație de construire",
  "chirie", "chirii", "birouri", "spațiu comercial", "spații comerciale", "parc industrial",
  "logistic", "ancpi", "cadastru", "tva", "puz", "pug", "urbanism", "randament",
  "investiție imobiliară", "proprietate", "proprietăți", "penthouse", "vila", "vile",
  "one united", "skanska", "vastint", "nepi rockcastle", "afi europe", "porr", "strabag",
  "prime kapital", "globalworth", "spektrum", "nordis", "herastrau", "floreasca", "pipera"
];

const STRICT_REJECT_KEYWORDS = [
  "fotbal", "handbal", "tenis", "sport", "campionat", "liga 1", "olimpiada", "meci", "arbitru", "gazon",
  "supercupa", "halep", "popovici", "hagi", "fcsb", "dinamo", "rapid", "steaua", "bistrița", "bistrita",
  "horoscop", "zodie", "astrologie", "vedetă", "divorț", "cancan", "showbiz", "moda", "lifestyle",
  "crimă", "rețetă", "retetă", "dietă", "bătălie politică", "alegeri interne", "biserică", "preot"
];

export function isRelevantRealEstateNews(title: string, summary: string): boolean {
  const combined = `${title} ${summary}`.toLowerCase();

  // Reject explicit non-relevant topics
  const hasReject = STRICT_REJECT_KEYWORDS.some(k => combined.includes(k));
  if (hasReject) return false;

  // Must match at least one real estate / economic relevance keyword
  const matches = RELEVANCE_KEYWORDS.filter(k => combined.includes(k));
  return matches.length >= 1;
}

export function classifyCategory(title: string, summary: string): TaxonomyCategory {
  const combined = `${title} ${summary}`.toLowerCase();

  if (combined.includes("birou") || combined.includes("office") || combined.includes("clădire de birouri") || combined.includes("cladire de birouri")) return "OFFICE";
  if (combined.includes("retail") || combined.includes("mall") || combined.includes("centru comercial")) return "RETAIL";
  if (combined.includes("logistic") || combined.includes("industrial") || combined.includes("depozit")) return "LOGISTICS";
  if (combined.includes("tva") || combined.includes("impozit") || combined.includes("fiscal")) return "TAX";
  if (combined.includes("puz") || combined.includes("pug") || combined.includes("urbanism") || combined.includes("primări")) return "URBANISM";
  if (combined.includes("infrastructură") || combined.includes("metro") || combined.includes("autostrad")) return "INFRASTRUCTURE";
  if (combined.includes("lux") || combined.includes("penthouse") || combined.includes("herastrau") || combined.includes("floreasca")) return "LUXURY";
  if (combined.includes("robor") || combined.includes("ircc") || combined.includes("dobân") || combined.includes("ipotec")) return "MORTGAGES";
  if (combined.includes("dezvoltator") || combined.includes("one united") || combined.includes("skanska") || combined.includes("vastint")) return "DEVELOPERS";
  if (combined.includes("construc")) return "CONSTRUCTION";
  if (combined.includes("teren") || combined.includes("lot")) return "LAND";
  if (combined.includes("chirie") || combined.includes("chirii") || combined.includes("închiriere")) return "RENTAL";
  if (combined.includes("preț") || combined.includes("pret") || combined.includes("€/mp") || combined.includes("eur/mp")) return "PRICES";
  if (combined.includes("tranzacți") || combined.includes("vânză") || combined.includes("achiziți")) return "TRANSACTIONS";
  if (combined.includes("investi")) return "INVESTMENT";
  if (combined.includes("rezidențial") || combined.includes("apartament") || combined.includes("locuinț")) return "RESIDENTIAL";
  if (combined.includes("inflați") || combined.includes("pib") || combined.includes("bce") || combined.includes("bnr")) return "MACROECONOMICS";

  return "MARKET";
}

export function extractIntelligence(title: string, summary: string): ExtractedIntelligence {
  const combined = `${title} ${summary}`.toLowerCase();

  // Location extraction
  const location: ExtractedIntelligence["location"] = { country: "Romania" };
  if (combined.includes("bucurești") || combined.includes("bucuresti")) {
    location.city = "Bucharest";
  } else if (combined.includes("cluj")) {
    location.city = "Cluj-Napoca";
  } else if (combined.includes("timișoara") || combined.includes("timisoara")) {
    location.city = "Timisoara";
  } else if (combined.includes("iași") || combined.includes("iasi")) {
    location.city = "Iasi";
  } else if (combined.includes("brașov") || combined.includes("brasov")) {
    location.city = "Brasov";
  } else if (combined.includes("constanța") || combined.includes("constanta")) {
    location.city = "Constanta";
  } else if (combined.includes("ilfov")) {
    location.city = "Ilfov";
  }

  if (combined.includes("sector 1") || combined.includes("herăstrău") || combined.includes("floreasca") || combined.includes("primăverii")) {
    location.district = "Sector 1";
    if (combined.includes("herăstrău") || combined.includes("herastrau")) location.neighborhood = "Herastrau";
    if (combined.includes("floreasca")) location.neighborhood = "Floreasca";
    if (combined.includes("primăverii") || combined.includes("primaverii")) location.neighborhood = "Primaverii";
  } else if (combined.includes("sector 2") || combined.includes("pipera")) {
    location.district = "Sector 2";
    if (combined.includes("pipera")) location.neighborhood = "Pipera";
  }

  // Developer / Company extraction
  let developer: string | undefined;
  if (combined.includes("one united")) developer = "One United Properties";
  else if (combined.includes("skanska")) developer = "Skanska";
  else if (combined.includes("vastint")) developer = "Vastint";
  else if (combined.includes("nepi rockcastle")) developer = "NEPI Rockcastle";
  else if (combined.includes("afi europe")) developer = "AFI Europe";
  else if (combined.includes("globalworth")) developer = "Globalworth";
  else if (combined.includes("prime kapital")) developer = "Prime Kapital";

  // Numbers extraction (VERBATIM ONLY - NEVER INVENT)
  const metrics: ExtractedIntelligence["metrics"] = {};

  // EUR/sqm extraction
  const sqmMatch = combined.match(/(\d+[\d.,]*)\s*(?:euro|eur|€)\s*\/\s*(?:mp|m2|metru pătrat)/i);
  if (sqmMatch) {
    const val = parseFloat(sqmMatch[1].replace(".", "").replace(",", "."));
    if (!isNaN(val)) metrics.sqm_price_eur = val;
  }

  // Interest rate extraction
  const rateMatch = combined.match(/(?:robor|ircc|dobândă|bce|bnr)\s*[^0-9]*(\d+[\d.,]*)\s*%/i);
  if (rateMatch) {
    const val = parseFloat(rateMatch[1].replace(",", "."));
    if (!isNaN(val)) metrics.interest_rate_pct = val;
  }

  // VAT extraction
  const vatMatch = combined.match(/tva\s*[^0-9]*(\d+[\d.,]*)\s*%/i);
  if (vatMatch) {
    const val = parseFloat(vatMatch[1].replace(",", "."));
    if (!isNaN(val)) metrics.vat_pct = val;
  }

  // Tags
  const tags: string[] = ["Piață Imobiliară"];
  if (location.city) tags.push(location.city);
  if (developer) tags.push(developer);
  if (metrics.sqm_price_eur) tags.push(`Preț: ${metrics.sqm_price_eur} €/mp`);
  if (metrics.interest_rate_pct) tags.push(`Dobândă: ${metrics.interest_rate_pct}%`);

  return {
    location,
    developer,
    metrics,
    tags,
  };
}

export function calculateScores(title: string, summary: string, sourceCredibility: number) {
  const combined = `${title} ${summary}`.toLowerCase();

  let relevance_score = 6.0;
  if (combined.includes("imobiliar") || combined.includes("apartament") || combined.includes("rezidențial")) relevance_score += 2.0;
  if (combined.includes("bucurești") || combined.includes("robor") || combined.includes("ircc")) relevance_score += 1.5;
  relevance_score = Math.min(10.0, Math.max(1.0, relevance_score));

  let importance_score = 5.0;
  if (combined.includes("record") || combined.includes("bce") || combined.includes("bnr") || combined.includes("tva")) importance_score += 2.5;
  if (combined.includes("creștere") || combined.includes("scădere") || combined.includes("tranzacți")) importance_score += 1.5;
  importance_score = Math.min(10.0, Math.max(1.0, importance_score));

  const credibility_score = Math.min(10.0, Math.max(1.0, sourceCredibility));

  const aix_score = Number(((relevance_score * 0.4) + (importance_score * 0.4) + (credibility_score * 0.2)).toFixed(1));

  return {
    relevance_score: Number(relevance_score.toFixed(1)),
    importance_score: Number(importance_score.toFixed(1)),
    credibility_score: Number(credibility_score.toFixed(1)),
    aix_score,
  };
}
