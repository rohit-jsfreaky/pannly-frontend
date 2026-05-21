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

const TITLE = "No-Code SaaS Ideas You Can Actually Build (2026)";
const DESCRIPTION =
  "No-code SaaS ideas that are genuinely buildable without engineers — plus an honest take on what no-code still can't do well — scored on real demand and linked to briefs.";
const PATH = "/no-code-saas-ideas";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "No-Code SaaS Ideas", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "No-code SaaS ideas",
  description:
    "SaaS ideas a non-technical founder can build with no-code tools — vertical CRMs, schedulers, form and testimonial tools — plus an honest take on what no-code can't yet do well. Each scored on demand and linked to a brief.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "What SaaS can you actually build with no-code?",
    answer:
      "Anything that's mostly forms, records, scheduling, dashboards, and notifications: vertical CRMs, booking and appointment tools, form and survey builders, video-testimonial collectors, simple client portals, and lightweight LMS platforms. If the core value is organising data and automating a workflow, no-code handles it well.",
  },
  {
    question: "What can't no-code do well yet?",
    answer:
      "Anything performance-sensitive, deeply real-time, or reliant on heavy custom logic and large-scale data processing. If your idea's whole value is a novel algorithm, sub-second performance, or complex integrations, you'll hit no-code's ceiling fast. Be honest about which side of that line your idea sits on.",
  },
  {
    question: "Can a no-code SaaS actually make money?",
    answer:
      "Yes. The buyer doesn't care how it was built — they care that it solves their problem. Vertical no-code tools for niches like fitness studios, salons, or contractors consistently reach meaningful MRR because their value is fit and customisation, not raw technology.",
  },
  {
    question: "Where do these ideas come from?",
    answer:
      "Real complaints on Reddit and Hacker News, clustered and scored on demand, reachability, and competition. Each idea's brief carries the evidence quotes and their original source threads.",
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("No-code SaaS ideas", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="No-Code SaaS" title="No-code SaaS ideas you can actually build">
        <p className="geo-speakable">
          The best no-code SaaS ideas are the ones whose value is organising data and
          automating a workflow — vertical CRMs, schedulers, form and testimonial tools — not
          ideas that secretly need a custom algorithm. If you&apos;re non-technical, picking an
          idea that fits no-code&apos;s strengths matters as much as picking one with demand.
        </p>
        <p className="text-base text-ink-50/70">
          Below are demand-scored ideas, plus an honest line on what no-code still can&apos;t do.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          Match the idea to what no-code is good at
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            No-code is genuinely powerful now — but it has a shape. It&apos;s excellent at
            CRUD: capture data in forms, store it, show it in dashboards, trigger
            notifications and automations. Most vertical SaaS is exactly that wearing an
            industry&apos;s vocabulary. A CRM for tattoo artists with deposits and a portfolio
            gallery is, underneath, records and reminders. That ships no-code in a weekend.
          </p>
          <p>
            Where founders waste months: picking an idea whose entire value is the hard part
            no-code can&apos;t reach — real-time performance, heavy data processing, a novel
            model. The skill isn&apos;t avoiding ambition; it&apos;s knowing which 20% of your
            idea is the moat and whether no-code can deliver it.
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="No-code-friendly SaaS ideas, ranked by demand"
        blurb="Pulled from the feed and sorted by score. Open any for the full brief — and check it against the no-code shape above before you commit."
      />

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">A quick gut-check</h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            Before you build, ask: <em className="italic">if I strip this idea to records,
            forms, and automations, is it still useful?</em> If yes, no-code is your fastest
            path. If the magic only appears with custom engineering, either narrow the idea or
            plan to bring in a developer for that 20%.
          </p>
          <p>
            More to browse:{" "}
            <Link href={"/micro-saas-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              micro SaaS ideas
            </Link>{" "}
            and the{" "}
            <Link href={"/startup-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              startup ideas hub
            </Link>
            .
          </p>
        </div>
      </section>

      <BlogFaq heading="No-code SaaS ideas — frequently asked" items={FAQS} />
      <BlogCta headline="Pick an idea no-code can actually ship." />
    </div>
  );
}
