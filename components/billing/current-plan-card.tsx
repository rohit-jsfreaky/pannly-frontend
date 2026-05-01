"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { openCustomerPortal } from "@/lib/api/checkout";
import type { BillingPlan } from "@/lib/api/me";
import { formatMoney } from "@/lib/format";

interface Props {
  plan: BillingPlan | null;
  portalAvailable: boolean;
}

function formatRenews(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Top-level billing card. Free tier shows a friendly empty state; paid users
 * see the active plan + the "Manage in customer portal" handoff.
 */
export function CurrentPlanCard({ plan, portalAvailable }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPortal = async () => {
    setLoading(true);
    setError(null);
    try {
      const { portal_url } = await openCustomerPortal();
      window.location.href = portal_url;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't open portal.");
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <section className="rounded-xl border border-cream-300 bg-cream-50 p-8">
        <span className="mb-4 block font-mono text-xs font-semibold uppercase tracking-[0.12em] text-cream-400">
          Current Plan
        </span>
        <h2 className="mb-2 font-display text-2xl text-ink-700">Free tier</h2>
        <p className="text-sm text-ink-50">
          You're on the free tier. Upgrade to Pro for unlimited unlocks and early access.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-cream-300 bg-cream-50 p-8 shadow-soft">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="mb-4 block font-mono text-xs font-semibold uppercase tracking-[0.12em] text-cream-400">
            Current Plan
          </span>
          <h2 className="mb-2 font-display text-2xl text-ink-700">{plan.label}</h2>
          {plan.amount_cents != null ? (
            <div className="mb-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl tabular-nums text-ink-700">
                {formatMoney(plan.amount_cents, plan.currency === "INR" ? "INR" : "USD")}
              </span>
              <span className="text-sm text-ink-50">
                / {plan.period === "lifetime" ? "lifetime" : plan.period === "yearly" ? "year" : "month"}
              </span>
            </div>
          ) : null}
          <p className="text-sm text-ink-50">
            {plan.status === "canceled" && plan.current_period_end ? (
              <>
                Cancelled — access ends{" "}
                <span className="font-mono">{formatRenews(plan.current_period_end)}</span>
              </>
            ) : plan.renews_on ? (
              <>
                Renews on <span className="font-mono">{formatRenews(plan.renews_on)}</span>
              </>
            ) : plan.period === "lifetime" ? (
              "No expiry — lifetime access"
            ) : (
              "Active"
            )}
          </p>
        </div>

        {portalAvailable ? (
          <div className="flex flex-col items-stretch gap-2">
            <Button size="lg" loading={loading} onClick={onPortal}>
              Manage in customer portal
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </Button>
            {error ? <p className="text-xs text-error">{error}</p> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
