import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { BriefMarkdown } from "@/components/ideas/brief-markdown";
import { IdeaHeader } from "@/components/ideas/idea-header";
import { UnlockCta } from "@/components/ideas/unlock-cta";
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
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-12">
        <IdeaHeader idea={data.idea} />

        <div className="mt-10">
          {data.access === "locked" ? (
            <>
              {data.free_preview_md ? (
                <BriefMarkdown source={data.free_preview_md} />
              ) : (
                <p className="text-base text-ink-50">Preview coming soon.</p>
              )}
              <div className="mt-12">
                <UnlockCta
                  slug={data.idea.slug}
                  unlockPriceCents={data.idea.unlock_price_cents}
                  hiddenWordCount={data.locked_summary.hidden_word_count}
                  hiddenSectionCount={data.locked_summary.hidden_section_count}
                />
              </div>
            </>
          ) : (
            <>
              <UnlockedBanner
                state={data.unlock_state?.state ?? null}
                viaSubscription={data.unlock_state === null}
              />
              {data.brief_md ? <BriefMarkdown source={data.brief_md} /> : null}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function UnlockedBanner({
  state,
  viaSubscription,
}: {
  state: string | null;
  viaSubscription: boolean;
}) {
  let label: string;
  if (viaSubscription) {
    label = "Unlocked with Pro";
  } else if (state === "unlocked") {
    label = "You've unlocked this";
  } else {
    label = `State: ${state ?? "—"}`;
  }
  return (
    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-moss-600/20 bg-moss-100 px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-moss-700">
      <span className="h-2 w-2 rounded-full bg-moss-600" aria-hidden />
      {label}
    </div>
  );
}
