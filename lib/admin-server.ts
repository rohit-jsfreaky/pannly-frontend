import "server-only";

/**
 * Server-side helpers for admin Server Components.
 *
 * Mirrors `lib/auth-server.ts` — the trick is that server-side fetch()
 * doesn't share the browser's cookie jar, so we have to manually read
 * `next/headers` cookies and pass them through as a `cookie:` header on
 * every backend call. Without that, /v1/admin/* returns 401.
 */

import { cookies } from "next/headers";

import {
  getAdminBuild as _getAdminBuild,
  getAdminBuildsQueue as _getAdminBuildsQueue,
  getAdminStats as _getAdminStats,
  getAdminUsers as _getAdminUsers,
  type AdminQueueBuild,
  type AdminQueueResponse,
  type AdminStatsResponse,
  type AdminUsersQuery,
  type AdminUsersResponse,
} from "@/lib/api/admin";

async function cookieHeader(): Promise<string> {
  const c = await cookies();
  return c.getAll().map((e) => `${e.name}=${e.value}`).join("; ");
}

export async function fetchAdminStats(): Promise<AdminStatsResponse> {
  const cookie = await cookieHeader();
  return _getAdminStats({ headers: { cookie } });
}

export async function fetchAdminUsers(
  query: AdminUsersQuery = {},
): Promise<AdminUsersResponse> {
  const cookie = await cookieHeader();
  return _getAdminUsers(query, { headers: { cookie } });
}

export async function fetchAdminBuildsQueue(
  page: number = 1,
  per_page: number = 20,
): Promise<AdminQueueResponse> {
  const cookie = await cookieHeader();
  return _getAdminBuildsQueue(page, per_page, { headers: { cookie } });
}

export async function fetchAdminBuild(
  unlockId: string,
): Promise<AdminQueueBuild> {
  const cookie = await cookieHeader();
  return _getAdminBuild(unlockId, { headers: { cookie } });
}
