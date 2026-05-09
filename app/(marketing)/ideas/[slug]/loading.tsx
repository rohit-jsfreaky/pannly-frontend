import { SkeletonBlock } from "@/components/ui/skeleton-block";

/**
 * /ideas/[slug] loading skeleton. Most-clicked dynamic route on the site
 * (every feed card → /ideas/{slug}). Without this loading boundary, those
 * Links can't be prefetched in N16 and clicks feel like a server round-trip.
 *
 * Mirrors the LockedView shape since the locked variant is what most
 * Product Hunt visitors will see.
 */
export default function IdeaDetailLoading() {
  return (
    <div className="bg-cream-100">
      <main className="mx-auto max-w-[1100px] px-6 pb-24 pt-10">
        {/* Back link */}
        <SkeletonBlock className="mb-8 h-4 w-16" />

        <article className="mx-auto max-w-3xl">
          {/* Header */}
          <header className="mb-12">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex gap-2">
                <SkeletonBlock className="h-5 w-16" />
                <SkeletonBlock className="h-5 w-16" />
                <SkeletonBlock className="h-5 w-16" />
              </div>
              <SkeletonBlock className="h-7 w-14 rounded-full" />
            </div>

            <SkeletonBlock className="mb-3 h-12 w-full" />
            <SkeletonBlock className="mb-8 h-12 w-3/4" />

            <SkeletonBlock className="mb-3 h-5 w-full max-w-2xl" />
            <SkeletonBlock className="mb-8 h-5 w-4/5 max-w-2xl" />

            {/* Counters strip */}
            <div className="mb-3 flex gap-4">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-4 w-24" />
            </div>
            <SkeletonBlock className="mb-8 h-4 w-72" />

            {/* CTA */}
            <SkeletonBlock className="h-12 w-44 rounded-md" />
            <SkeletonBlock className="mt-3 h-3 w-64" />
          </header>

          {/* Pain teaser */}
          <section className="mb-12">
            <SkeletonBlock className="mb-4 h-7 w-32" />
            <SkeletonBlock className="mb-2 h-4 w-full" />
            <SkeletonBlock className="mb-2 h-4 w-full" />
            <SkeletonBlock className="h-4 w-3/4" />
          </section>

          {/* Unlock panel */}
          <section className="rounded-2xl border border-cream-300 bg-cream-50 p-8 md:p-12">
            <div className="mb-6 flex items-start gap-3">
              <SkeletonBlock className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <SkeletonBlock className="mb-2 h-7 w-64" />
                <SkeletonBlock className="h-4 w-full max-w-md" />
              </div>
            </div>

            <SkeletonBlock className="mb-6 h-12 w-full rounded-lg" />

            <div className="mb-8 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <SkeletonBlock className="mt-0.5 h-5 w-5 shrink-0 rounded-full" />
                  <SkeletonBlock className="h-5 w-2/3" />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <SkeletonBlock className="h-12 flex-1 rounded-md" />
              <SkeletonBlock className="h-12 flex-1 rounded-md" />
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
