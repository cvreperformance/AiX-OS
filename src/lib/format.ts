export function formatPrice(price: number, currency = "EUR"): string {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatScore(score?: number): string {
  if (!score) return "—";
  return score.toFixed(1);
}

export function scoreColor(score?: number): string {
  if (!score) return "text-zinc-400";
  if (score >= 8.5) return "text-emerald-400";
  if (score >= 7) return "text-amber-400";
  return "text-zinc-400";
}

export function scoreBg(score?: number): string {
  if (!score) return "bg-zinc-100";
  if (score >= 8.5) return "bg-emerald-500/10 border-emerald-500/30";
  if (score >= 7) return "bg-amber-500/10 border-amber-500/30";
  return "bg-zinc-100 border-zinc-300";
}
