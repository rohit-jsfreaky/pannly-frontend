"use client";

import type { Route } from "next";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/api-client";
import { getLastCheckout, type LastCheckoutResponse } from "@/lib/api/me";
import { invalidateUnlockedSlugs } from "@/lib/hooks/use-unlocked-slugs";

const POLL_INTERVAL_MS = 1500;
const MAX_WAIT_MS = 30_000;

interface Props {
  /** Fired when status flips to succeeded — parent should re-fetch billing. */
  onSucceeded: () => void;
}

type Phase = "polling" | "succeeded" | "failed" | "timeout";

/**
 * Floating banner shown on /billing when the URL has `?confirming=1` (the
 * return URL we set on Pro/Lifetime checkouts). Polls /v1/me/last-checkout
 * every 1.5s up to 30s. On a `succeeded` flip we ping the parent so it
 * re-fetches billing data; on `failed` we render the inline error with a
 * retry CTA back to /pricing.
 */
export function CheckoutConfirming({ onSucceeded }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("polling");
  const [data, setData] = useState<LastCheckoutResponse | null>(null);
  const startedAt = useRef<number>(Date.now());
  const baselineTime = useRef<string | null>(null);

  useEffect(() => {
    if (phase !== "polling") return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = async () => {
      if (cancelled) return;
      try {
        const latest = await getLastCheckout();
        if (cancelled) return;
        // Pin a baseline so we only react to events created AFTER the user
        // landed on this page. Avoids "succeeded" from a previous payment
        // immediately closing the banner.
        if (baselineTime.current === null) {
          baselineTime.current = latest.created_at;
        }

        const isFresh =
          baselineTime.current === null ||
          latest.created_at > baselineTime.current ||
          // First poll: trust whatever's there if it's recent (last 90s)
          Date.now() - new Date(latest.created_at).getTime() < 90_000;

        setData(latest);

        if (isFresh && latest.status === "succeeded") {
          setPhase("succeeded");
          // The user just gained Pro/Lifetime access — drop the cached
          // unlocked-slugs snapshot so /feed reflects it on next render.
          invalidateUnlockedSlugs();
          onSucceeded();
          return;
        }
        if (isFresh && latest.status === "failed") {
          setPhase("failed");
          return;
        }
        if (Date.now() - startedAt.current > MAX_WAIT_MS) {
          setPhase("timeout");
          return;
        }
        timer = setTimeout(tick, POLL_INTERVAL_MS);
      } catch (err) {
        if (cancelled) return;
        // 404 — no payment history at all yet. Keep polling for a beat;
        // webhook may just be late.
        if (err instanceof ApiError && err.status === 404) {
          if (Date.now() - startedAt.current > MAX_WAIT_MS) {
            setPhase("timeout");
            return;
          }
          timer = setTimeout(tick, POLL_INTERVAL_MS);
          return;
        }
        setPhase("timeout");
      }
    };

    void tick();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [phase, onSucceeded]);

  // Auto-dismiss the success banner after a short celebration.
  useEffect(() => {
    if (phase !== "succeeded") return;
    const t = setTimeout(() => {
      // Drop the ?confirming= param so re-navigating doesn't re-fire the banner.
      router.replace("/billing" as Route);
    }, 2500);
    return () => clearTimeout(t);
  }, [phase, router]);

  return (
    <div
      role="status"
      className="mb-8 flex items-start gap-4 rounded-xl border border-cream-300 bg-cream-50 p-6 shadow-soft"
    >
      {phase === "polling" ? (
        <>
          <Spinner className="mt-0.5 h-5 w-5 text-moss-600" />
          <div className="flex-1">
            <h3 className="font-display text-lg text-ink-700">Confirming your subscription…</h3>
            <p className="text-sm text-ink-50">
              Waiting for Dodo to confirm — this usually takes a few seconds.
            </p>
          </div>
        </>
      ) : phase === "succeeded" ? (
        <>
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-moss-100">
            <CheckCircle2 className="h-4 w-4 text-moss-600" strokeWidth={2} aria-hidden />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg text-ink-700">You're in.</h3>
            <p className="text-sm text-ink-50">Subscription confirmed. Refreshing your plan…</p>
          </div>
        </>
      ) : phase === "failed" ? (
        <>
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-error/10">
            <XCircle className="h-4 w-4 text-error" strokeWidth={2} aria-hidden />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg text-ink-700">Payment failed.</h3>
            <p className="mb-3 text-sm text-ink-50">
              {data?.error_message ??
                "Your card was declined or the transaction couldn't go through. No money was taken."}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => router.replace("/pricing" as Route)}>
                Try again
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => router.replace("/billing" as Route)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-cream-200">
            <Spinner className="h-4 w-4 text-cream-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg text-ink-700">Still confirming…</h3>
            <p className="mb-3 text-sm text-ink-50">
              Dodo is taking longer than usual. Your payment will still go through — refresh in a
              minute, or check Dodo's customer portal.
            </p>
            <Button size="sm" variant="ghost" onClick={() => router.replace("/billing" as Route)}>
              Dismiss
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
