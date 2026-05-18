import { Suspense } from "react";

import { RefundsView } from "@/components/refunds/refunds-view";
import { fetchRefundsSummary, type RefundsSummary } from "@/lib/api/refunds";
import { pageMetadata } from "@/lib/seo/page-metadata";
import { REFUNDS_FAQ } from "@/lib/seo/refunds-faq-data";
import {
  buildBreadcrumbSchema,
  buildFaqPage,
  buildRefundsDataset,
  schemaJson,
} from "@/lib/seo/schemas";

export const metadata = pageMetadata({
  title: "Refunds",
  path: "/refunds",
  description:
    "Public ledger of every refund Pannly has issued. Auto-refunds for builders who ship within 30 days.",
});

const BREADCRUMB = buildBreadcrumbSchema([{ name: "Refunds", path: "/refunds" }]);

// FAQPage JSON-LD wrapping the same Q&A pairs the page renders. Drives AI
// citation eligibility for queries like "what counts as shipped on Pannly"
// or "how does the Pannly refund work".
const REFUNDS_FAQ_GRAPH = buildFaqPage({
  url: "/refunds",
  qas: REFUNDS_FAQ.map((item) => ({ question: item.q, answer: item.a })),
});

// Public ledger updates whenever a refund issues — 5 min lag is fine, and the
// schema fetcher inside fail-soft handles backend hiccups.
export const revalidate = 300;

/**
 * /refunds — public refund transparency. Page is SYNC so HTML streams to
 * the browser without waiting on the backend. The Dataset JSON-LD (which
 * needs the summary fetch) lives in a separate async component wrapped in
 * Suspense — it streams in once the data lands, doesn't block visible UI.
 */
export default function Page() {
  return (
    <>
      <Suspense fallback={null}>
        <RefundsDatasetSchema />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(REFUNDS_FAQ_GRAPH) }}
      />
      <RefundsView />
    </>
  );
}

/**
 * Async schema injector. Doesn't block the visible page render — Suspense
 * lets the rest of the page stream first. Fail-soft: backend down ⇒ schema
 * still renders, just describes an empty ledger.
 */
async function RefundsDatasetSchema() {
  const summary = await fetchSummaryForSchema();
  const dataset = buildRefundsDataset({
    totalRefundedCents: summary.total_refunded_cents,
    totalRefundsCount: summary.total_refunds_count,
    avgRefundCents: summary.avg_refund_cents,
  });
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaJson(dataset) }}
    />
  );
}

async function fetchSummaryForSchema(): Promise<RefundsSummary> {
  try {
    return await fetchRefundsSummary();
  } catch {
    return { total_refunded_cents: 0, total_refunds_count: 0, avg_refund_cents: 0 };
  }
}
