import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { ContactSidebar } from "@/components/contact/contact-sidebar";

export const metadata: Metadata = {
  title: "Contact · Pannly",
  description:
    "We're builders, not a corporation. Reach out and a human will read it.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

/**
 * /contact — public contact page.
 *
 * Layout intentionally has NO max-width container — the user wants this page
 * to span the full viewport. Content sits inside generous side padding.
 */
export default function Page() {
  return (
    <div className="w-full px-6 py-16 md:px-12 md:py-24">
      <header className="mb-16 max-w-3xl">
        <h1 className="mb-4 font-display text-5xl tracking-tight text-ink-700 md:text-6xl">
          Contact us.
        </h1>
        <p className="text-lg leading-relaxed text-ink-50">
          We're builders, not a corporation. Reach out and a human will read it.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
        <div className="md:col-span-2">
          <ContactForm />
        </div>
        <aside className="md:col-span-1">
          <ContactSidebar />
        </aside>
      </div>
    </div>
  );
}
