import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus, X } from "lucide-react";

import { fetchFeed, type FeedIdea } from "@/lib/api/feed";
import { env } from "@/lib/env";
import { pageMetadata } from "@/lib/seo/page-metadata";
import {
  buildBreadcrumbSchema,
  buildFaqPage,
  buildSpeakableWebPage,
  schemaJson,
} from "@/lib/seo/schemas";

/**
 * /gummysearch-alternative — Post 1 of the SEO blog plan (docs/SEO-BLOG-PLAN.md).
 *
 * Target query: "gummysearch alternative" (+ "gummysearch shut down",
 * "gummysearch replacement"). GummySearch closed 30 Nov 2025; thousands of
 * displaced users are actively searching. This is a product-adjacent landing
 * page, not a blog post — it converts.
 *
 * Recipe compliance (docs/SEO-BLOG-PLAN.md §6):
 *  - one target search, written here
 *  - intent match: the SERP wants "is it gone + what now + comparison" — we do
 *    exactly that, in that order
 *  - real Pannly data inside (live scored ideas, fail-soft)
 *  - honest: we name what Pannly does NOT replace and point to the right tool
 *  - internal links + one $3 CTA
 *  - FAQ backed by FAQPage JSON-LD for AI-answer eligibility
 */

const TITLE = "Best GummySearch Alternative in 2026 (It Shut Down)";
const DESCRIPTION =
  "GummySearch shut down on November 30, 2025. An honest comparison of the best alternatives for turning real Reddit pain into validated SaaS ideas.";
const PATH = "/gummysearch-alternative";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

// Mostly static editorial content, but the proof section pulls live scored
// ideas. 1-hour window keeps that fresh without hammering the backend; copy
// edits re-deploy and bust the cache anyway.
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([
  { name: "GummySearch Alternative", path: PATH },
]);

// Visible + machine-readable freshness. Without explicit dates Google scraped
// "November 30, 2025" (the GummySearch shutdown date, repeated in the body) and
// showed THAT as the page date in the SERP. datePublished/dateModified on the
// WebPage entity + the visible "Updated" line in the hero override that.
const PUBLISHED_ISO = "2026-05-18";
const MODIFIED_ISO = "2026-05-21";
const UPDATED_LABEL = "May 2026";

const SPEAKABLE = {
  ...buildSpeakableWebPage({
    url: PATH,
    name: "The best GummySearch alternative in 2026",
    description:
      "GummySearch shut down on November 30, 2025 after it could not secure a commercial license for Reddit's Data API. For turning recurring Reddit and Hacker News pain into validated, scored software ideas, the closest alternative is Pannly.",
  }),
  datePublished: PUBLISHED_ISO,
  dateModified: MODIFIED_ISO,
};

const FAQS = [
  {
    question: "Is GummySearch shut down?",
    answer:
      "Yes. GummySearch stopped operating on November 30, 2025. The founder announced the closure after being unable to secure a commercial license for Reddit's Data API, which the tool depended on.",
  },
  {
    question: "Why did GummySearch shut down?",
    answer:
      "GummySearch relied on Reddit's API to pull and analyse posts. After Reddit moved to paid commercial API licensing, GummySearch could not secure terms that kept the product viable, and it closed on November 30, 2025.",
  },
  {
    question: "What is the best free GummySearch alternative?",
    answer:
      "For free Reddit keyword monitoring, F5Bot emails you when your keywords appear in new Reddit or Hacker News posts. It does not analyse pain points or score ideas — it is an alert tool, not a research tool. Pannly's feed is free to browse; you only pay $3 to unlock a full brief.",
  },
  {
    question: "Does Pannly do the same thing as GummySearch?",
    answer:
      "Not exactly, and that matters. GummySearch did three jobs: audience/subreddit research, keyword monitoring, and pain-point discovery. Pannly replaces only the third one — and takes it further by scoring each recurring complaint and writing a structured brief. If you used GummySearch mainly to find what to build, Pannly is the closest replacement. If you used it for marketing keyword alerts, use a monitoring tool like F5Bot or Syften instead.",
  },
  {
    question: "How much does Pannly cost?",
    answer: `Browsing the feed of scored ideas is free. A full brief is $${env.prices.unlockDefaultUsd} to unlock — and it is refunded automatically if you ship a working build within ${env.prices.buildWindowDays} days. Unlimited access is $${env.prices.proMonthlyUsd}/month on Pro.`,
  },
];

