import type { Metadata, Route } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { LockedView } from "@/components/ideas/locked-view";
import { RelatedBriefs } from "@/components/ideas/related-briefs";
import { UnlockedView } from "@/components/ideas/unlocked-view";
import { IdeaPagePrefetcher } from "@/components/marketing/route-prefetcher";
import { BackLink } from "@/components/ui/back-link";
import { ApiError, apiGet } from "@/lib/api-client";
import type { IdeaDetailResponse } from "@/lib/api/ideas";
import {
  buildBreadcrumbSchema,
  buildIdeaSchema,
  schemaJson,
} from "@/lib/seo/schemas";

/**
 * Server-side fetch — forwards the browser's cookies so the backend can
 * decide locked vs unlocked. Failing soft on 404; everything else falls
 * through to the parent error boundary.
 */
async function fetchDetail(slug: string): Promise<IdeaDetailResponse | null> {
  let cookieHeader = "";
  try {
    const c = await cookies();
    cookieHeader = c
      .getAll()
      .map((entry) => `${entry.name}=${entry.value}`)
      .join("; ");
  } catch {
    /* not in a request — fine, anonymous fetch */
  }
  // For ANONYMOUS callers we cache for 5 minutes — the locked variant is
  // identical for every logged-out visitor, and the public counters tolerate
  // 5 min of staleness. For LOGGED-IN callers we still bypass the cache
  // because the response is per-user (unlock state, days remaining, first-
  // mover rank). Without this split, every render hits FastAPI which is
  // wasteful for the marketing surface that gets the most crawler traffic.
  const isAnon = !cookieHeader;
  try {
    return await apiGet<IdeaDetailResponse>(`/v1/ideas/${encodeURIComponent(slug)}`, {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      next: { revalidate: isAnon ? 300 : 0 },
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchDetail(slug).catch(() => null);
  if (!data) return { title: "Idea not found" };
  const canonical = `/ideas/${encodeURIComponent(slug)}`;
  // one_line_pain is intentionally short and meta-safe (full pain is server-
  // capped). It's the right text for description, OG, and Twitter alike.
  const description = data.idea.one_line_pain ?? data.idea.title;
  return {
    title: data.idea.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: data.idea.title,
      description,
      url: canonical,
      type: "article",
      images: [
        { url: "/og-default.png", width: 1200, height: 630, alt: data.idea.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.idea.title,
      description,
      images: ["/og-default.png"],
    },
  };
}

export default async function IdeaDetailPage({ params }: Params) {
  const { slug } = await params;
  const data = await fetchDetail(slug);
  if (!data) notFound();

  // Title can be very long for an SEO-friendly slug — clamp the breadcrumb
  // text so the SERP rich-result line doesn't overflow.
  const breadcrumbTitle =
    data.idea.title.length > 60
      ? `${data.idea.title.slice(0, 57)}…`
      : data.idea.title;
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Feed", path: "/feed" },
    { name: breadcrumbTitle, path: `/ideas/${encodeURIComponent(data.idea.slug)}` },
  ]);

  return (
    <div className="bg-cream-100">
      {/* Per-idea JSON-LD: CreativeWork + Offer. Always emitted regardless of
          locked/unlocked rendering — the brief exists, it's purchasable. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaJson(
            buildIdeaSchema({
              slug: data.idea.slug,
              title: data.idea.title,
              one_line_pain: data.idea.one_line_pain,
              tags: data.idea.tags,
              first_published_at: data.idea.first_published_at,
              unlock_price_cents: data.idea.unlock_price_cents,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(breadcrumbSchema) }}
      />
      {/* Programmatically prefetch /feed (back-button) and the related-idea
          slugs in the sidebar. By the time the user clicks Back or any
          related card, the route is already cached. Renders nothing. */}
      <IdeaPagePrefetcher relatedSlugs={data.related.map((r) => r.slug)} />
      <main className="mx-auto max-w-[1100px] px-6 pb-24 pt-10">
        <div className="mb-8">
          <BackLink fallbackHref={"/feed" as Route} label="Back" />
        </div>

        {data.access === "locked" ? (
          <LockedView data={data} />
        ) : (
          <UnlockedView data={data} />
        )}

        <RelatedBriefs items={data.related} />
      </main>
    </div>
  );
}
