import { Flame, Sparkles, TrendingUp } from "lucide-react";

import type { ScoreKind } from "@/lib/api/feed";
import { cn } from "@/lib/utils";

interface Props {
  score: number | null;
  kind: ScoreKind;
  className?: string;
}

const ICONS: Record<ScoreKind, typeof Flame | null> = {
  hot: Flame,
  trending: TrendingUp,
  fresh: Sparkles,
  normal: null,
};

const TINTS: Record<ScoreKind, string> = {
  hot: "text-plum-500",
  trending: "text-moss-500",
  fresh: "text-moss-400",
  normal: "text-moss-500",
};

/**
 * Score pill on idea cards. Server-derived `score_kind` picks the icon —
 * UI never re-derives.
 */
export function ScoreBadge({ score, kind, className }: Props) {
  if (score == null) return null;
  const Icon = ICONS[kind];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-cream-300 bg-cream-50 px-3 py-1 font-mono text-sm tabular-nums",
        className,
      )}
      aria-label={`Score ${score} out of 100, ${kind}`}
    >
      {Icon ? (
        <Icon
          className={cn("h-3.5 w-3.5", TINTS[kind])}
          strokeWidth={2}
          aria-hidden
        />
      ) : null}
      <span className="text-ink-700">{score}</span>
    </span>
  );
}
