/**
 * Real-Time Market Data Provider & Caching Layer - AiX OS 2026
 * Fetches from CoinGecko and public APIs, fallbacks gracefully to cached/mock datasets.
 */

export interface MarketItem {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  desc: string;
}

export interface BillionaireItem {
  rank: number;
  name: string;
  category: string;
  value: string;
  trend: "up" | "down" | "neutral";
  source: string;
}

export interface CompanyItem {
  rank: number;
  name: string;
  category: string;
  value: string;
  trend: "up" | "down" | "neutral";
  ticker: string;
}

export interface GlobalIntelligenceData {
  stocks: MarketItem[];
  commodities: MarketItem[];
  crypto: MarketItem[];
  macro: MarketItem[];
  billionaires: BillionaireItem[];
  companies: CompanyItem[];
}

// Global In-Memory Cache
let cache: {
  timestamp: number;
  data: GlobalIntelligenceData;
} | null = null;

const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache expiry for live feel

// Baseline data for simulation/fallbacks
const BASELINE_DATA: GlobalIntelligenceData = {
  stocks: [
    { label: "S&P 500", value: "5432.50", change: "+0.45%", trend: "up", desc: "Standard & Poor's US" },
    { label: "NASDAQ Composite", value: "18250.80", change: "+0.92%", trend: "up", desc: "Tech Index US" },
    { label: "DOW JONES", value: "40110.20", change: "-0.15%", trend: "down", desc: "Industrial Average US" },
    { label: "STOXX Europe 600", value: "512.40", change: "+0.18%", trend: "up", desc: "European Blue Chip" },
  ],
  commodities: [
    { label: "Gold (Spot)", value: "$2380.50 / oz", change: "+1.20%", trend: "up", desc: "Safe Haven Metal" },
    { label: "Silver (Spot)", value: "$30.15 / oz", change: "+2.45%", trend: "up", desc: "Industrial Precious" },
    { label: "Brent Crude Oil", value: "$82.40 / bbl", change: "-0.85%", trend: "down", desc: "Global Oil Standard" },
    { label: "WTI Crude Oil", value: "$78.10 / bbl", change: "-0.95%", trend: "down", desc: "US Crude Benchmark" },
  ],
  crypto: [
    { label: "Bitcoin (BTC)", value: "$67890.00", change: "+3.40%", trend: "up", desc: "Digital Gold" },
    { label: "Ethereum (ETH)", value: "$3480.20", change: "+2.15%", trend: "up", desc: "Smart Contracts" },
    { label: "Solana (SOL)", value: "$148.50", change: "+5.80%", trend: "up", desc: "High-Speed Layer 1" },
  ],
  macro: [
    { label: "Inflation Rate US", value: "2.8%", change: "-0.2%", trend: "down", desc: "US CPI (YoY)" },
    { label: "Fed Funds Rate", value: "4.25%", change: "-0.25%", trend: "down", desc: "US Federal Reserve" },
    { label: "EUR/USD", value: "1.0850", change: "+0.05%", trend: "up", desc: "Euro / US Dollar FX" },
    { label: "ECB Deposit Rate", value: "3.40%", change: "-0.25%", trend: "down", desc: "European Central Bank" },
  ],
  billionaires: [
    { rank: 1, name: "Elon Musk", category: "Tech & Aerospace (Tesla / SpaceX)", value: "$248.5 B", trend: "up", source: "United States" },
    { rank: 2, name: "Jeff Bezos", category: "Tech & E-commerce (Amazon)", value: "$210.2 B", trend: "up", source: "United States" },
    { rank: 3, name: "Bernard Arnault & Family", category: "Luxury Goods (LVMH)", value: "$195.8 B", trend: "down", source: "France" },
    { rank: 4, name: "Mark Zuckerberg", category: "Tech & Social (Meta)", value: "$178.4 B", trend: "up", source: "United States" },
    { rank: 5, name: "Larry Ellison", category: "Software & Cloud (Oracle)", value: "$152.0 B", trend: "up", source: "United States" },
    { rank: 6, name: "Warren Buffett", category: "Finance & Holdings (Berkshire)", value: "$138.5 B", trend: "down", source: "United States" },
  ],
  companies: [
    { rank: 1, name: "Microsoft Corp. (MSFT)", category: "Tech / Cloud & AI", value: "$3.42 T", trend: "up", ticker: "NASDAQ" },
    { rank: 2, name: "Apple Inc. (AAPL)", category: "Consumer Tech & Devices", value: "$3.35 T", trend: "up", ticker: "NASDAQ" },
    { rank: 3, name: "NVIDIA Corp. (NVDA)", category: "Semiconductors & AI Hardware", value: "$3.18 T", trend: "up", ticker: "NASDAQ" },
    { rank: 4, name: "Alphabet Inc. (GOOGL)", category: "Tech & Search Infrastructure", value: "$2.20 T", trend: "up", ticker: "NASDAQ" },
    { rank: 5, name: "Amazon.com Inc. (AMZN)", category: "E-commerce & Cloud", value: "$1.98 T", trend: "down", ticker: "NASDAQ" },
    { rank: 6, name: "Saudi Aramco", category: "Energy & Petrochemicals", value: "$1.85 T", trend: "down", ticker: "TADAWUL" },
  ],
};

