import type { Route } from "next";
import Link from "next/link";

/**
 * Final CTA band — closes the page with two real destinations:
 *   - /feed (browse and unlock)
 *   - /refunds (the public ledger we keep referring to)
 *
 * Sits on a cream-200 panel with rounded corners — feels like a closing
 * card, not the entrance to a different mood.
 */
export function FinalCtaBand() {
  return (
    <section className="px-6 pb-24 md:px-12 md:pb-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="rounded-2xl border border-cream-300 bg-cream-200 px-8 py-20 text-center shadow-soft md:px-12 md:py-28">
          <h2 className="mx-auto max-w-2xl font-display text-3xl tracking-tight text-ink-700 md:text-5xl">
            Find one worth building.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-50 md:text-lg">
            Browse the feed for two minutes. If a brief catches your eye, $3
            puts the full thing on your screen — refunded if you actually
            ship within 30 days.
          </p>

          {/* Bottom-of-page CTAs — by the time the user is here they're
              evaluating, force-prefetch ensures the click is instant. */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={"/feed" as Route}
              prefetch={true}
              className="inline-flex items-center justify-center rounded-xl bg-moss-600 px-7 py-3 text-base font-medium text-cream-50 shadow-sm transition-opacity hover:opacity-90"
            >
              Browse the feed
            </Link>
            <Link
              href={"/refunds" as Route}
              prefetch={true}
              className="inline-flex items-center justify-center rounded-xl border border-cream-300 bg-cream-50 px-7 py-3 text-base font-medium text-ink-700 transition-colors hover:bg-cream-100"
            >
              See refund ledger
            </Link>
          </div>

          <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-cream-400">
            Operated from India · Built in public
          </p>
        </div>
      </div>
    </section>
  );
}
