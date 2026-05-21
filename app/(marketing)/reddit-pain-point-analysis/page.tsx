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

const TITLE = "Reddit Pain Point Analysis: How to Score What You Find";
const DESCRIPTION =
  "A framework for turning Reddit complaints into ranked opportunities — scoring each pain on frequency, intensity, and reachability. The exact method, plus scored examples.";
const PATH = "/reddit-pain-point-analysis";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "Reddit Pain Point Analysis", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "Reddit pain point analysis",
  description:
    "A framework for analysing and scoring customer pain points found on Reddit — weighing frequency, intensity, and reachability — so you can rank opportunities instead of collecting complaints.",
});

const SCORES = [
  {
    h: "Frequency — how often does this pain recur?",
    b: "Count distinct people and threads describing the same problem over time, not upvotes on one post. A pain mentioned by twenty different people across six months is a market. A single viral thread is one person's bad week with an audience. Recurrence is the strongest signal a problem is real.",
  },
  {
    h: "Intensity — how much does it cost them?",
    b: "Read for the stakes. Are people losing money, hours, customers, or sleep? The phrases that matter: 'this costs me X a week,' 'I'd pay anything,' or a description of an elaborate workaround they built. A high-intensity pain converts; a mild annoyance gets a free tool at best.",
  },
  {
    h: "Reachability — can you actually sell to these people?",
    b: "A perfect problem you can't reach a buyer for is a hobby. Score whether these people gather somewhere you can market to without burning cash — a subreddit, a forum, a conference. Solo founders live and die on this; a reachable mediocre niche beats an unreachable great one.",
  },
];

const FAQS: BlogFaqItem[] = [
  {
    question: "How do you analyse pain points from Reddit?",
    answer:
      "Score each recurring complaint on three axes: frequency (how often the same pain recurs across people and threads), intensity (how much it costs them in money, time, or stress), and reachability (whether you can actually find and sell to these buyers). Rank by all three together rather than reacting to whichever post is loudest.",
  },
  {
    question: "Why not just go with the most upvoted complaint?",
    answer:
      "Upvotes measure relatability, not market size or willingness to pay. A funny rant gets upvotes; a quiet, expensive, recurring problem might not. Scoring on frequency, intensity, and reachability corrects for that bias and surfaces opportunities the upvote count would hide.",
  },
  {
    question: "How is this different from just reading Reddit?",
    answer:
      "Reading gives you anecdotes. Scoring gives you a ranked list. The framework forces you to weigh a complaint's recurrence, cost, and reachability instead of falling for the first compelling story — which is exactly how good ideas get separated from loud ones.",
  },
  {
    question: "Where do these scored examples come from?",
    answer:
      "Pannly runs this analysis continuously across six SaaS subreddits and Hacker News, scoring each clustered pain on demand, reachability, and competition. The examples below are live. Each links to a brief with the evidence and its source threads.",
  },
];
const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

export default async function Page() {
  const ideas = await safeBlogIdeas({ perPage: 6 });

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />

      <BlogHero eyebrow="Framework" title="Reddit pain point analysis">
        <p className="geo-speakable">
          To analyse pain points from Reddit, don&apos;t collect complaints — score them. Weigh
          each recurring pain on three axes: frequency (how often it recurs across people and
          threads), intensity (how much it costs them), and reachability (whether you can sell
          to these buyers). Rank by all three, and the real opportunities separate themselves
          from the loud ones.
        </p>
        <p className="text-base text-ink-50/70">
          Here&apos;s the framework, then live examples already scored this way.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-10 font-display text-3xl text-moss-600">The three axes</h2>
        <div className="flex flex-col gap-8">
          {SCORES.map((s) => (
            <div key={s.h}>
              <h3 className="mb-2 font-display text-xl text-ink-700">{s.h}</h3>
              <p className="text-base leading-relaxed text-ink-50/80">{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">Put them together</h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            None of the three axes works alone. A frequent, intense pain you can&apos;t reach a
            buyer for is a research paper. A reachable, intense pain that almost nobody has is a
            niche of one. The opportunities worth building for score well on all three at once —
            and those are rare enough that ranking is the entire point of the exercise.
          </p>
          <p>
            This is the analysis Pannly automates: it clusters recurring complaints and scores
            each on demand, reachability, and competition, so you read a ranked list instead of
            a wall of threads. A few live examples:
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="Pain points, already analysed and ranked"
        blurb="Live from the feed. Each opens into a brief with the evidence quotes and their original source threads."
        columns={3}
        ranked={false}
      />

      <section className="mx-auto w-full max-w-3xl">
        <p className="text-base leading-relaxed text-ink-50/80">
          Pair this with{" "}
          <Link href={"/how-to-find-pain-points-on-reddit" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            how to find pain points on Reddit
          </Link>{" "}
          for the full method, or jump to{" "}
          <Link href={"/reddit-startup-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            Reddit startup ideas
          </Link>
          .
        </p>
      </section>

      <BlogFaq heading="Reddit pain point analysis — frequently asked" items={FAQS} />
      <BlogCta headline="Rank the pain. Don't just collect it." />
    </div>
  );
}
