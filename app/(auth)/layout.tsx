import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-server";

/**
 * Auth-section guard. If the user already has a valid session, bounce them
 * away from /login, /signup, etc. — they shouldn't see those pages.
 *
 * Server-side check via getCurrentUser, which already failed-soft for
 * network blips, so we only redirect on a confirmed session.
 */
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/feed");
  }
  return <>{children}</>;
}
