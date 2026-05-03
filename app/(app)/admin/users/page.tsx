import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";

import { fetchAdminUsers } from "@/lib/admin-server";
import type { AdminUserRow } from "@/lib/api/admin";
import { formatDate, formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Admin · Users",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SearchParams {
  page?: string;
  search?: string;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const search = (sp.search ?? "").trim() || undefined;
  const data = await fetchAdminUsers({ page, per_page: 20, search });

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-12 md:px-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream-400">
            Admin · Users
          </span>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-ink-700 md:text-5xl">
            Users
          </h1>
          <p className="mt-2 text-sm text-ink-50">
            {data.pagination.total_count} total · sorted by signup, newest first
          </p>
        </div>
        <SearchForm initial={search ?? ""} />
      </header>

      <div className="overflow-x-auto rounded-xl border border-cream-300 bg-cream-50 shadow-soft">
        <table className="w-full min-w-[960px] border-collapse text-left text-sm">
          <thead className="border-b border-cream-300 bg-cream-100">
            <tr>
              <Th>Email</Th>
              <Th>Plan</Th>
              <Th>Joined</Th>
              <Th>Last login</Th>
              <Th align="right">Unlocks</Th>
              <Th align="right">Shipped</Th>
              <Th align="right">Paid</Th>
              <Th align="right">Refunded</Th>
            </tr>
          </thead>
          <tbody>
            {data.items.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-sm text-ink-50"
                >
                  No users match{search ? ` "${search}"` : ""}.
                </td>
              </tr>
            ) : (
              data.items.map((u) => <UserRow key={u.id} u={u} />)
            )}
          </tbody>
        </table>
      </div>

      {data.pagination.total_pages > 1 ? (
        <Pagination pagination={data.pagination} search={search} />
      ) : null}
    </div>
  );
}

// =================================================================== //
//  Sub-pieces                                                          //
// =================================================================== //

function Th({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "right";
}) {
  return (
    <th
      className={`px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-cream-400 ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function UserRow({ u }: { u: AdminUserRow }) {
  return (
    <tr className="border-b border-cream-300/60 last:border-b-0 hover:bg-cream-100">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-ink-700">{u.email}</span>
          {u.is_admin ? (
            <span className="rounded border border-plum-300 bg-plum-100 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-plum-700">
              admin
            </span>
          ) : null}
        </div>
        {u.display_name ? (
          <div className="mt-0.5 text-xs text-ink-50">{u.display_name}</div>
        ) : null}
      </td>
      <td className="px-4 py-3">
        <PlanBadge label={u.plan_label} isPro={u.is_pro} />
      </td>
      <td className="px-4 py-3 font-mono text-xs tabular-nums text-ink-50">
        {formatDate(u.created_at)}
      </td>
      <td className="px-4 py-3 font-mono text-xs tabular-nums text-ink-50">
        {u.last_login_at ? formatDate(u.last_login_at) : "—"}
      </td>
      <td className="px-4 py-3 text-right font-mono tabular-nums text-ink-700">
        {u.total_unlocks}
      </td>
      <td className="px-4 py-3 text-right font-mono tabular-nums text-moss-700">
        {u.total_builds}
      </td>
      <td className="px-4 py-3 text-right font-mono tabular-nums text-ink-700">
        {u.total_paid_cents > 0 ? formatMoney(u.total_paid_cents, u.currency) : "—"}
      </td>
      <td className="px-4 py-3 text-right font-mono tabular-nums text-plum-500">
        {u.total_refunded_cents > 0
          ? formatMoney(u.total_refunded_cents, u.currency)
          : "—"}
      </td>
    </tr>
  );
}

function PlanBadge({ label, isPro }: { label: string; isPro: boolean }) {
  if (!isPro) {
    return (
      <span className="rounded-md border border-cream-300 bg-cream-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-50">
        Free
      </span>
    );
  }
  return (
    <span className="rounded-md border border-moss-600/30 bg-moss-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-moss-700">
      {label}
    </span>
  );
}

function SearchForm({ initial }: { initial: string }) {
  // Simple GET form — submitting reloads with ?search=... preserved.
  return (
    <form action="/admin/users" method="get" className="flex items-center gap-2">
      <input
        type="search"
        name="search"
        defaultValue={initial}
        placeholder="Search email…"
        className="rounded-lg border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-ink-700 placeholder:text-cream-400 focus:border-moss-500 focus:outline-none focus:ring-2 focus:ring-moss-500/30"
      />
      <button
        type="submit"
        className="rounded-lg bg-moss-600 px-4 py-2 text-sm font-medium text-cream-50 transition-opacity hover:opacity-90"
      >
        Search
      </button>
    </form>
  );
}

function Pagination({
  pagination,
  search,
}: {
  pagination: { page: number; total_pages: number; has_prev: boolean; has_next: boolean };
  search: string | undefined;
}) {
  const buildHref = (p: number): Route => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (search) params.set("search", search);
    const qs = params.toString();
    return (qs ? `/admin/users?${qs}` : "/admin/users") as Route;
  };
  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="font-mono text-xs text-ink-50">
        Page {pagination.page} of {pagination.total_pages}
      </p>
      <div className="flex gap-2">
        {pagination.has_prev ? (
          <Link
            href={buildHref(pagination.page - 1)}
            className="rounded-lg border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm text-ink-700 hover:bg-cream-200"
          >
            ← Prev
          </Link>
        ) : null}
        {pagination.has_next ? (
          <Link
            href={buildHref(pagination.page + 1)}
            className="rounded-lg border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm text-ink-700 hover:bg-cream-200"
          >
            Next →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
