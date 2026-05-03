"use client";

import type { Route } from "next";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { startIdeaUnlock } from "@/lib/api/checkout";
import { useAuth } from "@/lib/auth-context";
import { env } from "@/lib/env";
import { formatMoney } from "@/lib/format";

interface Props {
  slug: string;
  unlockPriceCents: number;
  hiddenWordCount: number;
  hiddenSectionCount: number;
}

/**
 * The paywall card on the locked idea-detail variant. Triggers a Dodo
 * checkout via POST /v1/ideas/{slug}/unlock and hard-redirects to the
 * returned URL. Auth-aware — pushes to /login?next=/ideas/{slug} when
 * logged out.
 */
export function UnlockCta({
  slug,
  unlockPriceCents,
  hiddenWordCount,
  hiddenSectionCount,
}: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onUnlock = async () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/ideas/${slug}`)}` as Route);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Pass return / cancel URLs explicitly so the post-checkout flow
      // doesn't silently depend on the backend's defaults.
      //   return_url  — /billing?confirming=1 mirrors the Pro/Lifetime
      //                 flow and reuses the existing CheckoutConfirming
      //                 banner that polls /v1/me/last-checkout. Works for
      //                 every payment kind because it keys off `status`.
      //   cancel_url  — drops the user back on the same idea brief, where
      //                 the locked variant still renders so they can try
      //                 again or click "Get unlimited with Pro" instead.
      const res = await startIdeaUnlock(slug, {
        return_url: `${env.appBaseUrl}/billing?confirming=1`,
        cancel_url: `${env.appBaseUrl}/ideas/${slug}`,
      });
      if (res.checkout_url) {
        window.location.href = res.checkout_url;
      } else {
        setError("Couldn't start checkout. Try again.");
        setLoading(false);
      }
    } catch (err) {
      if (err instanceof ApiError && err.code === "ALREADY_UNLOCKED") {
        // Race: someone (or the user from another tab) already unlocked. Refresh
        // the page so the unlocked variant shows.
        router.refresh();
        return;
      }
      setError(
        err instanceof ApiError ? err.message : "Couldn't start checkout. Try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-cream-300 bg-cream-50 p-8 text-center shadow-soft">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-moss-100">
        <Lock className="h-5 w-5 text-moss-600" strokeWidth={2} aria-hidden />
      </div>
      <h3 className="mb-2 font-display text-2xl text-ink-700">Unlock the rest of this brief.</h3>
      <p className="mx-auto mb-6 max-w-md text-sm text-ink-50">
        Access the full market analysis, buyer profiles, competitor teardowns, and suggested
        pricing models.
      </p>
      <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-cream-300 bg-cream-200 px-3 py-1 font-mono text-xs uppercase tracking-wider text-ink-50">
        <span>{hiddenWordCount.toLocaleString()} words</span>
        <span className="text-cream-400">·</span>
        <span>{hiddenSectionCount} sections hidden</span>
      </p>
      <div className="mx-auto flex max-w-xs flex-col gap-3">
        <Button block size="lg" loading={loading} onClick={onUnlock}>
          Unlock for {formatMoney(unlockPriceCents)}
        </Button>
        <Button
          block
          size="lg"
          variant="secondary"
          onClick={() => router.push("/pricing" as Route)}
        >
          Get unlimited with Pro
        </Button>
      </div>
      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
