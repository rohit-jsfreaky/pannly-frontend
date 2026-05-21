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

const TITLE = "Micro SaaS Ideas for Ecommerce & Shopify Sellers (2026)";
const DESCRIPTION =
  "Micro SaaS ideas for ecommerce and Shopify stores — built around the gaps the app stores haven't filled, scored on real demand and linked to sourced briefs.";
const PATH = "/micro-saas-ideas-for-ecommerce";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "Micro SaaS Ideas for Ecommerce", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "Micro SaaS ideas for ecommerce",
  description:
    "Micro SaaS ideas for ecommerce and Shopify merchants, focused on the post-purchase, returns, and margin gaps the big app stores under-serve — each scored on demand and linked to a brief.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "Isn't the Shopify App Store already saturated?",
    answer:
      "The obvious categories are — email, reviews, upsells. The gaps are in the unglamorous operational work: returns, shipping-rule mistakes that quietly lose money, post-purchase experience, and margin analysis. Merchants feel these every day and most apps ignore them.",
  },
  {
    question: "Do I have to build on Shopify specifically?",
    answer:
      "Shopify is the easiest distribution because of the app store and the install intent, but the same pains exist on WooCommerce, BigCommerce, and headless setups. Start where the buyer is already looking for a solution — usually the Shopify App Store — then expand.",
  },
  {
    question: "What do ecommerce merchants pay for?",
    answer:
      "Anything that recovers revenue they're already losing or buys back time during peak. A tool that catches mispriced shipping-rule combinations, automates returns, or flags slow-moving stock has an obvious ROI a merchant can feel in a single month.",
  },
  {
    question: "Where do these ideas come from?",
    answer:
      "Real merchant complaints on Reddit and Hacker News, clustered and scored on demand, reachability, and competition. Each idea's brief carries the evidence quotes and their original source threads.",
  },
];
const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

export default async function Page() {
  const ideas = await safeBlogIdeas({ topic: "ecommerce", perPage: 12 });
  const hasIdeas = ideas.length > 0;

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />
      {hasIdeas ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("Micro SaaS ideas for ecommerce", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="Micro SaaS · Ecommerce" title="Micro SaaS ideas for ecommerce sellers">
        <p className="geo-speakable">
          The Shopify App Store looks full, but that&apos;s only true for the obvious
          categories. The best micro SaaS ideas for ecommerce live in the boring operational
          gaps — returns, shipping rules, post-purchase, margin — where merchants lose money
          quietly and almost no one has built a focused tool.
        </p>
        <p className="text-base text-ink-50/70">
          Below are ecommerce ideas pulled from real merchant complaints, scored on demand,
          each linked to a brief.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          &ldquo;Saturated&rdquo; is a category problem, not a market problem
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            Every new ecommerce founder builds an email tool, a reviews widget, or an upsell
            popup, then wonders why nobody installs it. Those shelves are full. But ask any
            merchant what actually annoys them and you&apos;ll hear something else entirely:
            a shipping rule that silently undercharged on heavy items for a month, a returns
            process held together by spreadsheets, dead stock nobody flagged.
          </p>
          <p>
            These are unglamorous and that&apos;s exactly why they&apos;re open. A tool that
            simulates shipping-rule combinations and surfaces the ones losing money has a
            number attached — &ldquo;you lost $1,400 last month&rdquo; sells itself.
          </p>
          <p>
            The rule for ecommerce: find the leak the merchant can&apos;t see, then show them
            the dollar figure. Revenue recovered beats features added.
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="Ecommerce micro SaaS ideas, ranked by demand"
        blurb="Pulled from the feed and sorted by score. Open any for the full brief — pain, evidence with sources, buyer, and a validation plan."
      />

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">Where the gaps are</h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            <strong className="text-ink-700">Returns &amp; post-purchase</strong> (the part of
            the funnel everyone ignores), <strong className="text-ink-700">margin &amp;
            pricing</strong> (shipping-rule leaks, dynamic pricing for small stores), and{" "}
            <strong className="text-ink-700">operations</strong> (inventory, supplier, dead
            stock). These are where merchants feel pain weekly.
          </p>
          <p>
            See the broader{" "}
            <Link href={"/saas-ideas-2026" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              SaaS ideas for 2026
            </Link>{" "}
            or the{" "}
            <Link href={"/micro-saas-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              full micro SaaS list
            </Link>
            .
          </p>
        </div>
      </section>

      <BlogFaq heading="Micro SaaS ideas for ecommerce — frequently asked" items={FAQS} />
      <BlogCta headline="Find the leak. Show the dollar figure." />
    </div>
  );
}
