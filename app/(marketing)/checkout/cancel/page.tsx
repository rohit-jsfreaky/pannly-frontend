"use client";

import type { Route } from "next";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

/**
 * Generic landing page Dodo redirects to when the user cancels checkout.
 * No state to recover — just a soft handoff back to wherever they were.
 */
export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream-100 px-6 py-16">
      <div className="w-full max-w-md rounded-xl border border-cream-300 bg-cream-50 p-10 text-center shadow-soft">
        <h1 className="mb-2 font-display text-3xl text-ink-700">Checkout cancelled.</h1>
        <p className="mb-8 text-sm text-ink-50">
          No charge was made. You can browse more ideas or try the same unlock again whenever
          you're ready.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={() => router.replace("/feed" as Route)}>
            <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
            Back to the feed
          </Button>
          <Button variant="ghost" onClick={() => router.replace("/pricing" as Route)}>
            See pricing
          </Button>
        </div>
      </div>
    </div>
  );
}
