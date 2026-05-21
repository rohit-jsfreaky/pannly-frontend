import type { Route } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BlogIdeaCard } from "@/components/blog/idea-card";
import { env } from "@/lib/env";
import { safeBlogIdeas } from "@/lib/blog/ideas";
import type { FeedIdea } from "@/lib/api/feed";
import { pageMetadata } from "@/lib/seo/page-metadata";
import {
  buildBreadcrumbSchema,
  buildFaqPage,
  buildSpeakableWebPage,
  schemaJson,
} from "@/lib/seo/schemas";

/**
 * /micro-saas-ideas — Blog 2 of the 3-blog brief (docs/SEO-BLOG-BRIEFS.md).
 * Target: `micro saas ideas` (+ `micro saas ideas reddit`, `... for solopreneurs`,
 * `profitable micro saas ideas`). Most direct hit on the Reddit-data moat — every
 * ranking competitor claims Reddit sourcing with zero receipts.
 */

const TITLE = "Micro SaaS Ideas from Real Reddit Threads";
const DESCRIPTION =
  "Small, profitable micro SaaS ideas pulled from real Reddit and Hacker News pain — each scored on demand and linked to a sourced brief. Not another brainstormed list.";
const PATH = "/micro-saas-ideas";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const PUBLISHED_ISO = "2026-05-21";
const MODIFIED_ISO = "2026-05-21";
const UPDATED_LABEL = "May 2026";

const BREADCRUMB = buildBreadcrumbSchema([{ name: "Micro SaaS Ideas", path: PATH }]);

const SPEAKABLE = {
  ...buildSpeakableWebPage({
    url: PATH,
    name: "Micro SaaS ideas from real Reddit threads",
    description:
      "A list of micro SaaS ideas — small, niche, solo-buildable software products — sourced from recurring Reddit and Hacker News complaints, scored on demand and competition, and linked to full briefs with evidence.",
  }),
  datePublished: PUBLISHED_ISO,
  dateModified: MODIFIED_ISO,
};

const FAQS = [
  {
    question: "What is a micro SaaS?",
    answer:
      "A micro SaaS is a small software product that solves one specific problem for a narrow audience, usually run by one to five people. The scope is intentionally tiny — you can build and launch in weeks, and a focused micro SaaS commonly reaches $5,000–$30,000 in monthly recurring revenue.",
  },
  {
    question: "Are micro SaaS ideas still profitable in 2026?",
    answer:
      "Yes, and arguably more so. As building gets cheaper, the edge moves from 'can you build it' to 'did you pick a real, reachable problem.' Vertical micro SaaS — a tool built deeply for one niche a generic AI can't serve — is where solo founders consistently make money.",
  },
  {
    question: "Where do these micro SaaS ideas come from?",
    answer:
      "Real public posts on six SaaS-focused subreddits and Hacker News, where people describe a repetitive task or missing tool they would pay for. Each idea is scored on demand, buyer reachability, and competitive gap. Open any idea's brief to read the evidence quotes and their original Reddit and Hacker News source links.",
  },
  {
    question: "How do I validate a micro SaaS idea?",
    answer:
      "Pick a pain that is frequent, specific, and felt by people with money. Then pre-sell before building: a landing page with a real 'reserve a spot' or pre-order beats survey answers. If ten people pay or commit, you have something. Build the smallest version in days and ship it to the community the pain came from.",
  },
];

const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

