/**
 * Landing FAQ — 6 questions builders actually ask, rendered as native
 * <details> for free a11y + zero JS with a custom rotation chevron.
 *
 * Source data lives in `lib/seo/landing-faq-data.ts` so the homepage page.tsx
 * can wrap the same Q&A pairs in FAQPage JSON-LD without duplication.
 */
import { LANDING_FAQ as FAQ } from "@/lib/seo/landing-faq-data";

export function LandingFaq() {
  return (
    <section className="px-6 md:px-12">
      <div className="mx-auto max-w-3xl py-24 md:py-32">
        <header className="mb-12 text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-400">
            FAQ
          </span>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-ink-700 md:text-4xl">
            Questions builders actually ask.
          </h2>
        </header>

        <div className="divide-y divide-cream-300/60 border-y border-cream-300/60">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group py-6 [&_summary]:list-none [&[open]_.faq-chevron]:rotate-180"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-6">
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
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-50">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
