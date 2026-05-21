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

const TITLE = "SaaS Ideas for Real Estate Agents Worth Building in 2026";
const DESCRIPTION =
  "SaaS ideas for real estate agents that solve the expensive problems — delayed closings, lead follow-up, transaction chaos — scored on real demand and linked to sourced briefs.";
const PATH = "/saas-ideas-for-real-estate-agents";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "SaaS Ideas for Real Estate Agents", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "SaaS ideas for real estate agents",
  description:
    "Software ideas for real estate agents and brokers, built around the moments that cost commission — transaction coordination, deadline tracking, and lead follow-up — each scored on demand and linked to a brief.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "What software do real estate agents actually need?",
    answer:
      "Agents are drowning in CRMs and starving for coordination. The tools they pay for protect commission: transaction and deadline tracking that prevents a closing from slipping, follow-up that stops warm leads going cold, and anything that turns the email-thread chaos of a deal into one timeline.",
  },
  {
    question: "Isn't real estate software a saturated market?",
    answer:
      "CRMs are saturated. Coordination is not. The real estate SaaS market hit roughly $8.6B in 2025 and is still growing fast precisely because the generic CRMs don't fit the deal workflow. The opening is in the specific rituals of getting a deal from offer to close.",
  },
  {
    question: "How much will a real estate agent pay per month?",
    answer:
      "A single delayed closing costs an agent $2,000+ in lost or at-risk commission, so a tool that reliably prevents that pays for itself many times over. Agents will happily pay $50–$99/month for one boring tool that removes a real risk — far more than for another feature-stuffed platform.",
  },
  {
    question: "Where do these ideas come from?",
    answer:
      "Real complaints from agents and brokers on Reddit and Hacker News, clustered and scored on demand, reachability, and competition. Each idea's brief includes the evidence quotes and their original source threads.",
  },
];
const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

export default async function Page() {
  const ideas = await safeBlogIdeas({ q: "real estate", perPage: 12 });
  const hasIdeas = ideas.length > 0;

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />
      {hasIdeas ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("SaaS ideas for real estate agents", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="SaaS Ideas · Real Estate" title="SaaS ideas for real estate agents">
        <p className="geo-speakable">
          The best SaaS ideas for real estate agents have nothing to do with building a
          better CRM. They protect commission. A single closing that slips because a deadline
          got buried in an email thread can cost an agent $2,000 or more — and that is the
          problem worth solving, not contact management.
        </p>
        <p className="text-base text-ink-50/70">
          Below are ideas pulled from real agent complaints, scored on demand, each linked to
          a brief with the evidence behind it.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          Why agents buy &ldquo;boring&rdquo; software and ignore the flashy stuff
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            An agent&apos;s income is lumpy and tied to deals closing on time. That single
            fact explains what they&apos;ll pay for. They don&apos;t want a prettier pipeline
            view; they want to never again lose a deal because an inspection contingency
            lapsed while they were showing three other houses.
          </p>
          <p>
            A property transaction touches dozens of documents, multiple parties, and a stack
            of hard deadlines — almost all of it tracked in email. A plain tool that puts every
            document, signature, and deadline for a deal in one place, with automatic reminders,
            is the kind of unglamorous software agents quietly renew forever.
          </p>
          <p>
            The trap is competing with the big-name CRMs on features. Don&apos;t. Pick the one
            moment in a deal that costs money when it goes wrong, and own it.
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="Real estate software ideas, ranked by demand"
        blurb="Pulled from the feed and sorted by score. Open any for the full brief — pain, evidence with sources, buyer, and a validation plan."
      />

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">Where to aim</h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            Three reliable veins: <strong className="text-ink-700">transaction
            coordination</strong> (deadlines, documents, parties in one timeline),{" "}
            <strong className="text-ink-700">lead follow-up</strong> that runs itself between
            showings, and <strong className="text-ink-700">hyper-local content</strong> —
            buyers sign faster when they feel they know the neighbourhood.
          </p>
          <p>
            For the smaller, solo-buildable versions, see{" "}
            <Link href={"/micro-saas-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              micro SaaS ideas
            </Link>
            ; for other verticals, the{" "}
            <Link href={"/startup-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
              startup ideas hub
            </Link>
            .
          </p>
        </div>
      </section>

      <BlogFaq heading="SaaS ideas for real estate agents — frequently asked" items={FAQS} />
      <BlogCta headline="Solve the deal that almost slipped." />
    </div>
  );
}