const FAQ_SCHEMA = buildFaqPage({
  url: PATH,
  qas: FAQS.map((f) => ({ question: f.question, answer: f.answer })),
});

export default async function GummySearchAlternativePage() {
  const sampleIdeas = await safeFetchTopIdeas();

  return (
    <div className="flex flex-col gap-24 px-6 py-16 md:px-12 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(SPEAKABLE) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }}
      />

      <Hero />
      <WhatHappened />
      <WhatToUseInstead />
      <ComparisonTable />
      <LiveProof ideas={sampleIdeas} />
      <Faq />
      <Cta />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Hero                                                              */
/* ---------------------------------------------------------------- */

function Hero() {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <span className="mb-4 block font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink-50/70">
        GummySearch Alternative
      </span>
      <h1 className="mb-3 font-display text-4xl font-medium tracking-tight text-moss-600 md:text-5xl">
        The best GummySearch alternative in 2026
      </h1>
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.12em] text-ink-50/60">
        Updated {UPDATED_LABEL}
      </p>
      {/* Definitional, citable passage. .geo-speakable is the selector in the
          SpeakableSpecification JSON-LD above — this is the sentence AI
          Overviews and voice assistants should read. */}
      <p className="geo-speakable max-w-2xl text-lg leading-relaxed text-ink-50/90">
        GummySearch shut down on November 30, 2025 after it could not secure a
        commercial license for Reddit&apos;s Data API. For turning recurring
        Reddit and Hacker News pain into validated, scored software ideas, the
        closest alternative is Pannly — it watches six SaaS subreddits and
        Hacker News, scores each recurring complaint, and writes a structured
        brief for it.
      </p>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-50/70">
        This page is honest about what Pannly does and does not replace, then
        compares every realistic option so you can pick the right one.
      </p>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/*  What happened to GummySearch                                      */
/* ---------------------------------------------------------------- */

function WhatHappened() {
  return (
    <section className="mx-auto w-full max-w-3xl">
      {/* Self-contained H2 — survives being quoted out of context by AI. */}
      <h2 className="mb-6 font-display text-3xl text-moss-600">
        What happened to GummySearch?
      </h2>
      <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
        <p>
          GummySearch was a Reddit audience-research tool. It clustered
          subreddits, surfaced recurring complaints, and let you monitor
          keywords across communities. It ran on Reddit&apos;s API.
        </p>
        <p>
          When Reddit moved to paid commercial API licensing, that dependency
          became fatal. The founder announced the product would close, and{" "}
          <strong className="font-semibold text-ink-700">
            GummySearch stopped operating on November 30, 2025
          </strong>
          . Paying users were left looking for a replacement — which is almost
          certainly why you&apos;re here.
        </p>
        <p>
          There is no single 1:1 replacement, because GummySearch did several
          different jobs. The honest answer is to figure out{" "}
          <em className="italic">which</em> job you actually used it for, then
          pick the tool built for that job.
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/*  What to use instead (honest job-by-job mapping)                   */
/* ---------------------------------------------------------------- */

const JOBS = [
  {
    job: "Finding validated ideas / pain points to build",
    replacement: "Pannly",
    detail:
      "This is the job Pannly is built for. Instead of handing you raw threads to sift, it scores each recurring complaint on demand, buyer reachability, and competitive gap, then writes a structured brief — pain, evidence quotes with source URLs, persona, and a validation plan.",
    isPannly: true,
  },
  {
    job: "Free keyword alerts (someone mentioned X)",
    replacement: "F5Bot (free)",
    detail:
      "If you used GummySearch to get pinged when a keyword appeared on Reddit or Hacker News, that is monitoring, not research. F5Bot does exactly this for free. Pannly does not do keyword alerts and won't pretend to.",
    isPannly: false,
  },
  {
    job: "Audience / subreddit analytics for marketing",
    replacement: "A dedicated monitoring tool",
    detail:
      "If you used GummySearch to size subreddits or track brand mentions for marketing, that is a social-listening job. Pannly is not the tool for that — a dedicated Reddit monitoring tool is. We'd rather tell you that than oversell.",
    isPannly: false,
  },
];

function WhatToUseInstead() {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <h2 className="mb-3 font-display text-3xl text-moss-600">
        What to use instead, by what you actually used GummySearch for
      </h2>
      <p className="mb-10 text-base leading-relaxed text-ink-50/70">
        Picking by job — not by &ldquo;closest clone&rdquo; — is the only honest
        way to choose a replacement.
      </p>
      <div className="flex flex-col gap-4">
        {JOBS.map((j) => (
          <div
            key={j.job}
            className={`rounded-xl border p-6 ${
              j.isPannly
                ? "border-moss-600 bg-cream-50"
                : "border-cream-300 bg-cream-50/60"
            }`}
          >
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-xl text-ink-700">{j.job}</h3>
              <span
                className={`font-mono text-xs font-semibold uppercase tracking-[0.08em] ${
                  j.isPannly ? "text-moss-600" : "text-ink-50/60"
                }`}
              >
                → {j.replacement}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-ink-50/80">{j.detail}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-base leading-relaxed text-ink-50/80">
        The rest of this page is about the first job — finding something worth
        building. See{" "}
        <Link
          href={"/how-it-works" as Route}
          className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500"
        >
          how Pannly turns a Reddit complaint into a scored brief
        </Link>
        .
      </p>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/*  Comparison table                                                  */
/* ---------------------------------------------------------------- */

interface Row {
  name: string;
  status: "live" | "gone";
  coreJob: string;
  sources: string;
  pricing: string;
  bestFor: string;
}

const ROWS: Row[] = [
  {
    name: "Pannly",
    status: "live",
    coreJob: "Scored, written briefs from real pain",
    sources: "6 SaaS subreddits + Hacker News",
    pricing: `Free to browse · $${env.prices.unlockDefaultUsd}/brief (refunded on ship)`,
    bestFor: "Deciding what to build next",
  },
  {
    name: "GummySearch",
    status: "gone",
    coreJob: "Audience research + monitoring",
    sources: "Reddit (via API)",
    pricing: "Discontinued Nov 30, 2025",
    bestFor: "—",
  },
  {
    name: "Pain-point research tools",
    status: "live",
    coreJob: "AI-summarised pain from communities",
    sources: "Reddit + communities",
    pricing: "Mostly paid subscription",
    bestFor: "Browsing many raw pain points",
  },
  {
    name: "F5Bot",
    status: "live",
    coreJob: "Keyword alerts",
    sources: "Reddit + Hacker News",
    pricing: "Free",
    bestFor: "Mention monitoring, not research",
  },
];

function StatusPill({ status }: { status: Row["status"] }) {
  if (status === "gone") {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-xs text-plum-500">
        <X className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        Discontinued
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs text-moss-600">
      <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      Operating
    </span>
  );
}

function ComparisonTable() {
  return (
    <section className="mx-auto w-full max-w-5xl">
      <h2 className="mb-3 font-display text-3xl text-moss-600">
        GummySearch alternatives compared
      </h2>
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-ink-50/70">
        No tool does everything GummySearch did. This is which one wins which
        job — including where Pannly is not the answer.
      </p>

      <div className="overflow-x-auto rounded-xl border border-cream-300">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-cream-300 bg-cream-50">
              {["Tool", "Status", "Core job", "Sources", "Pricing", "Best for"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-4 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-50/70"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr
                key={r.name}
                className={`border-b border-cream-300 last:border-0 ${
                  r.name === "Pannly" ? "bg-cream-50" : ""
                }`}
              >
                <td className="px-4 py-4 font-display text-base text-ink-700">
                  {r.name}
                </td>
                <td className="px-4 py-4">
                  <StatusPill status={r.status} />
                </td>
                <td className="px-4 py-4 text-ink-50/80">{r.coreJob}</td>
                <td className="px-4 py-4 text-ink-50/80">{r.sources}</td>
                <td className="px-4 py-4 text-ink-50/80">{r.pricing}</td>
                <td className="px-4 py-4 text-ink-50/80">
                  {r.bestFor === "—" ? (
                    <Minus
                      className="h-4 w-4 text-ink-50/40"
                      strokeWidth={2}
                      aria-label="not applicable"
                    />
                  ) : (
                    r.bestFor
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-ink-50/60">
        Pricing categories are summarised, not quoted — check each tool&apos;s
        site for current numbers. Pannly figures are exact.
      </p>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/*  Live proof — real scored ideas, fail-soft                         */
/* ---------------------------------------------------------------- */

function LiveProof({ ideas }: { ideas: FeedIdea[] | null }) {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <h2 className="mb-3 font-display text-3xl text-moss-600">
        What &ldquo;validated pain&rdquo; actually looks like
      </h2>
      <p className="mb-10 text-base leading-relaxed text-ink-50/70">
        Not a claim — the live feed. These are real, currently-scored ideas
        pulled from Reddit and Hacker News pain right now.
      </p>

      {ideas && ideas.length > 0 ? (
        <div className="flex flex-col gap-3">
          {ideas.map((idea) => (
            <Link
              key={idea.slug}
              href={`/ideas/${encodeURIComponent(idea.slug)}` as Route}
              className="group flex items-start justify-between gap-4 rounded-xl border border-cream-300 bg-cream-50/60 p-5 transition-colors hover:border-moss-600"
            >
              <div>
                <h3 className="mb-1 font-display text-lg text-ink-700 group-hover:text-moss-600">
                  {idea.title}
                </h3>
                {idea.one_line_pain ? (
                  <p className="text-sm leading-relaxed text-ink-50/70">
                    {idea.one_line_pain}
                  </p>
                ) : null}
              </div>
              {idea.overall_score !== null ? (
                <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-moss-600">
                  {idea.overall_score.toFixed(1)}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-cream-300 bg-cream-50/60 p-6 text-base text-ink-50/70">
          The live feed is loading on the main{" "}
          <Link
            href={"/feed" as Route}
            className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500"
          >
            idea feed
          </Link>{" "}
          — browse it free to see current scored pain points.
        </p>
      )}

      <p className="mt-6 text-base leading-relaxed text-ink-50/80">
        Each one opens into a full brief: the pain, evidence quotes with their
        original Reddit/HN source URLs, who buys it, and a validation plan.{" "}
        <Link
          href={"/feed" as Route}
          className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500"
        >
          Browse the full feed
        </Link>{" "}
        or read{" "}
        <Link
          href={"/pricing" as Route}
          className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500"
        >
          how pricing and the refund work
        </Link>
        .
      </p>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/*  FAQ — backed by FAQPage JSON-LD                                   */
/* ---------------------------------------------------------------- */

function Faq() {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <h2 className="mb-10 font-display text-3xl text-moss-600">
        GummySearch alternative — frequently asked
      </h2>
      <div className="flex flex-col divide-y divide-cream-300 border-t border-cream-300">
        {FAQS.map((f) => (
          <details key={f.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg text-ink-700">
              {f.question}
              <span className="ml-4 font-mono text-xl text-moss-600 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-4 text-base leading-relaxed text-ink-50/80">
              {f.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/*  CTA                                                               */
/* ---------------------------------------------------------------- */

function Cta() {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="rounded-2xl border border-cream-300 bg-cream-200 px-8 py-16 text-center shadow-soft">
        <h2 className="mx-auto max-w-xl font-display text-3xl tracking-tight text-ink-700 md:text-4xl">
          GummySearch found the threads. Pannly tells you which one to build.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-50">
          Browsing scored ideas is free. ${env.prices.unlockDefaultUsd} unlocks
          a full brief — refunded automatically if you ship within{" "}
          {env.prices.buildWindowDays} days.
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

/* ---------------------------------------------------------------- */
/*  Backend fetch — fail soft, never throw                            */
/* ---------------------------------------------------------------- */

async function safeFetchTopIdeas(): Promise<FeedIdea[] | null> {
  try {
    const res = await fetchFeed({ page: 1, per_page: 4, sort: "score" });
    return res.items.slice(0, 4);
  } catch {
    return null;
  }
}
