import { SkeletonBlock } from "@/components/ui/skeleton-block";

/**
 * /refunds loading skeleton — big $ hero + 2 chips + methodology panel + ledger table.
 */
export default function RefundsLoading() {
  return (
    <div className="mx-auto w-full px-6 py-16 md:px-12 md:py-24">
      {/* Hero */}
      <section className="mb-16">
        <SkeletonBlock className="mb-4 h-16 w-64" />
        <SkeletonBlock className="mb-8 h-8 w-96 max-w-full" />
        <div className="flex gap-3">
          <SkeletonBlock className="h-10 w-48 rounded-lg" />
          <SkeletonBlock className="h-10 w-32 rounded-lg" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Methodology */}
        <aside className="lg:col-span-4 lg:pr-4">
          <SkeletonBlock className="mb-6 h-6 w-40" />
          <div className="flex flex-col gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <SkeletonBlock className="mb-2 h-3 w-24" />
                <SkeletonBlock className="mb-1 h-4 w-full" />
                <SkeletonBlock className="mb-1 h-4 w-full" />
                <SkeletonBlock className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </aside>

        {/* Ledger table */}
        <div className="rounded-xl border border-cream-300 bg-cream-50 p-6 lg:col-span-8">
          <SkeletonBlock className="mb-6 h-3 w-32" />
          <div className="flex flex-col gap-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="grid grid-cols-12 items-center gap-4 border-b border-cream-300/60 pb-4 last:border-b-0"
              >
                <SkeletonBlock className="col-span-3 h-5" />
                <SkeletonBlock className="col-span-5 h-5" />
                <SkeletonBlock className="col-span-2 h-5" />
                <SkeletonBlock className="col-span-2 h-5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
