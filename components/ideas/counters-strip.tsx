import { Fragment } from "react";

import { cn } from "@/lib/utils";

interface Props {
  unlocked: number;
  building: number;
  shipped: number;
  className?: string;
}

/**
 * "[N] unlocked · [N] building · [N] shipped" strip with the bracketed
 * monospace numerals from the design.
 */
export function CountersStrip({ unlocked, building, shipped, className }: Props) {
  const items = [
    { count: unlocked, label: "unlocked" },
    { count: building, label: "building" },
    { count: shipped, label: "shipped" },
  ];
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-cream-300 py-3 font-mono text-sm",
        className,
      )}
    >
      {items.map((it, i) => (
        <Fragment key={it.label}>
          {i > 0 ? <span className="hidden text-cream-400 sm:inline">·</span> : null}
          <span className="flex items-center gap-2">
            <span className="text-ink-500 tabular-nums">[{it.count}]</span>
            <span className="text-cream-400">{it.label}</span>
          </span>
        </Fragment>
      ))}
    </div>
  );
}
