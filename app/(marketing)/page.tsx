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
import { buildSpeakableWebPage, schemaJson } from "@/lib/seo/schemas";

export const metadata: Metadata = {
  title: "Pannly — Find an idea worth building. Get refunded if you actually ship.",
  description:
    "A curated archive of high-signal software ideas sourced from real business pain points. Unlock a brief, build the solution, and we return your pledge.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

// SpeakableSpecification: marks the H1 and any element with .geo-speakable as
// the preferred passage for voice assistants and AI Overviews. Hero.tsx
// applies the class to the definitional one-sentence paragraph.
const SPEAKABLE_HOMEPAGE = buildSpeakableWebPage({
  url: "/",
  name: "Pannly — Indie idea finder with refund-on-ship pricing",
  description:
    "Pannly is a startup idea finder that surfaces validated software opportunities from real Reddit and Hacker News pain threads, priced at $3 per brief with an automatic refund if you ship within 30 days.",
});

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(SPEAKABLE_HOMEPAGE) }}
      />
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
