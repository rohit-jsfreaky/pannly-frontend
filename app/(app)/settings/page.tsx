import type { Metadata } from "next";

import { PasswordSection } from "@/components/settings/password-section";
import { ProfileSection } from "@/components/settings/profile-section";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your profile and password.",
};

/**
 * /settings — public-facing surface for the signed-in user.
 *
 * Two sections only:
 *   - Profile (avatar, display name, read-only email)
 *   - Update password (current / new / confirm)
 *
 * All form state is per-section; both sections read the current user from
 * AuthContext (already hydrated server-side in the (app) layout). No extra
 * /v1/auth/me round-trips on this page.
 */
export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 md:px-12 md:py-20">
      <header className="mb-12">
        <h1 className="mb-2 font-display text-4xl tracking-tight text-ink-700 md:text-5xl">
          Settings.
        </h1>
        <p className="text-base text-ink-50">
          Manage your profile and password.
        </p>
      </header>

      <div className="space-y-16">
        <ProfileSection />
        <div className="h-px w-full bg-cream-300/60" aria-hidden />
        <PasswordSection />
      </div>
    </div>
  );
}
