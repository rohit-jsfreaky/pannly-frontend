import type { Metadata } from "next";
import { Suspense } from "react";

import { GalleryView } from "@/components/gallery/gallery-view";

export const metadata: Metadata = {
  title: "Build Gallery",
  description:
    "Real builders shipping real products from $3 idea unlocks — every project here got a refund.",
};

/**
 * /built — public Build Gallery. Auth-free; everything renders for anon
 * users. Wrapped in <Suspense> because <GalleryView> reads search params
 * via useSearchParams(), which the App Router requires under a Suspense
 * boundary.
 */
export default function BuildGalleryPage() {
  return (
    <Suspense fallback={null}>
      <GalleryView />
    </Suspense>
  );
}
