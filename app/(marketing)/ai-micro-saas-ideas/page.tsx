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

const TITLE = "AI Micro SaaS Ideas a Solo Founder Can Ship Fast (2026)";
const DESCRIPTION =
  "AI micro SaaS ideas scoped small enough for one person to ship in weeks — one job, one niche, real demand. Scored and linked to sourced briefs.";
const PATH = "/ai-micro-saas-ideas";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "AI Micro SaaS Ideas", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "AI micro SaaS ideas",
  description:
    "Small, single-purpose AI micro SaaS ideas a solo founder can build in weeks, sourced from real pain, scored on demand, and linked to briefs.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "What's a good AI micro SaaS idea?",
    answer:
      "One that does a single, well-defined job for a specific person — generate this exact document, clean this exact data, draft this exact reply — and can be shipped in weeks. The narrower the job, the better an AI micro SaaS performs, because you can tune the prompt and UX around one outcome.",
  },
  {
    question: "How fast can I launch an AI micro SaaS?",
    answer:
      "Weeks, not months, if you keep the scope to one job. Most of the build is the wrapper around the model — auth, billing, a focused UI, and the prompt or pipeline that reliably produces the one output. Resist adding a second feature until the first has paying users.",
  },
  {
    question: "Won't a bigger AI tool just add my feature?",
    answer:
      "Maybe — which is why niche and distribution matter more than the feature. Pick a narrow audience the big tools won't bother serving well, and own the channel where they hang out. Speed to a loyal niche beats breadth.",
  },
  {
    question: "Where do these ideas come from?",
    answer:
      "Real complaints on Reddit and Hacker News, clustered and scored on demand, reachability, and competition. Each idea's brief carries the evidence quotes and their original source threads.",
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("AI micro SaaS ideas", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="AI Micro SaaS" title="AI micro SaaS ideas you can ship fast">
        <p className="geo-speakable">
          A great AI micro SaaS does exactly one job for one kind of person and ships in
          weeks. The scope is the strategy: when a tool produces a single, well-defined output,
          you can tune the prompt, the UX, and the pricing around that one outcome — and a solo
          founder can actually finish it before the excitement runs out.
        </p>
        <p className="text-base text-ink-50/70">
          Below are AI ideas scoped for speed, scored on demand, each linked to a brief.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          Narrow is the whole advantage
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            The mistake with AI micro SaaS is treating &ldquo;AI&rdquo; as the product. It
            isn&apos;t — the product is a finished outcome someone needs repeatedly. &ldquo;Turn
            this messy CSV into a clean, deduped contact list&rdquo; is a product. &ldquo;An AI
            data assistant&rdquo; is a homework assignment you give the user.
          </p>
          <p>
            When you pick one job, three things get easy: the prompt becomes reliable because
            you only have to be good at one thing, the UI becomes obvious, and the marketing
            writes itself because you can name the exact outcome. That&apos;s how a single
            person ships in weeks instead of stalling for months.
          </p>
          <p>
            Read each idea below and mentally strip it to its one output. If you can&apos;t
            name that output in a sentence, narrow it further before you build.
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="AI micro SaaS ideas, ranked by demand"
        blurb="Pulled from the feed and sorted by score. Open any for the full brief — and ask what its single output is before you commit."
      />

      <section className="mx-auto w-full max-w-3xl">
        <p className="text-base leading-relaxed text-ink-50/80">
          Thinking bigger or more defensible? See{" "}
          <Link href={"/ai-saas-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            AI SaaS ideas
          </Link>{" "}
          and{" "}
          <Link href={"/chatgpt-wrapper-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            ChatGPT wrapper ideas
          </Link>
          .
        </p>
      </section>

      <BlogFaq heading="AI micro SaaS ideas — frequently asked" items={FAQS} />
      <BlogCta headline="One job. One niche. Shipped in weeks." />
    </div>
  );
}
