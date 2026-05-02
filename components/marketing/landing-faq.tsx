/**
 * Landing FAQ — 6 questions builders actually ask, with factually correct
 * answers anchored on the codebase. Uses native <details> for free a11y +
 * zero JS, with a custom rotation chevron.
 *
 * Don't soften the answers; the brand voice is honest and specific.
 */
const FAQ: { q: string; a: string }[] = [
  {
    q: "What if I don't ship in 30 days?",
    a: "The $3 stays as a normal purchase. You keep access to the brief forever; we just don't issue the refund. The window is what makes the stake meaningful.",
  },
  {
    q: "What counts as 'shipped'?",
    a: "A working live URL plus a screenshot showing the core functionality. We reject 'coming soon' pages, sites behind login walls, and sites that don't credibly address the unlocked idea. Manual review by a human, 24–48 hour turnaround.",
  },
  {
    q: "Can I cancel my Pro plan?",
    a: "Anytime through the customer portal. We don't pro-rate refunds — you keep access until the end of the period you paid for.",
  },
  {
    q: "Do you store my card?",
    a: "No. Payments are handled by Dodo Payments. We see only transaction status and a customer ID for portal access. Your card details never touch our servers.",
  },
  {
    q: "Where does the brief content come from?",
    a: "Real public posts on Reddit and Hacker News. Every evidence quote in a brief preserves the source URL so you can read the original thread. Briefs are written by an LLM working from clustered signals, prompted to keep the language specific and grounded.",
  },
  {
    q: "What languages and regions do you cover?",
    a: "English-language posts from the listed subreddits and Hacker News. Pricing auto-converts to INR for users in India, USD elsewhere — based on your IP at checkout.",
  },
];

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
