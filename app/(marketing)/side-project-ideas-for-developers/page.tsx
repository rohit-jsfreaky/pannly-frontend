import type { Route } from "next";
import Link from "next/link";

import { BlogCta } from "@/components/blog/blog-cta";
import { BlogFaq } from "@/components/blog/blog-faq";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogIdeaGrid } from "@/components/blog/idea-grid";
import { safeBlogIdeas } from "@/lib/blog/ideas";
import { blogItemList, blogWebPage, type BlogFaqItem } from "@/lib/blog/schema";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { buildBreadcrumbSchema, buildFaqPage, schemaJson } from "@/lib/seo/schemas";

const TITLE = "Side Project Ideas for Developers (Built to Get Used) — 2026";
const DESCRIPTION =
  "Side project ideas for developers in 2026, chosen for the thing that actually matters now: a built-in audience. Building is easy; distribution is the bottleneck. Scored ideas, linked to briefs.";
const PATH = "/side-project-ideas-for-developers";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "Side Project Ideas for Developers", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "Side project ideas for developers",
  description:
    "Side project ideas for developers chosen for distribution, not just technical interest — projects with a built-in audience and real demand, sourced from Reddit and Hacker News and scored, each linked to a brief.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "What's a good side project idea for a developer in 2026?",
    answer:
      "One with a built-in audience. AI made building cheap, so the bottleneck moved to distribution. The best developer side projects solve a problem in a community you can already reach — your own stack's pain points, a tool for a niche you're part of — so you have somewhere to launch it the day it's done.",
  },
  {
    question: "Why does distribution matter more than the idea now?",
    answer:
      "Because building stopped being the hard part. AI can scaffold most side projects fast, which means thousands of similar ones ship every week. The ones that survive aren't the most clever — they're the ones whose maker knew exactly who to show it to. Pick projects where you already know that audience.",
  },
  {
    question: "Should developers build for themselves or for a market?",
    answer:
      "Start with your own pain — you understand it and you're the first user — but check that other people share it before assuming a market. The sweet spot is a problem you have AND that recurs for a reachable group of others. A project that's only useful to you is a great learning exercise, not a side business.",
  },
  {
    question: "Where do these ideas come from?",
    answer:
      "Real complaints from developers and technical founders on Reddit and Hacker News, clustered and scored on demand, reachability, and competition. Each idea's brief carries the evidence and its source threads.",
  },
];
const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

export default async function Page() {
  const ideas = await safeBlogIdeas({ topic: "devtools", perPage: 12 });
  const hasIdeas = ideas.length > 0;

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />
      {hasIdeas ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("Side project ideas for developers", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="Side Projects · Developers" title="Side project ideas for developers">
        <p className="geo-speakable">
          The best side project ideas for developers in 2026 aren&apos;t chosen for how
          interesting they are to build — they&apos;re chosen for whether anyone will see them.
          AI made building cheap, so the bottleneck moved to distribution. Pick a project with a
          built-in audience: a problem in a community you&apos;re already part of, with somewhere
          to launch it the day it&apos;s done.
        </p>
        <p className="text-base text-ink-50/70">
          Below are developer-tool ideas pulled from real pain, scored on demand, each linked to a brief.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          Building is solved. Being seen isn&apos;t.
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            A few years ago, the hard part of a side project was building it. That&apos;s over.
            You can scaffold most projects in a weekend now, which is exactly why &ldquo;I built
            a thing&rdquo; no longer earns attention — thousands of people built a thing this
            week too. The constraint that decides whether your project lives is distribution.
          </p>
          <p>
            So flip the order. Before picking what to build, pick who you can reach. The
            developers who win with side projects almost always scratch an itch inside a
            community they already belong to — their framework&apos;s subreddit, their
            niche&apos;s Discord — so launch day has a built-in first audience instead of
            crickets.
          </p>
          <p>
            Judge the ideas below on that: not &ldquo;is this fun to build&rdquo; but &ldquo;do
            I already know where the first hundred users are?&rdquo;
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="Developer side project ideas, ranked by demand"
        blurb="Pulled from the feed and sorted by score. Open any for the full brief — pain, evidence with sources, buyer, and a validation plan."
      />

      <section className="mx-auto w-full max-w-3xl">
        <p className="text-base leading-relaxed text-ink-50/80">
          Want something monetisable from day one? See{" "}
          <Link href={"/micro-saas-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            micro SaaS ideas
          </Link>{" "}
          and the{" "}
          <Link href={"/startup-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            startup ideas hub
          </Link>
          .
        </p>
      </section>

      <BlogFaq heading="Side project ideas for developers — frequently asked" items={FAQS} />
      <BlogCta headline="Pick the project you already know how to launch." />
    </div>
  );
}
