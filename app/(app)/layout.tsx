import { redirect } from "next/navigation";
import { Toaster } from "sonner";

import { SiteFooter } from "@/components/footer/site-footer";
import { TopNav } from "@/components/nav/top-nav";
import { getCurrentUser } from "@/lib/auth-server";

/**
 * Authenticated-section guard. Anything under /(app) requires a valid
 * session. If absent we bounce to /login.
 *
 * Shares TopNav + SiteFooter with /(marketing) so the chrome is identical
 * across public + private pages. Mounts a single <Toaster> here so any
 * authed page can call `toast.success(...)` / `toast.error(...)` without
 * setting up its own portal.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return (
    <div className="flex min-h-screen flex-col bg-cream-100">
      <TopNav />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter />
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3500}
        toastOptions={{
          classNames: {
            toast:
              "rounded-xl border border-cream-300 bg-cream-50 text-ink-700 shadow-soft",
          },
        }}
      />
    </div>
  );
}
