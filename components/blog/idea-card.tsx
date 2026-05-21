import type { Route } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { FeedIdea } from "@/lib/api/feed";

/**
 * Shared idea card for the SEO blog listicles (saas-ideas-2026, micro-saas-ideas,
 * startup-ideas). Renders ONLY public feed fields — title, one-line pain, real
 * score, tags, traction counts — and links to the full brief.
 *
 * Deliberately does NOT render evidence quotes or source URLs: those sit behind
 * the $3 unlock (the public API exposes neither). The real demand score is the
 * honest differentiator vs. competitors' citation-free lists; the linked brief
 * is where the sourced evidence lives.
 */
export function BlogIdeaCard({ idea, rank }: { idea: FeedIdea; rank?: number }) {
  return (
    <Link
      href={`/ideas/${encodeURIComponent(idea.slug)}` as Route}
      className="group flex flex-col rounded-xl border border-cream-300 bg-cream-50/60 p-6 transition-colors hover:border-moss-600"
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <h3 className="font-display text-lg leading-snug text-ink-700 group-hover:text-moss-600">
          {typeof rank === "number" ? (
            <span className="mr-2 font-mono text-sm text-ink-50/50">
              {String(rank).padStart(2, "0")}
            </span>
          ) : null}
          {idea.title}
        </h3>
        {idea.overall_score !== null ? (
          <span
            className="shrink-0 rounded-md border border-cream-300 bg-cream-100 px-2 py-1 font-mono text-sm font-semibold tabular-nums text-moss-600"
            title="Pannly demand score (demand × reachability × competitive gap)"
          >
            {idea.overall_score.toFixed(1)}
          </span>
        ) : null}
      </div>

      {idea.one_line_pain ? (
        <p className="mb-4 text-sm leading-relaxed text-ink-50/80">
          {idea.one_line_pain}
        </p>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-cream-300/70 pt-4">
        <div className="flex flex-wrap gap-1.5">
          {idea.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-cream-300 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-50/60"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-1 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.08em] text-moss-600">
          See the brief
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        </span>
      </div>
    </Link>
  );
}
