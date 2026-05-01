"use client";

import { Skeleton } from "boneyard-js/react";

import { GalleryCard } from "@/components/gallery/gallery-card";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import type { GalleryBuild } from "@/lib/api/builds";

interface Props {
  items: GalleryBuild[];
  loading: boolean;
  error: string | null;
}

/**
 * 3-up responsive grid. First load shows boneyard skeletons; on filter
 * changes we keep the previous list rendered while the next one loads
 * (no flicker), same as /feed.
 */
export function GalleryList({ items, loading, error }: Props) {
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
        <p className="font-display text-2xl text-ink-700">No builds here yet.</p>
        <p className="mt-2 text-sm text-ink-50">
          Try a different category — or unlock an idea and ship the first one.
        </p>
      </div>
    );
  }

  return (
    <Skeleton name="gallery-list" loading={showSkeleton} fallback={<GalleryListFallback />}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => (
          <GalleryCard key={b.id} build={b} />
        ))}
      </div>
    </Skeleton>
  );
}

function GalleryListFallback() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <article
          key={i}
          className="flex flex-col overflow-hidden rounded-xl border border-cream-300 bg-cream-50"
        >
          <SkeletonBlock className="aspect-square w-full rounded-none" />
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-start justify-between gap-2">
              <SkeletonBlock className="h-6 w-2/3" />
              <SkeletonBlock className="h-5 w-16 rounded-md" />
            </div>
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
            <div className="mt-auto flex items-center justify-between border-t border-cream-300/60 pt-4">
              <div className="flex items-center gap-2">
                <SkeletonBlock className="h-6 w-6 rounded-full" />
                <SkeletonBlock className="h-4 w-20" />
              </div>
              <SkeletonBlock className="h-5 w-24 rounded-md" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
