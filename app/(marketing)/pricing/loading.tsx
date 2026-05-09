import { SkeletonBlock } from "@/components/ui/skeleton-block";

/**
 * /pricing loading skeleton — hero + 3 plan cards + feature matrix.
 */
export default function PricingLoading() {
  return (
    <div className="bg-cream-100">
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-24 text-center">
        <SkeletonBlock className="mx-auto mb-4 h-3 w-16" />
        <SkeletonBlock className="mx-auto mb-6 h-12 w-1/2 max-w-xl" />
        <SkeletonBlock className="mx-auto h-5 w-1/2 max-w-md" />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-6 rounded-xl border border-cream-300 bg-cream-50 p-8"
            >
              <SkeletonBlock className="h-7 w-24" />
              <SkeletonBlock className="h-12 w-32" />
              <SkeletonBlock className="h-4 w-48" />
              <div className="flex flex-col gap-3 pt-4">
                {[0, 1, 2, 3].map((j) => (
                  <SkeletonBlock key={j} className="h-4 w-full" />
                ))}
              </div>
              <SkeletonBlock className="mt-4 h-12 rounded-md" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
