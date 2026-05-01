"use client";

import { Skeleton } from "boneyard-js/react";

import { IdeaCard } from "@/components/feed/idea-card";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import type { FeedIdea } from "@/lib/api/feed";

interface Props {
  items: FeedIdea[];
  loading: boolean;
  error: string | null;
}

/**
 * The card list. Shows boneyard skeletons on the first load (with a
 * Tailwind fallback shimmer until `npx boneyard-js build` captures bones).
 * On filter changes we keep the previous list rendered while the next one
 * loads — no flicker.
 */
export function FeedList({ items, loading, error }: Props) {
  // First load — no items yet.
  const showSkeleton = loading && items.length === 0;

  if (error && !loading) {
    return (
      <div
        role="alert"
        className="rounded-md border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
      >
        {error}
      </div>
    );
  }

  if (!showSkeleton && items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-cream-300 bg-cream-50 px-6 py-12 text-center">
        <p className="font-display text-2xl text-ink-700">Nothing here yet.</p>
        <p className="mt-2 text-sm text-ink-50">Try clearing a filter or picking a different sort.</p>
      </div>
    );
  }

  return (
    <Skeleton
      name="feed-list"
      loading={showSkeleton}
      fallback={<FeedListFallback />}
    >
      <div className="flex flex-col gap-6">
        {items.map((idea, i) => (
          <IdeaCard key={idea.slug} idea={idea} emphasised={i === 0} />
        ))}
      </div>
    </Skeleton>
  );
}

/** Tailwind fallback shimmer — mirrors three idea cards. */
function FeedListFallback() {
  return (
    <div className="flex flex-col gap-6">
      {[0, 1, 2].map((i) => (
        <article
          key={i}
          className="flex flex-col gap-4 rounded-xl border border-cream-300 bg-cream-50 p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-1.5">
              <SkeletonBlock className="h-5 w-16" />
              <SkeletonBlock className="h-5 w-12" />
            </div>
            <SkeletonBlock className="h-7 w-14 rounded-full" />
          </div>
          <SkeletonBlock className="h-7 w-3/4" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-5/6" />
          <div className="flex items-center justify-between border-t border-cream-300 pt-4">
            <div className="flex gap-4">
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-4 w-20" />
            </div>
            <SkeletonBlock className="h-9 w-24 rounded-md" />
          </div>
        </article>
      ))}
    </div>
  );
}
