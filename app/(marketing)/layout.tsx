import type { ReactNode } from "react";

import { TopNav } from "@/components/nav/top-nav";
import { SiteFooter } from "@/components/footer/site-footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      <TopNav />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
    </div>
  );
}
