/**
 * AiX OS™ — AiX Score Engine
 * Computes investment attractiveness scores (0–10) for properties
 * using heuristic rules when no manual score is provided.
 */

import type { Property, Opportunity } from "@/lib/types";

// ─── Zone weights ──────────────────────────────────────────────────────────
const ZONE_SCORES: Record<string, number> = {
  // Premium zones — Budapest-level demand
  "floreasca": 9.2,   "herăstrău": 9.0,  "herastrau": 9.0,
  "aviatorilor": 9.1, "dorobanți": 8.9,  "dorobanti": 8.9,
  "primăverii": 9.3,  "primaverii": 9.3, "kiseleff": 9.0,
  // High-yield zones
  "pipera": 8.0,      "voluntari": 7.8,  "băneasa": 8.5,  "baneasa": 8.5,
  "corbeanca": 7.9,   "otopeni": 7.5,
  // Mid zones
  "iancului": 7.4,    "titan": 7.2,      "militari": 7.0,
  "drumul taberei": 7.1, "berceni": 6.8,
  // International
  "monaco": 9.8,      "dubai": 9.2,      "abu dhabi": 9.0,
};

const PROPERTY_TYPE_MULTIPLIERS: Record<string, number> = {
  "penthouse": 1.15,
  "vilă": 1.10,
  "vila": 1.10,
  "apartament": 1.00,
  "studio": 0.95,
  "birou": 0.90,
  "commercial": 0.88,
};

/**
 * Generates an AiX Score for a property using heuristic rules.
 * Returns the existing score if already set (manual override wins).
 */
export function computeAixScore(property: Pick<Property,
  "aix_score" | "location" | "city" | "price" | "area_sqm" | "property_type" | "features"
>): number {
  // Manual score always wins
  if (property.aix_score != null && property.aix_score > 0) {
    return Math.min(10, Math.max(0, property.aix_score));
  }

  let score = 7.0; // base

  // Zone component (±2 points)
  const locKey = (property.location ?? "").toLowerCase();
  const cityKey = (property.city ?? "").toLowerCase();
  const zoneScore = ZONE_SCORES[locKey] ?? ZONE_SCORES[cityKey];
  if (zoneScore != null) {
    score = score * 0.4 + zoneScore * 0.6;
  }

  // Price per m² signal
  if (property.price && property.area_sqm && property.area_sqm > 0) {
    const pricePerM2 = property.price / property.area_sqm;
    if (pricePerM2 > 4000) score += 0.3;        // premium segment
    else if (pricePerM2 > 2500) score += 0.15;  // mid-premium
    else if (pricePerM2 < 1200) score -= 0.2;   // below market
  }

  // Property type multiplier
  const typeKey = (property.property_type ?? "").toLowerCase();
  const multiplier = PROPERTY_TYPE_MULTIPLIERS[typeKey] ?? 1.0;
  score *= multiplier;

  // Features bonus (max +0.3)
  const featureCount = property.features?.length ?? 0;
  score += Math.min(0.3, featureCount * 0.05);

  return Math.round(Math.min(10, Math.max(0, score)) * 10) / 10;
}

/**
 * Generates an investment insight if none exists.
 */
export function generateInsight(property: Pick<Property,
  "investment_insight" | "price" | "location" | "property_type"
> & { expected_yield?: number }): string {

  if (property.investment_insight) return property.investment_insight;

  const loc = property.location ?? "această zonă";
  const type = (property.property_type ?? "proprietate").toLowerCase();

  if (property.expected_yield && property.expected_yield > 7) {
    return `Yield ridicat de ${property.expected_yield}% face din această ${type} o oportunitate de cashflow solid. Recomandat pentru investitori orientați spre venit pasiv.`;
  }

  const pricePerM2Signal = property.price > 500000
    ? "Segment premium cu supply limitat — apreciere pe termen lung sustenabilă."
    : "Segment accesibil cu potențial de apreciere în contextul convergenței prețurilor spre media UE.";

  return `${pricePerM2Signal} Zona ${loc} prezintă fundamentale solide pentru investiție buy & hold 5–7 ani.`;
}

/**
 * Score label for display
 */
