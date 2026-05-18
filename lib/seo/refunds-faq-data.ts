/**
 * /refunds FAQ — single source of truth for both rendered Q&A and FAQPage
 * JSON-LD. Keep answers SPECIFIC: this page underwrites the entire pricing
 * pitch and Google's quality systems weight refund/payment pages on
 * concreteness (YMYL-adjacent).
 */

import type { LandingFaqItem } from "@/lib/seo/landing-faq-data";

export const REFUNDS_FAQ: readonly LandingFaqItem[] = [
  {
    q: "What exactly counts as 'shipped'?",
    a: "A live, publicly accessible URL where a non-logged-in visitor can interact with the core feature your unlocked brief described. Examples that pass: a working signup flow, a usable demo, a deployed tool with at least one end-to-end happy path. Examples that fail: a 'coming soon' splash, a Notion page describing what you plan to build, a screenshot of a Figma file, a Loom video of a localhost demo, a private beta gated behind an invite code we can't request.",
  },
  {
    q: "What proof do you need?",
    a: "Three things, submitted via the proof-of-launch form on /unlocks/[id]/submit: (1) the live URL, (2) one screenshot showing the core feature in use (annotate it if context isn't obvious), (3) one sentence in plain English explaining how this build addresses the pain in the brief. We don't need source code, repos, traffic numbers, or revenue.",
  },
  {
    q: "How long does the review take?",
    a: "24 to 48 hours from submission. A human reviews every claim — there's no auto-approver. If we need clarification we email back within the same window asking one specific question. Once approved, the refund hits your card within 5-10 business days depending on your bank (Dodo Payments handles the actual transfer).",
  },
  {
    q: "What if my build pivots away from the original idea?",
    a: "Submit anyway. If the build credibly addresses the pain described in the brief — even via a different mechanic — it qualifies. Example: brief said 'tool to deduplicate Reddit comment notifications', you built a generic notification grouper that includes Reddit. That passes. What doesn't pass: brief said 'AI agent cost preflight checker', you built a Pomodoro timer.",
  },
  {
    q: "What happens if I miss the 30-day window?",
    a: "The unlock stays as a normal $3 purchase. You keep permanent access to the brief — you just don't get the refund. Nothing else changes. We don't lock you out, charge a late fee, or downgrade your account. The window is what makes the stake meaningful; without it the refund mechanic loses its point.",
  },
  {
    q: "Can I extend the 30-day window?",
    a: "Yes, once per unlock, by 14 days, no questions asked. Email support@getrevlio.com from the address on your account before day 30 with the unlock ID and we'll push the deadline. Don't ask for a second extension — we'll say no, and the answer is consistent so we can keep the policy honest.",
  },
  {
    q: "Can I unlock multiple briefs and refund them all?",
    a: "Yes. Every unlock is independent. Ship five different ideas, get five separate refunds. No cap. No 'lifetime refund limit'. The same review standard applies to each one — the brief and the build need to match.",
  },
  {
    q: "Do refunds work on Pro subscriptions?",
    a: "No. Pro is a monthly subscription for unlimited brief access; it isn't a stake on a single idea. The refund mechanic only applies to per-unlock $3 purchases. You can cancel Pro anytime through the Dodo customer portal — we don't pro-rate but you keep access until the end of your paid period.",
  },
  {
    q: "What about refund chargebacks via my card issuer?",
    a: "Don't. If you have an issue, email support and we'll work it out — the refund mechanic exists specifically so you don't need to escalate to your bank. Chargebacks cost us a fee on top of the disputed amount and trigger a permanent ban from future unlocks. We've never refused a legitimate refund request.",
  },
  {
    q: "What does the public ledger show?",
    a: "Every refund Pannly has issued, with a timestamp, the amount in cents, and the deep-link to the idea page that was unlocked and shipped. No personally identifying information. The ledger is published as a Schema.org Dataset under CC BY 4.0 — feel free to mirror or analyse it. The /v1/refunds/ledger endpoint returns the same data as JSON for anyone building a tracker.",
  },
];
