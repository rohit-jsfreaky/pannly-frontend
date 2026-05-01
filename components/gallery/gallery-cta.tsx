"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

/**
 * Bottom CTA strip — invites the visitor either into the feed (browse) or
 * into a checkout (commit). Both routes are auth-aware; logged-out users
 * still get the same /feed view.
 */
export function GalleryCta() {
  const router = useRouter();
  return (
    <section className="mx-auto mt-12 w-5xl rounded-xl border border-cream-300/60 bg-cream-200 px-8 py-16 text-center shadow-soft">
      <h2 className="mb-8 font-display text-3xl text-ink-700">Want yours up here?</h2>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          onClick={() => router.push("/feed" as Route)}
          size="lg"
          className="rounded-xl"
        >
          Unlock an idea
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => router.push("/feed" as Route)}
          className="rounded-xl"
        >
          Browse the feed
        </Button>
      </div>
    </section>
  );
}
