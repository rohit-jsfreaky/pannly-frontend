import { SkeletonBlock } from "@/components/ui/skeleton-block";

/**
 * Marketing-section loading boundary. Catches every (marketing)/* route
 * that doesn't define its own loading.tsx.
 *
 * Why this matters: Next.js 16's `<Link prefetch="auto">` only prefetches
 * dynamic routes DOWN TO THE NEAREST loading boundary. Without this file,
 * dynamic marketing routes are not prefetched at all and clicks feel like
 * a full server round-trip. With this file, the skeleton is in the browser
 * before the user clicks, and the real page streams in afterwards.
 *
 * Generic shape: hero-style header + card grid. Specific routes (idea
 * detail, feed, refunds, built) override this with their own loading.tsx
 * for a closer-to-real skeleton.
 */
export default function MarketingLoading() {
  return (
    <div className="bg-cream-100">
      <main className="mx-auto max-w-[1200px] px-6 pb-24 pt-16 md:px-12 md:pt-20">
        {/* Hero band */}
        <div className="mb-16 max-w-3xl">
          <SkeletonBlock className="mb-6 h-3 w-48" />
          <SkeletonBlock className="mb-5 h-12 w-full max-w-2xl" />
          <SkeletonBlock className="mb-5 h-12 w-3/4" />
          <SkeletonBlock className="mb-8 h-5 w-full max-w-xl" />
          <SkeletonBlock className="mb-3 h-5 w-5/6 max-w-xl" />
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-xl border border-cream-300 bg-cream-50 p-8"
            >
              <SkeletonBlock className="h-4 w-16" />
              <SkeletonBlock className="h-8 w-3/4" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-5/6" />
              <SkeletonBlock className="mt-4 h-10 w-32 rounded-md" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
