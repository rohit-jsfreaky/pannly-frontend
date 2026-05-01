import type { Metadata } from "next";
import { Suspense } from "react";

import { BillingSkeleton } from "@/components/billing/billing-skeleton";
import { BillingView } from "@/components/billing/billing-view";

export const metadata: Metadata = {
  title: "Billing",
};

export default function BillingPage() {
  return (
    <div className="bg-cream-100">
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-12">
        <h1 className="mb-12 font-display text-5xl font-semibold tracking-tight text-ink-700 md:text-6xl">
          Billing
        </h1>
        <Suspense fallback={<BillingSkeleton />}>
          <BillingView />
        </Suspense>
      </main>
    </div>
  );
}
