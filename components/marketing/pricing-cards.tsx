import type { Route } from "next";
import Link from "next/link";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface Plan {
  name: string;
  blurb: string;
  price: string;
  unit: string;
  features: { label: string; emphasis?: boolean }[];
  cta: { label: string; href: string };
  highlight?: boolean;
}

const plans: Plan[] = [
  {
    name: "Free",
    blurb: "Browse the feed and taste the unlock model.",
    price: "$0",
    unit: "/ forever",
    features: [
      { label: "Daily feed previews" },
      { label: "1 free unlock per month" },
      { label: "Weekly email digest" },
      { label: "Browse the build gallery" },
    ],
    cta: { label: "Sign up free", href: "/login" },
  },
  {
    name: "Per-unlock",
    blurb: "Pay only when an idea matters. Refunded if you actually ship.",
    price: "$3",
    unit: "/ per idea",
    features: [
      { label: "Full idea brief (PDF)" },
      { label: "Evidence quotes with source links" },
      { label: "Competitors, prices, where they're weak" },
      { label: "Sample landing copy + 3-step validation plan" },
      { label: "Refunded if you ship within 60 days", emphasis: true },
    ],
    cta: { label: "Unlock your first idea", href: "/feed" },
    highlight: true,
  },
  {
    name: "Pro",
    blurb: "Unlimited unlocks for serial builders.",
    price: "$15",
    unit: "/ month",
    features: [
      { label: "Unlimited unlocks" },
      { label: "Daily personalised digest" },
      { label: "Custom keyword alerts" },
      { label: "24-hour early access on new ideas" },
      { label: "Cancel anytime" },
    ],
    cta: { label: "Go Pro", href: "/login" },
  },
];

export function PricingCards() {
  return (
    <section className="px-6 md:px-12 pb-24">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <PlanCard key={p.name} plan={p} />
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-ink-50/70">
        Indian users see INR pricing at checkout.
      </p>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border p-8",
        plan.highlight
          ? "border-plum-300/50 bg-cream-50 shadow-soft"
          : "border-cream-300 bg-cream-50/60",
      )}
    >
      {plan.highlight ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-plum-500 px-3 py-1 font-mono text-xs font-semibold tracking-[0.05em] text-cream-50">
          Most popular
        </span>
      ) : null}

      <div className="mb-8">
        <h3 className="mb-2 font-display text-2xl text-ink-700">{plan.name}</h3>
        <p className="mb-6 h-10 text-sm text-ink-50/80">{plan.blurb}</p>
        <div className="flex items-baseline gap-1">
          <span className="font-display text-5xl font-semibold text-ink-700">{plan.price}</span>
          <span className="text-sm text-ink-50/70">{plan.unit}</span>
        </div>
      </div>

      <ul className="mb-8 flex flex-grow flex-col gap-4">
        {plan.features.map((f, i) => (
          <li
            key={f.label}
            className={cn(
              "flex items-start gap-3",
              i > 0 ? "border-t border-cream-300/60 pt-4" : "",
            )}
          >
            <Check
              className="mt-0.5 h-[18px] w-[18px] shrink-0 text-moss-500"
              strokeWidth={2}
              aria-hidden
            />
            <span
              className={cn(
                "text-sm",
                f.emphasis ? "font-medium text-plum-500" : "text-ink-700",
              )}
            >
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={plan.cta.href as Route}
        className={cn(
          "block w-full rounded-xl py-3 text-center text-sm transition-colors",
          plan.highlight
            ? "bg-moss-600 text-cream-50 hover:bg-moss-700"
            : "border border-moss-500 text-ink-700 hover:bg-cream-200",
        )}
      >
        {plan.cta.label}
      </Link>
    </div>
  );
}
