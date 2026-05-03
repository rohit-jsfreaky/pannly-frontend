import type { Metadata } from "next";

/**
 * Build a complete per-page Metadata object with consistent OpenGraph + Twitter
 * cards.
 *
 * Without this, Next.js merges page-level `title`/`description` but per-page
 * OG/Twitter blocks fall back to the root layout values — so a Twitter share
 * of /pricing would render the homepage title. This helper closes that gap.
 *
 * Usage in a page:
 *
 *   export const metadata = pageMetadata({
 *     title: "Pricing",
 *     description: "Free to browse. $3 per unlock...",
 *     path: "/pricing",
 *   });
 */
export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  /** Optional override for the OG/Twitter image. Defaults to /og-default.png */
  image?: string;
}): Metadata {
  const url = input.path;
  const image = input.image ?? "/og-default.png";
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}
