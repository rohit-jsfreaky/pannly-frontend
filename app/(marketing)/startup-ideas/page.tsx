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
 * /startup-ideas — Blog 3, the PILLAR (docs/SEO-BLOG-BRIEFS.md).
 *
 * Long-game target: `startup ideas`. Winnable-now: `saas startup ideas`,
 * `startup ideas 2026`, `startup ideas for developers`, `software startup ideas`.
 * Scoped deliberately to SOFTWARE startup ideas (our lane) — not a generic
 * business-idea listicle competing on wellness/trades.
 *
 * Job: capture qualified long-tails now, age toward the head term, and act as
 * the hub that links down to /saas-ideas-2026 and /micro-saas-ideas (and they
 * link back up). Reciprocal clustering is what compounds authority.
 */

const TITLE = "Startup Ideas Worth Building in 2026 (From Real Founder Pain)";
const DESCRIPTION =
  "Software startup ideas for 2026, grounded in real Reddit and Hacker News demand — by category, each scored and linked to a sourced brief. Not a generic business-idea list.";
const PATH = "/startup-ideas";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const PUBLISHED_ISO = "2026-05-21";
const MODIFIED_ISO = "2026-05-21";
const UPDATED_LABEL = "May 2026";

const BREADCRUMB = buildBreadcrumbSchema([{ name: "Startup Ideas", path: PATH }]);

const SPEAKABLE = {
  ...buildSpeakableWebPage({
    url: PATH,
    name: "Startup ideas worth building in 2026",
    description:
      "A hub of software startup ideas for 2026 — SaaS, micro SaaS, developer tools, and AI — sourced from recurring Reddit and Hacker News pain, scored on demand, and linked to full briefs with evidence and a validation plan.",
  }),
  datePublished: PUBLISHED_ISO,
  dateModified: MODIFIED_ISO,
};

const FAQS = [
  {
    question: "What are the best startup ideas for 2026?",
    answer:
      "The best startup ideas in 2026 are narrow software products that solve a repetitive, expensive problem for a reachable niche — vertical SaaS, developer tools, and AI tools built deeply for one industry. Generic ideas lose; specific ones backed by real demand win. The ideas on this page are scored on exactly that.",
  },
  {
    question: "How do I find a startup idea?",
    answer:
      "Stop trying to invent one. Start from a problem you already understand, or watch where your target users complain — Reddit, Hacker News, niche forums. The strongest signal is the same pain repeated by different people who say they would pay to fix it. Pannly automates that watching and scores what it finds.",
  },
  {
    question: "What's a good startup idea for a developer?",
    answer:
      "Developers have an edge on tools they themselves wish existed — code-snippet managers, regex builders, form-recovery for static sites, internal-tool generators. The trick is choosing one with demand beyond yourself. See the developer-tool ideas below, each scored and linked to its evidence.",
  },
  {
    question: "Are these startup ideas validated?",
    answer:
      "Each idea is scored on demand, buyer reachability, and competitive gap, drawn from real public complaints. A high score means the demand is real and recurring — but treat it as a strong starting point, then validate with pre-sales before you build.",
  },
];

const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

function buildItemList(ideas: FeedIdea[]) {
  const base = env.appBaseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Startup ideas for 2026",
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

interface CategoryProps {
  id: string;
  heading: string;
  blurb: string;
  ideas: FeedIdea[];
  seeAllHref: string;
  seeAllLabel: string;
}

function Category({ heading, blurb, ideas, seeAllHref, seeAllLabel, id }: CategoryProps) {
  if (ideas.length === 0) return null;
  return (
    <section id={id} className="mx-auto w-full max-w-5xl scroll-mt-8">
      <h2 className="mb-3 font-display text-3xl text-moss-600">{heading}</h2>
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-ink-50/70">{blurb}</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {ideas.map((idea) => (
          <BlogIdeaCard key={idea.slug} idea={idea} />
        ))}
      </div>
      <div className="mt-6">
        <Link href={seeAllHref as Route} prefetch={true} className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.08em] text-moss-600 hover:text-plum-500">
          {seeAllLabel}
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </Link>
      </div>
    </section>
  );
}

