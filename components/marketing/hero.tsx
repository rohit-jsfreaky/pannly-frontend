import Link from "next/link";
import { ArrowDown } from "lucide-react";

import { StatsPill } from "@/components/marketing/stats-pill";

export function Hero() {
  return (
    <section className="px-6 md:px-12 flex flex-col items-center py-24 text-center md:py-32">
      <StatsPill />

      <h1 className="mt-8 max-w-4xl font-display text-4xl font-medium tracking-tight text-ink-700 md:text-5xl">
        Find an idea worth building. Get{" "}
        <em className="italic text-plum-500">refunded</em> if you actually ship.
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-ink-50/80">
        A curated archive of high-signal software ideas sourced from real business
        pain points. Unlock a brief, build the solution, and we return your pledge.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="#feed"
          className="inline-flex items-center gap-2 rounded-xl bg-moss-600 px-6 py-3 text-base text-cream-50 transition-opacity hover:opacity-90"
        >
          Browse the feed
          <ArrowDown className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </Link>
        <Link
          href="/how-it-works"
          className="rounded-xl border border-transparent px-6 py-3 text-base text-ink-50/80 transition-all hover:border-cream-300"
        >
          How it works
        </Link>
      </div>
    </section>
  );
}
