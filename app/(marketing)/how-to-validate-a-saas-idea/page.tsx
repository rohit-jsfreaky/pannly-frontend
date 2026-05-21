import type { Route } from "next";
import Link from "next/link";

import { BlogCta } from "@/components/blog/blog-cta";
import { BlogFaq } from "@/components/blog/blog-faq";
import { BlogHero } from "@/components/blog/blog-hero";
import { blogWebPage, type BlogFaqItem } from "@/lib/blog/schema";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { buildBreadcrumbSchema, buildFaqPage, schemaJson } from "@/lib/seo/schemas";

const TITLE = "How to Validate a SaaS Idea Before You Build It";
const DESCRIPTION =
  "A practical way to validate a SaaS idea without wasting months — the 2-20-200 approach, why pre-sales beat surveys, and how to test the problem before the product.";
const PATH = "/how-to-validate-a-saas-idea";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 86400;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "How to Validate a SaaS Idea", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "How to validate a SaaS idea",
  description:
    "A step-by-step approach to validating a SaaS idea before building: separating problem validation from product validation, the 2-20-200 time framework, customer conversations, and pre-selling instead of surveying.",
});

const STEPS = [
  {
    n: "01",
    h: "Validate the problem before the product",
    b: "These are two different things and people skip the first. Before you ask 'will they buy my solution,' ask 'is this problem painful enough that they'd pay anyone to fix it?' A real, tier-one problem is one people are actively losing time or money to. If the problem isn't severe, no product fixes that.",
  },
  {
    n: "02",
    h: "Spend 2 hours, then 20, then 200",
    b: "Stage your effort. Two hours of desk research to see if the problem and any competitors even exist. If it survives that, twenty hours talking to potential customers and testing a landing page. Only once you have strong signals do you spend 200 hours building an MVP. Most ideas should die in the first two stages — that's the framework working, not failing.",
  },
  {
    n: "03",
    h: "Talk to ~10 people and listen for the tier-one signal",
    b: "Line up about ten short conversations with people who have the problem. Come with ~10 questions aimed at one thing: how painful is this, really? After five calls you'll already sense whether it's a must-fix or a nice-to-have. Don't pitch — listen for the unprompted 'oh god, yes, I hate that.'",
  },
  {
    n: "04",
    h: "Pre-sell — money is the only honest survey",
    b: "Surveys and 'would you use this?' lie; people are polite. The real test is whether someone will commit money or a deposit before the product fully exists. If you talk to ten prospects about pricing and five say yes to actually paying when it's ready, you have something. If everyone loves it but nobody pre-pays, you don't.",
  },
  {
    n: "05",
    h: "Build the smallest thing that proves it, then ship to where the pain lives",
    b: "Once validated, build the smallest version that solves the core problem — days, not months — and ship it straight to the community the problem came from. Real usage tells you what to build next far better than any plan.",
  },
];

const FAQS: BlogFaqItem[] = [
  {
    question: "What's the fastest way to validate a SaaS idea?",
    answer:
      "Validate the problem first with a couple of hours of research and a handful of customer conversations, then test demand with a landing page and a pre-sell offer. If people commit money before the product is built, the idea is validated faster and more honestly than any survey could manage.",
  },
  {
    question: "Do surveys validate a SaaS idea?",
    answer:
      "Not really. People answer surveys to be helpful, not to commit. 'Would you use this?' gets a yes far more often than a credit card does. Use conversations to understand the problem and pre-sales to validate demand — surveys at best shape questions, they don't prove a market.",
  },
  {
    question: "How many customers should I talk to before building?",
    answer:
      "Around ten focused conversations is enough to feel whether a problem is tier-one. The goal isn't statistical significance; it's pattern recognition. If five or more of ten prospects say they'd pay for a solution when it's ready, that's a strong signal to start building the smallest version.",
  },
  {
    question: "How does Pannly fit into validation?",
    answer:
      "Pannly does the first stage for you: it surfaces problems that already recur across real Reddit and Hacker News threads and scores them on demand, so you start validation from a problem with evidence rather than a guess. You still run the customer conversations and the pre-sell — but from a much better starting point.",
  },
];
const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

export default function Page() {
  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />

      <BlogHero eyebrow="Guide" title="How to validate a SaaS idea before you build it">
        <p className="geo-speakable">
          To validate a SaaS idea, validate the problem before the product: confirm the pain is
          severe and recurring, talk to about ten people who have it, then pre-sell — because
          someone committing money before the product exists is the only honest signal. Stage
          your effort 2 hours, then 20, then 200, and let most ideas die early on purpose.
        </p>
        <p className="text-base text-ink-50/70">
          Here&apos;s the whole approach, step by step.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-10 font-display text-3xl text-moss-600">The five steps</h2>
        <ol className="flex flex-col gap-8">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-5">
              <span className="shrink-0 font-mono text-sm font-semibold text-moss-600">{s.n}</span>
              <div>
                <h3 className="mb-2 font-display text-xl text-ink-700">{s.h}</h3>
                <p className="text-base leading-relaxed text-ink-50/80">{s.b}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          The mistake almost everyone makes
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            People validate the <em className="italic">product</em> — &ldquo;do you like my
            idea?&rdquo; — when they should validate the <em className="italic">problem</em> —
            &ldquo;is this costing you enough that you&apos;d pay to make it stop?&rdquo; The
            first question gets you compliments. The second gets you customers. Compliments
            don&apos;t pay.
          </p>
          <p>
            A good starting point removes a whole stage of this: instead of guessing at a
            problem, start from one that already recurs across real threads. That&apos;s what{" "}
            <Link href={"/how-it-works" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              Pannly&apos;s scored briefs
            </Link>{" "}
            give you — then you run the conversations and the pre-sell from there. Browse{" "}
            <Link href={"/saas-ideas-2026" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              SaaS ideas already backed by demand
            </Link>{" "}
            to start from evidence instead of a hunch.
          </p>
        </div>
      </section>

      <BlogFaq heading="Validating a SaaS idea — frequently asked" items={FAQS} />
      <BlogCta headline="Validate the problem. Pre-sell the product." />
    </div>
  );
}
