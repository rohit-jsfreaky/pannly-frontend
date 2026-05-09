import { SkeletonBlock } from "@/components/ui/skeleton-block";

/**
 * /built loading skeleton — gallery hero + filter bar + grid of build cards.
 * Without this loading boundary, the gallery's dynamic search-param routes
 * (?category=, ?sort=, ?page=) can't be prefetched in N16.
 */
export default function BuiltLoading() {
  return (
    <div className="mx-auto flex w-full flex-col gap-12 px-6 pt-16 pb-24 md:px-12">
      {/* Hero */}
      <div className="text-center">
        <SkeletonBlock className="mx-auto mb-4 h-12 w-2/3 max-w-2xl" />
        <SkeletonBlock className="mx-auto h-5 w-1/2 max-w-md" />
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-8 w-20 rounded-md" />
          ))}
        </div>
        <SkeletonBlock className="h-8 w-28 rounded-md" />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <article
            key={i}
            className="flex flex-col overflow-hidden rounded-xl border border-cream-300 bg-cream-50"
          >
            <SkeletonBlock className="aspect-video w-full rounded-none" />
            <div className="flex flex-col gap-3 p-6">
              <SkeletonBlock className="h-6 w-3/4" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-2/3" />
              <div className="mt-4 flex items-center justify-between border-t border-cream-300 pt-4">
                <SkeletonBlock className="h-5 w-24" />
                <SkeletonBlock className="h-5 w-16" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
