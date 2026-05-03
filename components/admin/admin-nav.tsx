"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links: { href: Route; label: string; matchPrefix: string }[] = [
  { href: "/admin" as Route, label: "Overview", matchPrefix: "/admin" },
  { href: "/admin/users" as Route, label: "Users", matchPrefix: "/admin/users" },
  { href: "/admin/builds" as Route, label: "Build queue", matchPrefix: "/admin/builds" },
];

/**
 * Top tabs for the admin section. Sits inside `(app)/admin/layout.tsx`.
 *
 * "Overview" matches `/admin` exactly so it doesn't stay highlighted on
 * `/admin/users` or `/admin/builds`. The other two use prefix match so
 * `/admin/builds/{id}` keeps the parent tab lit.
 */
export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-cream-300 bg-cream-50">
      <div className="mx-auto flex max-w-[1280px] items-center gap-1 px-6 md:px-12">
        {links.map((l) => {
          const isActive =
            l.matchPrefix === "/admin"
              ? pathname === "/admin"
              : pathname === l.matchPrefix ||
                pathname.startsWith(`${l.matchPrefix}/`);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "-mb-px border-b-2 px-4 py-4 text-sm font-medium transition-colors",
                isActive
                  ? "border-moss-600 text-moss-700"
                  : "border-transparent text-ink-50 hover:text-ink-700",
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
