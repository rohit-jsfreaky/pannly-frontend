import type { Route } from "next";
import Link from "next/link";

import { ScoreBadge } from "@/components/feed/score-badge";
import type { FeedIdea } from "@/lib/api/feed";

interface Props {
  items: FeedIdea[];
}

/** 3-up grid at the bottom of /ideas/{slug}. Hidden when there are no related ideas. */
export function RelatedBriefs({ items }: Props) {
  if (!items.length) return null;

  return (
    <section className="mx-auto mt-24 max-w-[1100px] border-t border-cream-300 pt-16">
      <h2 className="mb-8 font-display text-3xl text-ink-700">Related Briefs</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((idea) => (
          <Link
            key={idea.slug}
            href={`/ideas/${idea.slug}` as Route}
            className="group block rounded-xl border border-cream-300 bg-cream-50 p-6 transition-colors duration-300 hover:bg-cream-200"
          >
            <div className="mb-4 flex items-start justify-between gap-2">
              {idea.tags.length ? (
                <span className="rounded-md border border-cream-300 bg-cream-200 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-moss-500">
                  {idea.tags[0]}
                </span>
              ) : (
                <span />
              )}
              <ScoreBadge score={idea.overall_score} kind={idea.score_kind} />
            </div>
            <h3 className="mb-3 font-display text-xl text-ink-700 group-hover:text-moss-700">
              {idea.title}
            </h3>
            {idea.one_line_pain ? (
              <p className="line-clamp-2 text-sm text-ink-50">{idea.one_line_pain}</p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
