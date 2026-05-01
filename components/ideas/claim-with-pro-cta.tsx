"use client";

import { Crown, Hammer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { claimIdeaWithPro } from "@/lib/api/ideas";

interface Props {
  slug: string;
}

/**
 * Shown to Pro / Lifetime users who haven't yet claimed THIS idea. One click
 * creates the Unlock row and refreshes the page — after that they see the
 * standard state chips + action row + first-mover bonus + day counter.
 *
 * Renders in place of the StateChips + ActionRow on first view.
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
      await claimIdeaWithPro(slug);
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
        You have full access via your Pro plan. Claim this idea to start your 60-day build window
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
