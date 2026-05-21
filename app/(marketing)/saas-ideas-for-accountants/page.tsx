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

const TITLE = "SaaS Ideas for Accountants & Bookkeepers (2026)";
const DESCRIPTION =
  "SaaS ideas for accountants and bookkeepers built around their real daily friction — scattered client comms, intake, repetitive review — scored on demand and linked to sourced briefs.";
const PATH = "/saas-ideas-for-accountants";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "SaaS Ideas for Accountants", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "SaaS ideas for accountants",
  description:
    "Software ideas for accountants and bookkeepers, focused on client communication, intake, and repetitive review work, each scored on demand and linked to a brief.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "What software do accountants and bookkeepers need?",
    answer:
      "Not another ledger — they have QuickBooks or Xero. What they need is the layer around it: unified client communication, smoother document and intake collection, and tools that cut the repetitive reconciliation and review that eats their week. The unsexy glue is the opportunity.",
  },
  {
    question: "Isn't accounting software dominated by QuickBooks and Xero?",
    answer:
      "The core ledgers are, and you shouldn't compete there. But accountants stitch those ledgers to email, spreadsheets, and text to actually serve clients — and that stitching is manual and miserable. Tools that sit alongside QuickBooks/Xero and remove a specific chore are wide open.",
  },
  {
    question: "How much will an accounting firm pay?",
    answer:
      "Firms bill their time, so anything that returns hours has a clear ROI. A tool that unifies scattered client messages or automates intake can justify $30–$100+/month per seat, especially during tax season when every saved hour is billable elsewhere.",
  },
  {
    question: "Where do these ideas come from?",
    answer:
      "Real complaints from accountants and bookkeepers on Reddit and Hacker News, clustered and scored on demand, reachability, and competition. Each idea's brief carries the evidence quotes and their original source threads.",
  },
];
const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

export default async function Page() {
  const ideas = await safeBlogIdeas({ q: "account", perPage: 12 });
  const hasIdeas = ideas.length > 0;

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />
      {hasIdeas ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("SaaS ideas for accountants", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="SaaS Ideas · Accounting" title="SaaS ideas for accountants & bookkeepers">
        <p className="geo-speakable">
          The opportunity in accounting software isn&apos;t a better ledger — it&apos;s the
          messy layer around it. Accountants hold client work together across QuickBooks,
          email, spreadsheets, and text, and that stitching is manual and miserable. The best
          SaaS ideas for accountants automate one piece of that glue.
        </p>
        <p className="text-base text-ink-50/70">
          Below are ideas pulled from real accountant complaints, scored on demand, each linked
          to a brief.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          Don&apos;t fight QuickBooks. Fight the chaos around it.
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            Every few months someone tries to build &ldquo;a better QuickBooks&rdquo; and
            learns an expensive lesson. The ledger is solved and switching costs are brutal.
            But ask a bookkeeper where their time actually goes and it&apos;s not the ledger —
            it&apos;s chasing clients for documents, answering the same questions across three
            channels, and re-doing reconciliations by hand.
          </p>
          <p>
            A tool that unifies client communication and file-sharing into one thread, or that
            turns intake into a guided flow instead of a dozen emails, removes a weekly chore.
            It rides on top of the ledger the firm already uses — no rip-and-replace, no fight
            you can&apos;t win.
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="Accounting software ideas, ranked by demand"
        blurb="Pulled from the feed and sorted by score. Open any for the full brief — pain, evidence with sources, buyer, and a validation plan."
      />

      <section className="mx-auto w-full max-w-3xl">
        <p className="text-base leading-relaxed text-ink-50/80">
          More verticals in the{" "}
          <Link href={"/startup-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            startup ideas hub
          </Link>
          , or the broader{" "}
          <Link href={"/saas-ideas-2026" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            SaaS ideas for 2026
          </Link>
          .
        </p>
      </section>

      <BlogFaq heading="SaaS ideas for accountants — frequently asked" items={FAQS} />
      <BlogCta headline="Automate the glue, not the ledger." />
    </div>
  );
}
