export type VideoCategory =
  | "Real Estate Intelligence"
  | "Market Intelligence"
  | "Investment Intelligence"
  | "Business Intelligence"
  | "Education"
  | "Interviews"
  | "AI Technology";

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: VideoCategory;
  thumbnail?: string;
  publishedDate?: string;
  duration?: string;
  featured?: boolean;
  tags?: string[];
  author?: string;
  views?: string;
}

export const VIDEO_CATEGORIES: VideoCategory[] = [
  "Real Estate Intelligence",
  "Market Intelligence",
  "Investment Intelligence",
  "Business Intelligence",
  "Education",
  "Interviews",
  "AI Technology"
];

export const INITIAL_VIDEOS: Video[] = [
  {
    id: "vid-re-01",
    title: "Global Real Estate Trends 2026: Institutional Capital Allocation & Asset Valuation",
    description: "In-depth briefing on institutional capital movement, prime yield shifts, and emerging commercial & residential real estate opportunities across high-growth markets.",
    youtubeId: "dQw4w9WgXcQ",
    category: "Real Estate Intelligence",
    publishedDate: "2026-08-01",
    duration: "18:45",
    featured: true,
    author: "Cristian Vaduva",
    tags: ["Real Estate", "Yields", "Institutional", "Valuation"],
    views: "14.2K"
  },
  {
    id: "vid-re-02",
    title: "Luxury Residential Market Analytics & High-Net-Worth Portfolio Structuring",
    description: "Detailed analysis of luxury residential market dynamics, buyer velocity, financing strategies, and wealth preservation mechanisms.",
    youtubeId: "L_LUpnjgPso",
    category: "Real Estate Intelligence",
    publishedDate: "2026-07-28",
    duration: "24:12",
    featured: false,
    author: "Cristian Vaduva",
    tags: ["Luxury Real Estate", "HNW", "Portfolio", "Analytics"],
    views: "9.8K"
  },
  {
    id: "vid-mk-01",
    title: "Macroeconomic Liquidity & Central Bank Interest Rate Outlook",
    description: "Strategic breakdown of global central bank interest rate policies, inflation indicators, and sovereign bond market yield curve signals.",
    youtubeId: "V_J1bH4yFNo",
    category: "Market Intelligence",
    publishedDate: "2026-08-04",
    duration: "15:30",
    featured: false,
    author: "AiX Market Intelligence Desk",
    tags: ["Macroeconomics", "Interest Rates", "Liquidity", "Markets"],
    views: "22.5K"
  },
  {
    id: "vid-inv-01",
    title: "Private Equity & Direct Asset Investment Frameworks",
    description: "Frameworks for evaluating risk-adjusted returns in private equity, co-investment structures, and direct asset acquisition strategies.",
    youtubeId: "tgbNymZ7vqY",
    category: "Investment Intelligence",
    publishedDate: "2026-07-25",
    duration: "21:05",
    featured: false,
    author: "AiX Capital Research",
    tags: ["Private Equity", "Asset Allocation", "Risk Modeling"],
    views: "11.4K"
  },
  {
    id: "vid-biz-01",
    title: "Enterprise AI Operating Systems: Transforming Corporate Workflows",
    description: "How modern AI agentic operating systems scale operational leverage, automate decision engines, and optimize capital efficiency.",
    youtubeId: "3JZ_D3ELwOQ",
    category: "Business Intelligence",
    publishedDate: "2026-07-30",
    duration: "29:40",
    featured: false,
    author: "Cristian Vaduva",
    tags: ["Enterprise AI", "Automation", "Workflow OS", "Business Architecture"],
    views: "31.1K"
  },
  {
    id: "vid-edu-01",
    title: "Financial Education: Underwriting Mortgage & Commercial Debt Instruments",
    description: "Masterclass on debt structuring, interest coverage ratios, loan-to-value covenants, and debt service optimization.",
    youtubeId: "J---aiyznGQ",
    category: "Education",
    publishedDate: "2026-07-15",
    duration: "34:15",
    featured: false,
    author: "AiX Education Series",
    tags: ["Underwriting", "Debt Structuring", "Mortgages", "Finance"],
    views: "18.9K"
  },
  {
    id: "vid-int-01",
    title: "Executive Interview: The Future of PropTech & AI-Driven Asset Management",
    description: "Exclusive conversation with leading real estate technology founders on smart asset monitoring, predictive maintenance, and AI valuations.",
    youtubeId: "9bZkp7q19f0",
    category: "Interviews",
    publishedDate: "2026-07-20",
    duration: "42:00",
    featured: false,
    author: "Cristian Vaduva Spotlight",
    tags: ["Interview", "PropTech", "AI Asset Management", "Leadership"],
    views: "27.3K"
  },
  {
    id: "vid-ai-01",
    title: "Autonomous AI Agents in Real-Time Market Scanning & Signal Detection",
    description: "Technical deep-dive into multi-agent systems performing real-time lead capture, data normalization, and predictive sentiment scoring.",
    youtubeId: "fJ9rUzIMcZQ",
    category: "AI Technology",
    publishedDate: "2026-08-05",
    duration: "26:50",
    featured: false,
    author: "AiX Engineering",
    tags: ["AI Agents", "Autonomous Systems", "Signal Detection", "LLMs"],
    views: "45.0K"
  }
];

export function getYouTubeThumbnail(youtubeId: string, quality: "maxres" | "hq" = "maxres"): string {
  if (quality === "maxres") {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}
