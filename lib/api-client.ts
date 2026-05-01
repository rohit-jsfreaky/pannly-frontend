/**
 * Thin typed wrapper around fetch() that talks to the FastAPI backend.
 *
 * Conventions:
 * - Always sends `credentials: "include"` so the session cookie is carried.
 * - Always sends `X-Requested-With: pannly-web` (CSRF-lite paired with SameSite=Lax).
 * - Always parses the standard envelope: { ok, data?, error?, meta }.
 * - Throws ApiError on a non-ok envelope so callers can `try/catch` with one shape.
 */

import { env } from "@/lib/env";

export class ApiError extends Error {
  code: string;
  status: number;
  requestId?: string;

  constructor(code: string, message: string, status: number, requestId?: string) {
    super(message);
    this.code = code;
    this.status = status;
    this.requestId = requestId;
  }
}

interface OkEnvelope<T> {
  ok: true;
  data: T;
  meta: { request_id: string; version: string };
}

interface ErrorEnvelope {
  ok: false;
  error: { code: string; message: string };
  meta: { request_id: string; version: string };
}

type Envelope<T> = OkEnvelope<T> | ErrorEnvelope;

export interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  /** Pass-through for Next.js fetch options like { revalidate, tags }. */
  next?: { revalidate?: number; tags?: string[] };
  /** Pass-through for AbortSignal. */
  signal?: AbortSignal;
  /** Marketing pages may want to opt out of `credentials: "include"`. Default is include. */
  withCredentials?: boolean;
}

function buildUrl(path: string, query?: ApiOptions["query"]): string {
  const base = env.apiBaseUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (!query) return `${base}${cleanPath}`;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    params.set(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${base}${cleanPath}?${qs}` : `${base}${cleanPath}`;
}

export async function api<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const url = buildUrl(path, opts.query);
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Requested-With": "pannly-web",
    ...opts.headers,
  };
  let body: BodyInit | undefined;
  if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.body);
  }

  const res = await fetch(url, {
    method: opts.method ?? "GET",
    headers,
    body,
    credentials: opts.withCredentials === false ? "omit" : "include",
    next: opts.next,
    signal: opts.signal,
  });

  let parsed: Envelope<T>;
  try {
    parsed = (await res.json()) as Envelope<T>;
  } catch {
    throw new ApiError("INVALID_JSON", `Non-JSON response (${res.status})`, res.status);
  }

  if (!parsed.ok) {
    throw new ApiError(
      parsed.error.code,
      parsed.error.message,
      res.status,
      parsed.meta?.request_id,
    );
  }

  return parsed.data;
}

/** Convenience helpers for the common verbs. */
export const apiGet = <T>(path: string, opts: Omit<ApiOptions, "method" | "body"> = {}) =>
  api<T>(path, { ...opts, method: "GET" });

export const apiPost = <T>(
  path: string,
  body?: unknown,
  opts: Omit<ApiOptions, "method" | "body"> = {},
) => api<T>(path, { ...opts, method: "POST", body });

export const apiPatch = <T>(
  path: string,
  body?: unknown,
  opts: Omit<ApiOptions, "method" | "body"> = {},
) => api<T>(path, { ...opts, method: "PATCH", body });

export const apiDelete = <T>(path: string, opts: Omit<ApiOptions, "method" | "body"> = {}) =>
  api<T>(path, { ...opts, method: "DELETE" });
