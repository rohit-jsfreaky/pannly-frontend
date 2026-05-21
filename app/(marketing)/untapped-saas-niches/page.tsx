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

const TITLE = "Untapped SaaS Niches With Low Competition (and Why They Stay Open)";
const DESCRIPTION =
  "Where the low-competition SaaS niches actually hide — the industries technical founders never build for because they don't feel the pain. Scored ideas, linked to briefs.";
const PATH = "/untapped-saas-niches";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "Untapped SaaS Niches", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "Untapped SaaS niches",
  description:
    "An analysis of where low-competition SaaS niches actually are — skilled trades, local services, non-English markets, and compliance — and why technical founders consistently overlook them. Scored ideas linked to briefs.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "Why do untapped SaaS niches stay untapped?",
    answer:
      "Because most SaaS founders are developers, designers, or marketers, and people build for pains they personally feel. That leaves entire industries — skilled trades, local services, compliance-heavy fields, non-English markets — with manual processes and almost no purpose-built software, simply because few builders live in those worlds.",
  },
  {
    question: "Are low-competition niches low-competition for a bad reason?",
    answer:
      "Sometimes — a niche can be empty because nobody will pay. But often it's empty for an accidental reason: the buyers aren't on the platforms founders hang out on, the work is unglamorous, or the domain takes effort to understand. Those are the good ones. Check that the buyers have money and feel the pain weekly before you commit.",
  },
  {
    question: "How do I find an untapped niche myself?",
    answer:
      "Look where you're not. Industries still running on spreadsheets, paper, or generic tools that don't fit. Non-English markets copying English-only products. Compliance areas where requirements changed and tools haven't caught up. The signal is a real, recurring complaint plus the absence of a tool built specifically for it.",
  },
  {
    question: "Where do these ideas come from?",
    answer:
      "Real complaints across Reddit and Hacker News, clustered and scored on demand, reachability, and competition — the competition score is exactly what surfaces under-served niches. Each idea's brief carries the evidence and its source threads.",
  },
];
const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

export default async function Page() {
  const ideas = await safeBlogIdeas({ perPage: 12 });
  const hasIdeas = ideas.length > 0;

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />
      {hasIdeas ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("Untapped SaaS niches", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="Analysis" title="Untapped SaaS niches with low competition">
        <p className="geo-speakable">
          Low-competition SaaS niches aren&apos;t hidden — they&apos;re avoided. Most founders
          are developers, designers, or marketers, so they build for the pains they feel, and
          the crowded niches are crowded for that reason. The open ones are the industries
          those founders never touch: skilled trades, local services, compliance, non-English
          markets — full of manual work and almost no purpose-built software.
        </p>
        <p className="text-base text-ink-50/70">
          Below, scored ideas that lean into those gaps. Each links to a brief with the evidence.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          The competition map is really a map of who builds software
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            There&apos;s a reason there are forty AI writing tools and zero good apps for the
            company that installs commercial fire-suppression systems. Founders build what
            they understand. The result is a market that looks saturated everywhere founders
            congregate and barren everywhere they don&apos;t.
          </p>
          <p>
            That barren territory is the opportunity — but it comes with a cost: you have to do
            the homework to understand a world you don&apos;t live in. The payoff is that the
            buyer is starved for a tool that fits, has no good alternative, and will pay a
            premium for software that finally speaks their language.
          </p>
          <p>
            The filter is simple. An empty niche is good when the buyers have money and feel the
            pain weekly, and bad when it&apos;s empty because nobody will pay. Confirm the first
            before you celebrate the second.
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="Under-served ideas, ranked by demand"
        blurb="Pulled from the feed and sorted by score. The competition score is what surfaces the under-served ones — open each for the full brief."
      />

      <section className="mx-auto w-full max-w-3xl">
        <p className="text-base leading-relaxed text-ink-50/80">
          Related reading:{" "}
          <Link href={"/profitable-saas-niches-2026" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            profitable SaaS niches for 2026
          </Link>{" "}
          and the{" "}
          <Link href={"/startup-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            startup ideas hub
          </Link>
          .
        </p>
      </section>

      <BlogFaq heading="Untapped SaaS niches — frequently asked" items={FAQS} />
      <BlogCta headline="Build where the other founders aren't." />
    </div>
  );
}
