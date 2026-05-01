"use client";

import type { Route } from "next";
import { CheckCircle2, Hourglass, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/api-client";
import { getMyUnlock, type UnlockStateResponse } from "@/lib/api/me";
import { invalidateUnlockedSlugs } from "@/lib/hooks/use-unlocked-slugs";

const POLL_INTERVAL_MS = 1500;
const MAX_WAIT_MS = 45_000; // backend webhook usually fires within 5s; we wait up to ~45s

type Phase = "waiting" | "ready" | "timeout" | "error";

export default function UnlockSuccessPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const [phase, setPhase] = useState<Phase>("waiting");
  const [unlock, setUnlock] = useState<UnlockStateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef<number>(Date.now());

  // Poll loop. Cancels on unmount or phase change.
  useEffect(() => {
    if (!id || phase !== "waiting") return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = async () => {
      if (cancelled) return;
      try {
        const data = await getMyUnlock(id);
        if (cancelled) return;
        setUnlock(data);
        if (data.state !== "pending") {
          setPhase("ready");
          return;
        }
        if (Date.now() - startedAt.current > MAX_WAIT_MS) {
          setPhase("timeout");
          return;
        }
        timer = setTimeout(tick, POLL_INTERVAL_MS);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError("We couldn't find that unlock. It may have been removed.");
        } else if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Couldn't reach the server. Refresh and try again.");
        }
        setPhase("error");
      }
    };

    void tick();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id, phase]);

  // Auto-redirect on success after a brief celebration. Skip on failed/rejected
  // states — the user needs to read the error and decide what to do.
  useEffect(() => {
    if (phase !== "ready" || !unlock) return;
    if (unlock.state === "rejected" || unlock.state === "failed") return;
    // The user just unlocked something — drop the cached slug set so the
    // /feed cards flip from "Unlock $X" to "Unlocked" on next visit.
    invalidateUnlockedSlugs();
    const t = setTimeout(() => {
      router.replace(`/ideas/${unlock.idea_slug}` as Route);
    }, 1500);
    return () => clearTimeout(t);
  }, [phase, unlock, router]);

  const isFailed = unlock?.state === "failed" || unlock?.state === "rejected";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream-100 px-6 py-16">
      <div className="w-full max-w-md rounded-xl border border-cream-300 bg-cream-50 p-10 text-center shadow-soft">
        {phase === "waiting" ? (
          <>
            <Spinner className="mx-auto mb-6 h-8 w-8 text-moss-600" />
            <h1 className="mb-2 font-display text-2xl text-ink-700">Confirming your unlock…</h1>
            <p className="text-sm text-ink-50">
              We're waiting on confirmation from Dodo. This usually takes a few seconds.
            </p>
          </>
        ) : phase === "ready" && !isFailed ? (
          <>
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-moss-100">
              <CheckCircle2 className="h-6 w-6 text-moss-600" strokeWidth={2} aria-hidden />
            </div>
            <h1 className="mb-2 font-display text-2xl text-ink-700">Unlocked.</h1>
            <p className="text-sm text-ink-50">
              Redirecting you to the brief…
            </p>
          </>
        ) : phase === "ready" && isFailed ? (
          <>
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
              <XCircle className="h-6 w-6 text-error" strokeWidth={2} aria-hidden />
            </div>
            <h1 className="mb-2 font-display text-2xl text-ink-700">
              {unlock?.state === "failed" ? "Payment failed." : "Payment declined."}
            </h1>
            <p className="mb-6 text-sm text-ink-50">
              {unlock?.error_message ??
                "Your card was declined or the transaction couldn't go through. No money was taken — try again?"}
            </p>
            <div className="flex flex-col gap-2">
              {unlock?.idea_slug ? (
                <Button
                  onClick={() => router.replace(`/ideas/${unlock.idea_slug}` as Route)}
                >
                  Try again
                </Button>
              ) : null}
              <Button variant="ghost" onClick={() => router.replace("/feed" as Route)}>
                Back to feed
              </Button>
            </div>
          </>
        ) : phase === "timeout" ? (
          <>
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-cream-200">
              <Hourglass className="h-6 w-6 text-cream-400" strokeWidth={2} aria-hidden />
            </div>
            <h1 className="mb-2 font-display text-2xl text-ink-700">Still waiting…</h1>
            <p className="mb-6 text-sm text-ink-50">
              Dodo is taking longer than usual to confirm. Your payment will still go through —
              check back in a minute or visit your dashboard.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.replace("/unlocks" as Route)}>Go to dashboard</Button>
              <Button
                variant="ghost"
                onClick={() => {
                  startedAt.current = Date.now();
                  setPhase("waiting");
                }}
              >
                Keep waiting
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
              <XCircle className="h-6 w-6 text-error" strokeWidth={2} aria-hidden />
            </div>
            <h1 className="mb-2 font-display text-2xl text-ink-700">Something went wrong.</h1>
            <p className="mb-6 text-sm text-ink-50">{error ?? "Please try again."}</p>
            <Button onClick={() => router.replace("/feed" as Route)}>Back to feed</Button>
          </>
        )}
      </div>
    </div>
  );
}
