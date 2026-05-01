import "server-only";

/**
 * Server-only auth helpers — uses next/headers, can only be imported from
 * Server Components / Route Handlers / Server Actions.
 */

import { cookies } from "next/headers";

import { apiGet, ApiError } from "@/lib/api-client";
import type { CurrentUser, MeResponse } from "@/lib/auth";

/**
 * Read the current user from the backend, forwarding the browser's cookies
 * so the session is recognised. Returns `null` for unauthenticated requests
 * AND for backend hiccups — we fail soft so unauth pages always render.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  let cookieHeader = "";
  try {
    const c = await cookies();
    cookieHeader = c
      .getAll()
      .map((entry) => `${entry.name}=${entry.value}`)
      .join("; ");
  } catch {
    return null;
  }

  if (!cookieHeader) return null;

  try {
    const data = await apiGet<MeResponse>("/v1/auth/me", {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    });
    return data.user;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    return null;
  }
}
