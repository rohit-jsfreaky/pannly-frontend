import { ScoreBadge } from "@/components/feed/score-badge";
import type { IdeaHeader as IdeaHeaderModel } from "@/lib/api/ideas";

interface Props {
  idea: IdeaHeaderModel;
}

/**
 * Tags + title + pain summary + counters. Identical layout for the locked
 * and unlocked variants — the body underneath swaps.
 */
export function IdeaHeader({ idea }: Props) {
  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {idea.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-cream-300 bg-cream-200 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-moss-500"
            >
              {tag}
            </span>
          ))}
        </div>
        <ScoreBadge score={idea.overall_score} kind={idea.score_kind} />
      </div>
      <h1 className="font-display text-4xl text-ink-700 md:text-5xl">{idea.title}</h1>
      {idea.one_line_pain ? (
        <p className="max-w-2xl text-base text-ink-50">{idea.one_line_pain}</p>
      ) : null}
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-y border-cream-300 py-3 font-mono text-sm tabular-nums text-cream-400">
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
    </header>
  );
}
