"use client";

import { MethodologyPanel } from "@/components/refunds/methodology-panel";
import { PublicLedger } from "@/components/refunds/public-ledger";
import { RefundsHero } from "@/components/refunds/refunds-hero";
import { useRefundsSummary } from "@/lib/hooks/use-refunds";

/**
 * Top-level client wrapper for /refunds.
 *
 * API shape per page mount:
 *   - useRefundsSummary()  → /v1/refunds        (cached once per session)
 *   - useRefundsLedger()   → /v1/refunds/ledger (page 1, then append on click)
 *
 * Two endpoints, two calls per cold mount. Subsequent mounts reuse the
 * module cache. "Load earlier entries" fires one extra ledger call per click.
 */
export function RefundsView() {
  const summary = useRefundsSummary();

  return (
    <div className="mx-auto w-full px-6 py-16 md:px-12 md:py-24">
      <RefundsHero summary={summary.data} loading={summary.loading} />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        <aside className="lg:col-span-4 lg:pr-4">
          <MethodologyPanel />
        </aside>
        <div className="lg:col-span-8">
          <PublicLedger />
        </div>
      </div>
    </div>
  );
}
