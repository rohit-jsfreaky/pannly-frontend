import { Check } from "lucide-react";
import type { ReactNode } from "react";

type Cell = ReactNode | "check" | "dash";

interface Row {
  feature: string;
  cells: [Cell, Cell, Cell]; // free / a-la-carte / artisan
}

const ROWS: Row[] = [
  { feature: "Daily idea previews", cells: ["3", "3", "Unlimited"] },
  { feature: "Full PDF teardowns", cells: ["dash", "Per purchase", "Unlimited"] },
  { feature: "Refund-on-ship", cells: ["dash", "check", "check"] },
  { feature: "Early access to drops", cells: ["dash", "dash", "check"] },
  { feature: "Community access", cells: ["dash", "dash", "check"] },
];

function renderCell(cell: Cell) {
  if (cell === "check") {
    return (
      <Check className="mx-auto h-5 w-5 text-moss-600" strokeWidth={2} aria-label="Included" />
    );
  }
  if (cell === "dash") {
    return <span className="text-cream-400" aria-label="Not included">—</span>;
  }
  return <span>{cell}</span>;
}

/**
 * Three-column comparison matrix. Pure presentational — feature list is
 * curated locally so the columns line up with the cards above. Easy to
 * extend by appending to ROWS.
 */
export function FeatureMatrix() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-24">
      <h2 className="mb-12 text-center font-display text-3xl text-ink-700">
        Compare detailed features
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-cream-300/60">
              <th className="w-1/3 py-4 font-mono text-xs font-normal uppercase tracking-wider text-cream-400">
                Feature
              </th>
              <th className="w-[22%] py-4 text-center font-display text-xl text-ink-700">
                Explorer
              </th>
              <th className="w-[22%] py-4 text-center font-display text-xl text-ink-700">
                A La Carte
              </th>
              <th className="w-[22%] py-4 text-center font-display text-xl text-ink-700">
                Artisan
              </th>
            </tr>
          </thead>
          <tbody className="text-sm text-ink-500">
            {ROWS.map((row, i) => (
              <tr
                key={row.feature}
                className={
                  i < ROWS.length - 1
                    ? "border-b border-cream-300/40"
                    : undefined
                }
              >
                <td className="py-4 pr-4">{row.feature}</td>
                <td className="py-4 text-center">{renderCell(row.cells[0])}</td>
                <td className="py-4 text-center">{renderCell(row.cells[1])}</td>
                <td className="py-4 text-center">{renderCell(row.cells[2])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
