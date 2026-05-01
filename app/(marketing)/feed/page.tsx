import type { Metadata } from "next";
import { Suspense } from "react";

import { FeedView } from "@/components/feed/feed-view";

export const metadata: Metadata = {
  title: "Feed",
  description:
    "Pain points from real builders, scored, briefed, and ready to unlock for $3.",
};

/**
 * /feed — public, browsable by anyone. Auth gating is per-action: clicking
 * "Unlock $3" while logged out pushes to /login?next=/ideas/{slug}.
 *
 * The route is wrapped in <Suspense> because <FeedView> reads search params
 * via useSearchParams(), which Next.js requires to live under a Suspense
 * boundary on the App Router.
 */
export default function FeedPage() {
  return (
    <Suspense fallback={null}>
      <FeedView />
    </Suspense>
  );
}
