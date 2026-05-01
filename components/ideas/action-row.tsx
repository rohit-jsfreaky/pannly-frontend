"use client";

import { Download, Hammer } from "lucide-react";
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
 * Bottom of the unlocked header: "I'm building this" primary + "Download
 * brief PDF" secondary. The PDF link is a plain anchor — the browser carries
 * the auth cookie automatically.
 */
export function ActionRow({ unlockId, state }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canMarkBuilding = state === "unlocked";
  const pdfUrl = `${env.apiBaseUrl}/v1/me/unlocks/${encodeURIComponent(unlockId)}/pdf`;

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
    <div className="flex flex-col gap-3 sm:flex-row">
      {canMarkBuilding ? (
        <Button onClick={onMarkBuilding} loading={busy || isPending} size="lg">
          <Hammer className="h-4 w-4" strokeWidth={2} aria-hidden />
          I'm building this
        </Button>
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
