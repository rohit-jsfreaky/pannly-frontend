"use client";

import { Skeleton } from "boneyard-js/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { BillingSkeleton } from "@/components/billing/billing-skeleton";
import { CheckoutConfirming } from "@/components/billing/checkout-confirming";
import { CurrentPlanCard } from "@/components/billing/current-plan-card";
import { InvoiceHistoryTable } from "@/components/billing/invoice-history-table";
import { ApiError } from "@/lib/api-client";
import { getBilling, type BillingResponse } from "@/lib/api/me";

// Module-level cache so React 18 StrictMode dev re-mount doesn't double-fire.
let cached: BillingResponse | null = null;
let inflight: Promise<BillingResponse> | null = null;

function ensureBilling(force = false): Promise<BillingResponse> {
  if (force) {
    cached = null;
    inflight = null;
  }
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;
  inflight = getBilling()
    .then((res) => {
      cached = res;
      inflight = null;
      return res;
    })
    .catch((err) => {
      inflight = null;
      throw err;
    });
  return inflight;
}

export function BillingView() {
  const searchParams = useSearchParams();
  const isConfirming = searchParams.get("confirming") === "1";

  const [data, setData] = useState<BillingResponse | null>(cached);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    let alive = true;
    ensureBilling(true)
      .then((res) => {
        if (alive) setData(res);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }
    let alive = true;
    ensureBilling()
      .then((res) => {
        if (!alive) return;
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err instanceof ApiError ? err.message : "Couldn't load billing.");
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Skeleton name="billing" loading={loading} fallback={<BillingSkeleton />}>
      {error ? (
        <div
          role="alert"
          className="rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
        >
          {error}
        </div>
      ) : data ? (
        <div className="flex flex-col gap-12">
          {isConfirming ? <CheckoutConfirming onSucceeded={reload} /> : null}
          <CurrentPlanCard plan={data.current_plan} portalAvailable={data.portal_available} />
          <section>
            <h2 className="mb-6 font-display text-3xl text-ink-700">Invoice history</h2>
            <InvoiceHistoryTable invoices={data.invoices} />
          </section>
        </div>
      ) : null}
    </Skeleton>
  );
}
