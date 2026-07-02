import { scoreBg, scoreColor, formatScore } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function ScoreBadge({
  score,
  size = "md",
  showLabel = true,
  className,
}: ScoreBadgeProps) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-medium",
        scoreBg(score),
        sizes[size],
        className
      )}
    >
      {showLabel && (
        <span className="text-zinc-400 text-xs uppercase tracking-wider">
          AiX Score
        </span>
      )}
      <span className={cn("font-semibold tabular-nums", scoreColor(score))}>
        {formatScore(score)}
      </span>
    </div>
  );
}

interface ScoreCardProps {
  score?: number;
  explanation?: string;
  insight?: string;
}

export function ScoreCard({ score, explanation, insight }: ScoreCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-widest text-zinc-400">
          AiX OS Score
        </h3>
        <ScoreBadge score={score} size="lg" showLabel={false} />
      </div>
      {explanation && (
        <div>
          <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">
            Why
          </p>
          <p className="text-zinc-300 text-sm leading-relaxed">{explanation}</p>
        </div>
      )}
      {insight && (
        <div className="border-t border-zinc-800 pt-4">
          <p className="text-xs uppercase tracking-wider text-amber-500/80 mb-1">
            Investment Insight
          </p>
          <p className="text-zinc-200 text-sm leading-relaxed">{insight}</p>
        </div>
      )}
    </div>
  );
}
