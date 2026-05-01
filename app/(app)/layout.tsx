import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-server";

/**
 * Authenticated-section guard. Anything under /(app) requires a valid
 * session. If absent we bounce to /login.
 *
 * For action-driven gates (clicking "Unlock $3" while logged out on a public
 * page) the client-side useRequireAuth hook handles the `?next=` query so
 * the user lands back where they tried to go. The server-side guard here
 * just enforces the protection.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return <>{children}</>;
}
