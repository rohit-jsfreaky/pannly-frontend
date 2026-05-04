import type { Route } from "next";
import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";

type FooterLink = { href: Route | string; label: string; external?: boolean };

const links: FooterLink[] = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/built", label: "Build Gallery" },
  { href: "/pricing", label: "Pricing" },
  { href: "/refunds", label: "Refunds" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full border-t border-cream-300 bg-cream-100">
      <div className="px-6 md:px-12 grid grid-cols-1 gap-8 py-12 md:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Wordmark size="sm" />
          <p className="text-sm tracking-wide text-ink-50/80">
            © {new Date().getFullYear()} Pannly. Built in public from India.
          </p>
          {/* ShipBoost "Featured on" badge — links back to the directory.
              Standard third-party badge served from shipboost.io's CDN, so
              we use a plain <img> rather than next/image (no point in
              optimising an SVG hosted elsewhere). */}
          <a
            href="https://shipboost.io"
            data-shipboost-badge="free-launch"
            target="_blank"
            rel="noopener"
            className="inline-block w-fit"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://shipboost.io/ShipBoost-Badge/ShipBoost-Light-Badge.svg"
              alt="Featured on ShipBoost"
              style={{ height: 54, width: "auto" }}
            />
          </a>
        </div>

        <div className="flex flex-wrap justify-start gap-x-8 gap-y-4 md:col-span-2 md:justify-end">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href as Route}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-sm tracking-wide text-ink-50/70 underline decoration-cream-300 underline-offset-4 transition-colors hover:text-plum-500"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
