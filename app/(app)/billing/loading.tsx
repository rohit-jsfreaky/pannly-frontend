import { SkeletonBlock } from "@/components/ui/skeleton-block";

/** /billing skeleton — current plan card + payment method + invoice table. */
export default function BillingLoading() {
  return (
    <div className="mx-auto flex w-full flex-col gap-10 px-6 pt-12 pb-24 md:px-12">
      <SkeletonBlock className="h-10 w-48" />

      {/* Current plan */}
      <div className="rounded-xl border border-cream-300 bg-cream-50 p-8">
        <SkeletonBlock className="mb-3 h-3 w-24" />
        <SkeletonBlock className="mb-3 h-8 w-32" />
        <SkeletonBlock className="mb-3 h-4 w-40" />
        <SkeletonBlock className="h-4 w-48" />
        <SkeletonBlock className="mt-6 h-12 w-56 rounded-md" />
      </div>

      {/* Invoice table */}
      <div>
        <SkeletonBlock className="mb-4 h-7 w-40" />
        <div className="rounded-xl border border-cream-300 bg-cream-50 p-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="grid grid-cols-12 items-center gap-4 border-b border-cream-300/60 py-3 last:border-b-0"
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
  );
}
