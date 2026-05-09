import { SkeletonBlock } from "@/components/ui/skeleton-block";

/** /unlocks dashboard skeleton — hero, stats strip, tabs, 3 unlock cards. */
export default function UnlocksLoading() {
  return (
    <div className="mx-auto flex w-full flex-col gap-12 px-6 pt-12 pb-24 md:px-12">
      <header className="space-y-3">
        <SkeletonBlock className="h-12 w-48" />
        <SkeletonBlock className="h-5 w-80 max-w-full" />
        <div className="pt-4 flex flex-wrap gap-3">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-8 w-32 rounded-md" />
          ))}
        </div>
      </header>

      <div>
        <div className="mb-6 flex gap-6 border-b border-cream-300 pb-2">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-5 w-20" />
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-cream-300 bg-cream-50 p-8">
              <div className="mb-4 flex items-center justify-between">
                <SkeletonBlock className="h-5 w-32" />
                <SkeletonBlock className="h-7 w-24 rounded-full" />
              </div>
              <SkeletonBlock className="mb-3 h-7 w-3/4" />
              <SkeletonBlock className="mb-6 h-4 w-full" />
              <div className="flex items-center justify-between border-t border-cream-300 pt-4">
                <SkeletonBlock className="h-10 w-40" />
                <SkeletonBlock className="h-10 w-32 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
