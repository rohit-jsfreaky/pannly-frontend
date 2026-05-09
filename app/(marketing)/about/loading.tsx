import { SkeletonBlock } from "@/components/ui/skeleton-block";

/** /about loading skeleton — centred founder note. */
export default function AboutLoading() {
  return (
    <div className="px-6 md:px-12 w-full py-16 md:py-24">
      <header className="mx-auto mb-24 max-w-2xl text-center">
        <SkeletonBlock className="mx-auto mb-4 h-3 w-12" />
        <SkeletonBlock className="mx-auto h-12 w-3/4" />
      </header>
      <div className="mx-auto max-w-2xl">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <SkeletonBlock key={i} className="mb-3 h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
