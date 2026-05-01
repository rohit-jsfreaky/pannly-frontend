"use client";

import { Hammer, LockOpen, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { markUnlockBuilding } from "@/lib/api/ideas";
import type { UnlockedState } from "@/lib/api/ideas";
import { cn } from "@/lib/utils";

interface Props {
  state: UnlockedState;
}

/**
 * State chips on the unlocked variant. The middle chip is interactive — when
 * the unlock is in `unlocked` state, clicking flips it to `building`. Once
 * past `building` (submitted/approved/refunded), the chip becomes a static
 * status indicator.
 */
export function StateChips({ state }: Props) {
  const router = useRouter();
  const [optimistic, setOptimistic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  const current = optimistic ?? state.state;
  const isBuilding = current === "building" || current === "submitted" ||
    current === "approved" || current === "refunded";
  const canMarkBuilding = current === "unlocked";

  const onMarkBuilding = async () => {
    if (!canMarkBuilding || busy) return;
    setBusy(true);
    setError(null);
    setOptimistic("building");
    try {
      await markUnlockBuilding(state.unlock_id);
      // Re-fetch the server-rendered idea page so counters propagate.
      startTransition(() => router.refresh());
    } catch (err) {
      setOptimistic(null);
      setError(err instanceof ApiError ? err.message : "Couldn't update state.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Chip icon={<LockOpen className="h-3.5 w-3.5" strokeWidth={2} />} tone="moss">
        Just unlocked
      </Chip>

      {canMarkBuilding ? (
        <button
          type="button"
          onClick={onMarkBuilding}
          disabled={busy}
          aria-busy={busy || undefined}
          className={cn(
            "inline-flex items-center gap-2 rounded-md border border-cream-300 bg-cream-50 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-ink-50 transition-colors hover:bg-cream-200 disabled:opacity-60",
          )}
        >
          <Hammer className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          {busy || isPending ? "Marking…" : "I'm building this"}
        </button>
      ) : (
        <Chip
          icon={<Hammer className="h-3.5 w-3.5" strokeWidth={2} />}
          tone="plum"
          highlighted={isBuilding && current === "building"}
        >
          {current === "building"
            ? "I'm building this"
            : current === "submitted"
              ? "Build submitted"
              : current === "approved"
                ? "Approved"
                : "Refunded"}
        </Chip>
      )}

      <Chip icon={<Timer className="h-3.5 w-3.5" strokeWidth={2} />} tone="neutral">
        <span className="font-mono">
          Day {state.days_elapsed} of {state.build_window_days} to ship.
        </span>
      </Chip>

      {error ? (
        <span role="alert" className="text-xs text-error">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function Chip({
  icon,
  tone,
  highlighted,
  children,
}: {
  icon: React.ReactNode;
  tone: "moss" | "plum" | "neutral";
  highlighted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-wider",
        tone === "moss" && "border-moss-600/20 bg-moss-100 text-moss-700",
        tone === "plum" && !highlighted && "border-cream-300 bg-cream-50 text-plum-500",
        tone === "plum" && highlighted && "border-plum-300 bg-plum-100 text-plum-700",
        tone === "neutral" && "border-cream-300 bg-cream-50 text-cream-400",
      )}
    >
      <span className="opacity-80">{icon}</span>
      {children}
    </span>
  );
}
