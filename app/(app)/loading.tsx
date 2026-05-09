import { SkeletonBlock } from "@/components/ui/skeleton-block";

/**
 * Default app-section loading skeleton (catches /billing, /settings, etc.
 * that don't define their own). Hero + 3 cards.
 */
export default function AppLoading() {
  return (
    <div className="mx-auto flex w-full flex-col gap-12 px-6 pt-12 pb-24 md:px-12">
      <header className="space-y-3">
        <SkeletonBlock className="h-12 w-48" />
        <SkeletonBlock className="h-5 w-96 max-w-full" />
      </header>
      <div className="flex flex-col gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-cream-300 bg-cream-50 p-8">
            <div className="mb-4 flex items-center justify-between">
              <SkeletonBlock className="h-5 w-32" />
              <SkeletonBlock className="h-7 w-20 rounded-full" />
            </div>
            <SkeletonBlock className="mb-3 h-7 w-3/4" />
            <SkeletonBlock className="mb-2 h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