// Generates minor randomized jitter to simulate tick updates
function addJitter(valStr: string, percentage: number): string {
  const isPercent = valStr.includes("%");
  const isDollar = valStr.includes("$");
  const isB = valStr.includes(" B");
  const isT = valStr.includes(" T");
  
  let numeric = parseFloat(valStr.replace(/[^\d.-]/g, ""));
  if (isNaN(numeric)) return valStr;

  const changeFactor = 1 + (Math.random() - 0.5) * percentage;
  numeric = numeric * changeFactor;

  let formatted = numeric.toFixed(2);
  if (isPercent) formatted += "%";
  if (isDollar) formatted = "$" + formatted;
  if (isB) formatted += " B";
  if (isT) formatted += " T";
  return formatted;
}

export async function getMarketIntelligence(): Promise<GlobalIntelligenceData> {
  const now = Date.now();
  
  // Return cached copy if still valid
  if (cache && (now - cache.timestamp < CACHE_DURATION)) {
    return cache.data;
  }

  // Clone baseline data to modify
  const data: GlobalIntelligenceData = JSON.parse(JSON.stringify(BASELINE_DATA));

  // 1. Fetch live rates from ER-API
  try {
    const fxRes = await fetch("https://open.er-api.com/v6/latest/EUR", { next: { revalidate: 300 } });
    if (fxRes.ok) {
      const fxJson = await fxRes.json();
      if (fxJson && fxJson.rates) {
        const rates = fxJson.rates;
        
        // Populate FX Rates
        const eurUsd = rates.USD;
        const eurRon = rates.RON;
        const eurGbp = rates.GBP;
        const usdRon = eurRon / eurUsd;
        
        // Update macro indicators
        data.macro = [
          { label: "Inflation Rate RO (INS)", value: "4.6%", change: "-0.2%", trend: "down", desc: "Romania CPI YoY" },
          { label: "BNR Key Rate", value: "6.25%", change: "0.0%", trend: "neutral", desc: "Banca Națională a României" },
          { label: "EUR / RON", value: eurRon.toFixed(4), change: "+0.02%", trend: "up", desc: "BNR / Interbank Rate" },
          { label: "USD / RON", value: usdRon.toFixed(4), change: "-0.15%", trend: "down", desc: "US Dollar to RON" },
          { label: "EUR / USD", value: eurUsd.toFixed(4), change: "+0.05%", trend: "up", desc: "Euro / US Dollar" },
          { label: "GBP / RON", value: (eurRon / eurGbp).toFixed(4), change: "+0.10%", trend: "up", desc: "British Pound to RON" },
        ];

        // Update gold and silver if rates.XAU/XAG exists
        if (rates.XAU) {
          const goldOzEUR = 1 / rates.XAU;
          const goldOzUSD = goldOzEUR * eurUsd;
          const goldGramRON = (goldOzEUR / 31.1035) * eurRon;
          data.commodities[0] = {
            label: "Gold Spot",
            value: `$${goldOzUSD.toLocaleString("en-US", { maximumFractionDigits: 2 })} / oz`,
            change: "+0.85%",
            trend: "up",
            desc: `Au Spot Rate (~${goldGramRON.toFixed(2)} RON / gram)`
          };
        }
        if (rates.XAG) {
          const silverOzEUR = 1 / rates.XAG;
          const silverOzUSD = silverOzEUR * eurUsd;
          data.commodities[1] = {
            label: "Silver Spot",
            value: `$${silverOzUSD.toLocaleString("en-US", { maximumFractionDigits: 2 })} / oz`,
            change: "+1.25%",
            trend: "up",
            desc: "Ag Industrial Metal"
          };
        }
      }
    }
  } catch (err) {
    console.warn("[AiX Data Provider] FX Rates fetch failed. Serving fallback.", err);
  }

  // 1.5 Fetch live prices from CoinGecko
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true",
      { next: { revalidate: 120 } }
    );
    if (res.ok) {
      const json = await res.json();
      if (json.bitcoin && json.ethereum && json.solana) {
        data.crypto = [
          {
            label: "Bitcoin (BTC)",
            value: `$${json.bitcoin.usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            change: `${json.bitcoin.usd_24h_change >= 0 ? "+" : ""}${json.bitcoin.usd_24h_change.toFixed(2)}%`,
            trend: json.bitcoin.usd_24h_change >= 0 ? "up" : "down",
            desc: "Digital Gold Benchmark",
          },
          {
            label: "Ethereum (ETH)",
            value: `$${json.ethereum.usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            change: `${json.ethereum.usd_24h_change >= 0 ? "+" : ""}${json.ethereum.usd_24h_change.toFixed(2)}%`,
            trend: json.ethereum.usd_24h_change >= 0 ? "up" : "down",
            desc: "Smart Contracts Capital",
          },
          {
            label: "Solana (SOL)",
            value: `$${json.solana.usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            change: `${json.solana.usd_24h_change >= 0 ? "+" : ""}${json.solana.usd_24h_change.toFixed(2)}%`,
            trend: json.solana.usd_24h_change >= 0 ? "up" : "down",
            desc: "High-Speed L1 Network",
          },
        ];
      }
    }
  } catch (err) {
    console.warn("[AiX Data Provider] CoinGecko fetch failed. Serving fallback.", err);
  }

  // 2. Add realistic jitter to stocks, commodities, and macro variables to simulate real-time ticks
  data.stocks = data.stocks.map(item => {
    const rawVal = item.value;
    const nextVal = addJitter(rawVal, 0.002); // 0.2% max jitter
    const isUp = parseFloat(nextVal) >= parseFloat(rawVal);
    return {
      ...item,
      value: nextVal,
      change: `${isUp ? "+" : ""}${((parseFloat(nextVal) - parseFloat(rawVal)) / parseFloat(rawVal) * 100).toFixed(2)}%`,
      trend: isUp ? "up" : "down",
    };
  });

  data.commodities = data.commodities.map(item => {
    const cleanStr = item.value.split(" / ")[0];
    const unit = item.value.split(" / ")[1] ? ` / ${item.value.split(" / ")[1]}` : "";
    const nextVal = addJitter(cleanStr, 0.003);
    const isUp = Math.random() > 0.45;
    return {
      ...item,
      value: `${nextVal}${unit}`,
      change: `${isUp ? "+" : ""}${(Math.random() * 1.5).toFixed(2)}%`,
      trend: isUp ? "up" : "down",
    };
  });

  // Store update in cache
  cache = {
    timestamp: now,
    data,
  };

  return data;
}
