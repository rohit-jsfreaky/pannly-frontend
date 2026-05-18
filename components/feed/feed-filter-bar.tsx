"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Select, type SelectOption } from "@/components/ui/select";
import type { FeedSort, FeedTopic } from "@/lib/api/feed";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface Props {
  topics: FeedTopic[];
  /** Slug of the currently-active topic chip, or null = "all". */
  activeTopic: string | null;
  /** Currently-selected sort. */
  sort: FeedSort;
  /** Current search query — controlled from parent so URL stays in sync. */
  q: string | null;
  onTopicChange: (slug: string | null) => void;
  onSortChange: (sort: FeedSort) => void;
  /** Fired with a debounced search value (~400ms). */
  onSearch: (q: string | null) => void;
}

const SORT_OPTIONS: SelectOption<FeedSort>[] = [
  { value: "score", label: "Sort by: Score" },
  { value: "recent", label: "Sort by: Newest" },
  { value: "trending", label: "Sort by: Trending" },
  { value: "building", label: "Sort by: Most building" },
];

/**
 * Sticky filter bar — topic chips on the left, sort + search on the right.
 * Search input is debounced 400ms before reaching the URL/API layer.
 */
export function FeedFilterBar({
  topics,
  activeTopic,
  sort,
  q,
  onTopicChange,
  onSortChange,
  onSearch,
}: Props) {
  // Local-controlled input — the parent only learns about debounced updates.
  const [draft, setDraft] = useState(q ?? "");
  const debounced = useDebounce(draft, 400);

  // Sync URL → local input when the user navigates back/forward.
  useEffect(() => {
    setDraft(q ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // Forward the debounced search up. Only fires when the value actually changes
  // from what the parent already knows about, so we don't infinite-loop.
  useEffect(() => {
    const next = debounced.trim() || null;
    const current = q ?? null;
    if (next !== current) onSearch(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className="sticky top-0 z-30 -mx-6 flex flex-col gap-3 border-b border-cream-300 bg-cream-100/95 px-6 py-3 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between md:-mx-12 md:px-12">
      {/* Topic chips. Each chip is min-h-11 (44px) to meet WCAG 2.5.5 — were
          30px before. Horizontal scroll snap keeps the row navigable when
          there are more chips than fit (no separate "more" affordance needed
          because tablet 768px now scrolls cleanly with momentum on touch). */}
      <div
        className="-mx-1 flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-1 pb-1 [scrollbar-width:thin] sm:w-auto"
        role="tablist"
        aria-label="Filter ideas by topic"
      >
        {topics.map((t) => {
          const isActive =
            (t.slug === "all" && !activeTopic) ||
            (activeTopic && t.slug.toLowerCase() === activeTopic.toLowerCase());
          return (
            <button
              key={t.slug}
              type="button"
              role="tab"
              aria-selected={Boolean(isActive)}
              onClick={() => onTopicChange(t.slug === "all" ? null : t.slug)}
              className={cn(
                "min-h-11 snap-start whitespace-nowrap rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
                isActive
                  ? "border-ink-700 bg-ink-700 text-cream-50"
                  : "border-cream-300 bg-cream-50 text-cream-400 hover:bg-cream-200 hover:text-ink-500",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Sort + search */}
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <Select
          aria-label="Sort feed"
          value={sort}
          onChange={onSortChange}
          options={SORT_OPTIONS}
          className="w-full sm:w-44"
        />

        <div className="relative w-full sm:w-56">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream-400"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Filter…"
            aria-label="Search feed"
            className="w-full rounded-md border border-cream-300 bg-cream-200 py-2 pl-9 pr-3 text-sm text-ink-500 placeholder:text-cream-400 focus:outline-none focus:ring-2 focus:ring-moss-500/40"
          />
        </div>
      </div>
    </div>
  );
}
