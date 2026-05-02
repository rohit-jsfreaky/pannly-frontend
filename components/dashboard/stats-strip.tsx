import { Crown } from "lucide-react";

import { formatMoney } from "@/lib/format";
import type { DashboardStats } from "@/lib/api/me";
import { cn } from "@/lib/utils";

interface Props {
  stats: DashboardStats | null;
  loading: boolean;
}

/**
 * Top stats strip: 4 small chips (unlocked / building / shipped / refunded).
 *
 * The headline "unlocked" count is the user's actual engagement count — it
 * matches the "All" tab count below, so the two never disagree. Pro / Lifetime
 * access (which grants read scope to every live idea regardless of the
 * unlocks table) is surfaced as a separate banner above the chips so it
 * doesn't compete with the engaged count.
 *
 * "BUILDING" is tinted sage to draw the eye — it's the active state the user
 * typically wants to glance at. "Refunded" uses plum because it's the payoff.
 */
export function StatsStrip({ stats, loading }: Props) {
  const items: ChipDef[] = [
    {
      count: pretty(stats?.total_unlocked),
      label: "unlocked",
      tone: "neutral",
    },
    { count: pretty(stats?.total_building), label: "building", tone: "sage" },
    { count: pretty(stats?.total_shipped), label: "shipped", tone: "neutral" },
    {
      count: stats ? formatMoney(stats.total_refunded_cents) : "$—",
      label: "refunded so far",
      tone: "plum",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        loading && "opacity-60",
      )}
      aria-busy={loading || undefined}
    >
      {stats?.has_pro_access ? (
        <ProAccessBanner accessibleCount={stats.total_accessible} />
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        {items.map((it) => (
          <Chip key={it.label} {...it} />
        ))}
      </div>
    </div>
  );
}

function ProAccessBanner({ accessibleCount }: { accessibleCount: number }) {
  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-moss-600/30 bg-moss-100/60 px-3 py-1.5 text-xs text-moss-700">
      <Crown className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      <span className="font-medium">Pro plan active</span>
      <span className="text-moss-600/80">
        — read access to all {accessibleCount} live ideas
      </span>
    </span>
  );
}

type Tone = "neutral" | "sage" | "plum";

interface ChipDef {
  count: string;
  label: string;
  tone: Tone;
}

function Chip({ count, label, tone }: ChipDef) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-3 py-2",
        tone === "neutral" && "border-cream-300 bg-cream-50",
        tone === "sage" && "border-sage-300/60 bg-sage-100/40",
        tone === "plum" && "border-plum-300/60 bg-plum-100/40",
      )}
    >
      <span
        className={cn(
          "font-mono text-sm font-medium tabular-nums",
          tone === "sage" && "text-sage-500",
          tone === "plum" && "text-plum-500",
          tone === "neutral" && "text-moss-600",
        )}
      >
        {count}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink-50">
        {label}
      </span>
    </span>
  );
}

function pretty(n: number | undefined): string {
  if (n === undefined) return "—";
  return String(n);
}
