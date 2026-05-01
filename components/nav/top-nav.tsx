"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Wordmark } from "@/components/brand/wordmark";
import { UserMenu } from "@/components/nav/user-menu";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const links: { href: Route; label: string }[] = [
  { href: "/feed", label: "Ideas" },
  { href: "/built", label: "Build Gallery" },
  { href: "/refunds", label: "Archive" },
  { href: "/pricing", label: "Pricing" },
];

/**
 * Top nav. Reads the current user from AuthContext so login/logout flips
 * the right-side affordances instantly — no router.refresh() needed.
 */
export function TopNav() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-cream-300 bg-cream-50">
      <div className="px-6 md:px-12 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Pannly home">
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const isActive =
              pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "font-display text-sm tracking-tight transition-colors",
                  isActive
                    ? "font-semibold text-moss-700 border-b-2 border-moss-600 pb-1"
                    : "text-moss-500 hover:text-plum-500",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link
                href="/login"
                className="hidden font-display text-sm tracking-tight text-moss-500 transition-colors hover:text-plum-500 md:block"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-moss-600 px-4 py-2 text-sm text-cream-50 transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
