"use client";

import { useEffect } from "react";

/**
 * Marketing-segment error boundary. Catches any thrown error from a
 * Server or Client Component below this layout and replaces it with a
 * friendly fallback so the rest of the chrome (top-nav, footer) keeps
 * working and the user can retry without a hard reload.
 *
 * Without this file, a single thrown error in any marketing page collapses
 * the whole page to Next.js's generic "An error occurred in the Server
 * Components render" message — which is what was hitting Pannly in
 * production.
 */
export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to console + Plausible for visibility. Replace with Sentry
    // when DSN is wired.
    console.error("[marketing-error]", error.digest, error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-ink-700 md:text-4xl">
        Something went wrong on this page.
      </h1>
      <p className="text-base leading-relaxed text-ink-50">
        Refreshing usually fixes it. If it keeps happening, the rest of the
        site is still working — try the navigation above.
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
          href="/"
          className="rounded-xl border border-cream-300 bg-cream-50 px-6 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-cream-200"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
