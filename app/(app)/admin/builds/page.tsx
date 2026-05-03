import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";

import { fetchAdminBuildsQueue } from "@/lib/admin-server";
import type { AdminQueueBuild } from "@/lib/api/admin";
import { formatRelative } from "@/lib/format";

export const metadata: Metadata = {
  title: "Admin · Build queue",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SearchParams {
  page?: string;
}

export default async function AdminBuildsQueuePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const data = await fetchAdminBuildsQueue(page, 20);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-12 md:px-12">
      <header className="mb-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-400">
          Admin · Build queue
        </span>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-ink-700 md:text-5xl">
          Pending review
        </h1>
        <p className="mt-2 text-sm text-ink-50">
          {data.pagination.total_count} build
          {data.pagination.total_count === 1 ? "" : "s"} waiting · oldest first
          (FIFO)
        </p>
      </header>

      {data.items.length === 0 ? (
        <EmptyQueue />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data.items.map((b) => (
            <QueueRow key={b.unlock_id} build={b} />
          ))}
        </div>
      )}

      {data.pagination.total_pages > 1 ? (
        <Pagination
          page={data.pagination.page}
          totalPages={data.pagination.total_pages}
          hasPrev={data.pagination.has_prev}
          hasNext={data.pagination.has_next}
        />
      ) : null}
    </div>
  );
}

// =================================================================== //
//  Sub-pieces                                                          //
// =================================================================== //

function EmptyQueue() {
  return (
    <div className="rounded-xl border border-dashed border-cream-300 bg-cream-50 px-6 py-16 text-center">
      <p className="font-display text-2xl text-ink-700">Queue is empty.</p>
      <p className="mt-2 text-sm text-ink-50">
        Nothing to review right now. New submissions appear here in real time.
      </p>
    </div>
  );
}

function QueueRow({ build }: { build: AdminQueueBuild }) {
  return (
    <Link
      href={`/admin/builds/${encodeURIComponent(build.unlock_id)}` as Route}
      className="group flex flex-col gap-4 rounded-xl border border-cream-300 bg-cream-50 p-5 shadow-soft transition-colors hover:border-moss-600/40 md:flex-row md:items-center md:gap-6"
    >
      {/* Thumbnail */}
      <div className="h-24 w-full shrink-0 overflow-hidden rounded-lg bg-cream-200 md:h-20 md:w-32">
        {build.build_screenshot_url ? (
          // Plain <img>: thumbnails are R2 URLs and don't need Next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={build.build_screenshot_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase tracking-wider text-cream-400">
            no screenshot
          </div>
        )}
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="font-display text-lg text-ink-700 group-hover:text-moss-700">
            {build.build_name || "(unnamed build)"}
          </h2>
          {build.build_category ? (
            <span className="rounded border border-cream-300 bg-cream-100 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-50">
              {build.build_category}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-ink-50">
          from idea: <span className="text-ink-700">{build.idea_title}</span>
        </p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-cream-400">
          {build.user_email}
        </p>
      </div>

      {/* Meta */}
      <div className="flex flex-row gap-6 md:flex-col md:items-end md:text-right">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-cream-400">
            Submitted
          </p>
          <p className="mt-1 font-mono text-xs tabular-nums text-ink-700">
            {build.submitted_at ? formatRelative(build.submitted_at) : "—"}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-cream-400">
            Pending
          </p>
          <p
            className={`mt-1 font-mono text-xs tabular-nums ${
              build.days_pending >= 2 ? "text-plum-500" : "text-ink-700"
            }`}
          >
            {build.days_pending} day{build.days_pending === 1 ? "" : "s"}
          </p>
        </div>
        <span className="ml-auto self-center font-mono text-[11px] uppercase tracking-[0.16em] text-moss-700 md:ml-0">
          Review →
        </span>
      </div>
    </Link>
  );
}

function Pagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
}: {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <p className="font-mono text-xs text-ink-50">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        {hasPrev ? (
          <Link
            href={`/admin/builds?page=${page - 1}` as Route}
            className="rounded-lg border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm text-ink-700 hover:bg-cream-200"
          >
            ← Prev
          </Link>
        ) : null}
        {hasNext ? (
          <Link
            href={`/admin/builds?page=${page + 1}` as Route}
            className="rounded-lg border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm text-ink-700 hover:bg-cream-200"
          >
            Next →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
