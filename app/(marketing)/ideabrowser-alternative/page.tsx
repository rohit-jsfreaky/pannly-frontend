import type { Route } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";

import { BlogCta } from "@/components/blog/blog-cta";
import { BlogFaq } from "@/components/blog/blog-faq";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogIdeaGrid } from "@/components/blog/idea-grid";
import { env } from "@/lib/env";
import { safeBlogIdeas } from "@/lib/blog/ideas";
import { blogWebPage, type BlogFaqItem } from "@/lib/blog/schema";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { buildBreadcrumbSchema, buildFaqPage, schemaJson } from "@/lib/seo/schemas";

const TITLE = "Ideabrowser Alternative: An Honest Comparison (2026)";
const DESCRIPTION =
  "Looking for an Ideabrowser alternative? An honest comparison of startup-idea tools — what each does, where they overlap, and the one mechanic Pannly adds that none of them have.";
const PATH = "/ideabrowser-alternative";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "Ideabrowser Alternative", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "Ideabrowser alternative",
  description:
    "An honest comparison of startup-idea discovery tools as alternatives to Ideabrowser, including what each does well and the refund-on-ship mechanic unique to Pannly.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "What is the best Ideabrowser alternative?",
    answer:
      "It depends what you want it for. For deep AI-generated idea reports, tools like Ideabrowser and its direct clones compete on analysis depth. For ideas pulled from real Reddit and Hacker News pain with a demand score, Pannly is the closest alternative — and the only one that refunds your unlock if you actually ship.",
  },
  {
    question: "How is Pannly different from Ideabrowser?",
    answer:
      "Ideabrowser leans on AI-generated analysis and trend data. Pannly starts from real, recurring complaints on Reddit and Hacker News, scores each on demand, reachability, and competition, and writes a brief with evidence quotes and source links. The defining difference: Pannly refunds your $" +
      env.prices.unlockDefaultUsd +
      " unlock when you ship a working build within " +
      env.prices.buildWindowDays +
      " days. The incentive is on you building, not just buying.",
  },
  {
    question: "Is there a free Ideabrowser alternative?",
    answer:
      "Browsing Pannly's scored idea feed is free — you only pay to unlock a full brief, and that's refundable on ship. Several other tools offer free tiers with limited ideas. F5Bot is free if all you want is keyword alerts rather than scored ideas.",
  },
  {
    question: "Why trust ideas from Reddit over AI-generated ones?",
    answer:
      "AI-generated ideas are fluent but un-grounded — they can invent demand that doesn't exist. Ideas drawn from real complaints come with proof: a person, a thread, a problem they said they'd pay to solve. Pannly keeps the source link on every piece of evidence so you can read the original yourself.",
  },
];
const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

interface Row {
  name: string;
  approach: string;
  source: string;
  signal: string;
  refund: boolean;
}
const ROWS: Row[] = [
  { name: "Pannly", approach: "Scored briefs from real pain", source: "Reddit + Hacker News", signal: "Demand score + evidence", refund: true },
  { name: "Ideabrowser", approach: "AI idea reports + trends", source: "AI + trend data", signal: "AI analysis", refund: false },
  { name: "BigIdeasDB", approach: "Large idea database", source: "Aggregated", signal: "Market notes", refund: false },
  { name: "Exploding Topics", approach: "Trend discovery", source: "Search/trend signals", signal: "Growth curves", refund: false },
];

export default async function Page() {
  const ideas = await safeBlogIdeas({ perPage: 4 });

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />

      <BlogHero eyebrow="Comparison" title="An honest Ideabrowser alternative">
        <p className="geo-speakable">
          Ideabrowser and most idea tools do one job well: they hand you ideas and analysis.
          Pannly does that too — ideas pulled from real Reddit and Hacker News pain, each with
          a demand score and the source thread — but adds one thing none of them have:
          it refunds your unlock when you actually ship.
        </p>
        <p className="text-base text-ink-50/70">
          Here&apos;s the honest comparison, including where Pannly isn&apos;t the right pick.
        </p>
      </BlogHero>

      {/* Comparison table */}
      <section className="mx-auto w-full max-w-5xl">
        <h2 className="mb-3 font-display text-3xl text-moss-600">Idea tools, compared</h2>
        <p className="mb-10 max-w-2xl text-base leading-relaxed text-ink-50/70">
          They overlap more than the marketing suggests. The real differences are where the
          ideas come from, and whether anything ties the tool to you actually building.
        </p>
        <div className="overflow-x-auto rounded-xl border border-cream-300">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-cream-300 bg-cream-50">
                {["Tool", "Approach", "Idea source", "Core signal", "Refund on ship"].map((h) => (
                  <th key={h} className="px-4 py-4 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-50/70">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.name} className={`border-b border-cream-300 last:border-0 ${r.name === "Pannly" ? "bg-cream-50" : ""}`}>
                  <td className="px-4 py-4 font-display text-base text-ink-700">{r.name}</td>
                  <td className="px-4 py-4 text-ink-50/80">{r.approach}</td>
                  <td className="px-4 py-4 text-ink-50/80">{r.source}</td>
                  <td className="px-4 py-4 text-ink-50/80">{r.signal}</td>
                  <td className="px-4 py-4">
                    {r.refund ? (
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-moss-600">
                        <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden /> Yes
                      </span>
                    ) : (
                      <Minus className="h-4 w-4 text-ink-50/40" strokeWidth={2} aria-label="no" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-ink-50/60">
          Approaches summarised from each tool&apos;s public positioning; check their sites for
          current details. Pannly&apos;s refund mechanic is exact.
        </p>
      </section>

      {/* The real difference */}
      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          The difference that actually matters
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            Every idea tool has the same failure mode: you pay, you feel productive, you read
            twenty ideas, and you build none of them. The tool got paid whether or not you
            shipped. Your incentives and theirs point in different directions.
          </p>
          <p>
            Pannly&apos;s refund-on-ship flips that. Unlock a brief for ${env.prices.unlockDefaultUsd},
            ship a working build within {env.prices.buildWindowDays} days, and the ${env.prices.unlockDefaultUsd}
            comes back. It reframes the whole thing from &ldquo;buying ideas&rdquo; to
            &ldquo;betting on yourself&rdquo; — and it&apos;s the one mechanic no other idea
            tool offers.
          </p>
          <p>
            When is Pannly <em className="italic">not</em> the pick? If you specifically want
            AI-generated business plans or trend growth-curves, a tool built for that will go
            deeper. Pannly is for builders who want grounded, scored pain — and a reason to
            actually ship.
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="What Pannly's ideas look like"
        blurb="Live from the feed. Each opens into a brief with evidence quotes and their original source links."
        ranked={false}
      />

      <BlogFaq heading="Ideabrowser alternative — frequently asked" items={FAQS} />
      <BlogCta headline="Get the idea — and a reason to ship it." />
    </div>
  );
}