function buildItemList(ideas: FeedIdea[]) {
  const base = env.appBaseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Micro SaaS ideas",
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

export default async function MicroSaasIdeasPage() {
  const ideas = await safeBlogIdeas({ perPage: 12 });
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
          Micro SaaS Ideas
        </span>
        <h1 className="mb-3 font-display text-4xl font-medium tracking-tight text-moss-600 md:text-5xl">
          Micro SaaS ideas from real Reddit threads
        </h1>
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.12em] text-ink-50/60">
          Updated {UPDATED_LABEL}
        </p>
        <p className="geo-speakable max-w-2xl text-lg leading-relaxed text-ink-50/90">
          Every &ldquo;micro SaaS ideas from Reddit&rdquo; list says the same thing —
          &ldquo;sourced from real pain&rdquo; — and then shows you nothing. No thread, no
          number, no proof. This list is different: each idea carries a real demand score
          and links to a brief where the evidence and its Reddit and Hacker News sources live.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-50/70">
          A micro SaaS is small on purpose — one sharp problem, one niche, buildable in
          weeks. The hard part was never building. It&apos;s picking a problem people
          actually pay to fix.
        </p>
      </section>

      {/* What makes a good micro SaaS idea */}
      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          What makes a micro SaaS idea worth building
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>The ideas below all clear the same bar — and it&apos;s a short one:</p>
          <ul className="space-y-3 border-l-2 border-cream-300 pl-6">
            <li><strong className="text-ink-700">The pain is repetitive.</strong> If someone
              does this task weekly or daily, they&apos;ll pay to automate it.</li>
            <li><strong className="text-ink-700">The buyer has money.</strong> Agencies,
              freelancers, and small-business owners treat $50/month as a rounding error if
              it saves them three hours.</li>
            <li><strong className="text-ink-700">The path to &ldquo;yes&rdquo; is fast.</strong>{" "}
              A narrow, measurable problem gets you to a paying customer in weeks, not quarters.</li>
          </ul>
          <p>
            The score on each card is Pannly&apos;s weighting of demand, reachability, and
            competitive gap — the same bar, made numeric. Here&apos;s{" "}
            <Link href={"/how-it-works" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              how that score is built
            </Link>
            .
          </p>
        </div>
      </section>

      {/* The ideas */}
      <section className="mx-auto w-full max-w-5xl">
        <h2 className="mb-3 font-display text-3xl text-moss-600">
          Micro SaaS ideas (live, ranked by demand score)
        </h2>
        <p className="mb-10 max-w-2xl text-base leading-relaxed text-ink-50/70">
          Pulled from the feed now. Open any one for the full brief — the pain, evidence
          quotes with their original Reddit/HN links, the buyer, and a validation plan.
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
            to see every scored idea.
          </p>
        )}

        <div className="mt-8 text-center">
          <Link href={"/feed" as Route} prefetch={true} className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.08em] text-moss-600 hover:text-plum-500">
            See every idea in the feed
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </section>

      {/* Revenue reality */}
      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          Micro SaaS revenue: what&apos;s actually realistic
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            Be honest with yourself about the numbers. A focused micro SaaS that nails a
            real niche typically lands somewhere between <strong className="text-ink-700">
            $5,000 and $30,000 in monthly recurring revenue</strong> — life-changing for a
            solo founder, not a venture-scale rocket.
          </p>
          <p>
            What moves you toward the top of that range isn&apos;t a cleverer idea — it&apos;s
            charging buyers who have budget, solving a pain frequent enough that churn stays
            low, and reaching a community you can actually post into. That&apos;s why
            reachability is one of the three things every idea here is scored on.
          </p>
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">Keep going</h2>
        <ul className="space-y-3 text-lg text-ink-50/80">
          <li>
            <Link href={"/saas-ideas-2026" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              SaaS ideas for 2026, backed by real Reddit pain
            </Link>{" "}
            — the bigger list, same method.
          </li>
          <li>
            <Link href={"/startup-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              Startup ideas worth building in 2026
            </Link>{" "}
            — by category, including dev and AI.
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
      <h2 className="mb-10 font-display text-3xl text-moss-600">Micro SaaS ideas — frequently asked</h2>
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
          Pick one with the receipts behind it.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-50">
          Browsing scored ideas is free. ${env.prices.unlockDefaultUsd} unlocks the brief —
          evidence, sources, and a validation plan — refunded if you ship within{" "}
          {env.prices.buildWindowDays} days.
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
