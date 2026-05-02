import type { Metadata } from "next";

import { BriefAnatomy } from "@/components/marketing/brief-anatomy";
import { FinalCtaBand } from "@/components/marketing/final-cta-band";
import { Hero } from "@/components/marketing/hero";
import { LandingFaq } from "@/components/marketing/landing-faq";
import { LiveNumbers } from "@/components/marketing/live-numbers";
import { PipelineFlow } from "@/components/marketing/pipeline-flow";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { RefundTimeline } from "@/components/marketing/refund-timeline";
import { WhereWeListen } from "@/components/marketing/where-we-listen";

export const metadata: Metadata = {
  title: "Pannly — Find an idea worth building. Get refunded if you actually ship.",
  description:
    "A curated archive of high-signal software ideas sourced from real business pain points. Unlock a brief, build the solution, and we return your pledge.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

/**
 * Landing page — 9 stacked sections, top to bottom.
 *
 *   1. Hero          — editorial composition + two CTAs
 *   2. WhereWeListen — Reddit + HN sources constellation
 *   3. PipelineFlow  — 5-step ingestion pipeline visual
 *   4. BriefAnatomy  — what's inside a $3 unlock
 *   5. RefundTimeline — Day 0 → Day 30+24h calendar
 *   6. LiveNumbers   — server-fetched real refund stats + cumulative chart
 *   7. PricingCards  — Free / Per Unlock / Pro
 *   8. LandingFaq    — 6 honest questions
 *   9. FinalCtaBand  — close
 *
 * <LiveNumbers /> is a Server Component that fetches /v1/refunds at render
 * time, so the chart and stats reflect production data on every page load
 * (no client-side delay, no fake placeholders).
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <WhereWeListen />
      <PipelineFlow />
      <BriefAnatomy />
      <RefundTimeline />
      <LiveNumbers />
      <PricingCards />
      <LandingFaq />
      <FinalCtaBand />
    </>
  );
}
