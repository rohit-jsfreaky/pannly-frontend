import type { Metadata } from "next";
import { Suspense } from "react";

import { BriefAnatomy } from "@/components/marketing/brief-anatomy";
import { FinalCtaBand } from "@/components/marketing/final-cta-band";
import { Hero } from "@/components/marketing/hero";
import { LandingFaq } from "@/components/marketing/landing-faq";
import { LiveNumbers } from "@/components/marketing/live-numbers";
import { PipelineFlow } from "@/components/marketing/pipeline-flow";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { RefundTimeline } from "@/components/marketing/refund-timeline";
import { HomePagePrefetcher } from "@/components/marketing/route-prefetcher";
import { WhereWeListen } from "@/components/marketing/where-we-listen";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
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
      {/* Programmatically prefetches the most-likely-next routes (feed,
          pricing, how-it-works, refunds, built, about) once the homepage
          mounts. Renders nothing. By the time a Product Hunt visitor
          clicks any nav item or hero CTA, the route is already cached. */}
      <HomePagePrefetcher />
      <Hero />
      <WhereWeListen />
      <PipelineFlow />
      <BriefAnatomy />
      <RefundTimeline />
      {/* LiveNumbers awaits two backend calls (refunds summary + ledger).
          Wrapping it in Suspense lets the rest of the page stream to the
          browser without waiting — Hero / WhereWeListen / pipeline / etc.
          paint immediately, LiveNumbers fills in once its data arrives.
          With the new revalidate=60 caching it's mostly an instant cache
          hit, but on cold cache (every 60s) Suspense keeps the page from
          stalling on a backend roundtrip. */}
      <Suspense fallback={<LiveNumbersFallback />}>
        <LiveNumbers />
      </Suspense>
      <PricingCards />
      <LandingFaq />
      <FinalCtaBand />
    </>
  );
}

function LiveNumbersFallback() {
  return (
    <section className="px-6 md:px-12">
      <div className="mx-auto max-w-[1280px] py-24 md:py-32">
        <div className="mb-12 max-w-2xl">
          <SkeletonBlock className="mb-3 h-3 w-32" />
          <SkeletonBlock className="mb-4 h-10 w-full max-w-md" />
          <SkeletonBlock className="h-4 w-3/4" />
        </div>
        <div className="rounded-2xl border border-cream-300 bg-cream-50 p-8 shadow-soft md:p-14">
          <div className="grid grid-cols-1 gap-10 border-b border-cream-300/60 pb-10 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <SkeletonBlock className="mb-3 h-12 w-32" />
                <SkeletonBlock className="h-3 w-24" />
              </div>
            ))}
          </div>
          <div className="pt-10">
            <SkeletonBlock className="mb-4 h-3 w-48" />
            <SkeletonBlock className="h-[260px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
