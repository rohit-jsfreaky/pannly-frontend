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

const TITLE = "SaaS Ideas for Agencies (That Agencies Will Actually Pay For)";
const DESCRIPTION =
  "SaaS ideas for marketing, design, and dev agencies — built around where agencies bleed billable hours, scored on real demand, and linked to sourced briefs.";
const PATH = "/saas-ideas-for-agencies";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "SaaS Ideas for Agencies", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "SaaS ideas for agencies",
  description:
    "Software ideas built for marketing, design, and development agencies — focused on the operational gaps where agencies lose billable time, each scored on demand and linked to a full brief.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "What kind of SaaS do agencies actually pay for?",
    answer:
      "Agencies pay for tools that either win back billable hours or make them look good to clients. Reporting that turns raw analytics into a client-ready story, onboarding that stops the two-week kickoff drag, and anything that removes a recurring manual step across many client accounts. They are far less interested in another all-in-one platform.",
  },
  {
    question: "Is agency software a crowded market?",
    answer:
      "The big horizontal tools are crowded. The gaps are in the glue between them — the manual copy-paste an account manager does every Monday across ten clients. Narrow, workflow-specific tools that sit between the giants are where solo founders still win.",
  },
  {
    question: "How much will an agency pay per month?",
    answer:
      "More than most niches, because the cost is spread across clients. A tool that saves an account manager three hours a week is easily worth $79–$199/month to an agency billing those hours back. Price per seat or per managed client, not per feature.",
  },
  {
    question: "Where do these ideas come from?",
    answer:
      "Real complaints from agency owners and operators on Reddit and Hacker News, clustered and scored on demand, reachability, and competition. Open any idea's brief for the evidence and its original source threads.",
  },
];
const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

export default async function Page() {
  const ideas = await safeBlogIdeas({ q: "agency", perPage: 12 });
  const hasIdeas = ideas.length > 0;

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />
      {hasIdeas ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("SaaS ideas for agencies", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="SaaS Ideas · Agencies" title="SaaS ideas for agencies">
        <p className="geo-speakable">
          Agencies are the easiest SaaS customers to sell to and the hardest to impress.
          They already pay for fifteen tools — what they&apos;re missing is the glue between
          them. The best SaaS ideas for agencies don&apos;t replace that stack; they kill the
          repetitive, unbillable work that happens between the tabs.
        </p>
        <p className="text-base text-ink-50/70">
          Below are ideas pulled from real agency complaints, scored on demand. Every one
          links to a brief with the evidence behind it.
        </p>
      </BlogHero>

      {/* The thesis — unique analysis */}
      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          Why agencies are a great SaaS niche — and where founders get it wrong
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            Most people build &ldquo;an agency platform&rdquo; — project management plus CRM
            plus invoicing plus reporting. That market is a graveyard, because agencies have
            already standardised on tools they won&apos;t rip out.
          </p>
          <p>
            The opportunity is narrower and far less glamorous. An account manager spends
            Monday morning logging into ten GA4 properties, screenshotting charts the client
            won&apos;t understand, and pasting them into ten slide decks. A tool that turns
            GA4 data into a plain-English client report is worth $79/month per agency on its
            own — and there are a hundred versions of that exact unbillable ritual.
          </p>
          <p>
            The pattern to look for: a task an agency repeats <em className="italic">per
            client, every week</em>, that the client never sees and never pays for. Automate
            one of those and you&apos;ve built something an agency keeps forever.
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="Agency software ideas, ranked by demand"
        blurb="Pulled from the feed and sorted by score. Open any for the full brief — pain, evidence with sources, buyer, and a validation plan."
      />

      {/* What wins / what to skip */}
      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">What wins, what to skip</h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            <strong className="text-ink-700">Win:</strong> client-facing reporting,
            onboarding portals, white-label dashboards, anything that makes the agency look
            more expensive than it is.
          </p>
          <p>
            <strong className="text-ink-700">Skip:</strong> another all-in-one. You will lose
            to incumbents on features and never out-spend them on trust. Pick one ritual and
            own it.
          </p>
          <p>
            Want the smaller, solo version of these?{" "}
            <Link href={"/micro-saas-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              Micro SaaS ideas
            </Link>{" "}
            covers weekend-sized builds; the{" "}
            <Link href={"/startup-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              startup ideas hub
            </Link>{" "}
            has the rest by category.
          </p>
        </div>
      </section>

      <BlogFaq heading="SaaS ideas for agencies — frequently asked" items={FAQS} />
      <BlogCta headline="Build the tool agencies keep forever." />
    </div>
  );
}
