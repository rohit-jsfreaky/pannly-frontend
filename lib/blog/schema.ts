/**
 * Shared schema + date helpers for the SEO blog cluster.
 *
 * Centralises the boilerplate (dated WebPage, ItemList) so each blog page can
 * focus on its own unique prose. Page-unique data — title, description, FAQs,
 * the actual copy — is always passed in per page; nothing here templates content.
 */

import type { FeedIdea } from "@/lib/api/feed";
import { env } from "@/lib/env";
import { buildSpeakableWebPage } from "@/lib/seo/schemas";

// Shared publish/modified stamps for the cluster launched 2026-05-21. Bump
// `BLOG_MODIFIED` + the visible label whenever a page gets a real content refresh.
export const BLOG_PUBLISHED = "2026-05-21";
export const BLOG_MODIFIED = "2026-05-21";
export const BLOG_UPDATED_LABEL = "May 2026";

export interface BlogFaqItem {
  question: string;
  answer: string;
}

/** WebPage + Speakable with explicit dates (so Google shows the real freshness). */
export function blogWebPage(input: {
  url: string;
  name: string;
  description: string;
}) {
  return {
    ...buildSpeakableWebPage(input),
    datePublished: BLOG_PUBLISHED,
    dateModified: BLOG_MODIFIED,
  };
}

/** ItemList of idea briefs — AI engines use it to discover/cite individual entries. */
export function blogItemList(name: string, ideas: FeedIdea[]) {
  const base = env.appBaseUrl.replace(/\/+$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: ideas.length,
    itemListElement: ideas.map((idea, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${base}/ideas/${encodeURIComponent(idea.slug)}`,
      name: idea.title,
    })),
  };
}
