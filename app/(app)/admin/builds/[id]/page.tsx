import type { Metadata } from "next";
import type { Route } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ReviewActions } from "@/components/admin/review-actions";
import { fetchAdminBuild } from "@/lib/admin-server";
import { ApiError } from "@/lib/api-client";
import { formatDate, formatRelative } from "@/lib/format";

export const metadata: Metadata = {
  title: "Admin · Review build",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminBuildReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let build;
  try {
    build = await fetchAdminBuild(id);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-12 md:px-12">
      <Link
        href={"/admin/builds" as Route}
        className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-cream-400 transition-colors hover:text-moss-700"
      >
        <ArrowLeft className="h-3 w-3" strokeWidth={2} aria-hidden />
        Back to queue
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h1 className="font-display text-3xl tracking-tight text-ink-700 md:text-4xl">
            {build.build_name || "(unnamed build)"}
          </h1>
          {build.build_category ? (
            <span className="rounded border border-cream-300 bg-cream-100 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-ink-50">
              {build.build_category}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-ink-50">
          Submitted by{" "}
          <span className="font-medium text-ink-700">{build.user_email}</span>
          {build.submitted_at
            ? ` · ${formatRelative(build.submitted_at)} (${formatDate(build.submitted_at, { hour: "numeric", minute: "2-digit" })})`
            : null}
          {" · "}
          <span
            className={
              build.days_pending >= 2 ? "text-plum-500" : "text-ink-50"
            }
          >
            {build.days_pending} day{build.days_pending === 1 ? "" : "s"} pending
          </span>
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ---- Left column: build artifacts ---- */}
        <section className="lg:col-span-7">
          {/* Screenshot */}
          <div className="overflow-hidden rounded-xl border border-cream-300 bg-cream-50 shadow-soft">
            <div className="border-b border-cream-300 bg-cream-100 px-4 py-2.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream-400">
                Submitted screenshot
              </p>
            </div>
            <div className="bg-cream-200">
              {build.build_screenshot_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={build.build_screenshot_url}
                  alt="Build screenshot"
                  className="block w-full"
                />
              ) : (
                <div className="px-6 py-16 text-center font-mono text-xs uppercase tracking-wider text-cream-400">
                  No screenshot uploaded
                </div>
              )}
            </div>
          </div>

          {/* Build URL */}
          <div className="mt-6 rounded-xl border border-cream-300 bg-cream-50 p-5 shadow-soft">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream-400">
              Live build URL
            </p>
            {build.build_url ? (
              <a
                href={build.build_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 break-all text-sm text-moss-700 underline decoration-cream-400 underline-offset-4 hover:decoration-moss-500"
              >
                {build.build_url}
                <ExternalLink className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
              </a>
            ) : (
              <p className="mt-2 text-sm text-ink-50">No URL submitted.</p>
            )}
          </div>

          {/* Writeup */}
          {build.build_writeup ? (
            <div className="mt-6 rounded-xl border border-cream-300 bg-cream-50 p-5 shadow-soft">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream-400">
                Builder&apos;s writeup
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
                {build.build_writeup}
              </p>
            </div>
          ) : null}
        </section>

        {/* ---- Right column: idea context + actions ---- */}
        <aside className="lg:col-span-5">
          <div className="sticky top-6 flex flex-col gap-6">
            {/* Original idea */}
            <div className="rounded-xl border border-cream-300 bg-cream-50 p-5 shadow-soft">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream-400">
                Original brief
              </p>
              <h2 className="mt-2 font-display text-xl text-ink-700">
                {build.idea_title}
              </h2>
              <Link
                href={`/ideas/${encodeURIComponent(build.idea_slug)}` as Route}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm text-moss-700 underline decoration-cream-400 underline-offset-4 hover:decoration-moss-500"
              >
                Open the brief
                <ExternalLink className="h-3 w-3" strokeWidth={2} aria-hidden />
              </Link>
            </div>

            {/* Actions */}
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-cream-400">
                Decision
              </p>
              <ReviewActions unlockId={build.unlock_id} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
