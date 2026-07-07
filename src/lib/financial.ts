/**
 * AiX OS™ — Financial Data Layer
 * Step 5: Lightweight financial layer with live-ready placeholders.
 *
 * Production upgrade path:
 * - EUR/RON: BNR open API https://www.bnr.ro/nbrfxrates.xml
 * - Inflation: INS / Eurostat API
 * - Market Sentiment: Proprietary scoring from Supabase
 */

export interface FinancialIndicator {
  id: string;
  label: string;
  value: string;
  numericValue?: number;
  change?: string;
  changeNumeric?: number;
  trend: "up" | "down" | "neutral";
  unit?: string;
  source: string;
  updatedAt: string;
  description?: string;
}

export interface MarketSentiment {
  score: number; // 0-100
  label: "Bearish" | "Cautious" | "Neutral" | "Optimistic" | "Bullish";
  color: string;
  description: string;
  factors: Array<{ label: string; impact: "positive" | "negative" | "neutral" }>;
}

/**
 * Static financial indicators — updated manually or via BNR/ECB cron.
 * Replace with live API calls when backend is ready.
 */
export const financialIndicators: FinancialIndicator[] = [
  {
    id: "eur-ron",
    label: "EUR/RON",
    value: "4.9768",
    numericValue: 4.9768,
    change: "+0.12%",
    changeNumeric: 0.12,
    trend: "up",
    source: "BNR",
    updatedAt: "2026-07-01",
    description: "Cursul de schimb EUR/RON publicat de Banca Națională a României",
  },
  {
    id: "inflation-ro",
    label: "Inflație RO",
    value: "4.8%",
    numericValue: 4.8,
    change: "-0.3pp",
    changeNumeric: -0.3,
    trend: "down",
    unit: "% YoY",
    source: "INS",
    updatedAt: "2026-06-01",
    description: "Rata inflației anuale publicată de Institutul Național de Statistică",
  },
  {
    id: "robor-3m",
    label: "ROBOR 3M",
    value: "6.85%",
    numericValue: 6.85,
    change: "-0.05pp",
    changeNumeric: -0.05,
    trend: "down",
    unit: "%",
    source: "BNR",
    updatedAt: "2026-07-01",
    description: "Rata dobânzii la depozite pe piața interbancară, 3 luni",
  },
  {
    id: "ircc",
    label: "IRCC Q2 2026",
    value: "5.78%",
    numericValue: 5.78,
    change: "-0.22pp",
    changeNumeric: -0.22,
    trend: "down",
    unit: "%",
    source: "BNR",
    updatedAt: "2026-04-01",
    description: "Indicele de Referință pentru Creditele Consumatorilor — baza pentru credite ipotecare noi",
  },
  {
    id: "ecb-rate",
    label: "Dobândă BCE",
    value: "3.40%",
    numericValue: 3.4,
    change: "-0.25pp",
    changeNumeric: -0.25,
    trend: "down",
    unit: "%",
    source: "ECB",
    updatedAt: "2026-06-12",
    description: "Rata dobânzii de referință a Băncii Centrale Europene",
  },
  {
    id: "price-bucharest-old",
    label: "Prețuri Vechi BUC",
    value: "€2,653/mp",
    numericValue: 2653,
    change: "+3.2%",
    changeNumeric: 3.2,
    trend: "up",
    unit: "EUR/mp",
    source: "Storia/OLX Mar 2026",
    updatedAt: "2026-03-01",
    description: "Prețul mediu pe mp pentru apartamente vechi în București",
  },
  {
    id: "price-bucharest-new",
    label: "Prețuri Noi BUC",
    value: "€2,099/mp",
    numericValue: 2099,
    change: "+1.1%",
    changeNumeric: 1.1,
    trend: "up",
    unit: "EUR/mp",
    source: "Imobiliare.ro Mar 2026",
    updatedAt: "2026-03-01",
    description: "Prețul mediu pe mp pentru apartamente noi în București",
  },
  {
    id: "yield-avg-bucharest",
    label: "Yield Mediu BUC",
    value: "6.2%",
    numericValue: 6.2,
    change: "+0.1pp",
    changeNumeric: 0.1,
    trend: "up",
    unit: "% net",
    source: "AiX OS™ Research",
    updatedAt: "2026-07-01",
    description: "Randamentul mediu net din chirii în București, toate zonele",
  },
];

/**
 * Real estate market sentiment scoring for Romania Q2 2026.
 * Score: 0–100 (100 = fully bullish)
 */
export const romanianMarketSentiment: MarketSentiment = {
  score: 64,
  label: "Optimistic",
  color: "text-emerald-400",
  description:
    "Piața imobiliară din România prezintă fundamentale solide cu creștere moderată. Dobânzile în scădere și convergența prețurilor spre media UE susțin un outlook pozitiv pe termen mediu.",
  factors: [
    { label: "Convergență prețuri spre UE", impact: "positive" },
    { label: "ROBOR în scădere", impact: "positive" },
    { label: "Creștere PIB 4%+", impact: "positive" },
    { label: "Cerere expat/corporate solidă", impact: "positive" },
    { label: "TVA 21% pe construcții noi", impact: "negative" },
    { label: "Inflație 4.8% (risc)", impact: "neutral" },
    { label: "Accesibilitate creditare limitată", impact: "negative" },
  ],
};

/**
 * Dubai market sentiment Q2 2026
 */
export const dubaiMarketSentiment: MarketSentiment = {
  score: 82,
  label: "Bullish",
  color: "text-amber-400",
  description:
    "Dubai continuă să fie cel mai dinamic hub imobiliar global. Creștere accelerată a populației, 0% impozit și ROI de 7–12% poziționează piața ca lider mondial.",
  factors: [
    { label: "0% impozit pe câștiguri", impact: "positive" },
    { label: "Creștere accelerată populație", impact: "positive" },
    { label: "ROI 7–12% documentat", impact: "positive" },
    { label: "Plată rate la developer", impact: "positive" },
    { label: "Volatilitate mai mare vs UE", impact: "negative" },
    { label: "Over-supply în segmente mid", impact: "neutral" },
  ],
};

/**
 * Get indicators by category
 */
export function getIndicatorsByCategory(category: "macro" | "property" | "rates") {
  const map = {
    macro: ["eur-ron", "inflation-ro", "ecb-rate"],
    rates: ["robor-3m", "ircc"],
    property: ["price-bucharest-old", "price-bucharest-new", "yield-avg-bucharest"],
  };
  return financialIndicators.filter((i) => map[category].includes(i.id));
}

/**
 * Format for display in market ticker
 */
export function formatTicker(indicator: FinancialIndicator): string {
  return `${indicator.label}: ${indicator.value} ${indicator.change ?? ""}`.trim();
}
