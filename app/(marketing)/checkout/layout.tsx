import type { Metadata } from "next";

/**
 * Checkout subtree must never be indexed. /checkout/cancel (and any future
 * /checkout/* destination Dodo redirects to) is transactional UI with no SEO
 * value, and indexing it would dilute the marketing surface.
 *
 * The page itself is a client component, so this layout is the canonical
 * place to set robots metadata for the section.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
