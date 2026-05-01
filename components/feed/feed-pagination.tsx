"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  onChange: (page: number) => void;
}

/**
 * Build the displayed page list — always shows first, last, current ±1, and
 * "…" between gaps. Keeps the bar at most ~7 cells wide so it doesn't wrap.
 */
function buildPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i += 1) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}

export function FeedPagination({ page, totalPages, hasPrev, hasNext, onChange }: Props) {
  if (totalPages <= 1) return null;
  const pages = buildPages(page, totalPages);

  return (
    <nav
      aria-label="Feed pagination"
      className="mt-8 flex items-center justify-center gap-2 font-mono text-sm tabular-nums"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={!hasPrev}
        onClick={() => onChange(Math.max(1, page - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-cream-300 text-ink-50 hover:bg-cream-200 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="px-1 text-cream-400"
            aria-hidden
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-9 min-w-9 items-center justify-center rounded-md border px-2.5",
              p === page
                ? "border-ink-700 bg-ink-700 text-cream-50"
                : "border-cream-300 text-ink-50 hover:bg-cream-200",
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="Next page"
        disabled={!hasNext}
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-cream-300 text-ink-50 hover:bg-cream-200 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </button>
    </nav>
  );
}
