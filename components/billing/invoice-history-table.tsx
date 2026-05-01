import type { InvoiceItem } from "@/lib/api/me";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  invoices: InvoiceItem[];
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusPill(status: string): { label: string; className: string } {
  if (status === "succeeded") {
    return {
      label: "Paid",
      className: "border-moss-600/20 bg-moss-100 text-moss-700",
    };
  }
  if (status === "refunded") {
    return {
      label: "Refunded",
      className: "border-plum-300 bg-plum-100 text-plum-700",
    };
  }
  if (status === "failed") {
    return {
      label: "Failed",
      className: "border-error/30 bg-error/10 text-error",
    };
  }
  return {
    label: status[0]?.toUpperCase() + status.slice(1),
    className: "border-cream-300 bg-cream-200 text-ink-50",
  };
}

export function InvoiceHistoryTable({ invoices }: Props) {
  if (invoices.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-cream-300 bg-cream-50 px-6 py-12 text-center text-sm text-ink-50">
        No invoices yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-cream-300 bg-cream-50">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-cream-300/60">
            <th className="px-6 py-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-cream-400">
              Date
            </th>
            <th className="px-6 py-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-cream-400">
              Description
            </th>
            <th className="px-6 py-4 text-right font-mono text-[11px] font-semibold uppercase tracking-wider text-cream-400">
              Amount
            </th>
            <th className="px-6 py-4 text-center font-mono text-[11px] font-semibold uppercase tracking-wider text-cream-400">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, i) => {
            const pill = statusPill(inv.status);
            const last = i === invoices.length - 1;
            return (
              <tr
                key={inv.id}
                className={cn(
                  !last && "border-b border-cream-300/40",
                  "transition-colors hover:bg-cream-200/60",
                )}
              >
                <td className="px-6 py-4 font-mono text-sm tabular-nums text-ink-50">
                  {formatDate(inv.date)}
                </td>
                <td className="px-6 py-4 text-sm text-ink-500">{inv.description}</td>
                <td className="px-6 py-4 text-right font-mono text-sm tabular-nums text-ink-500">
                  {formatMoney(
                    inv.amount_cents,
                    inv.currency === "INR" ? "INR" : "USD",
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider",
                      pill.className,
                    )}
                  >
                    {pill.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
