"use client";

import { useState, useEffect } from "react";
import { X, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { brandContent } from "@/lib/content/brand";

interface Alert {
  id: string;
  type: "info" | "warning" | "success";
  text: string;
  source?: string;
  href?: string;
}

// Market alerts — sourced from brandContent.marketInsight
const ALERTS: Alert[] = [
  {
    id: "bucharest-price-paradox",
    type: "warning",
    text: `🏙️ București: Apartamente vechi (€2.653/mp) cu 27% mai SCUMPE decât blocuri noi (€2.099/mp). Cauza: TVA 21% pe construcții noi.`,
    source: brandContent.marketInsight.source,
    href: "/market",
  },
  {
    id: "robor-alert",
    type: "info",
    text: "📈 ROBOR 3M: ~6.85% — Avantaj major pentru cumpărătorii cash. Consultanță gratuită disponibilă.",
    href: "/calculators",
  },
  {
    id: "aix-score-launch",
    type: "success",
    text: "✨ AiX OS Intelligence Platform — Acces gratuit la calculatoare, market intelligence și AI Advisor.",
    href: "/ai",
  },
];

const DISMISSED_KEY = "aix_banner_dismissed_ids";

export function MarketAlertBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const ids = JSON.parse(localStorage.getItem(DISMISSED_KEY) ?? "[]") as string[];
        // Only dismiss if ALL alerts were dismissed
        setDismissed(ids.length >= ALERTS.length);
      } catch {
        setDismissed(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (dismissed !== false) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % ALERTS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [dismissed]);

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(ALERTS.map((a) => a.id)));
    } catch {}
  }

  if (dismissed !== false) return null;

  const alert = ALERTS[currentIndex];
  const typeStyles = {
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    info: "bg-blue-500/10 border-blue-500/30 text-blue-300",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  };
  const Icon = alert.type === "warning" ? AlertTriangle : alert.type === "success" ? TrendingUp : TrendingDown;

  return (
    <div
      className={`relative w-full border-b px-4 py-2 flex items-center justify-between gap-3 text-xs transition-all ${typeStyles[alert.type]}`}
      role="alert"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Icon className="h-3.5 w-3.5 flex-shrink-0" />
        {alert.href ? (
          <a href={alert.href} className="truncate hover:underline">
            {alert.text}
          </a>
        ) : (
          <span className="truncate">{alert.text}</span>
        )}
        {alert.source && (
          <span className="text-zinc-600 hidden md:inline flex-shrink-0">
            · {alert.source}
          </span>
        )}
      </div>

      {/* Pagination dots */}
      <div className="flex gap-1 flex-shrink-0">
        {ALERTS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === currentIndex ? "w-4 bg-current" : "w-1.5 bg-current opacity-30"}`}
            aria-label={`Alert ${i + 1}`}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="p-1 rounded hover:bg-white/10 transition-all flex-shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
