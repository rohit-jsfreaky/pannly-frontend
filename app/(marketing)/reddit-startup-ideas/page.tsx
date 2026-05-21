import type { Route } from "next";
import Link from "next/link";

import { BlogCta } from "@/components/blog/blog-cta";
import { BlogFaq } from "@/components/blog/blog-faq";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogIdeaGrid } from "@/components/blog/idea-grid";
import { safeBlogIdeas, safeIdeaCount } from "@/lib/blog/ideas";
import { blogItemList, blogWebPage, type BlogFaqItem } from "@/lib/blog/schema";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { buildBreadcrumbSchema, buildFaqPage, schemaJson } from "@/lib/seo/schemas";

const TITLE = "Reddit Startup Ideas: Real Pain, Scored (Not Just Scraped)";
const DESCRIPTION =
  "Startup ideas pulled from real Reddit threads and scored on demand — plus how to tell a one-off vent from a genuine market. Each idea links to a sourced brief.";
const PATH = "/reddit-startup-ideas";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "Reddit Startup Ideas", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "Reddit startup ideas",
  description:
    "Startup and SaaS ideas sourced from real Reddit threads and scored on demand, reachability, and competition, with guidance on telling a recurring market signal from a one-off complaint. Each idea links to a brief.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "Are Reddit startup ideas actually any good?",
    answer:
      "The raw threads are noisy, but the signal is real — Reddit is where people complain honestly about tools and workflows. The trick is separating a recurring, widely-felt pain from one person's bad day. Scored ideas (by how often a pain recurs across people and threads) cut through that noise.",
  },
  {
    question: "How do I tell a real market from a one-off complaint?",
    answer:
      "A real market repeats. The same pain shows up from different people, in different threads, over time, often with comments saying 'same here' or 'I'd pay for that.' A one-off is a single frustrated post with no echo. Demand here is measured by recurrence, not by how loud a single rant is.",
  },
  {
    question: "Which subreddits are best for startup ideas?",
    answer:
      "Problem-focused, work-oriented communities where your potential buyers actually are. Pannly draws from six SaaS-focused subreddits plus Hacker News, but the principle generalises: pick communities with active, problem-led discussion rather than memes or news.",
  },
  {
    question: "Where do these ideas come from?",
    answer:
      "Real public Reddit and Hacker News posts, clustered and scored on demand, reachability, and competition. Open any idea's brief for the evidence quotes and their original source threads.",
  },
];
const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

export default async function Page() {
  const [ideas, total] = await Promise.all([
    safeBlogIdeas({ perPage: 12 }),
    safeIdeaCount(),
  ]);
  const hasIdeas = ideas.length > 0;

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />
      {hasIdeas ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("Reddit startup ideas", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="Reddit Startup Ideas" title="Reddit startup ideas, scored — not just scraped">
        <p className="geo-speakable">
          Reddit is the most honest focus group on the internet, but a list of scraped
          complaints isn&apos;t a list of startup ideas. The signal worth building on is the
          pain that <em className="italic">recurs</em> — the same problem from different people,
          in different threads, with others chiming in. That recurrence is what these ideas are
          scored on{total ? `, drawn from ${total} live ideas` : ""}.
        </p>
        <p className="text-base text-ink-50/70">
          Below, real Reddit-sourced ideas ranked by demand, each linked to a brief with the threads.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          A vent is loud. A market repeats.
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            The mistake people make mining Reddit for ideas is mistaking volume for demand. One
            highly-upvoted rant feels like a signal, but a single thread is just one person
            having a bad week, amplified. The thing you actually want is quieter and more
            valuable: the same complaint surfacing again and again, from different people, over
            months.
          </p>
          <p>
            That&apos;s the difference between &ldquo;someone was annoyed once&rdquo; and
            &ldquo;there&apos;s a market here.&rdquo; The ideas below are ranked by exactly that
            — recurrence across people and threads — not by how loud any single post was. Each
            one links to a brief where you can read the evidence and judge for yourself.
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="Reddit-sourced startup ideas, ranked by demand"
        blurb="Pulled from the feed and sorted by score. Open any for the full brief — evidence quotes with their original Reddit and Hacker News links, the buyer, and a validation plan."
      />

      <section className="mx-auto w-full max-w-3xl">
        <p className="text-base leading-relaxed text-ink-50/80">
          Want to do it by hand? Read{" "}
          <Link href={"/how-to-find-pain-points-on-reddit" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            how to find pain points on Reddit
          </Link>{" "}
          and{" "}
          <Link href={"/reddit-pain-point-analysis" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            how to score what you find
          </Link>
          .
        </p>
      </section>

      <BlogFaq heading="Reddit startup ideas — frequently asked" items={FAQS} />
      <BlogCta headline="Start from pain that repeats." />
    </div>
  );
}
