"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ScoreBadge } from "@/components/feed/score-badge";
import { Button } from "@/components/ui/button";
import type { FeedIdea } from "@/lib/api/feed";
import { useAuth } from "@/lib/auth-context";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  idea: FeedIdea;
  /** True when this is the first card on the page — used as a thumb-stop visual. */
  emphasised?: boolean;
}

/**
 * One row in the feed list. The action button is auth-aware: clicking
 * "Unlock" while logged out pushes to /login?next=/ideas/{slug} so the user
 * lands on the idea page after sign-in.
 */
export function IdeaCard({ idea, emphasised }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const ideaPath = `/ideas/${idea.slug}` as Route;

  const onUnlock = () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/ideas/${idea.slug}`)}` as Route);
      return;
    }
    router.push(ideaPath);
  };

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-cream-300 bg-cream-50 p-6 transition-shadow hover:shadow-soft",
        emphasised && "shadow-soft",
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {idea.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-cream-300 bg-cream-200 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-moss-500"
            >
              {tag}
            </span>
          ))}
        </div>
        <ScoreBadge score={idea.overall_score} kind={idea.score_kind} />
      </header>

      <Link href={ideaPath} className="group flex flex-col gap-2 outline-none">
        <h2 className="font-display text-2xl text-ink-700 group-hover:text-moss-700">
          {idea.title}
        </h2>
        {idea.one_line_pain ? (
          <p className="text-base leading-relaxed text-ink-50">{idea.one_line_pain}</p>
        ) : null}
      </Link>

      <footer className="flex flex-col gap-3 border-t border-cream-300 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm tabular-nums text-cream-400">
          <span>
            <span className="text-ink-500">{idea.unlock_count}</span> unlocked
          </span>
          <span>
            <span className="text-ink-500">{idea.building_count}</span> building
          </span>
          <span>
            <span className="text-ink-500">{idea.shipped_count}</span> shipped
          </span>
        </div>
        <Button
          onClick={onUnlock}
          variant={emphasised ? "primary" : "secondary"}
          size="md"
          className="self-stretch sm:self-auto"
        >
          Unlock {formatMoney(idea.unlock_price_cents)}
        </Button>
      </footer>
    </article>
  );
}
