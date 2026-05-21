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

const TITLE = "AI SaaS Ideas for 2026 (That Aren't Already Dead)";
const DESCRIPTION =
  "AI SaaS ideas worth building in 2026 — the vertical, workflow-owning kind that survives, not generic wrappers. Scored on real demand and linked to sourced briefs.";
const PATH = "/ai-saas-ideas";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "AI SaaS Ideas", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "AI SaaS ideas",
  description:
    "AI SaaS ideas for 2026 focused on vertical, workflow-owning products with a real moat, sourced from recurring Reddit and Hacker News pain, scored on demand, and linked to briefs.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "Are AI SaaS ideas still worth building in 2026?",
    answer:
      "Yes, but the easy wins are gone. Generic 'AI writes X' tools are commoditised and undercut by the model providers themselves. What's still wide open is vertical AI: tools that own a specific industry's workflow and data so deeply that a general model can't replace them.",
  },
  {
    question: "What makes an AI SaaS defensible?",
    answer:
      "Not the model — everyone has the same models. Defensibility comes from proprietary workflow, proprietary data, and distribution into a niche. If your only feature is an API call to a frontier model, you have a feature, not a moat.",
  },
  {
    question: "Isn't the AI SaaS market overcrowded?",
    answer:
      "The horizontal, consumer-facing layer is. The vertical layer — AI built for one industry's exact process — is early. Most founders chase the crowded layer because it's easier to imagine; the durable money is in the unglamorous vertical one.",
  },
  {
    question: "Where do these AI ideas come from?",
    answer:
      "Real complaints on Reddit and Hacker News where people describe an expensive, repetitive task AI could handle, clustered and scored on demand, reachability, and competition. Each idea's brief carries the evidence and its source threads.",
  },
];
const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

export default async function Page() {
  const ideas = await safeBlogIdeas({ topic: "ai", perPage: 12 });
  const hasIdeas = ideas.length > 0;

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />
      {hasIdeas ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("AI SaaS ideas", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="AI SaaS Ideas" title="AI SaaS ideas for 2026">
        <p className="geo-speakable">
          The best AI SaaS ideas in 2026 aren&apos;t &ldquo;ChatGPT for X.&rdquo; That window
          is closing fast — the model providers keep absorbing the generic use cases. What
          survives is vertical AI: a tool built so deeply into one industry&apos;s workflow and
          data that a general model can&apos;t casually replace it.
        </p>
        <p className="text-base text-ink-50/70">
          Below are AI ideas pulled from real pain, scored on demand, each linked to a brief.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          The moat was never the model
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            Here&apos;s the uncomfortable truth most AI idea lists skip: you and every
            competitor call the same handful of models. The model is not your advantage. So
            anything whose entire value is &ldquo;we prompt GPT for you&rdquo; gets commoditised
            the moment the use case becomes obvious — often by the model provider itself.
          </p>
          <p>
            What doesn&apos;t get commoditised: a tool that has the industry&apos;s proprietary
            data, sits inside the daily workflow, and integrates with the systems that
            industry already runs. A legal-AI tool that drafts and checks against a firm&apos;s
            own precedent library is defensible. A generic &ldquo;AI legal assistant&rdquo; is not.
          </p>
          <p>
            So when you read the ideas below, judge each on one question: <em className="italic">
            what here can&apos;t a frontier model do for the user directly in six months?</em>
            That answer is your moat.
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="AI SaaS ideas, ranked by demand"
        blurb="Pulled from the feed and sorted by score. Open any for the full brief — pain, evidence with sources, buyer, and a validation plan."
      />

      <section className="mx-auto w-full max-w-3xl">
        <p className="text-base leading-relaxed text-ink-50/80">
          Want the smaller versions?{" "}
          <Link href={"/ai-micro-saas-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            AI micro SaaS ideas
          </Link>
          ,{" "}
          <Link href={"/ai-agent-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            AI agent ideas
          </Link>
          , and{" "}
          <Link href={"/chatgpt-wrapper-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            ChatGPT wrapper ideas
          </Link>{" "}
          all go deeper.
        </p>
      </section>

      <BlogFaq heading="AI SaaS ideas — frequently asked" items={FAQS} />
      <BlogCta headline="Build the AI tool a model can't replace." />
    </div>
  );
}
