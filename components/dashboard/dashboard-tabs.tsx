"use client";

import type { DashboardTabCounts, UnlockTab } from "@/lib/api/me";
import { cn } from "@/lib/utils";

interface Props {
  active: UnlockTab;
  counts: DashboardTabCounts | null;
  onChange: (tab: UnlockTab) => void;
}

const TABS: { id: UnlockTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "building", label: "Building" },
  { id: "submitted", label: "Submitted" },
  { id: "refunded", label: "Refunded" },
];

export function DashboardTabs({ active, counts, onChange }: Props) {
  return (
    <div role="tablist" className="mb-8 flex gap-8 border-b border-cream-300/60">
      {TABS.map((t) => {
        const count = counts ? counts[t.id] : null;
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.id)}
            className={cn(
              "-mb-px flex items-center gap-2 border-b-2 pb-3 text-base font-medium transition-colors",
              isActive
                ? "border-moss-600 text-moss-700"
                : "border-transparent text-ink-50 hover:text-ink-700",
            )}
          >
            {t.label}
            {count !== null && count > 0 ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-mono text-[11px] tabular-nums",
                  isActive
                    ? "bg-moss-100 text-moss-700"
                    : "bg-cream-200 text-ink-50",
                )}
              >
                {count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
