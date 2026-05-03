"use client";

/**
 * Route-level error boundary.
 *
 * Catches anything thrown during render of a Server Component, a Client
 * Component, or a data-fetch inside the (marketing) / (app) / (auth) groups.
 * Without this file, Next renders an unstyled fallback that looks like
 * raw HTML — bad for paying customers.
 *
 * `global-error.tsx` is the *outer* fallback that catches errors thrown
 * inside the root layout itself. This one assumes the layout still works.
 */
import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RouteError({ error, reset }: Props) {
  useEffect(() => {
    // When error reporting (Sentry) is wired up, replace this with the SDK call.
    // The `digest` is Next's stable error id — use it to grep server logs.
    console.error("[route-error]", error.digest ?? "no-digest", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-400">
        Something broke
      </p>
      <h1 className="font-display text-4xl tracking-tight text-ink-700 md:text-5xl">
        We hit an unexpected error.
      </h1>
      <p className="max-w-md text-base leading-relaxed text-ink-50">
        It's on us — the team has been notified. You can try the action again,
        or head back to the feed.
      </p>
      {error.digest ? (
        <p className="font-mono text-xs text-cream-400">
          Reference · {error.digest}
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} size="lg" className="rounded-xl">
          Try again
        </Button>
        <Link
          href="/feed"
          className="inline-flex items-center justify-center rounded-xl border border-cream-300 bg-cream-50 px-5 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-cream-200"
        >
          Back to the feed
        </Link>
      </div>
    </div>
  );
}
