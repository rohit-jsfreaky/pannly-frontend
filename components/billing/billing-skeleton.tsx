import { SkeletonBlock } from "@/components/ui/skeleton-block";

/** Tailwind fallback while boneyard hasn't captured snapshots yet. */
export function BillingSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl border border-cream-300 bg-cream-50 p-8">
        <SkeletonBlock className="mb-4 h-3 w-24" />
        <SkeletonBlock className="mb-2 h-7 w-32" />
        <SkeletonBlock className="mb-2 h-6 w-40" />
        <SkeletonBlock className="h-4 w-56" />
      </div>
      <div>
        <SkeletonBlock className="mb-6 h-7 w-44" />
        <div className="rounded-xl border border-cream-300 bg-cream-50 p-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between border-b border-cream-300/40 py-4 last:border-b-0">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-4 w-32" />
              <SkeletonBlock className="h-4 w-16" />
              <SkeletonBlock className="h-5 w-12 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
