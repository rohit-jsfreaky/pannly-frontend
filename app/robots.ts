/**
 * /robots.txt — Next.js generates this from the MetadataRoute.Robots return.
 *
 * Posture: open to all crawlers, including AI search bots. Private surfaces
 * (auth screens, user dashboard, checkout pages) are disallowed because they
 * are either per-user or transactional — there's nothing useful for a bot
 * to index there.
 *
 * AI bots get explicit allow rules (rather than relying on the wildcard) so
 * the intent is unambiguous: Pannly's content is meant to be cited.
 */

import type { MetadataRoute } from "next";

import { env } from "@/lib/env";

const PRIVATE_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/billing",
  "/settings",
  "/unlocks",
  "/checkout",
];

const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Bytespider",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  const base = env.appBaseUrl.replace(/\/+$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      // Repeat the same posture for each AI bot. Explicit allow makes the
      // intent visible to anyone reading the file.
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

/**
 * IndexNow API key. The value must match the filename of the key file in
 * /public/{KEY}.txt and the contents of that file. Bing reads the key from
 * the file at publish-ping time to verify ownership.
 *
 * Rotate by: (1) generating a new 32-char hex via `secrets.token_hex(16)`,
 * (2) renaming /public/{KEY}.txt and its contents, (3) updating this constant.
 * The IndexNow protocol explicitly supports key rotation — no API call needed.
 */
export const INDEXNOW_KEY = "db34134f3d0abe29189f9779cb8cbae3";
