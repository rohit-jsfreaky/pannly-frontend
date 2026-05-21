import type { Route } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BlogIdeaCard } from "@/components/blog/idea-card";
import { env } from "@/lib/env";
import { safeBlogIdeas, safeIdeaCount } from "@/lib/blog/ideas";
import type { FeedIdea } from "@/lib/api/feed";
import { pageMetadata } from "@/lib/seo/page-metadata";
import {
  buildBreadcrumbSchema,
  buildFaqPage,
  buildSpeakableWebPage,
  schemaJson,
} from "@/lib/seo/schemas";

/**
 * /saas-ideas-2026 — Post 2 of the SEO plan (docs/SEO-BLOG-PLAN.md), Blog 1 of
 * the 3-blog brief (docs/SEO-BLOG-BRIEFS.md).
 *
 * Target: `saas ideas 2026` (+ `saas ideas`, `saas ideas from reddit`,
 * `validated saas ideas`). Winnable — peer competition, citation-free.
 *
 * Wedge: real demand SCORES + real pain + links to sourced briefs. Competitors
 * claim "from Reddit" with zero receipts. We show the score and link the brief.
 * (Public API exposes no quote text/URLs — those are paywalled — so we never
 * print quotes inline.)
 */

const TITLE = "SaaS Ideas for 2026, Backed by Real Reddit Pain";
const DESCRIPTION =
  "A live, scored list of SaaS ideas for 2026 — pulled from real Reddit and Hacker News pain, not brainstormed. Every idea carries a demand score and links to its brief.";
const PATH = "/saas-ideas-2026";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const PUBLISHED_ISO = "2026-05-21";
const MODIFIED_ISO = "2026-05-21";
const UPDATED_LABEL = "May 2026";

const BREADCRUMB = buildBreadcrumbSchema([{ name: "SaaS Ideas for 2026", path: PATH }]);

const SPEAKABLE = {
  ...buildSpeakableWebPage({
    url: PATH,
    name: "SaaS ideas for 2026, backed by real Reddit pain",
    description:
      "A continuously updated list of SaaS ideas for 2026 sourced from recurring Reddit and Hacker News complaints. Each idea is scored on demand, buyer reachability, and competitive gap, and links to a full brief with evidence and a validation plan.",
  }),
  datePublished: PUBLISHED_ISO,
  dateModified: MODIFIED_ISO,
};

const FAQS = [
  {
    question: "Where do these SaaS ideas come from?",
    answer:
      "They are pulled from real public posts on six SaaS-focused subreddits (r/SaaS, r/indiehackers, r/Entrepreneur, r/SideProject, r/microsaas, r/SaaS_Ideas) and Hacker News, where founders describe problems they would pay to solve. They are not brainstormed or AI-invented — each one traces back to recurring complaints.",
  },
  {
    question: "Are these SaaS ideas validated?",
    answer:
      "Each idea is scored on three signals: how strong and recurring the demand is, how reachable the buyer is for a solo founder, and how weak the existing competition is. A high score means real, repeated demand — but a score is a starting point, not a guarantee. Validate with pre-sales before you build.",
  },
  {
    question: "How much can a SaaS or micro SaaS make?",
    answer:
      "A focused micro SaaS commonly reaches $5,000–$30,000 in monthly recurring revenue for a solo founder or small team. The ceiling depends on the niche and pricing, not the idea alone — vertical tools that target buyers with money tend to outperform generic ones.",
  },
  {
    question: "Can I see the original Reddit thread for an idea?",
    answer:
      "Yes — open any idea's brief. The full brief includes evidence quotes with their original Reddit and Hacker News source links, the buyer persona, and a step-by-step validation plan. Browsing the scored list is free; unlocking a full brief is $" +
      env.prices.unlockDefaultUsd +
      ", refunded if you ship within " +
      env.prices.buildWindowDays +
      " days.",
  },
  {
    question: "Is this list updated?",
    answer:
      "Yes. The ideas shown are pulled live from the feed and re-ranked by score, so the list reflects current demand rather than a static snapshot from when the page was written.",
  },
];

const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

