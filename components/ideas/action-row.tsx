"use client";

import { Download, Hammer, Send } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { markUnlockBuilding } from "@/lib/api/ideas";
import { env } from "@/lib/env";

interface Props {
  unlockId: string;
  state: string;
}

/**
 * Bottom of the unlocked header: "I'm building this" / "Submit a build" /
 * "Download brief PDF". The PDF link is a plain anchor — the browser carries
 * the auth cookie automatically. The Submit link is a Next <Link>, so the
 * router prefetches the form on hover.
 */
export function ActionRow({ unlockId, state }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canMarkBuilding = state === "unlocked";
  const canSubmitBuild = state === "unlocked" || state === "building";
  const pdfUrl = `${env.apiBaseUrl}/v1/me/unlocks/${encodeURIComponent(unlockId)}/pdf`;
  const submitHref = `/unlocks/${encodeURIComponent(unlockId)}/submit` as Route;

  const onMarkBuilding = async () => {
    if (!canMarkBuilding || busy) return;
    setBusy(true);
    setError(null);
    try {
      await markUnlockBuilding(unlockId);
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't update state.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {canMarkBuilding ? (
        <Button onClick={onMarkBuilding} loading={busy || isPending} size="lg">
          <Hammer className="h-4 w-4" strokeWidth={2} aria-hidden />
          I'm building this
        </Button>
      ) : null}
      {canSubmitBuild ? (
        <Link
          href={submitHref}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-moss-600 px-6 py-3 text-base font-medium text-cream-50 transition-opacity hover:opacity-90"
        >
          <Send className="h-4 w-4" strokeWidth={2} aria-hidden />
          Submit a build
        </Link>
      ) : null}
      <a
        href={pdfUrl}
        download
        className="inline-flex items-center justify-center gap-2 rounded-md border border-cream-300 bg-cream-50 px-5 py-2.5 text-base font-medium text-ink-500 transition-colors hover:bg-cream-200"
      >
        <Download className="h-4 w-4" strokeWidth={2} aria-hidden />
        Download brief PDF
      </a>
      {error ? (
        <span role="alert" className="self-center text-sm text-error">
          {error}
        </span>
      ) : null}
    </div>
  );
}
