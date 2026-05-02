import type { Metadata } from "next";
import { Suspense } from "react";

import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Your ideas",
  description: "Everything you've unlocked, in one place.",
};

/**
 * /unlocks — the user dashboard.
 *
 * Wrapped in <Suspense> because <DashboardView> reads search params via
 * useSearchParams(), which Next requires under a Suspense boundary so the
 * static shell can render while the URL state hydrates.
 */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <DashboardView />
    </Suspense>
  );
}
