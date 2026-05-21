import type { Route } from "next";
import Link from "next/link";

import type { FeedIdea } from "@/lib/api/feed";
import { BlogIdeaCard } from "./idea-card";

/**
 * Shared "live ideas" grid for the blog listicles. Renders real scored idea
 * cards, or a fail-soft pointer to /feed when the backend returns nothing.
 */
export function BlogIdeaGrid({
  ideas,
  heading,
  blurb,
  columns = 2,
  ranked = true,
}: {
  ideas: FeedIdea[];
  heading: string;
  blurb: string;
  columns?: 2 | 3;
  ranked?: boolean;
}) {
  const grid = columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
  return (
    <section className="mx-auto w-full max-w-5xl">
      <h2 className="mb-3 font-display text-3xl text-moss-600">{heading}</h2>
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-ink-50/70">{blurb}</p>
      {ideas.length > 0 ? (
        <div className={`grid grid-cols-1 gap-4 ${grid}`}>
          {ideas.map((idea, i) => (
            <BlogIdeaCard key={idea.slug} idea={idea} rank={ranked ? i + 1 : undefined} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-cream-300 bg-cream-50/60 p-6 text-base text-ink-50/70">
          The live feed is loading — browse the full{" "}
          <Link href={"/feed" as Route} className="text-moss-600 underline decoration-cream-300 underline-offset-4 hover:text-plum-500">
            idea feed
          </Link>{" "}
          to see every scored idea.
        </p>
      )}
    </section>
  );
}
