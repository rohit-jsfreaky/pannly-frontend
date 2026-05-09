import { SkeletonBlock } from "@/components/ui/skeleton-block";

/**
 * /how-it-works loading skeleton — hero + 6 step rows.
 */
export default function HowItWorksLoading() {
  return (
    <div className="px-6 md:px-12 flex flex-col gap-16 py-12 md:py-16">
      <section className="max-w-4xl pb-8 pt-12">
        <SkeletonBlock className="mb-6 h-12 w-3/4 max-w-2xl" />
        <SkeletonBlock className="mb-3 h-5 w-full max-w-xl" />
        <SkeletonBlock className="h-5 w-2/3 max-w-xl" />
      </section>

      <div className="flex flex-col gap-12 border-t border-cream-300 pt-12">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <SkeletonBlock className="mb-3 h-3 w-12" />
              <SkeletonBlock className="mb-4 h-7 w-full max-w-md" />
              <SkeletonBlock className="mb-2 h-4 w-full" />
              <SkeletonBlock className="h-4 w-3/4" />
            </div>
            <SkeletonBlock className="h-40 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