export default async function StartupIdeasPage() {
  const [saas, devtools, ai, total] = await Promise.all([
    safeBlogIdeas({ topic: "saas", perPage: 3 }),
    safeBlogIdeas({ topic: "devtools", perPage: 3 }),
    safeBlogIdeas({ topic: "ai", perPage: 3 }),
    safeIdeaCount(),
  ]);
  const allShown = [...saas, ...devtools, ...ai];

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(SPEAKABLE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />
      {allShown.length > 0 ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(buildItemList(allShown)) }} />
      ) : null}

      {/* Hero */}
      <section className="mx-auto w-full max-w-3xl">
        <span className="mb-4 block font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink-50/70">
          Startup Ideas
        </span>
        <h1 className="mb-3 font-display text-4xl font-medium tracking-tight text-moss-600 md:text-5xl">
          Startup ideas worth building in 2026
        </h1>
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.12em] text-ink-50/60">
          Updated {UPDATED_LABEL}
        </p>
        <p className="geo-speakable max-w-2xl text-lg leading-relaxed text-ink-50/90">
          These are software startup ideas — SaaS, micro SaaS, developer tools, and AI —
          grounded in real Reddit and Hacker News demand and scored, not a generic list of
          business ideas padded with dropshipping and dog-walking. Each one links to a brief
          with the evidence behind it{total ? `, drawn from ${total} live, scored ideas` : ""}.
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-50/70">
          We deliberately stay in our lane: software you could start as a solo founder. If
          that&apos;s you, browse by category below.
        </p>
      </section>

      {/* Where good ideas come from */}
      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          Where good startup ideas actually come from
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            The best startup ideas aren&apos;t invented at a whiteboard. They&apos;re noticed.
            Three places they reliably hide:
          </p>
          <ul className="space-y-3 border-l-2 border-cream-300 pl-6">
            <li><strong className="text-ink-700">Your own repeated annoyance.</strong> The
              thing you do manually every week and mutter &ldquo;someone should build
              this&rdquo; about. You already understand the buyer — you are one.</li>
            <li><strong className="text-ink-700">Spreadsheet duct-tape.</strong> Anywhere a
              business is holding a process together with Excel or Google Sheets, there&apos;s
              usually room for real software.</li>
            <li><strong className="text-ink-700">Where users complain in public.</strong>{" "}
              Reddit, Hacker News, niche forums. The gold is the same complaint repeated by
              different people who say they&apos;d pay to fix it.</li>
          </ul>
          <p>
            That third one is what Pannly automates — watching those threads, clustering the
            repeats, and{" "}
            <Link href={"/how-it-works" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              scoring them
            </Link>{" "}
            so you start from demand instead of a guess.
          </p>
        </div>
      </section>

      {/* Categories — the hub */}
      <Category
        id="saas"
        heading="SaaS startup ideas"
        blurb="Software-as-a-service ideas with recurring-revenue potential, ranked by demand score."
        ideas={saas}
        seeAllHref="/saas-ideas-2026"
        seeAllLabel="See all SaaS ideas for 2026"
      />
      <Category
        id="developers"
        heading="Startup ideas for developers"
        blurb="Developer tools and technical products — the kind you have an unfair advantage building because you'd use them yourself."
        ideas={devtools}
        seeAllHref="/feed?topic=devtools"
        seeAllLabel="See all developer-tool ideas"
      />
      <Category
        id="ai"
        heading="AI startup ideas"
        blurb="AI-native tools that do a job, not just wrap a chatbot — scored on real, recurring demand."
        ideas={ai}
        seeAllHref="/feed?topic=ai"
        seeAllLabel="See all AI ideas"
      />

      {/* Micro SaaS pointer */}
      <section className="mx-auto w-full max-w-3xl">
        <div className="rounded-xl border border-cream-300 bg-cream-50/60 p-6">
          <h2 className="mb-2 font-display text-2xl text-ink-700">Want something smaller?</h2>
          <p className="text-base leading-relaxed text-ink-50/80">
            If you&apos;re a solo founder after a weekend-sized project, the{" "}
            <Link href={"/micro-saas-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              micro SaaS ideas
            </Link>{" "}
            list is the same method at a smaller scope — one sharp problem, one niche.
          </p>
        </div>
      </section>

      {/* How to validate */}
      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          How to validate a startup idea before you commit
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>A real demand score gets you to the starting line. To make sure it&apos;s right for you:</p>
          <ol className="list-decimal space-y-3 pl-6 marker:font-mono marker:text-moss-600">
            <li>Go back to where the pain was voiced and read more of it. Make sure you&apos;d
              recognise a good solution if you saw one.</li>
            <li>Pre-sell before you build. A landing page with a real payment or commitment
              button is the only validation that counts — people pay for things they want.</li>
            <li>Ship the smallest useful version in days, to the exact community the pain came
              from. Iterate from real usage, not imagination.</li>
          </ol>
          <p>
            Each idea&apos;s brief gives you the head start: the buyer persona, a three-step
            validation plan, and sample landing copy — for{" "}
            <Link href={"/pricing" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              ${env.prices.unlockDefaultUsd}, refunded when you ship
            </Link>
            .
          </p>
        </div>
      </section>

      <Faq />
      <Cta />
    </div>
  );
}

function Faq() {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <h2 className="mb-10 font-display text-3xl text-moss-600">Startup ideas — frequently asked</h2>
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
          The hard part isn&apos;t building. It&apos;s picking right.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-50">
          Browse the scored feed free. ${env.prices.unlockDefaultUsd} unlocks any brief —
          refunded automatically if you ship within {env.prices.buildWindowDays} days.
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
