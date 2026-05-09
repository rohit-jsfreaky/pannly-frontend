"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

import { Wordmark } from "@/components/brand/wordmark";
import { UserMenu } from "@/components/nav/user-menu";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const links: { href: Route; label: string }[] = [
  { href: "/feed", label: "Ideas" },
  { href: "/built", label: "Build Gallery" },
  { href: "/refunds", label: "Refunds" },
  { href: "/pricing", label: "Pricing" },
];

/**
 * Top nav. Reads the current user from AuthContext so login/logout flips
 * the right-side affordances instantly — no router.refresh() needed.
 *
 * On mobile (<md), the 4 marketing links collapse behind a hamburger
 * panel. The user-menu dropdown still handles account links separately.
 */
export function TopNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on route change so the panel doesn't linger after tapping a link.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Outside-click + Escape close, mirroring the UserMenu dropdown.
  useEffect(() => {
    if (!mobileOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setMobileOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onEscape);
    };
  }, [mobileOpen]);

  return (
    <nav className="relative w-full border-b border-cream-300 bg-cream-50">
      <div className="px-6 md:px-12 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Pannly home">
          <Wordmark />
        </Link>

        {/* Force prefetch={true} on every nav link. These are the most-clicked
            links on the entire site — every visitor hits at least one. With
            the loading.tsx boundaries in place from the perf sweep, even the
            dynamic-route ones (/feed, /built, /refunds) now prefetch fully on
            viewport entry, so clicks feel like SPA navigations. */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const isActive =
              pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                prefetch={true}
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

        <div className="flex items-center gap-3">
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

          {/* Hamburger — mobile only */}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-cream-300 bg-cream-50 text-ink-700 transition-colors hover:bg-cream-200 md:hidden"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            ) : (
              <Menu className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          ref={panelRef}
          id="mobile-nav-panel"
          role="menu"
          aria-label="Site navigation"
          className="absolute inset-x-0 top-full z-40 border-b border-cream-300 bg-cream-50 shadow-soft-lg md:hidden"
        >
          <ul className="flex flex-col px-6 py-3">
            {links.map((l) => {
              const isActive =
                pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    role="menuitem"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block py-3 font-display text-base tracking-tight transition-colors",
                      isActive
                        ? "font-semibold text-moss-700"
                        : "text-ink-700 hover:text-plum-500",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
            {!user ? (
              <li className="mt-2 border-t border-cream-300 pt-3">
                <Link
                  href="/login"
                  role="menuitem"
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 font-display text-base tracking-tight text-ink-700 transition-colors hover:text-plum-500"
                >
                  Log in
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
