import type { Route } from "next";
import Link from "next/link";

import { BlogCta } from "@/components/blog/blog-cta";
import { BlogFaq } from "@/components/blog/blog-faq";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogIdeaGrid } from "@/components/blog/idea-grid";
import { safeBlogIdeas } from "@/lib/blog/ideas";
import { blogWebPage, type BlogFaqItem } from "@/lib/blog/schema";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { buildBreadcrumbSchema, buildFaqPage, schemaJson } from "@/lib/seo/schemas";

const TITLE = "How to Find Pain Points on Reddit (The Actual Method)";
const DESCRIPTION =
  "A practical, step-by-step method for finding real customer pain points on Reddit — the search operators, where the gold actually hides, and how to score what you find.";
const PATH = "/how-to-find-pain-points-on-reddit";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "How to Find Pain Points on Reddit", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "How to find pain points on Reddit",
  description:
    "A step-by-step method for finding and validating real customer pain points on Reddit: choosing subreddits, the search queries that surface complaints, mining comments, reading the 'I'd pay for' signal, and scoring what you find.",
});

const STEPS = [
  {
    n: "01",
    h: "Pick three subreddits where your buyer actually complains",
    b: "Not the biggest subreddits — the ones with daily, problem-focused discussion. Look for communities with recent posts (within 24 hours), a healthy comment-to-post ratio (roughly 5–10+), and people talking about work, not memes. Three good subreddits beats twenty broad ones.",
  },
  {
    n: "02",
    h: "Search for the exact phrases frustration uses",
    b: "People in pain write in predictable language. Search each subreddit for “I hate”, “I wish there was”, “is there a tool that”, “how do you all deal with”, and “why is there no”. Combine with a domain word, e.g. “struggling with invoicing”. Then sort by Top → Past Year so high-upvote complaints (problems many people share) rise to the surface.",
  },
  {
    n: "03",
    h: "Read the comments, not just the post",
    b: "The post introduces a problem; the comments reveal how deep it goes. That's where people list the workarounds they've tried, the tools that failed them, and how much the problem actually costs them. A complaint with 40 'same here' comments is a market. A complaint with none is one person's bad day.",
  },
  {
    n: "04",
    h: "Hunt for the 'I'd pay for' signal",
    b: "The strongest signal isn't a complaint — it's someone saying they would pay to make it stop, or describing a clumsy paid workaround they already use. Those sentences are gold. Also watch for self-built spreadsheets and Zapier duct-tape: a workaround is proof the demand outran the supply.",
  },
  {
    n: "05",
    h: "Score the pattern before you trust it",
    b: "For each recurring pain, weigh three things: how often it shows up across people and threads (demand), whether you can actually reach those people to sell (reachability), and whether existing tools already solve it well (competition). A pain that's frequent, reachable, and under-served is the one worth building for.",
  },
];

const FAQS: BlogFaqItem[] = [
  {
    question: "What should I search for on Reddit to find pain points?",
    answer:
      "Search inside relevant subreddits for the phrases frustration uses: “I hate”, “I wish there was a tool”, “is there anything that”, “how do you deal with”, plus a keyword from your niche. Sort by Top and Past Year so the most-upvoted complaints surface first.",
  },
  {
    question: "Where on a Reddit thread are the real pain points?",
    answer:
      "Usually the comments, not the original post. Comments reveal failed solutions, workarounds, and how much the problem costs — the detail that separates a real market from a one-off rant. Pay special attention to anyone who says they'd pay for a fix.",
  },
  {
    question: "How do I know a pain point is worth building for?",
    answer:
      "Score it on three things: frequency (does the same pain recur across many people?), reachability (can a solo founder actually find and sell to these people?), and competition (is it already solved well?). High frequency, high reachability, weak competition is the sweet spot.",
  },
  {
    question: "Is there a faster way than doing this by hand?",
    answer:
      "Yes — this is exactly what Pannly automates. It watches six SaaS subreddits and Hacker News continuously, clusters recurring complaints, scores them on demand, reachability, and competition, and writes a brief for each. You can do the manual method above, or browse the scored results directly.",
  },
];
const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

export default async function Page() {
  const ideas = await safeBlogIdeas({ perPage: 4 });
  const hasIdeas = ideas.length > 0;

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />

      <BlogHero eyebrow="Guide" title="How to find pain points on Reddit">
        <p className="geo-speakable">
          To find real customer pain points on Reddit, search the subreddits where your buyer
          already complains for phrases like &ldquo;I hate&rdquo; and &ldquo;I wish there was a
          tool,&rdquo; sort by Top in the past year, read the comments rather than the post,
          and look for anyone who says they&apos;d pay to make the problem stop. Then score each
          recurring pain on demand, reachability, and competition.
        </p>
        <p className="text-base text-ink-50/70">
          That&apos;s the whole method. Here it is in detail — and at the end, the faster way.
        </p>
      </BlogHero>

      {/* The method */}
      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-10 font-display text-3xl text-moss-600">The five-step method</h2>
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

      {/* The honest shortcut */}
      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          The catch — and the shortcut
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            Done properly, this takes hours per week, every week. The signal decays — last
            month&apos;s hot complaint is this month&apos;s solved problem — so it&apos;s not a
            one-time job. That&apos;s why most people do it once, get excited, and never go back.
          </p>
          <p>
            Pannly runs this method continuously: it watches six SaaS subreddits and Hacker
            News, clusters the recurring complaints, scores each on demand, reachability, and
            competition, and writes a brief. Same method — automated, scored, and kept fresh.
            Here&apos;s what the output looks like:
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="Pain points, already found and scored"
        blurb="Live from the feed. Each opens into a brief with the evidence quotes and their original Reddit and Hacker News source links."
        ranked={false}
      />

      <section className="mx-auto w-full max-w-3xl">
        <p className="text-base leading-relaxed text-ink-50/80">
          Prefer to keep doing it yourself? Good — the manual method above genuinely works.
          Either way, see{" "}
          <Link href={"/how-it-works" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            how the scoring works
          </Link>{" "}
          or jump to{" "}
          <Link href={"/reddit-startup-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            startup ideas already pulled from Reddit
          </Link>
          .
        </p>
      </section>

      <BlogFaq heading="Finding pain points on Reddit — frequently asked" items={FAQS} />
      <BlogCta headline="Skip the scrolling. Start from scored pain." />
    </div>
  );
}
