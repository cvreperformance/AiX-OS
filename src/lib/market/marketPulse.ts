/**
 * AiX OS — Market Pulse Engine
 * Computes market sentiment and investment attractiveness from macro data.
 */

import { macroIndicators, getKeyIndicators } from "./macroIndicators";

export type SentimentLabel = "Bearish" | "Cautious" | "Neutral" | "Optimistic" | "Bullish";

export interface MarketPulse {
  score: number;          // 0–100
  label: SentimentLabel;
  emoji: string;
  color: string;
  description: string;
  recommendation: string;
  factors: MarketFactor[];
  updatedAt: string;
}

export interface MarketFactor {
  id: string;
  label: string;
  impact: "strongly_positive" | "positive" | "neutral" | "negative" | "strongly_negative";
  value: string;
  note: string;
}

// ─── Static factor definitions ─────────────────────────────────────────────
// Each factor has a weight + current assessment
const MARKET_FACTORS: MarketFactor[] = [
  {
    id: "robor-trend",
    label: "ROBOR în scădere",
    impact: "positive",
    value: "6.85% (-0.05pp)",
    note: "Trendul descendent eliberează presiunea pe creditele variabile",
  },
  {
    id: "ecb-cuts",
    label: "Reduceri BCE",
    impact: "positive",
    value: "3.40% (-0.25pp)",
    note: "Politica monetară relaxată în zona euro susține investițiile",
  },
  {
    id: "price-convergence",
    label: "Convergență spre UE",
    impact: "strongly_positive",
    value: "€2,650/mp vs €5,000+ UE",
    note: "Prețurile rămân la 50–60% din media UE — potențial semnificativ",
  },
  {
    id: "gdp-growth",
    label: "Creștere PIB",
    impact: "positive",
    value: "+4.1% YoY",
    note: "Una din cele mai rapide creșteri din UE susține cererea imobiliară",
  },
  {
    id: "vat-new-builds",
    label: "TVA 21% construcții noi",
    impact: "negative",
    value: "21% (aug 2025+)",
    note: "Reduce atracția apartamentelor noi, presionează prețurile la vechi",
  },
  {
    id: "inflation-risk",
    label: "Inflație 4.8%",
    impact: "neutral",
    value: "4.8% YoY",
    note: "Imobiliarele sunt hedge la inflație, dar erodează puterea de cumpărare",
  },
  {
    id: "credit-accessibility",
    label: "Accesibilitate credit",
    impact: "negative",
    value: "Dobândă medie ~8%",
    note: "Creditele scumpe limitează cererea pe segmentul mid",
  },
  {
    id: "transaction-volume",
    label: "Volum tranzacții",
    impact: "positive",
    value: "+8.2% Q1 2026",
    note: "Lichiditate în creștere — piața rămâne activă",
  },
  {
    id: "eu-funds",
    label: "Fonduri UE & PNRR",
    impact: "positive",
    value: "€30B+ alocat RO",
    note: "Investițiile în infrastructură apreciază zonele adiacente",
  },
];

// Impact score mapping
const IMPACT_SCORES: Record<MarketFactor["impact"], number> = {
  strongly_positive: 15,
  positive: 8,
  neutral: 0,
  negative: -8,
  strongly_negative: -15,
};

/**
 * Computes the current market pulse for Romania
 */
export function getRomanianMarketPulse(): MarketPulse {
  const raw = MARKET_FACTORS.reduce((sum, f) => sum + IMPACT_SCORES[f.impact], 0);
  // Normalize to 0–100 (raw range is roughly -45 to +75)
  const score = Math.round(Math.max(0, Math.min(100, 50 + raw)));

  return {
    score,
    ...getSentimentFromScore(score),
    factors: MARKET_FACTORS,
    updatedAt: "2026-07-01",
  };
}

function getSentimentFromScore(score: number): {
  label: SentimentLabel;
  emoji: string;
  color: string;
  description: string;
  recommendation: string;
} {
  if (score >= 75) return {
    label: "Bullish",
    emoji: "🚀",
    color: "text-emerald-400",
    description: "Piața prezintă fundamentale excepționale. Toți indicatorii cheie sunt favorabili.",
    recommendation: "Moment optim de achiziție. Priorități: zonele premium + off-market.",
  };
  if (score >= 60) return {
    label: "Optimistic",
    emoji: "📈",
    color: "text-emerald-500",
    description: "Fundamentale solide cu creștere moderată. Risc redus, upside clar pe termen mediu.",
    recommendation: "Oportunități selective în zonele premium. Buy & hold 5–7 ani.",
  };
  if (score >= 45) return {
    label: "Neutral",
    emoji: "⚖️",
    color: "text-amber-400",
    description: "Piată echilibrată. Oportunități există dar necesită selecție atentă.",
    recommendation: "Focus pe cash-flow și due diligence riguros. Evită supra-prețul.",
  };
  if (score >= 30) return {
    label: "Cautious",
    emoji: "⚠️",
    color: "text-yellow-500",
    description: "Semnale mixte. Prudență recomandată — selectivitate mai mare.",
    recommendation: "Așteaptă corecție sau caută oportunități off-market sub prețul pieței.",
  };
  return {
    label: "Bearish",
    emoji: "🔻",
    color: "text-red-400",
    description: "Condiții dificile. Riscul de corecție este ridicat.",
    recommendation: "Conservă capitalul. Evaluează piețe alternative (Dubai, UAE).",
  };
}

/**
 * Quick market ticker for header/banner display
 */
export function getMarketTicker(): string[] {
  return getKeyIndicators(6).map(
    (i) => `${i.labelShort ?? i.label}: ${i.value} ${i.change}`
  );
}

/**
 * Investment attractiveness by market
 */
export const MARKET_ATTRACTIVENESS = {
  romania: {
    score: 72,
    label: "Optimistic" as SentimentLabel,
    highlights: ["Convergență UE", "PIB +4.1%", "Yield 6.2%"],
    risks: ["TVA 21% noi", "ROBOR 6.85%"],
  },
  dubai: {
    score: 88,
    label: "Bullish" as SentimentLabel,
    highlights: ["0% tax", "Yield 9.1%", "Creștere pop."],
    risks: ["Volatilitate", "Supply mid"],
  },
  monaco: {
    score: 81,
    label: "Bullish" as SentimentLabel,
    highlights: ["0% income tax", "Supply extrem limitat", "Prestige"],
    risks: ["Lichiditate mică", "Entry very high"],
  },
} as const;
