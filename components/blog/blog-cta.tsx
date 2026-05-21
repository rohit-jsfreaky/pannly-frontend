import type { Route } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { env } from "@/lib/env";

/**
 * Closing CTA band. `headline` is themed per page so the close doesn't read
 * identically across the cluster; the sub-line and buttons are shared.
 */
export function BlogCta({ headline }: { headline: string }) {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="rounded-2xl border border-cream-300 bg-cream-200 px-8 py-16 text-center shadow-soft">
        <h2 className="mx-auto max-w-xl font-display text-3xl tracking-tight text-ink-700 md:text-4xl">
          {headline}
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-50">
          Browsing the scored feed is free. ${env.prices.unlockDefaultUsd} unlocks the full
          brief — refunded automatically if you ship within {env.prices.buildWindowDays} days.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={"/feed" as Route}
            prefetch={true}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-moss-600 px-7 py-3 text-base font-medium text-cream-50 shadow-sm transition-opacity hover:opacity-90"
          >
            Browse the feed
            <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
          </Link>
          <Link
            href={"/how-it-works" as Route}
            prefetch={true}
            className="inline-flex items-center justify-center rounded-xl border border-cream-300 bg-cream-50 px-7 py-3 text-base font-medium text-ink-700 transition-colors hover:bg-cream-100"
          >
            How it works
          </Link>
        </div>
      </div>
    </section>
  );
}
