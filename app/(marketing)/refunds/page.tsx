import { RefundsView } from "@/components/refunds/refunds-view";
import { fetchRefundsSummary, type RefundsSummary } from "@/lib/api/refunds";
import { pageMetadata } from "@/lib/seo/page-metadata";
import {
  buildBreadcrumbSchema,
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

/**
 * /refunds — public refund transparency. Server-side we fetch the summary
 * once and embed a Dataset JSON-LD block describing the ledger as a queryable
 * public dataset. Eligible for Google Dataset Search; AI engines also use
 * Dataset to anchor "build in public" / credibility signals.
 *
 * The client `<RefundsView>` re-fetches the summary on its own (uses module
 * cache so it'll be a single network call total), so duplicate fetches are
 * dedup'd. Failure on the server-side fetch falls back to zeros — schema
 * still renders, just describes an empty ledger.
 */
export default async function Page() {
  const summary = await fetchSummaryForSchema();
  const dataset = buildRefundsDataset({
    totalRefundedCents: summary.total_refunded_cents,
    totalRefundsCount: summary.total_refunds_count,
    avgRefundCents: summary.avg_refund_cents,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(dataset) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson(BREADCRUMB) }}
      />
      <RefundsView />
    </>
  );
}

async function fetchSummaryForSchema(): Promise<RefundsSummary> {
  try {
    return await fetchRefundsSummary();
  } catch {
    return { total_refunded_cents: 0, total_refunds_count: 0, avg_refund_cents: 0 };
  }
}