export function getScoreLabel(score: number): {
  label: string;
  color: string;
  bg: string;
} {
  if (score >= 9.0) return { label: "Exceptional", color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/30" };
  if (score >= 8.0) return { label: "Strong Buy",  color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
  if (score >= 7.0) return { label: "Buy",         color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20" };
  if (score >= 6.0) return { label: "Watch",       color: "text-yellow-400",  bg: "bg-yellow-500/10 border-yellow-500/20" };
  if (score >= 5.0) return { label: "Neutral",     color: "text-zinc-400",    bg: "bg-zinc-500/10 border-zinc-500/20" };
  return              { label: "Avoid",        color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20" };
}

/**
 * Scores an opportunity using its yield and type
 */
export function scoreOpportunity(opp: Pick<Opportunity,
  "aix_score" | "expected_yield" | "opportunity_type" | "location"
>): number {
  if (opp.aix_score != null && opp.aix_score > 0) return opp.aix_score;

  let score = 7.5;

  // Yield component
  if (opp.expected_yield) {
    if (opp.expected_yield > 20) score += 1.2;      // development
    else if (opp.expected_yield > 10) score += 0.8;
    else if (opp.expected_yield > 7)  score += 0.5;
    else if (opp.expected_yield > 5)  score += 0.2;
  }

  // Type bonus
  const type = (opp.opportunity_type ?? "").toLowerCase();
  if (type === "off-market")  score += 0.5;
  if (type === "portofoliu")  score += 0.3;
  if (type === "dezvoltare")  score += 0.2;

  // Zone
  const locKey = (opp.location ?? "").toLowerCase();
  for (const [zone, zScore] of Object.entries(ZONE_SCORES)) {
    if (locKey.includes(zone)) { score += (zScore - 7) * 0.1; break; }
  }

  return Math.round(Math.min(10, score) * 10) / 10;
}

export interface NewsScoreResult {
  score: number;
  explanation: string;
  insight: string;
}

export function computeNewsScore(title: string, summary: string): NewsScoreResult {
  const combined = `${title} ${summary}`.toLowerCase();
  let score = 7.0; // base score for neutral news

  // Contextual positive cues (financial, macro, real estate positive indicators)
  const positiveCues = [
    "scade robor", "scadere robor", "scădere robor", "scade ircc", "scadere ircc", "scădere ircc",
    "reducere dobândă", "reducere dobanda", "scădere dobânzi", "scadere dobanzi", "ieftinire credite",
    "creștere tranzacții", "crestere tranzactii", "record tranzacții", "investiții record",
    "yield ridicat", "apreciere prețuri", "apreciere preturi", "creștere economică", "crestere economica",
    "stabilizare piață", "stabilizare piata", "oportunitate de investiție", "oportunitati de investitii",
    "profit in crestere", "crestere profit", "fonduri europene", "convergenta ue"
  ];

  // Contextual negative cues (financial, macro, real estate negative indicators / risks)
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

  // Fallbacks if no specific cues matched
  if (score === 7.0) {
    const generalPositives = ["record", "crestere", "creștere", "dezvoltare", "profit", "investitie", "investiție"];
    const generalNegatives = ["criza", "criză", "risc", "scădere", "scadere", "conflict", "scumpire"];
    
    for (const word of generalPositives) {
      if (combined.includes(word)) { score += 0.2; break; }
    }
    for (const word of generalNegatives) {
      if (combined.includes(word)) { score -= 0.2; break; }
    }
  }

  // Bound score between 5.0 and 9.5 and round to 1 decimal place
  score = Math.max(5.0, Math.min(9.5, score));
  score = Math.round(score * 10) / 10;

  // Generate explanations and insights that match the exact tone of the platform
  let explanation = "";
  let insight = "";

  if (score >= 8.5) {
    explanation = "Acest semnal indică o dinamică de piață favorabilă, caracterizată de condiții îmbunătățite de finanțare sau de interes puternic pe segmentul de dezvoltare.";
    insight = "Oportunitate optimă pentru plasarea capitalului. Recomandăm focalizarea pe achiziții în zone premium cu perspective clare de apreciere.";
  } else if (score >= 7.5) {
    explanation = "Indicatorii reflectă un climat macroeconomic echilibrat, cu riscuri moderate și un trend general de stabilizare a dobânzilor.";
    insight = "Moment potrivit pentru investiții pe termen mediu și lung (buy & hold). Evaluează costul creditării pentru randamente optime.";
  } else if (score >= 6.5) {
    explanation = "Articolul prezintă semnale neutre. Piața locală traversează o perioadă de consolidare, unde evoluțiile depind de politicile monetare viitoare.";
    insight = "Menține o abordare selectivă. Monitorizează îndeaproape indicii de preț locali și negociază marjele de profit.";
  } else {
    explanation = "Semnalul evidențiază o creștere a costurilor sau modificări legislative cu impact direct asupra randamentului imobiliar.";
    insight = "Recomandăm prudență maximă în planificarea noilor proiecte și recalibrarea așteptărilor de yield în funcție de noile taxe.";
  }

  return {
    score,
    explanation,
    insight,
  };
}
