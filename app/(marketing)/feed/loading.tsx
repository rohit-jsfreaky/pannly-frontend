import { SkeletonBlock } from "@/components/ui/skeleton-block";

/**
 * /feed loading skeleton. Mirrors the FeedView layout: hero, filter bar,
 * sidebar of popular tags, and 3 idea-card placeholders.
 *
 * Even though /feed now SSRs the first page (we did this in the SEO sweep),
 * dynamic search-param URLs (e.g. /feed?topic=devtools) still need this
 * boundary to be prefetchable in Next.js 16.
 */
export default function FeedLoading() {
  return (
    <div className="flex flex-col gap-12 px-6 pb-16 pt-12 md:px-12">
      {/* Hero */}
      <div>
        <SkeletonBlock className="mb-3 h-12 w-40" />
        <SkeletonBlock className="mb-4 h-5 w-96 max-w-full" />
        <SkeletonBlock className="h-3 w-32" />
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <SkeletonBlock key={i} className="h-8 w-24 rounded-md" />
          ))}
        </div>
        <SkeletonBlock className="h-8 w-40 rounded-md" />
      </div>

      {/* Sidebar + cards */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Sidebar */}
        <div className="lg:w-48">
          <SkeletonBlock className="mb-4 h-3 w-24" />
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <SkeletonBlock key={i} className="h-4 w-32" />
            ))}
          </div>
        </div>

        {/* Card list */}
        <div className="flex flex-grow flex-col gap-6">
          {[0, 1, 2].map((i) => (
            <article
              key={i}
              className="flex flex-col gap-4 rounded-xl border border-cream-300 bg-cream-50 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-2">
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
      </div>
    </div>
  );
}
