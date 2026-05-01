"use client";

import { Skeleton } from "boneyard-js/react";

import { SkeletonBlock } from "@/components/ui/skeleton-block";
import type { PopularTag } from "@/lib/api/feed";
import { cn } from "@/lib/utils";

interface Props {
  tags: PopularTag[] | null;
  /** Currently-active tag slug — passed through `?tags=` filter. */
  activeTags: string[];
  onToggle: (tag: string) => void;
  loading: boolean;
}

/**
 * Left rail. When `loading`, defers to boneyard's <Skeleton> with a Tailwind
 * fallback so we still get a sensible shimmer pre-CLI-build.
 */
export function FeedPopularTags({ tags, activeTags, onToggle, loading }: Props) {
  return (
    <aside className="hidden w-[200px] flex-shrink-0 lg:block">
      <div className="sticky top-32">
        <h3 className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-cream-400">
          Popular Tags
        </h3>
        <Skeleton
          name="popular-tags"
          loading={loading || tags === null}
          fallback={<PopularTagsFallback />}
        >
          <ul className="flex flex-col gap-1">
            {(tags ?? []).map((t) => {
              const active = activeTags.includes(t.name);
              return (
                <li key={t.name}>
                  <button
                    type="button"
                    onClick={() => onToggle(t.name)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                      active
                        ? "bg-cream-200 text-ink-700"
                        : "text-ink-50 hover:bg-cream-200 hover:text-ink-500",
                    )}
                  >
                    <span>{t.name}</span>
                    <span className="font-mono text-xs tabular-nums text-cream-400">
                      {t.count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Skeleton>
      </div>
    </aside>
  );
}

function PopularTagsFallback() {
  return (
    <ul className="flex flex-col gap-1">
      {[60, 50, 70, 45, 55].map((width, i) => (
        <li key={i} className="flex items-center justify-between px-2 py-1.5">
          <SkeletonBlock className="h-4" style={{ width: `${width}%` }} />
          <SkeletonBlock className="h-3 w-6" />
        </li>
      ))}
    </ul>
  );
}
