"use client";

import { ArrowLeft } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface Props {
  /**
   * Where to go when there's no in-app history (cold load via shared link,
   * direct URL paste, opening in new tab). Should be the closest sensible
   * "parent" page — usually `/feed` for idea pages, `/unlocks` for unlock
   * detail pages, etc.
   */
  fallbackHref: Route;
  /** Visible label. Default "Back". */
  label?: string;
  className?: string;
}

/**
 * History-aware back arrow. Calls `router.back()` so the user lands on
 * whatever page they came from (could be `/feed`, `/unlocks`, search results,
 * a related-rail click, etc.) instead of always defaulting to the feed.
 *
 * For cold loads where browser history is empty / cross-origin, falls back
 * to `fallbackHref`.
 */
export function BackLink({
  fallbackHref,
  label = "Back",
  className,
}: Props) {
  const router = useRouter();

  const onClick = () => {
    // window.history.length > 1 means there's at least one prior entry in
    // *this* tab — back() will land on a real prior page. When 1, we landed
    // here cold (new tab / direct URL) and back() would no-op or leave the
    // app, so we navigate to the fallback instead.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      // min-h-11 = 44px tap target. The text-only link was rendering at 18px
      // tall and failing WCAG 2.5.5. Negative margin keeps the visual hit
      // under the same baseline so the layout doesn't shift.
      className={
        className ??
        "-ml-3 inline-flex min-h-11 items-center gap-2 rounded px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-cream-400 transition-colors hover:text-ink-500"
      }
    >
      <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
      {label}
    </button>
  );
}
