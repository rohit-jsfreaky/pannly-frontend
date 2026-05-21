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

const TITLE = "Profitable SaaS Niches for 2026 (And the 4 Traits They Share)";
const DESCRIPTION =
  "The four traits every profitable SaaS niche shares — and how to test an idea against them before you build. Real, demand-scored niches linked to sourced briefs.";
const PATH = "/profitable-saas-niches-2026";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "Profitable SaaS Niches 2026", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "Profitable SaaS niches for 2026",
  description:
    "The four traits of a profitable SaaS niche — high willingness to pay, recurring pain, no entrenched enterprise player, and a reachable buyer — applied to real, demand-scored ideas linked to briefs.",
});

const TRAITS = [
  {
    h: "1. Buyers with real willingness to pay",
    b: "The buyer treats $50–$200/month as a rounding error because the problem costs them more. Businesses and professionals who bill their time qualify; hobbyists usually don't. If your buyer hesitates at $9/month, the niche is fighting you.",
  },
  {
    h: "2. A recurring, frequent pain",
    b: "The problem shows up weekly or daily, not once a year. Frequency is what creates retention — people keep paying for a tool that keeps solving a problem they keep having. One-time pains lead to one-time payments and brutal churn.",
  },
  {
    h: "3. No entrenched enterprise player",
    b: "If a giant already serves this niche perfectly, you lose on features and budget. The sweet spot is a niche the big vendors serve badly or ignore — too small for them to care, too specific for their generic tool to fit.",
  },
  {
    h: "4. A buyer you can actually reach",
    b: "A profitable niche has a watering hole — a subreddit, a forum, a conference, a community — where you can find buyers without burning money on ads. If you can't name where these people gather, the go-to-market will quietly kill you.",
  },
];

const FAQS: BlogFaqItem[] = [
  {
    question: "What makes a SaaS niche profitable?",
    answer:
      "Four things together: buyers with real willingness to pay (ideally $50+/month), a pain that recurs frequently enough to drive retention, no entrenched enterprise player owning the space, and a clearly reachable buyer you can market to without huge ad spend. Miss one and the economics get hard.",
  },
  {
    question: "Which SaaS niches are most profitable in 2026?",
    answer:
      "Vertical SaaS for specific industries and AI/developer tooling lead on margins and willingness to pay, while historically under-served areas — compliance, nonprofit and fundraising tools, construction and field service, supply-chain for SMBs — are profitable precisely because they've been slow to adopt software and have few competitors.",
  },
  {
    question: "How do I test a niche against these traits?",
    answer:
      "Take any idea and score it honestly on all four: will the buyer pay $50+, is the pain weekly, is there no dominant incumbent, and can you name where the buyers gather? An idea that clears all four is rare and worth pursuing; one that fails two is worth dropping early.",
  },
  {
    question: "Where do these ideas come from?",
    answer:
      "Real complaints across Reddit and Hacker News, clustered and scored on demand, reachability, and competition — the three signals map closely to the traits above. Each idea's brief carries the evidence and its source threads.",
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("Profitable SaaS niches for 2026", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="Analysis" title="Profitable SaaS niches for 2026">
        <p className="geo-speakable">
          A SaaS niche is profitable when four things are true at once: the buyer will pay
          $50+/month, the pain recurs weekly, no enterprise player owns the space, and you can
          actually reach the buyer. Most ideas clear one or two of these. The rare ones that
          clear all four are the niches worth your year.
        </p>
        <p className="text-base text-ink-50/70">
          Here are the four traits in detail, then real demand-scored ideas to test against them.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-10 font-display text-3xl text-moss-600">The four traits, in order of how often they kill ideas</h2>
        <div className="flex flex-col gap-8">
          {TRAITS.map((t) => (
            <div key={t.h}>
              <h3 className="mb-2 font-display text-xl text-ink-700">{t.h}</h3>
              <p className="text-base leading-relaxed text-ink-50/80">{t.b}</p>
            </div>
          ))}
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="Niches to test against the four traits"
        blurb="Pulled from the feed and sorted by score. Run each through the four traits above before you commit — the brief gives you the buyer and the evidence to judge."
      />

      <section className="mx-auto w-full max-w-3xl">
        <p className="text-base leading-relaxed text-ink-50/80">
          See also{" "}
          <Link href={"/untapped-saas-niches" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            untapped SaaS niches
          </Link>{" "}
          and{" "}
          <Link href={"/b2b-saas-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            B2B SaaS ideas
          </Link>
          .
        </p>
      </section>

      <BlogFaq heading="Profitable SaaS niches — frequently asked" items={FAQS} />
      <BlogCta headline="Test your niche against all four. Then build." />
    </div>
  );
}
