import type { Metadata } from "next";

import { PricingCards } from "@/components/marketing/pricing-cards";
import { FeatureMatrix } from "@/components/marketing/feature-matrix";
import { Faq } from "@/components/marketing/faq";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free for browsing. $3 to unlock with refund-on-ship. $15/mo if you'd rather subscribe.",
};

const faqs = [
  {
    question: "How does the refund-on-ship work?",
    answer:
      "Build a working URL within 60 days of unlocking — even just a real landing page with email signup counts. Submit it on your dashboard. Auto-validation runs on the spot (real domain, registered after unlock, real content), and the $3 is refunded back to your card within 7 days. Edge cases get a quick human review.",
  },
  {
    question: "Can I switch from per-unlock to Pro later?",
    answer:
      "Yes, anytime. After ~5 unlocks in a month you're already paying more than Pro, so we'll suggest the upgrade automatically. Pro starts the moment you subscribe — no waiting, no migration.",
  },
  {
    question: "What's inside an unlocked brief?",
    answer:
      "The pain (with 3–5 quoted excerpts from the original posts), who buys it and where they hang out, existing solutions and their prices, the wedge they're missing, sample landing-page copy, a 3-step validation plan, and distribution channels with traffic estimates. You get it as a watermarked PDF you keep forever.",
  },
  {
    question: "Do you offer team plans?",
    answer:
      "Not yet. Pannly is built for solo indie hackers and small studios. We'll consider team billing only after we hit a wall of demand for it.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="px-6 md:px-12 pb-16 pt-24 text-center">
        <span className="mb-4 block font-mono text-xs font-semibold uppercase tracking-[0.2em] text-plum-500">
          Pricing
        </span>
        <h1 className="mx-auto mb-6 max-w-3xl font-display text-4xl font-medium tracking-tight text-ink-700 md:text-5xl">
          Three ways to use Pannly
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-ink-50/80">
          Free for browsing. $3 to unlock with refund-on-ship. $15/mo if you&apos;d
          rather subscribe.
        </p>
      </section>

      <PricingCards />

      <FeatureMatrix />

      <Faq items={faqs} />
    </>
  );
}
