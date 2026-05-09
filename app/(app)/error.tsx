"use client";

import { useEffect } from "react";

/**
 * App-segment error boundary. Same purpose as the marketing one — catches
 * thrown errors from any /unlocks, /billing, /settings, /admin route and
 * shows a friendly retry instead of breaking the whole app shell.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error.digest, error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <h1 className="font-display text-2xl text-ink-700 md:text-3xl">
        We hit a snag loading this page.
      </h1>
      <p className="text-base leading-relaxed text-ink-50">
        Your data is safe. Try refreshing — if it keeps happening, the rest
        of the dashboard still works from the nav above.
      </p>
      {error.digest ? (
        <p className="font-mono text-xs uppercase tracking-wider text-cream-400">
          Reference: {error.digest}
        </p>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="rounded-xl bg-moss-600 px-6 py-3 text-sm font-medium text-cream-50 shadow-sm transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <a
          href="/feed"
          className="rounded-xl border border-cream-300 bg-cream-50 px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-cream-200"
        >
          Back to feed
        </a>
      </div>
    </div>
  );
}
