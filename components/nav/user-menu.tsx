"use client";

import type { Route } from "next";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import type { CurrentUser } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";

const items: { href: Route; label: string }[] = [
  { href: "/unlocks", label: "Dashboard" },
  { href: "/settings", label: "Settings" },
  { href: "/billing", label: "Billing" },
];

export function UserMenu({ user }: { user: CurrentUser }) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      // AuthContext.logout() already cleared the user — TopNav reflects it
      // immediately. Just push the user back to the marketing root.
      router.push("/");
    }
  };

  const initial = (user.display_name || user.email)[0]?.toUpperCase() ?? "?";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-cream-300 bg-cream-50 py-1 pl-1 pr-3 transition-colors hover:bg-cream-200"
      >
        {user.avatar_url ? (
          // Plain <img> — avatar URLs are R2 public CDN, change rarely, and
          // we don't need Next/image optimisation for a 28×28 pixel square.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar_url}
            alt=""
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full bg-moss-600 font-display text-sm font-semibold text-cream-50"
            aria-hidden
          >
            {initial}
          </span>
        )}
        <ChevronDown className="h-4 w-4 text-ink-50/70" strokeWidth={1.75} aria-hidden />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-cream-300 bg-cream-50 shadow-soft-lg"
        >
          <div className="border-b border-cream-300 px-4 py-3">
            <p className="truncate font-display text-sm text-ink-700">
              {user.display_name || "Signed in"}
            </p>
            <p className="truncate text-xs text-ink-50/70">{user.email}</p>
          </div>
          <ul className="py-1">
            {items.map((it) => (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className="block px-4 py-2 text-sm text-ink-700 hover:bg-cream-200"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                >
                  {it.label}
                </Link>
              </li>
            ))}
            {user.is_admin ? (
              <li>
                <Link
                  href={"/admin/unlocks" as Route}
                  className="block px-4 py-2 text-sm text-plum-500 hover:bg-cream-200"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                >
                  Admin queue
                </Link>
              </li>
            ) : null}
          </ul>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-busy={loggingOut || undefined}
            role="menuitem"
            className="flex w-full items-center gap-2 border-t border-cream-300 px-4 py-2.5 text-left text-sm text-ink-700 transition-colors hover:bg-cream-200 disabled:opacity-60"
          >
            {loggingOut ? (
              <Spinner className="h-4 w-4" aria-hidden />
            ) : (
              <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden />
            )}
            <span>Log out</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
