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

const TITLE = "AI Agent Ideas for Business (That Aren't Hype) — 2026";
const DESCRIPTION =
  "AI agent ideas that replace one repetitive task with clear inputs and outputs — support triage, lead qualification, meeting notes — scored on real demand and linked to briefs.";
const PATH = "/ai-agent-ideas";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "AI Agent Ideas", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "AI agent ideas for business",
  description:
    "Practical AI agent ideas that automate a single recurring business task with clear inputs and outputs — support triage, lead qualification, meeting notes — sourced from real pain, scored, and linked to briefs.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "What's a realistic AI agent to build first?",
    answer:
      "One that handles a single recurring task with clear inputs, outputs, and rules. Support-ticket triage, lead qualification, and meeting-notes-to-action-items are proven first agents because the job is bounded and the value is obvious. Avoid 'fully autonomous everything' as a first build — it's where projects die.",
  },
  {
    question: "Do AI agents actually save businesses money?",
    answer:
      "When scoped to the right task, yes, measurably. Voice and support agents can cut the cost of routine handling dramatically compared with paying $25–$40 per hour per human agent, and triage agents free a team's time for the work that actually needs judgment. The ROI is clearest when the task is high-volume and rules-based.",
  },
  {
    question: "What makes an AI agent idea defensible?",
    answer:
      "The integrations and the workflow it lives inside — not the model. An agent wired into a company's specific CRM, ticketing, and approval rules is sticky. A generic agent with no integrations is a demo. Depth into one workflow beats breadth across many.",
  },
  {
    question: "Where do these ideas come from?",
    answer:
      "Real complaints on Reddit and Hacker News where teams describe repetitive, rules-based work, clustered and scored on demand, reachability, and competition. Each idea's brief carries the evidence and its source threads.",
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("AI agent ideas for business", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="AI Agent Ideas" title="AI agent ideas for business">
        <p className="geo-speakable">
          The AI agent ideas that actually work in business are the unglamorous ones: replace
          a single repetitive task that has clear inputs, outputs, and rules. Support-ticket
          triage, lead qualification, meeting-notes-to-action-items. The fantasy of a fully
          autonomous employee is where projects stall — bounded jobs are where money gets made.
        </p>
        <p className="text-base text-ink-50/70">
          Below are agent ideas pulled from real pain, scored on demand, each linked to a brief.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          Bounded beats autonomous
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            The demos sell autonomy — an agent that runs your whole business. The revenue is in
            the opposite: an agent that does one job so reliably a team forgets it&apos;s there.
            A triage agent that reads incoming tickets, tags them by urgency, routes them, and
            drafts a first reply removes a real, daily chore. Nobody has to trust it with the
            company; they just have to trust it with the inbox.
          </p>
          <p>
            Pick a task that&apos;s high-volume, rules-heavy, and currently done by an expensive
            human doing it on autopilot. That&apos;s where an agent has obvious ROI you can put a
            number on — and where buyers say yes without a six-month pilot.
          </p>
          <p>
            The moat isn&apos;t the model; it&apos;s the integrations. An agent wired into a
            company&apos;s actual CRM and approval rules is sticky. A standalone demo is not.
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="AI agent ideas, ranked by demand"
        blurb="Pulled from the feed and sorted by score. Open any for the full brief — pain, evidence with sources, buyer, and a validation plan."
      />

      <section className="mx-auto w-full max-w-3xl">
        <p className="text-base leading-relaxed text-ink-50/80">
          Related:{" "}
          <Link href={"/ai-saas-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            AI SaaS ideas
          </Link>{" "}
          and{" "}
          <Link href={"/ai-micro-saas-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            AI micro SaaS ideas
          </Link>
          .
        </p>
      </section>

      <BlogFaq heading="AI agent ideas — frequently asked" items={FAQS} />
      <BlogCta headline="Automate one chore. Charge for the hours back." />
    </div>
  );
}
