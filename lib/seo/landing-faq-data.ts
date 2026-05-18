/**
 * Single source of truth for the homepage FAQ.
 *
 * Used in two places:
 *   1. <LandingFaq /> renders these as native <details> for users.
 *   2. The homepage page.tsx wraps them in FAQPage JSON-LD for AI search
 *      and (until Aug 2023's restriction) Google rich results.
 *
 * Editing here updates both. Don't soften the answers — the brand voice is
 * honest and specific.
 */

export interface LandingFaqItem {
  q: string;
  a: string;
}

export const LANDING_FAQ: readonly LandingFaqItem[] = [
  {
    q: "What if I don't ship in 30 days?",
    a: "The $3 stays as a normal purchase. You keep access to the brief forever; we just don't issue the refund. The window is what makes the stake meaningful.",
  },
  {
    q: "What counts as 'shipped'?",
    a: "A working live URL plus a screenshot showing the core functionality. We reject 'coming soon' pages, sites behind login walls, and sites that don't credibly address the unlocked idea. Manual review by a human, 24-48 hour turnaround.",
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
