import { SkeletonBlock } from "@/components/ui/skeleton-block";

/** /contact loading skeleton — title + form + sidebar. */
export default function ContactLoading() {
  return (
    <div className="w-full px-6 py-16 md:px-12 md:py-24">
      <header className="mb-16 max-w-3xl">
        <SkeletonBlock className="mb-4 h-12 w-48" />
        <SkeletonBlock className="h-5 w-96 max-w-full" />
      </header>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        <div className="flex flex-col gap-4 md:col-span-2">
          <SkeletonBlock className="h-12 w-full rounded-md" />
          <SkeletonBlock className="h-12 w-full rounded-md" />
          <SkeletonBlock className="h-32 w-full rounded-md" />
          <SkeletonBlock className="h-12 w-32 rounded-md" />
        </div>
        <aside className="flex flex-col gap-4">
          <SkeletonBlock className="h-32 rounded-lg" />
        </aside>
      </div>
    </div>
  );
}
