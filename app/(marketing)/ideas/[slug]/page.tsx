import type { Metadata, Route } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { LockedView } from "@/components/ideas/locked-view";
import { RelatedBriefs } from "@/components/ideas/related-briefs";
import { UnlockedView } from "@/components/ideas/unlocked-view";
import { ApiError, apiGet } from "@/lib/api-client";
import type { IdeaDetailResponse } from "@/lib/api/ideas";

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
  return {
    title: data.idea.title,
    description: data.idea.one_line_pain ?? undefined,
  };
}

export default async function IdeaDetailPage({ params }: Params) {
  const { slug } = await params;
  const data = await fetchDetail(slug);
  if (!data) notFound();

  return (
    <div className="bg-cream-100">
      <main className="mx-auto max-w-[1100px] px-6 pb-24 pt-10">
        <Link
          href={"/feed" as Route}
          className="mb-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-cream-400 transition-colors hover:text-ink-500"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden />
          Back to feed
        </Link>

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
