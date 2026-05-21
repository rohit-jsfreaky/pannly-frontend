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

const TITLE = "SaaS Ideas for Fitness Coaches, Gyms & Studios (2026)";
const DESCRIPTION =
  "SaaS ideas for fitness coaches, boutique studios, and solo trainers the gym-management giants ignore — payments, nutrition, retention — scored on demand and linked to sourced briefs.";
const PATH = "/saas-ideas-for-fitness-coaches";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });
export const revalidate = 3600;

const BREADCRUMB = buildBreadcrumbSchema([{ name: "SaaS Ideas for Fitness Coaches", path: PATH }]);
const WEBPAGE = blogWebPage({
  url: PATH,
  name: "SaaS ideas for fitness coaches and gyms",
  description:
    "Software ideas for independent fitness coaches, boutique studios, and small gyms underserved by enterprise gym-management platforms — payments, nutrition, and retention — each scored and linked to a brief.",
});

const FAQS: BlogFaqItem[] = [
  {
    question: "Isn't gym software already a crowded market?",
    answer:
      "The big all-in-one gym-management platforms are crowded, but they're built for multi-location gyms and feel like overkill to a solo trainer or a single boutique studio. That mismatch is the opening: lightweight, mobile-first tools designed for one coach or one small studio, not an enterprise chain.",
  },
  {
    question: "What do independent fitness coaches actually pay for?",
    answer:
      "Things that fix payment friction and save admin time. Inconsistent client payments are a constant headache — a simple credit tracker with automated reminders is genuinely valuable. Beyond that: client check-ins, workout and nutrition delivery, and retention nudges, all without the bloat of a full gym platform.",
  },
  {
    question: "Why focus on boutique studios and solo trainers?",
    answer:
      "Because the giants don't. Yoga, pilates, barre, spin, and personal-training businesses have flourished, but the software written for them is either consumer fitness apps or enterprise gym software — nothing that fits a one-or-two-person operation. Purpose-built tools for that segment win on fit.",
  },
  {
    question: "Where do these ideas come from?",
    answer:
      "Real complaints from coaches and studio owners on Reddit and Hacker News, clustered and scored on demand, reachability, and competition. Each idea's brief carries the evidence and its source threads.",
  },
];
const FAQ_SCHEMA = buildFaqPage({ url: PATH, qas: FAQS });

export default async function Page() {
  const ideas = await safeBlogIdeas({ q: "fitness", perPage: 12 });
  const hasIdeas = ideas.length > 0;

  return (
    <div className="flex flex-col gap-20 px-6 py-16 md:px-12 md:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(WEBPAGE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(FAQ_SCHEMA) }} />
      {hasIdeas ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson(blogItemList("SaaS ideas for fitness coaches and gyms", ideas)) }} />
      ) : null}

      <BlogHero eyebrow="SaaS Ideas · Fitness" title="SaaS ideas for fitness coaches & studios">
        <p className="geo-speakable">
          The gym-software giants are built for multi-location chains, which means the solo
          personal trainer and the single boutique studio are quietly underserved. The best
          SaaS ideas for fitness coaches are lightweight and mobile-first — they fix payment
          friction and admin for a one-person operation instead of forcing enterprise software
          onto it.
        </p>
        <p className="text-base text-ink-50/70">
          Below are fitness ideas pulled from real pain, scored on demand, each linked to a brief.
        </p>
      </BlogHero>

      <section className="mx-auto w-full max-w-3xl">
        <h2 className="mb-6 font-display text-3xl text-moss-600">
          The giants left the small studios behind
        </h2>
        <div className="space-y-5 text-lg leading-relaxed text-ink-50/80">
          <p>
            Boutique studios — yoga, pilates, barre, spin — and solo trainers have boomed, but
            their software options are bad in both directions: consumer fitness apps that
            don&apos;t handle the business, or enterprise gym platforms that are overkill and
            overpriced for one location. The middle is empty.
          </p>
          <p>
            And the pain is concrete. Inconsistent client payments are a constant drain — a
            trainer chasing people for money instead of coaching them. A focused tool that just
            handles credits, automated payment reminders, and simple check-ins is worth real
            money to someone whose whole business is one calendar and one payment method.
          </p>
          <p>
            Don&apos;t build &ldquo;the new Mindbody.&rdquo; Build the thing a single coach
            actually opens every day.
          </p>
        </div>
      </section>

      <BlogIdeaGrid
        ideas={ideas}
        heading="Fitness software ideas, ranked by demand"
        blurb="Pulled from the feed and sorted by score. Open any for the full brief — pain, evidence with sources, buyer, and a validation plan."
      />

      <section className="mx-auto w-full max-w-3xl">
        <p className="text-base leading-relaxed text-ink-50/80">
          More verticals in the{" "}
          <Link href={"/startup-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            startup ideas hub
          </Link>
          , or the smaller{" "}
          <Link href={"/micro-saas-ideas" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            micro SaaS ideas
          </Link>
          .
        </p>
      </section>

      <BlogFaq heading="SaaS ideas for fitness coaches — frequently asked" items={FAQS} />
      <BlogCta headline="Build for the one coach, not the chain." />
    </div>
  );
}
