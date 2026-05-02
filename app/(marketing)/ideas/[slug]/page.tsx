import type { Metadata, Route } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { LockedView } from "@/components/ideas/locked-view";
import { RelatedBriefs } from "@/components/ideas/related-briefs";
import { UnlockedView } from "@/components/ideas/unlocked-view";
import { BackLink } from "@/components/ui/back-link";
import { ApiError, apiGet } from "@/lib/api-client";
import type { IdeaDetailResponse } from "@/lib/api/ideas";
import { buildIdeaSchema, schemaJson } from "@/lib/seo/schemas";

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
  try {
    return await apiGet<IdeaDetailResponse>(`/v1/ideas/${encodeURIComponent(slug)}`, {
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      next: { revalidate: 0 },
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
  return {
    title: data.idea.title,
    description: data.idea.one_line_pain ?? undefined,
    alternates: { canonical },
    openGraph: {
      title: data.idea.title,
      description: data.idea.one_line_pain ?? undefined,
      url: canonical,
      type: "article",
    },
  };
}

export default async function IdeaDetailPage({ params }: Params) {
  const { slug } = await params;
  const data = await fetchDetail(slug);
  if (!data) notFound();

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
