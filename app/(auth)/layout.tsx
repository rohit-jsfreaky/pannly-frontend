import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth-server";

/**
 * Auth pages must never appear in search results — robots.txt Disallow is
 * advisory, so we belt-and-braces with on-page noindex,nofollow. Children
 * routes inherit this metadata (login, signup, signup/verify, signup/complete,
 * forgot-password, forgot-password/verify, forgot-password/reset).
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

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
