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

const TITLE = "ChatGPT Wrapper Ideas That Actually Make Money (2026)";
const DESCRIPTION =
  "'Wrapper' isn't an insult — focused GPT wrappers like PhotoAI and PDF.ai make real money. ChatGPT wrapper ideas scored on real demand and linked to sourced briefs.";
const PATH = "/chatgpt-wrapper-ideas";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "ChatGPT Wrapper Ideas", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "ChatGPT wrapper ideas",
  description:
    "Focused ChatGPT/LLM wrapper ideas that solve a specific problem for a specific niche, sourced from real pain, scored on demand, and linked to briefs — with an honest take on what makes a wrapper defensible.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "Are ChatGPT wrappers actually profitable?",
    answer:
      "Some are very profitable. Focused wrappers that solve one specific problem for one audience — PhotoAI (~$157K/month) and PDF.ai (~$30K/month) are the often-cited examples — prove that a thin layer over a model can be a real business when the niche and distribution are right.",
  },
  {
    question: "Isn't 'wrapper' a bad thing?",
    answer:
      "Only if the wrapper adds nothing. The successful ones add a focused UI, a tuned prompt or pipeline, an opinionated workflow, and access to an audience that would never assemble it themselves. 'Wrapper' is just an unflattering word for 'product built on infrastructure you don't own' — which describes most software.",
  },
  {
    question: "What makes a ChatGPT wrapper defensible?",
    answer:
      "The same rules as any pre-AI product: a niche you understand, a distribution channel you own, and a workflow that's annoying to rebuild. The model is a commodity; your understanding of a specific buyer and your reach to them is not.",
  },
  {
    question: "Where do these ideas come from?",
    answer:
      "Real complaints on Reddit and Hacker News where people describe a repetitive task a focused AI tool could own, clustered and scored on demand, reachability, and competition. Each idea's brief carries the evidence and its source threads.",
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("ChatGPT wrapper ideas", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="ChatGPT Wrapper Ideas" title="ChatGPT wrapper ideas worth building">
        <p className="geo-speakable">
          &ldquo;It&apos;s just a wrapper&rdquo; is the laziest dismissal in software. Focused
          GPT wrappers like PhotoAI (~$157K/month) and PDF.ai (~$30K/month) make real money
          because the model was never the hard part — the niche, the workflow, and the
          distribution were. A good ChatGPT wrapper idea owns all three.
        </p>
        <p className="text-base text-ink-50/70">
          Below are wrapper-shaped ideas pulled from real pain, scored on demand, each linked
          to a brief.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          The model is the commodity. You aren&apos;t.
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            Everyone has the same API key. So the question that decides whether a wrapper makes
            money has nothing to do with the model and everything to do with: do you understand
            a specific buyer better than a generalist tool ever will, and can you reach them?
          </p>
          <p>
            PhotoAI didn&apos;t win because of its model access — it won by serving one need
            (professional-looking photos without a shoot) for an audience that wouldn&apos;t
            prompt their way there themselves. The wrapper&apos;s job is to remove the prompting,
            the guesswork, and the assembly. That convenience, aimed at the right niche, is the
            product.
          </p>
          <p>
            Read each idea below and ask: <em className="italic">who specifically is this for,
            and where do they already hang out?</em> If you can answer both, the &ldquo;just a
            wrapper&rdquo; objection stops mattering.
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="ChatGPT wrapper ideas, ranked by demand"
        blurb="Pulled from the feed and sorted by score. Open any for the full brief — pain, evidence with sources, buyer, and a validation plan."
      />

      <section className="mx-auto w-full max-w-3xl">
        <p className="text-base leading-relaxed text-ink-50/80">
          Related:{" "}
          <Link href={"/ai-saas-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            AI SaaS ideas
          </Link>
          ,{" "}
          <Link href={"/ai-micro-saas-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            AI micro SaaS ideas
          </Link>
          , and{" "}
          <Link href={"/ai-agent-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            AI agent ideas
          </Link>
          .
        </p>
      </section>

      <BlogFaq heading="ChatGPT wrapper ideas — frequently asked" items={FAQS} />
      <BlogCta headline="The model is free. The niche is yours." />
    </div>
  );
}
