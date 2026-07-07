/**
 * AiX OS™ — Macro Indicators Module
 * Real BNR/INS/ECB data with typed structure and formatting utilities.
 * Source of truth for all financial indicators displayed across the platform.
 */

export type IndicatorTrend = "up" | "down" | "neutral";
export type IndicatorCategory = "rates" | "macro" | "property" | "global";

export interface MacroIndicator {
  id: string;
  label: string;
  labelShort?: string;
  value: string;
  numericValue: number;
  change: string;
  changeNumeric: number;
  trend: IndicatorTrend;
  unit: string;
  category: IndicatorCategory;
  source: string;
  updatedAt: string;
  description: string;
  positiveIsUp: boolean; // true = up trend is good news, false = down is good
}

export const macroIndicators: MacroIndicator[] = [
  // ─── Rates ────────────────────────────────────────────────────────────────
  {
    id: "eur-ron",
    label: "EUR / RON",
    labelShort: "EUR/RON",
    value: "4.9768",
    numericValue: 4.9768,
    change: "+0.12%",
    changeNumeric: 0.12,
    trend: "up",
    unit: "RON",
    category: "rates",
    source: "BNR",
    updatedAt: "2026-07-01",
    description: "Cursul de schimb EUR/RON publicat zilnic de Banca Națională a României.",
    positiveIsUp: false,
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
    category: "rates",
    source: "BNR",
    updatedAt: "2026-07-01",
    description: "Rata dobânzii la depozitele interbancare pe 3 luni. Baza creditelor variabile vechi.",
    positiveIsUp: false,
  },
  {
    id: "ircc-q2-2026",
    label: "IRCC Q2 2026",
    value: "5.78%",
    numericValue: 5.78,
    change: "-0.22pp",
    changeNumeric: -0.22,
    trend: "down",
    unit: "%",
    category: "rates",
    source: "BNR",
    updatedAt: "2026-04-01",
    description: "Indicele de Referință pentru Creditele Consumatorilor — baza creditelor noi din 2019+.",
    positiveIsUp: false,
  },
  {
    id: "ecb-rate",
    label: "Dobândă BCE",
    value: "3.40%",
    numericValue: 3.40,
    change: "-0.25pp",
    changeNumeric: -0.25,
    trend: "down",
    unit: "%",
    category: "rates",
    source: "ECB",
    updatedAt: "2026-06-12",
    description: "Rata dobânzii de referință a Băncii Centrale Europene. Influențează indirect piața RO.",
    positiveIsUp: false,
  },
  // ─── Macro ────────────────────────────────────────────────────────────────
  {
    id: "inflation-ro",
    label: "Inflație RO",
    value: "4.8%",
    numericValue: 4.8,
    change: "-0.3pp",
    changeNumeric: -0.3,
    trend: "down",
    unit: "% YoY",
    category: "macro",
    source: "INS",
    updatedAt: "2026-06-01",
    description: "Rata inflației anuale în România. Proprietățile imobiliare sunt un hedge natural.",
    positiveIsUp: false,
  },
  {
    id: "gdp-growth-ro",
    label: "PIB România",
    value: "+4.1%",
    numericValue: 4.1,
    change: "+0.3pp",
    changeNumeric: 0.3,
    trend: "up",
    unit: "% YoY",
    category: "macro",
    source: "INS / Eurostat",
    updatedAt: "2026-06-01",
    description: "Creșterea economică a României — driver principal al convergenței prețurilor spre media UE.",
    positiveIsUp: true,
  },
  // ─── Property ─────────────────────────────────────────────────────────────
  {
    id: "price-old-buc",
    label: "Apartamente Vechi BUC",
    labelShort: "Vechi /mp",
    value: "€2,653/mp",
    numericValue: 2653,
    change: "+3.2%",
    changeNumeric: 3.2,
    trend: "up",
    unit: "EUR/mp",
    category: "property",
    source: "Storia/OLX Mar 2026",
    updatedAt: "2026-03-01",
    description: "Prețul mediu pe mp pentru apartamentele vechi în București. 27% PESTE blocuri noi (efect TVA 21%).",
    positiveIsUp: true,
  },
  {
    id: "price-new-buc",
    label: "Apartamente Noi BUC",
    labelShort: "Noi /mp",
    value: "€2,099/mp",
    numericValue: 2099,
    change: "+1.1%",
    changeNumeric: 1.1,
    trend: "up",
    unit: "EUR/mp",
    category: "property",
    source: "Imobiliare.ro Mar 2026",
    updatedAt: "2026-03-01",
    description: "Prețul mediu pe mp pentru apartamente noi. Mai ieftin decât cele vechi — fenomen rar în Europa.",
    positiveIsUp: true,
  },
  {
    id: "yield-avg-buc",
    label: "Yield Mediu BUC",
    value: "6.2% net",
    numericValue: 6.2,
    change: "+0.1pp",
    changeNumeric: 0.1,
    trend: "up",
    unit: "% net/an",
    category: "property",
    source: "AiX OS™ Research",
    updatedAt: "2026-07-01",
    description: "Randamentul mediu net din chirii în București, toate zonele. Zonele cu yield maxim: Iancului, Militari, Titan.",
    positiveIsUp: true,
  },
  {
    id: "transactions-q1",
    label: "Tranzacții Q1 2026",
    value: "18,430",
    numericValue: 18430,
    change: "+8.2%",
    changeNumeric: 8.2,
    trend: "up",
    unit: "unități",
    category: "property",
    source: "ANCPI",
    updatedAt: "2026-04-15",
    description: "Numărul total de tranzacții imobiliare înregistrate în Q1 2026. Piața rămâne activă.",
    positiveIsUp: true,
  },
  // ─── Global ───────────────────────────────────────────────────────────────
  {
    id: "dubai-yield",
    label: "Dubai Yield Mediu",
    value: "9.1%",
    numericValue: 9.1,
    change: "+0.4pp",
    changeNumeric: 0.4,
    trend: "up",
    unit: "% brut/an",
    category: "global",
    source: "DXB / Bayut",
    updatedAt: "2026-06-01",
    description: "Randamentul mediu din chirii în Dubai. Cea mai profitabilă piață din G20.",
    positiveIsUp: true,
  },
  {
    id: "monaco-price",
    label: "Monaco Preț/mp",
    value: "€55,000/mp",
    numericValue: 55000,
    change: "+4.1%",
    changeNumeric: 4.1,
    trend: "up",
    unit: "EUR/mp",
    category: "global",
    source: "Knight Frank",
    updatedAt: "2026-01-01",
    description: "Prețul mediu pe mp în Monaco. Cel mai scump imobil din lume. 0% impozit pe venit.",
    positiveIsUp: true,
  },
];

/** Get indicators by category */
export function getIndicatorsByCategory(cat: IndicatorCategory): MacroIndicator[] {
  return macroIndicators.filter((i) => i.category === cat);
}

/** Get the top N most market-relevant indicators for quick display */
export function getKeyIndicators(n = 6): MacroIndicator[] {
  const priority = ["eur-ron", "robor-3m", "inflation-ro", "price-old-buc", "yield-avg-buc", "gdp-growth-ro", "ecb-rate", "dubai-yield"];
  const sorted = [...macroIndicators].sort(
    (a, b) => priority.indexOf(a.id) - priority.indexOf(b.id)
  );
  return sorted.slice(0, n);
}

/** Format a change string with sign */
export function formatChange(indicator: MacroIndicator): string {
  const isGood = indicator.positiveIsUp
    ? indicator.changeNumeric >= 0
    : indicator.changeNumeric <= 0;
  return `${isGood ? "✓" : "⚠"} ${indicator.change}`;
}
