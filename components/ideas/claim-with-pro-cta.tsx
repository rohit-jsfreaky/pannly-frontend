"use client";

import { Crown, Hammer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { claimIdeaWithPro, markUnlockBuilding } from "@/lib/api/ideas";
import { invalidateUnlockedSlugs } from "@/lib/hooks/use-unlocked-slugs";

interface Props {
  slug: string;
}

/**
 * Shown to Pro / Lifetime users who haven't yet claimed THIS idea. The button
 * labelled "I'm building this" chains TWO API calls in one click:
 *   1. claim   — creates the unlock row (state="unlocked")
 *   2. mark-building — flips state to "building"
 *
 * Why combine: the button text is a commitment statement. If we only claimed,
 * the user lands on the same page and sees "I'm building this" AGAIN on the
 * action row, which is confusing — they think their click did nothing.
 *
 * The mark-building step is best-effort: if it fails for any reason, the claim
 * still succeeded and the action row will let the user retry the transition.
 */
export function ClaimWithProCta({ slug }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const onClaim = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const result = await claimIdeaWithPro(slug);
      // Pro user is committing to build — chain straight into mark-building
      // so the next render shows the active building state, not another
      // "I'm building this" button.
      if (result.state === "unlocked") {
        try {
          await markUnlockBuilding(result.unlock_id);
        } catch (mbErr) {
          // Claim succeeded — don't surface this as a fatal error. The user
          // will see the action row's button after refresh and can retry.
          console.warn("claim succeeded but mark-building failed", mbErr);
        }
      }
      // Bust the client-side unlocked-slugs cache so the next render of any
      // feed card sees this slug as owned. Without this, the user navigates
      // back to /feed and the card still says "Unlock $3" until a hard reload.
      invalidateUnlockedSlugs();
      // Refresh server-rendered page so the unlocked-view sees the new
      // unlock_state and re-renders chips + action row.
      startTransition(() => router.refresh());
    } catch (err) {
      setBusy(false);
      setError(err instanceof ApiError ? err.message : "Couldn't claim this idea.");
    }
  };

  return (
    <div className="rounded-xl border-2 border-moss-600/30 bg-moss-100/40 p-6">
      <div className="mb-3 flex items-center gap-2">
        <Crown className="h-5 w-5 text-moss-600" strokeWidth={2} aria-hidden />
        <h3 className="font-display text-lg text-moss-700">Claim this idea with Pro</h3>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-ink-50">
        You have full access via your Pro plan. Claim this idea to start your 30-day build window
        and join the builders working on it.
      </p>
      <Button onClick={onClaim} loading={busy} size="lg">
        <Hammer className="h-4 w-4" strokeWidth={2} aria-hidden />
        I&apos;m building this
      </Button>
      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
