"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PricingCardProps {
  name: string;
  blurb: string;
  price: ReactNode;
  unit: string;
  features: { label: string; emphasis?: boolean }[];
  cta: {
    label: string;
    onClick: () => void | Promise<void>;
    loading?: boolean;
    disabled?: boolean;
  };
  highlighted?: boolean;
  badge?: string;
}

/**
 * One pricing tier. Highlighted variant gets the "Most Popular" badge + a
 * subtle ring + filled CTA. The CTA's loading state is owned by the parent.
 */
export function PricingCard({
  name,
  blurb,
  price,
  unit,
  features,
  cta,
  highlighted,
  badge,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border border-cream-300 bg-cream-200 p-8",
        highlighted && "border-moss-600/30 bg-cream-50 shadow-soft",
      )}
    >
      {highlighted && badge ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-plum-500 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-cream-50">
          {badge}
        </span>
      ) : null}

      <header className="mb-8">
        <h3 className="font-display text-2xl text-ink-700">{name}</h3>
        <p className="mt-2 h-10 text-sm text-ink-50">{blurb}</p>
        <div className="mt-6 flex items-baseline gap-1">
          <span className="font-display text-5xl font-semibold text-ink-700">{price}</span>
          <span className="text-sm text-ink-50">{unit}</span>
        </div>
      </header>

      <ul className="mb-8 flex flex-grow flex-col gap-4">
        {features.map((f, i) => (
          <li
            key={f.label}
            className={cn(
              "flex items-start gap-3 text-sm",
              i > 0 && "border-t border-cream-300/60 pt-4",
            )}
          >
            <Check
              className="mt-0.5 h-4 w-4 flex-shrink-0 text-moss-600"
              strokeWidth={2}
              aria-hidden
            />
            <span className={cn("text-ink-500", f.emphasis && "font-medium text-plum-500")}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      <Button
        block
        size="lg"
        loading={cta.loading}
        disabled={cta.disabled}
        variant={highlighted ? "primary" : "secondary"}
        onClick={() => void cta.onClick()}
      >
        {cta.label}
      </Button>
    </div>
  );
}