function buildItemList(ideas: FeedIdea[]) {
  const base = env.appBaseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SaaS ideas for 2026",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: ideas.length,
    itemListElement: ideas.map((idea, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${base}/ideas/${encodeURIComponent(idea.slug)}`,
      name: idea.title,
    })),
  };
}

export default async function SaasIdeas2026Page() {
  const [ideas, total] = await Promise.all([
    safeBlogIdeas({ topic: "saas", perPage: 15 }),
    safeIdeaCount(),
  ]);
  const hasIdeas = ideas.length > 0;

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(SPEAKABLE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />
      {hasIdeas ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(buildItemList(ideas)) }} />
      ) : null}

      {/* Hero */}
      <section className="mx-auto w-full max-w-3xl">
        <span className="mb-4 block font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink-50/70">
          SaaS Ideas · 2026
        </span>
        <h1 className="mb-3 font-display text-4xl font-medium tracking-tight text-moss-600 md:text-5xl">
          SaaS ideas for 2026, backed by real Reddit pain
        </h1>
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.12em] text-ink-50/60">
          Updated {UPDATED_LABEL}
        </p>
        <p className="geo-speakable max-w-2xl text-lg leading-relaxed text-ink-50/90">
          Most &ldquo;SaaS ideas&rdquo; lists are brainstormed in an afternoon. This one
          isn&apos;t. Every idea below is pulled from a recurring complaint on Reddit or
          Hacker News, scored on real demand, and linked to a brief with the evidence
          behind it{total ? ` — ${total} live ideas and counting` : ""}.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-50/70">
          No fake search-volume claims, no &ldquo;trust me, people want this.&rdquo; A
          number you can check, and a thread you can read.
        </p>
      </section>

      {/* How we picked these */}
      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          How these SaaS ideas were chosen
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            Pannly watches six SaaS-focused subreddits and Hacker News for the posts where
            founders say some version of <em className="italic">&ldquo;I&apos;d pay for
            this&rdquo;</em> or <em className="italic">&ldquo;why does no one build
            this?&rdquo;</em> Those signals get clustered and scored on three things:
          </p>
          <ul className="space-y-3 border-l-2 border-cream-300 pl-6">
            <li><strong className="text-ink-700">Demand</strong> — is the same pain
              surfacing across multiple people and threads, or is it one person venting?</li>
            <li><strong className="text-ink-700">Reachability</strong> — can a solo
              founder actually find and reach the people who have this problem?</li>
            <li><strong className="text-ink-700">Competitive gap</strong> — is this
              unserved, or served badly by expensive, clunky incumbents?</li>
          </ul>
          <p>
            The number on each card below is that weighted score. It&apos;s a filter, not a
            crystal ball — see exactly{" "}
            <Link href={"/how-it-works" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              how the scoring works
            </Link>
            .
          </p>
        </div>
      </section>

      {/* The ideas */}
      <section className="mx-auto w-full max-w-5xl">
        <h2 className="mb-3 font-display text-3xl text-moss-600">
          The SaaS ideas (live, ranked by demand score)
        </h2>
        <p className="mb-10 max-w-2xl text-base leading-relaxed text-ink-50/70">
          Pulled from the feed right now and sorted by score. Open any one for the full
          brief — the pain, evidence quotes with their Reddit/HN sources, the buyer, and a
          validation plan.
        </p>

        {hasIdeas ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {ideas.map((idea, i) => (
              <BlogIdeaCard key={idea.slug} idea={idea} rank={i + 1} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-cream-300 bg-cream-50/60 p-6 text-base text-ink-50/70">
            The live feed is loading — browse the full,{" "}
            <Link href={"/feed" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              continuously-updated idea feed
            </Link>{" "}
            to see every scored SaaS idea.
          </p>
        )}

        <div className="mt-8 text-center">
          <Link
            href={"/feed?topic=saas" as Route}
            prefetch={true}
            className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.08em] text-moss-600 hover:text-plum-500"
          >
            See every SaaS idea in the feed
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </section>

      {/* Validate before building */}
      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          How to validate a SaaS idea before you build it
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            A high score means the demand is real. It does not mean <em className="italic">you</em>{" "}
            should drop everything and build it. Before you write a line of code:
          </p>
          <ol className="list-decimal space-y-3 pl-6 marker:font-mono marker:text-moss-600">
            <li>Find where these people already gather — the subreddit or thread the pain
              came from — and read ten more posts to make sure you understand it.</li>
            <li>Try to pre-sell. A landing page and a &ldquo;reserve a spot&rdquo; button
              tells you more in a week than a month of building. Money beats survey answers.</li>
            <li>Build the smallest version that solves the core problem in days, not months.
              Ship it to the community it came from.</li>
          </ol>
          <p>
            This is the difference between &ldquo;an idea&rdquo; and &ldquo;a thing people
            pay for.&rdquo; If you want the worked version — persona, validation steps, and
            sample landing copy — that&apos;s exactly what a{" "}
            <Link href={"/pricing" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              ${env.prices.unlockDefaultUsd} brief
            </Link>{" "}
            contains.
          </p>
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">Keep going</h2>
        <ul className="space-y-3 text-lg text-ink-50/80">
          <li>
            <Link href={"/micro-saas-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              Micro SaaS ideas from real Reddit threads
            </Link>{" "}
            — smaller, weekend-buildable niches.
          </li>
          <li>
            <Link href={"/startup-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              Startup ideas worth building in 2026
            </Link>{" "}
            — the bigger picture, by category.
          </li>
          <li>
            <Link href={"/gummysearch-alternative" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              The best GummySearch alternative
            </Link>{" "}
            — if you came here from a Reddit-research tool.
          </li>
        </ul>
      </section>

      <Faq />
      <Cta />
    </div>
  );
}

function Faq() {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <h2 className="mb-10 font-display text-3xl text-moss-600">SaaS ideas — frequently asked</h2>
      <div className="flex flex-col divide-y divide-cream-300 border-t border-cream-300">
        {FAQS.map((f) => (
          <details key={f.question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg text-ink-700">
              {f.question}
              <span className="ml-4 font-mono text-xl text-moss-600 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 text-base leading-relaxed text-ink-50/80">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="rounded-2xl border border-cream-300 bg-cream-200 px-8 py-16 text-center shadow-soft">
        <h2 className="mx-auto max-w-xl font-display text-3xl tracking-tight text-ink-700 md:text-4xl">
          Stop brainstorming. Start with real demand.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-50">
          Browsing the scored feed is free. ${env.prices.unlockDefaultUsd} unlocks the full
          brief — refunded automatically if you ship within {env.prices.buildWindowDays} days.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href={"/feed" as Route} prefetch={true} className="inline-flex items-center justify-center gap-2 rounded-xl bg-moss-600 px-7 py-3 text-base font-medium text-cream-50 shadow-sm transition-opacity hover:opacity-90">
            Browse the feed
            <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
          </Link>
          <Link href={"/how-it-works" as Route} prefetch={true} className="inline-flex items-center justify-center rounded-xl border border-cream-300 bg-cream-50 px-7 py-3 text-base font-medium text-ink-700 transition-colors hover:bg-cream-100">
            How it works
          </Link>
        </div>
      </div>
    </section>
  );
}
