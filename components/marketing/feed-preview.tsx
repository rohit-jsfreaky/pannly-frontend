import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { apiGet } from "@/lib/api-client";
import {
  LandingIdeaCard,
  type LandingIdeaCardProps,
} from "@/components/marketing/landing-idea-card";

interface FeedItem extends LandingIdeaCardProps {
  unlock_count: number;
  building_count: number;
  shipped_count: number;
}

interface FeedResponse {
  items: FeedItem[];
  next_cursor: string | null;
}

async function fetchFeedPreview(): Promise<FeedItem[]> {
  try {
    const data = await apiGet<FeedResponse>("/v1/feed", {
      query: { limit: 3 },
      next: { revalidate: 60 },
    });
    return data.items;
  } catch {
    return [];
  }
}

export async function FeedPreview() {
  const items = await fetchFeedPreview();

  return (
    <section id="feed" className="px-6 md:px-12 py-24">
      <div className="mb-12 flex items-end justify-between gap-6">
        <div>
          <h2 className="font-display text-3xl text-ink-700 md:text-[2rem]">
            Live from the feed
          </h2>
          <p className="mt-2 text-base text-ink-50/80">
            Recently documented problems waiting to be solved.
          </p>
        </div>
        <Link
          href="/feed"
          className="inline-flex shrink-0 items-center gap-1 text-sm text-moss-500 transition-colors hover:text-plum-500"
        >
          View all
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item) => (
            <LandingIdeaCard key={item.slug} {...item} />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-cream-300 bg-cream-50 p-12 text-center">
      <p className="text-base text-ink-50/80">
        The feed is loading or empty. Run{" "}
        <code className="rounded bg-cream-200 px-1.5 py-0.5 font-mono text-sm text-ink-700">
          uv run python seed.py
        </code>{" "}
        in <code>backend/</code> to populate fixture ideas.
      </p>
    </div>
  );
}
