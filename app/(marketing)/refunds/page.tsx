import type { Metadata } from "next";

import { RefundsView } from "@/components/refunds/refunds-view";

export const metadata: Metadata = {
  title: "Refunds · Pannly",
  description:
    "Public ledger of every refund Pannly has issued. Auto-refunds for builders who ship within 30 days.",
};

export default function Page() {
  return <RefundsView />;
}
