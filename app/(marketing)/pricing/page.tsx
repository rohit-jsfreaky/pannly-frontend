"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FaqSection } from "@/components/pricing/faq-section";
import { FeatureMatrix } from "@/components/pricing/feature-matrix";
import { PricingCard } from "@/components/pricing/pricing-card";
import { ApiError } from "@/lib/api-client";
import { startProMonthly } from "@/lib/api/checkout";
import { useAuth } from "@/lib/auth-context";
import { env } from "@/lib/env";

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [subscribing, setSubscribing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real prices come from env (so they match what Dodo charges).
  const unlockPrice = env.prices.unlockDefaultUsd;
  const proMonthly = env.prices.proMonthlyUsd;

  const onSubscribe = async () => {
    if (!user) {
      router.push("/login?next=/pricing" as Route);
      return;
    }
    setSubscribing(true);
    setErrorMessage(null);
    try {
      const { checkout_url } = await startProMonthly({
        // The confirming overlay on /billing polls /v1/me/last-checkout until
        // it sees succeeded or failed.
        return_url: `${env.appBaseUrl}/billing?confirming=1`,
        cancel_url: `${env.appBaseUrl}/pricing`,
      });
      if (checkout_url) {
        window.location.href = checkout_url;
      } else {
        setErrorMessage("Couldn't start checkout. Try again in a moment.");
        setSubscribing(false);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError ? err.message : "Couldn't start checkout. Try again.",
      );
      setSubscribing(false);
    }
  };

  return (
    <div className="bg-cream-100">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-24 text-center">
        <span className="mb-4 block font-mono text-xs font-semibold uppercase tracking-[0.15em] text-plum-500">
          Pricing
        </span>
        <h1 className="mb-6 font-display text-5xl font-semibold tracking-tight text-ink-700 md:text-6xl">
          Three ways to use Pannly
        </h1>
        {/* Definitional paragraph for AI Overviews extraction. The
            .geo-speakable class is referenced by the SpeakableSpecification
            JSON-LD on the pricing page. */}
        <p className="geo-speakable mx-auto max-w-2xl text-lg leading-relaxed text-ink-500">
          Pannly charges $3 to unlock a single idea brief. Builders who ship a
          working product within 30 days are automatically refunded — the
          unlock fee functions as a 30-day commitment stake, not a subscription.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-ink-50">
          Whether you're exploring your first idea or shipping your tenth product, we have a
          model that respects your craftsmanship.
        </p>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <PricingCard
            name="Free"
            blurb="Browse the feed and see what's trending. No card required."
            price="$0"
            unit="/ forever"
            features={[
              { label: "Browse the public feed" },
              { label: "3 daily idea previews" },
              { label: "Basic trend signals" },
            ]}
            cta={{
              label: user ? "Browse the feed" : "Get started",
              onClick: () => router.push((user ? "/feed" : "/signup") as Route),
            }}
          />

          <PricingCard
            highlighted
            badge="Most Popular"
            name="Per Unlock"
            blurb="Pay for detailed briefs only when you need them."
            price={`$${unlockPrice}`}
            unit="/ per brief"
            features={[
              { label: "Full PDF teardown" },
              { label: "Competitor matrix" },
              { label: "Refund-on-ship guarantee", emphasis: true },
            ]}
            cta={{
              label: "Browse briefs",
              onClick: () => router.push("/feed" as Route),
            }}
          />

          <PricingCard
            name="Pro"
            blurb="For serial builders who want unlimited access."
            price={`$${proMonthly}`}
            unit="/ month"
            features={[
              { label: "Unlimited briefs" },
              { label: "Early access to new drops" },
              { label: "Private builder community" },
            ]}
            cta={{
              label: user ? "Subscribe" : "Sign up to subscribe",
              onClick: onSubscribe,
              loading: subscribing,
            }}
          />
        </div>

        {errorMessage ? (
          <div
            role="alert"
            className="mx-auto mt-6 max-w-md rounded-md border border-error/30 bg-error/10 px-4 py-3 text-center text-sm text-error"
          >
            {errorMessage}
          </div>
        ) : null}
      </section>

      <FeatureMatrix />
      <FaqSection />
    </div>
  );
}
