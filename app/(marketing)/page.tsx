import type { Metadata } from "next";

import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { AccountabilityBanner } from "@/components/marketing/accountability-banner";
import { FeedPreview } from "@/components/marketing/feed-preview";
import { FinalCtaBand } from "@/components/marketing/final-cta-band";

export const metadata: Metadata = {
  title: "Pannly — Find an idea worth building. Get refunded if you actually ship.",
  description:
    "A curated archive of high-signal software ideas sourced from real business pain points. Unlock a brief, build the solution, and we return your pledge.",
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <AccountabilityBanner />
      <FeedPreview />
      <FinalCtaBand />
    </>
  );
}
