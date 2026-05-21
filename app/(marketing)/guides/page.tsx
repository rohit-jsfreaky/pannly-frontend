import type { Route } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { blogWebPage } from "@/lib/blog/schema";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { buildBreadcrumbSchema, schemaJson } from "@/lib/seo/schemas";

/**
 * /guides — the content hub. Links to every idea-list, vertical, and guide so
 * none of them is an orphan, gives crawlers one entry point, and lets internal
 * link equity flow to the whole cluster. Linked from the site footer.
 */

const TITLE = "Startup & SaaS Idea Guides";
const DESCRIPTION =
  "Every Pannly guide in one place — idea lists, ideas by industry, AI ideas, Reddit research methods, and validation frameworks. All grounded in real, scored demand.";
const PATH = "/guides";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 86400;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "Guides", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "Startup & SaaS idea guides",
  description:
    "A directory of Pannly's guides: idea lists, ideas by industry, AI ideas, Reddit pain-point research methods, and idea-validation frameworks — all grounded in real, scored demand.",
});

interface GuideLink {
  href: string;
  title: string;
  blurb: string;
}
interface GuideGroup {
  heading: string;
  links: GuideLink[];
}

const GROUPS: GuideGroup[] = [
  {
    heading: "Idea lists",
    links: [
      { href: "/saas-ideas-2026", title: "SaaS ideas for 2026", blurb: "The big list, backed by real Reddit pain." },
      { href: "/micro-saas-ideas", title: "Micro SaaS ideas", blurb: "Small, weekend-buildable, profitable niches." },
      { href: "/b2b-saas-ideas", title: "B2B SaaS ideas", blurb: "Boring, sticky, $10K+ ACV." },
      { href: "/no-code-saas-ideas", title: "No-code SaaS ideas", blurb: "What you can actually build without engineers." },
      { href: "/reddit-startup-ideas", title: "Reddit startup ideas", blurb: "Real pain, scored — not just scraped." },
    ],
  },
  {
    heading: "Ideas by industry",
    links: [
      { href: "/saas-ideas-for-agencies", title: "For agencies", blurb: "Kill the unbillable glue work." },
      { href: "/saas-ideas-for-real-estate-agents", title: "For real estate agents", blurb: "Protect the commission, not the CRM." },
      { href: "/micro-saas-ideas-for-ecommerce", title: "For ecommerce sellers", blurb: "The gaps the app stores ignore." },
      { href: "/saas-ideas-for-accountants", title: "For accountants", blurb: "Automate the glue, not the ledger." },
      { href: "/saas-ideas-for-healthcare", title: "For healthcare", blurb: "Win the admin layer, skip the landmine." },
      { href: "/saas-ideas-for-fitness-coaches", title: "For fitness coaches & gyms", blurb: "Build for the one coach, not the chain." },
    ],
  },
  {
    heading: "AI ideas",
    links: [
      { href: "/ai-saas-ideas", title: "AI SaaS ideas", blurb: "The vertical kind that survives." },
      { href: "/ai-micro-saas-ideas", title: "AI micro SaaS ideas", blurb: "One job, one niche, shipped fast." },
      { href: "/ai-agent-ideas", title: "AI agent ideas", blurb: "Automate one chore, not everything." },
      { href: "/chatgpt-wrapper-ideas", title: "ChatGPT wrapper ideas", blurb: "The model's free; the niche is yours." },
    ],
  },
  {
    heading: "Niche & market analysis",
    links: [
      { href: "/untapped-saas-niches", title: "Untapped SaaS niches", blurb: "Where other founders aren't looking." },
      { href: "/profitable-saas-niches-2026", title: "Profitable SaaS niches", blurb: "The four traits that make a niche pay." },
      { href: "/startup-ideas", title: "Startup ideas hub", blurb: "Software ideas by category." },
    ],
  },
  {
    heading: "Research & validation",
    links: [
      { href: "/how-to-find-pain-points-on-reddit", title: "Find pain points on Reddit", blurb: "The actual method, step by step." },
      { href: "/reddit-pain-point-analysis", title: "Score pain points", blurb: "Frequency × intensity × reachability." },
      { href: "/how-to-validate-a-saas-idea", title: "Validate a SaaS idea", blurb: "Pre-sell beats survey, every time." },
      { href: "/side-project-ideas-for-developers", title: "Developer side projects", blurb: "Pick the one you can launch." },
      { href: "/ideabrowser-alternative", title: "Ideabrowser alternative", blurb: "An honest comparison of idea tools." },
      { href: "/gummysearch-alternative", title: "GummySearch alternative", blurb: "What to use now it's gone." },
    ],
  },
];

export default function GuidesPage() {
  return (
    <div className="flex flex-col gap-16 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />

      <section className="mx-auto w-full max-w-3xl">
        <span className="mb-4 block font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink-50/70">
          Guides
        </span>
        <h1 className="mb-6 font-display text-4xl font-medium tracking-tight text-moss-600 md:text-5xl">
          Startup &amp; SaaS idea guides
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-ink-50/90">
          Every guide in one place — idea lists, ideas by industry, AI ideas, and the research
          methods behind them. All of it grounded in real, scored demand from Reddit and Hacker
          News, not brainstormed.
        </p>
      </section>

      {GROUPS.map((group) => (
        <section key={group.heading} className="mx-auto w-full max-w-5xl">
          <h2 className="mb-6 font-display text-2xl text-moss-600">{group.heading}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {group.links.map((l) => (
              <Link
                key={l.href}
                href={l.href as Route}
                className="group flex flex-col rounded-xl border border-cream-300 bg-cream-50/60 p-5 transition-colors hover:border-moss-600"
              >
                <div className="mb-1 flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg text-ink-700 group-hover:text-moss-600">{l.title}</h3>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-moss-600" strokeWidth={2} aria-hidden />
                </div>
                <p className="text-sm leading-relaxed text-ink-50/70">{l.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
