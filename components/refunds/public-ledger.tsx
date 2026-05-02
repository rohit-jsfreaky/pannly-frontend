"use client";

import { ChevronDown } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { useRefundsLedger } from "@/lib/hooks/use-refunds";
import type { LedgerEntry } from "@/lib/api/refunds";
import { formatDate, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Public-ledger table.
 *
 * Loads page 1 on mount. "Load earlier entries" appends — never replaces —
 * so already-rendered rows stay put. Loading spinner only shows on cold mount.
 */
export function PublicLedger() {
  const { items, loading, error, pagination, loadMore } = useRefundsLedger();

  return (
    <section className="overflow-hidden rounded-xl border border-cream-300 bg-cream-50">
      <header className="border-b border-cream-300 bg-cream-200/70 px-6 py-4">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-50">
          Public ledger
        </h3>
      </header>

      <div role="table" aria-label="Refunded builds">
        <ColumnHeader />

        {loading && items.length === 0 ? (
          <RowsSkeleton />
        ) : error && items.length === 0 ? (
          <ErrorRow message={error} />
        ) : items.length === 0 ? (
          <EmptyRow />
        ) : (
          items.map((it) => <Row key={it.unlock_id} entry={it} />)
        )}

        {error && items.length > 0 ? (
          <p
            role="alert"
            className="border-t border-cream-300/60 px-6 py-3 text-center text-sm text-error"
          >
            {error}
          </p>
        ) : null}

        <footer className="bg-cream-200/40 px-6 py-4 text-center">
          {pagination?.has_next ? (
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-50 transition-colors hover:text-moss-700 disabled:opacity-60"
            >
              {loading ? "Loading…" : "Load earlier entries"}
              <ChevronDown className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            </button>
          ) : pagination ? (
            <span className="font-mono text-[11px] uppercase tracking-wider text-cream-400">
              That's the whole ledger.
            </span>
          ) : null}
        </footer>
      </div>
    </section>
  );
}

// =================================================================== //
//  Layout primitives — same 12-col grid for header + every row        //
// =================================================================== //

const GRID =
  "grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center";

function ColumnHeader() {
  return (
    <div
      className={cn(
        GRID,
        "hidden border-b border-cream-300/60 py-3 md:grid",
      )}
      role="row"
    >
      <Heading className="md:col-span-3">Builder</Heading>
      <Heading className="md:col-span-5">Project seed</Heading>
      <Heading className="md:col-span-2 md:text-right">Shipped on</Heading>
      <Heading className="md:col-span-2 md:text-right">Amount</Heading>
    </div>
  );
}

function Heading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      role="columnheader"
      className={cn(
        "font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-50",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Row({ entry }: { entry: LedgerEntry }) {
  return (
    <div
      role="row"
      className={cn(
        GRID,
        "border-b border-cream-300/60 transition-colors last:border-b-0 hover:bg-cream-100",
      )}
    >
      <div className="flex items-center gap-2 md:col-span-3">
        <Avatar initials={entry.builder.initials} />
        <span className="text-sm text-ink-700">
          {entry.builder.display_name ?? "Anonymous"}
        </span>
      </div>
      <Link
        href={`/ideas/${encodeURIComponent(entry.idea_slug)}` as Route}
        className="truncate text-base font-medium text-moss-700 transition-colors hover:text-moss-600 md:col-span-5"
        title={entry.project_seed}
      >
        {entry.project_seed}
      </Link>
      <span className="font-mono text-sm text-ink-50 tabular-nums md:col-span-2 md:text-right">
        {formatDate(entry.shipped_at, { month: "short", day: "numeric" })}
      </span>
      <span className="font-mono text-sm text-moss-600 tabular-nums md:col-span-2 md:text-right">
        {formatMoney(entry.amount_cents)}
      </span>
    </div>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <span
      aria-hidden
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 font-mono text-[10px] font-semibold text-sage-500"
    >
      {initials}
    </span>
  );
}

function RowsSkeleton() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={cn(GRID, "border-b border-cream-300/60")}>
          <div className="flex items-center gap-2 md:col-span-3">
            <SkeletonBlock className="h-6 w-6 rounded-full" />
            <SkeletonBlock className="h-4 w-24" />
          </div>
          <SkeletonBlock className="h-4 w-3/4 md:col-span-5" />
          <SkeletonBlock className="h-4 w-16 md:col-span-2 md:ml-auto" />
          <SkeletonBlock className="h-4 w-12 md:col-span-2 md:ml-auto" />
        </div>
      ))}
    </>
  );
}

function ErrorRow({ message }: { message: string }) {
  return (
    <p role="alert" className="px-6 py-12 text-center text-sm text-error">
      {message}
    </p>
  );
}

function EmptyRow() {
  return (
    <p className="px-6 py-12 text-center text-sm text-ink-50">
      No refunds yet — the first shipped build is on its way.
    </p>
  );
}
