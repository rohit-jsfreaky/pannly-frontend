/**
 * Detailed FAQ for /refunds. Renders 10 questions covering proof, timeline,
 * pivots, edge cases, and chargebacks. Native <details> = a11y + zero JS.
 *
 * Source data lives in `lib/seo/refunds-faq-data.ts`. The page-level FAQPage
 * JSON-LD wraps the same array so AI engines see the Q&A pairs as
 * citation-ready.
 */

import { REFUNDS_FAQ } from "@/lib/seo/refunds-faq-data";

export function RefundsFaq() {
  return (
    <section className="mt-20">
      <header className="mb-10 max-w-2xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-400">
          Refund FAQ
        </span>
        <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-700 md:text-4xl">
          Everything you actually need to know about refunds.
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink-50">
          The mechanic is simple. The edge cases are where people get burned,
          so we wrote them out.
        </p>
      </header>

      <div className="divide-y divide-cream-300/60 border-y border-cream-300/60">
        {REFUNDS_FAQ.map((item) => (
          <details
            key={item.q}
            className="group py-6 [&_summary]:list-none [&[open]_.faq-chevron]:rotate-180"
          >
            <summary className="flex min-h-[44px] cursor-pointer items-start justify-between gap-6">
              <span className="font-display text-lg text-ink-700 md:text-xl">
                {item.q}
              </span>
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="faq-chevron mt-1 h-5 w-5 shrink-0 text-cream-400 transition-transform"
              >
                <path
                  d="M4 6 L 8 10 L 12 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-50">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
