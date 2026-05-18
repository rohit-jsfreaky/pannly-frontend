import type { Route } from "next";
import Link from "next/link";
import {
  Activity,
  Users,
  Swords,
  Globe,
  ArrowRight,
} from "lucide-react";

import { pageMetadata } from "@/lib/seo/page-metadata";
import {
  buildAboutGraph,
  buildBreadcrumbSchema,
  schemaJson,
} from "@/lib/seo/schemas";

export const metadata = pageMetadata({
  title: "About",
  path: "/about",
  description:
    "Why Pannly exists. The founder note, our scoring methodology, and how we build in public.",
});

// Pure static content. 1-day cache window — any edit re-deploys.
export const revalidate = 86400;

const ABOUT_GRAPH = buildAboutGraph({
  founderName: "Rohit",
  founderJobTitle: "Founder",
  founderLocation: "India",
});

const BREADCRUMB = buildBreadcrumbSchema([{ name: "About", path: "/about" }]);

export default function AboutPage() {
  return (
    <div className="px-6 md:px-12 w-full px-6 py-16 md:px-8 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(ABOUT_GRAPH) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }}
      />
      <Header />
      <FounderNote />
      <Methodology />
      <BuildInPublicBand />
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Header                                                            */
/* ---------------------------------------------------------------- */

function Header() {
  return (
    <header className="mx-auto mb-24 max-w-2xl text-center">
      <span className="mb-4 block font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink-50/70">
        About
      </span>
      <h1 className="font-display text-4xl font-medium tracking-tight text-moss-600 md:text-5xl">
        Why Pannly exists.
      </h1>
    </header>
  );
}

/* ---------------------------------------------------------------- */
/*  Founder note                                                      */
/* ---------------------------------------------------------------- */

function FounderNote() {
  return (
    <section className="mx-auto mb-32 max-w-2xl">
      <div className="space-y-6 text-lg leading-relaxed text-ink-50/80">
        <p>
          I&apos;ve shipped a handful of side projects. Most of them died because I
          picked the wrong idea, not because I built them badly. Pannly is the tool
          I wish I&apos;d had four years ago.
        </p>
        <p>
          When you&apos;re scrolling Reddit and Hacker News looking for ideas,
          you&apos;re doing the same thing every other indie hacker is doing —
          staring at noise, hoping a pattern emerges. Sometimes one does. Most of
          the time it doesn&apos;t.
        </p>
        <p>
          So I built a thing that watches those threads for me. It pulls posts
          where real founders are saying <em className="italic">&ldquo;I&apos;d pay for X&rdquo;</em> or{" "}
          <em className="italic">&ldquo;why does no one build Y&rdquo;</em>, scores how
          reachable those buyers are, and turns the strongest signals into briefs
          you can actually act on.
        </p>
        <p>
          The refund-on-ship mechanic exists because I&apos;ve seen too many tools —
          and built too many of my own — where the cost of finding out is greater
          than the cost of trying. Pannly should pay you back for taking the swing.
        </p>
        <p>
          If you ship something using a Pannly brief, I&apos;ll personally see your
          refund clear. That&apos;s the deal.
        </p>
      </div>

      <div className="mt-12 flex items-center gap-6 border-t border-cream-300 pt-8">
        <Monogram letter="R" />
        <div>
          <p className="m-0 font-display text-2xl text-moss-600">Rohit</p>
          <p className="m-0 text-sm text-ink-50/70">founder of Pannly · building from India</p>
        </div>
      </div>
    </section>
  );
}

function Monogram({ letter }: { letter: string }) {
  return (
    <span
      className="flex h-16 w-16 items-center justify-center rounded-md border border-cream-300 bg-cream-200 font-display text-2xl font-semibold text-moss-700"
      aria-hidden
    >
      {letter}
    </span>
  );
}

/* ---------------------------------------------------------------- */
/*  Methodology                                                       */
/* ---------------------------------------------------------------- */

const methods = [
  {
    icon: Activity,
    title: "Demand",
    body: "How many people are actually feeling this pain? A single rant is noise; the same complaint surfacing across multiple subreddits and HN threads in the same month is a market. We weigh signal volume across communities and time.",
  },
  {
    icon: Users,
    title: "Reachability",
    body: "Can a solo builder actually find these buyers? Indie SaaS lives or dies on distribution. We score harder for problems with clear, public communities you can post into — and lower for buyers who only exist behind enterprise sales motions.",
  },
  {
    icon: Swords,
    title: "Competition",
    body: "If three companies already do this perfectly, the score drops. If they exist but charge enterprise prices, ship clunky UX, or only serve the top 5% of the market, the score rises. The wedge matters more than the absence of competition.",
  },
];

function Methodology() {
  return (
    <section className="mx-auto mb-32 max-w-4xl">
      <h2 className="mb-12 text-center font-display text-3xl text-moss-600">
        How we score ideas, in plain English.
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {methods.map((m) => (
          <div
            key={m.title}
            className="flex flex-col items-start rounded-xl border border-cream-300 bg-cream-50/60 p-8"
          >
            <m.icon
              className="mb-6 h-6 w-6 text-moss-600"
              strokeWidth={1.75}
              aria-hidden
            />
            <h3 className="mb-3 font-display text-2xl text-ink-700">{m.title}</h3>
            <p className="text-sm text-ink-50/80">{m.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */
/*  Build in public band                                              */
/* ---------------------------------------------------------------- */

function BuildInPublicBand() {
  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-cream-300 bg-cream-50 px-8 py-16 text-center">
      <Globe
        className="mx-auto mb-4 h-9 w-9 text-plum-500"
        strokeWidth={1.5}
        aria-hidden
      />
      <h3 className="mb-4 font-display text-2xl text-moss-600">Building in the open</h3>
      <p className="mb-8 text-base text-ink-50/80">
        Every refund processed, every shipped build, every monthly revenue update —
        posted publicly. No vanity metrics, no hustle theatre.
      </p>
      <Link
        href={"/refunds" as Route}
        className="inline-flex items-center gap-2 rounded-xl bg-moss-600 px-6 py-3 text-sm text-cream-50 transition-opacity hover:opacity-90"
      >
        See the refund ledger
        <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
      </Link>
    </section>
  );
}
