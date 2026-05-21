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

const TITLE = "B2B SaaS Ideas: Boring, Sticky, and Worth Real Money (2026)";
const DESCRIPTION =
  "B2B SaaS ideas that target mid-market gaps with high willingness to pay — the unglamorous, sticky tools businesses don't churn out of. Scored on demand, linked to sourced briefs.";
const PATH = "/b2b-saas-ideas";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "B2B SaaS Ideas", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "B2B SaaS ideas",
  description:
    "B2B SaaS ideas focused on mid-market gaps and high willingness to pay — vertical CRMs, workflow tools, and operational software businesses don't churn out of — each scored on demand and linked to a brief.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "What makes a good B2B SaaS idea?",
    answer:
      "A painful, recurring problem for a business that has budget and a clear buyer you can reach. The best B2B ideas are often unglamorous — they solve a workflow bottleneck or an outdated process that quietly costs the company time or money. Boring and sticky beats exciting and churny.",
  },
  {
    question: "Why target mid-market instead of enterprise or SMB?",
    answer:
      "Enterprise means long sales cycles and heavy requirements; pure SMB often means low willingness to pay and high churn. Mid-market businesses have real budgets, feel operational pain acutely, and are big enough to pay $10K+ a year but too small for the enterprise vendors to bother serving well. That gap is where focused B2B tools win.",
  },
  {
    question: "Are vertical B2B tools better than horizontal ones?",
    answer:
      "Usually, for a new entrant. A CRM built for insurance brokers or an LMS for construction safety beats a generic tool because it fits the workflow exactly. Horizontal tools compete on features and budget you can't match; vertical tools compete on fit, which you can.",
  },
  {
    question: "Where do these ideas come from?",
    answer:
      "Real complaints from operators on Reddit and Hacker News, clustered and scored on demand, reachability, and competition. Each idea's brief carries the evidence quotes and their original source threads.",
  },
];
const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

export default async function Page() {
  const ideas = await safeBlogIdeas({ topic: "saas", perPage: 12 });
  const hasIdeas = ideas.length > 0;

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />
      {hasIdeas ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("B2B SaaS ideas", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="B2B SaaS Ideas" title="B2B SaaS ideas worth real money">
        <p className="geo-speakable">
          The best B2B SaaS ideas are boring on purpose. They solve a workflow bottleneck or an
          outdated process that quietly costs a business time or money — the kind of problem a
          company will pay $10K+ a year to make disappear and won&apos;t churn out of, because
          ripping it out would hurt more than the subscription.
        </p>
        <p className="text-base text-ink-50/70">
          Below are B2B ideas pulled from real operator pain, scored on demand, each linked to a brief.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          Aim at the mid-market gap
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            Enterprise is a slog of long sales cycles and security reviews. Pure SMB is a
            treadmill of low prices and high churn. The comfortable middle — businesses big
            enough to have budget and a real buyer, small enough that the enterprise vendors
            ignore them — is where a focused founder makes money.
          </p>
          <p>
            And the winning ideas are unglamorous: a referral tool built for B2B instead of the
            B2C tools everyone forces into the role, a subscription-audit tool that finds the
            SaaS a company is paying for and not using, a vertical CRM that fits one industry&apos;s
            actual process. None of these will trend on launch day. All of them are sticky.
          </p>
          <p>
            Stickiness is the whole B2B game. Pick a problem where, once you&apos;re embedded in
            the workflow, leaving is more painful than staying.
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="B2B SaaS ideas, ranked by demand"
        blurb="Pulled from the feed and sorted by score. Open any for the full brief — pain, evidence with sources, buyer, and a validation plan."
      />

      <section className="mx-auto w-full max-w-3xl">
        <p className="text-base leading-relaxed text-ink-50/80">
          Related:{" "}
          <Link href={"/saas-ideas-2026" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            SaaS ideas for 2026
          </Link>{" "}
          and{" "}
          <Link href={"/profitable-saas-niches-2026" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            profitable SaaS niches
          </Link>
          .
        </p>
      </section>

      <BlogFaq heading="B2B SaaS ideas — frequently asked" items={FAQS} />
      <BlogCta headline="Build the boring tool they can't rip out." />
    </div>
  );
}
