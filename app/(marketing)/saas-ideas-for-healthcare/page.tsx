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

const TITLE = "SaaS Ideas for Healthcare a Solo Founder Can Actually Build";
const DESCRIPTION =
  "Healthcare SaaS ideas that avoid the clinical/regulatory minefield and win on the admin side — follow-ups, billing, scheduling — scored on demand and linked to sourced briefs.";
const PATH = "/saas-ideas-for-healthcare";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "SaaS Ideas for Healthcare", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "SaaS ideas for healthcare",
  description:
    "Healthcare SaaS ideas focused on the administrative layer a solo founder can realistically ship — patient follow-up, billing analytics, scheduling — rather than regulated clinical software, each scored and linked to a brief.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "Can a solo founder really build healthcare SaaS?",
    answer:
      "On the admin side, yes. Clinical software that touches diagnosis or stores protected health data carries heavy regulatory and compliance burden. But the administrative layer — appointment follow-up, billing analytics, intake, no-show reduction, feedback collection — is buildable by a small team and still solves expensive problems for practices.",
  },
  {
    question: "What's the catch with healthcare SaaS?",
    answer:
      "Compliance. The moment you store or transmit protected health information you take on real obligations (HIPAA in the US, equivalents elsewhere). The smart play for a small team is to design ideas that minimise PHI exposure — work with metadata, scheduling, and aggregate billing data rather than clinical records — until you have the resources to do the regulated parts properly.",
  },
  {
    question: "Do healthcare practices pay well for software?",
    answer:
      "Yes — the market is large and growing, and practices feel admin pain acutely. A tool that cuts no-shows or recovers billing leakage has a direct dollar impact a practice manager can see, which makes the buying decision straightforward.",
  },
  {
    question: "Where do these ideas come from?",
    answer:
      "Real complaints from people working in and around healthcare on Reddit and Hacker News, clustered and scored on demand, reachability, and competition. Each idea's brief carries the evidence and its source threads.",
  },
];
const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

export default async function Page() {
  const ideas = await safeBlogIdeas({ q: "health", perPage: 12 });
  const hasIdeas = ideas.length > 0;

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />
      {hasIdeas ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("SaaS ideas for healthcare", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="SaaS Ideas · Healthcare" title="Healthcare SaaS ideas you can actually build">
        <p className="geo-speakable">
          Most healthcare SaaS ideas are a trap for a small team — the clinical, regulated core
          demands compliance work a solo founder can&apos;t shoulder. The winnable opportunity
          is the admin layer: appointment follow-up, no-show reduction, billing analytics, and
          intake. Same large market, far less regulatory weight.
        </p>
        <p className="text-base text-ink-50/70">
          Below are healthcare ideas pulled from real pain, scored on demand, each linked to a
          brief.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          Stay out of the clinical record, not out of the market
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            Compliance is healthcare&apos;s moat and its landmine. The moment your product
            stores or transmits protected health information, you inherit serious obligations.
            For a big, funded company that&apos;s a barrier to entry worth crossing. For a solo
            founder it&apos;s usually a reason the project never ships.
          </p>
          <p>
            So design around it. The admin layer of a practice is full of expensive, repetitive
            problems that touch little or no clinical data: patients no-showing because reminders
            are manual, billing leaking because nobody analyses it, intake forms collected on
            paper. Solve one of those with minimal PHI exposure and you&apos;re in a big market
            without the compliance cliff on day one.
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="Healthcare software ideas, ranked by demand"
        blurb="Pulled from the feed and sorted by score. Open any for the full brief — and weigh its compliance exposure before you commit."
      />

      <section className="mx-auto w-full max-w-3xl">
        <p className="text-base leading-relaxed text-ink-50/80">
          More verticals in the{" "}
          <Link href={"/startup-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            startup ideas hub
          </Link>
          , or browse the full{" "}
          <Link href={"/feed" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            idea feed
          </Link>
          .
        </p>
      </section>

      <BlogFaq heading="SaaS ideas for healthcare — frequently asked" items={FAQS} />
      <BlogCta headline="Win the admin layer. Skip the landmine." />
    </div>
  );
}
