import { notFound } from "next/navigation";

import { AdminNav } from "@/components/admin/admin-nav";
import { getCurrentUser } from "@/lib/auth-server";

/**
 * Admin section guard.
 *
 * The outer `(app)/layout.tsx` already redirects unauthenticated users to
 * /login. Here we add the second gate: only `is_admin = true` users get
 * past. Non-admins receive a 404 (NOT a 403) so the route's existence
 * isn't even disclosed to a regular user who guesses the URL.
 *
 * Note that the backend independently enforces `require_admin` on every
 * /v1/admin/* endpoint — this layout guard is UX, not security.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || !user.is_admin) {
    notFound();
  }

  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
