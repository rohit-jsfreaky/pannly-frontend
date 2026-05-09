import { SkeletonBlock } from "@/components/ui/skeleton-block";

/** /privacy + /terms shape — long doc skeleton. Same shape used by /terms loading. */
export default function LegalLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-12">
      <SkeletonBlock className="mb-4 h-3 w-32" />
      <SkeletonBlock className="mb-12 h-12 w-2/3" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="mb-10">
          <SkeletonBlock className="mb-4 h-7 w-1/2" />
          {[0, 1, 2].map((j) => (
            <SkeletonBlock key={j} className="mb-2 h-4 w-full" />
          ))}
          <SkeletonBlock className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
