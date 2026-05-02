"use client";

import { useState } from "react";
import { toast } from "sonner";

import { AvatarPicker } from "@/components/settings/avatar-picker";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import {
  type UpdateProfileBody,
  updateProfile,
} from "@/lib/api/me";
import { presignAvatar, uploadFileToR2 } from "@/lib/api/uploads";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

/**
 * Profile editor.
 *
 * Save flow (lazy upload — no R2 traffic until the user explicitly hits Save):
 *
 *   1. Validate locally (display_name not empty).
 *   2. Diff against the original auth-context user. Build a PATCH body
 *      containing ONLY the fields that actually changed.
 *   3. If `screenshotFile` is staged → presign + PUT to R2 → use the
 *      returned URL as `avatar_url`. If the user clicked Remove and no new
 *      file is staged → send `avatar_url: null` to clear.
 *   4. PATCH /v1/me/profile with the diff.
 *   5. AuthContext.updateUser(patch) → navbar reflects without a /me
 *      refetch.
 *
 *  No-op shortcut: if nothing changed (no file staged, no name change, no
 *  remove flag), Save is a no-op + a toast.
 */
export function ProfileSection() {
  const { user, updateUser } = useAuth();

  // Local form state mirrors the auth-context user. We re-sync on user
  // change so logout-into-other-user works too (rare but cheap).
  const [displayName, setDisplayName] = useState(user?.display_name ?? "");
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const initials = deriveInitials(user.display_name, user.email);

  // Effective preview URL for the picker: null when user is mid-remove,
  // otherwise the saved URL.
  const pickerInitialUrl = removeAvatar ? null : user.avatar_url;

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    const trimmedName = displayName.trim();
    if (!trimmedName) {
      toast.error("Display name can't be empty.");
      return;
    }

    // Diff against current user state. Only send what actually changed.
    const patch: UpdateProfileBody = {};
    if (trimmedName !== (user.display_name ?? "")) {
      patch.display_name = trimmedName;
    }

    setSaving(true);
    try {
      // Avatar upload is the slow part — do it before the PATCH so we have
      // the final URL to send.
      if (stagedFile) {
        const presigned = await presignAvatar(stagedFile.type);
        const url = await uploadFileToR2(presigned, stagedFile);
        patch.avatar_url = url;
      } else if (removeAvatar && user.avatar_url) {
        patch.avatar_url = null;
      }

      // Genuine no-op: no name change, no avatar change.
      if (Object.keys(patch).length === 0) {
        toast("No changes to save.");
        setSaving(false);
        return;
      }

      const res = await updateProfile(patch);
      // Splice the server-confirmed values back into the auth context so the
      // navbar (and anything else reading from useAuth) updates instantly.
      updateUser({
        display_name: res.display_name,
        avatar_url: res.avatar_url,
      });
      // Reset local-only flags now that they're persisted.
      setStagedFile(null);
      setRemoveAvatar(false);
      toast.success("Profile saved.");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Couldn't save your profile.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-labelledby="profile-heading" className="space-y-6">
      <header>
        <h2
          id="profile-heading"
          className="font-display text-2xl text-ink-700"
        >
          Profile
        </h2>
        <p className="text-sm text-ink-50">
          This information is shown next to your activity on Pannly.
        </p>
      </header>

      <form onSubmit={onSave} className="space-y-6" noValidate>
        <AvatarPicker
          fallbackInitials={initials}
          initialUrl={pickerInitialUrl}
          file={stagedFile}
          onFileChange={(f) => {
            setStagedFile(f);
            setRemoveAvatar(false);
          }}
          onClear={() => {
            setStagedFile(null);
            // Only mark for removal if there's actually a saved avatar to
            // remove. If they just picked a new file then clicked Remove,
            // we just discard the staged file and keep the existing URL.
            setRemoveAvatar(!!user.avatar_url);
          }}
          busy={saving}
        />

        <Field label="Display name" htmlFor="display_name">
          <input
            id="display_name"
            type="text"
            value={displayName}
            maxLength={80}
            placeholder="Your name"
            onChange={(e) => setDisplayName(e.target.value)}
            className={inputCls}
            autoComplete="name"
            required
          />
        </Field>

        <Field
          label="Email address"
          htmlFor="email"
          hint="Email can't be changed for now — reach out to support if you need to."
        >
          <input
            id="email"
            type="email"
            value={user.email}
            readOnly
            disabled
            className={cn(inputCls, "cursor-not-allowed bg-cream-200/60 text-ink-50")}
          />
        </Field>

        <Button
          type="submit"
          loading={saving}
          className="rounded-xl"
          disabled={saving}
        >
          Save profile
        </Button>
      </form>
    </section>
  );
}

// =================================================================== //
//  Local primitives                                                    //
// =================================================================== //

function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-50"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-ink-50">{hint}</p> : null}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 text-base text-ink-700 outline-none transition-colors placeholder:text-cream-400 focus:border-moss-500 focus:ring-1 focus:ring-moss-500/40";

function deriveInitials(displayName: string | null, email: string): string {
  const base = (displayName || email).trim();
  if (!base) return "?";
  const parts = base.split(/[\s.@_-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return base.slice(0, 2).toUpperCase();
}
