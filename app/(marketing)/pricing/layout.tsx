import type { Metadata } from "next";

import { env } from "@/lib/env";
import { buildPricingGraph, schemaJson } from "@/lib/seo/schemas";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free to browse. $3 per idea unlock — refunded automatically when you ship within 30 days. Or $15/mo Pro for unlimited briefs.",
  alternates: { canonical: "/pricing" },
  openGraph: { url: "/pricing" },
};

/**
 * Pricing layout exists for two reasons:
 *   1. Attach metadata + canonical to the route — the page itself is
 *      `"use client"` (React state for the subscription checkout flow),
 *      which Next disallows mixing with `metadata` exports.
 *   2. Inject Product+Offer JSON-LD for the Per Unlock and Pro tiers.
 *      Server Component default — runs at build/render time, never ships
 *      to the client.
 *
 * Prices come from env vars (mirror of backend config) so a price change in
 * `.env` propagates automatically.
 */
export default function PricingLayout({ children }: { children: React.ReactNode }) {
  const graph = buildPricingGraph({
    unlockUsd: env.prices.unlockDefaultUsd,
    proMonthlyUsd: env.prices.proMonthlyUsd,
  });
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(graph) }}
      />
      {children}
    </>
  );
}
