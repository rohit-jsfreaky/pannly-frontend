"use client";

import { useState } from "react";
import { toast } from "sonner";

import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { changePassword } from "@/lib/api/me";
import { cn } from "@/lib/utils";

const MIN_LEN = 8;

interface FieldErrors {
  current?: string;
  next?: string;
  confirm?: string;
}

/**
 * Update-password form. Three fields: current, new, confirm.
 *
 * Server is the source of truth on "current password is correct" — we only
 * do format validation here. On 401 from the API we map the message to the
 * `current` field; other errors surface as a generic toast.
 */
export function PasswordSection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    const localErrors: FieldErrors = {};
    if (!current) localErrors.current = "Required.";
    if (next.length < MIN_LEN) {
      localErrors.next = `At least ${MIN_LEN} characters.`;
    }
    if (next !== confirm) {
      localErrors.confirm = "Doesn't match the new password.";
    }
    if (next && current && next === current) {
      localErrors.next = "New password must be different from current.";
    }
    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      await changePassword({
        current_password: current,
        new_password: next,
        confirm_password: confirm,
      });
      toast.success("Password updated.");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // Auth-shaped failure → wrong current password. Surface inline so
        // the user knows which field to fix.
        setErrors({ current: err.message });
      } else {
        toast.error(
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Couldn't update your password.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-labelledby="password-heading" className="space-y-6">
      <header>
        <h2
          id="password-heading"
          className="font-display text-2xl text-ink-700"
        >
          Update password
        </h2>
        <p className="text-sm text-ink-50">
          Use a long, unique password — Pannly doesn't have device-level
          session control yet, so changing this won't sign you out elsewhere.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <Field label="Current password" htmlFor="pwd_current" error={errors.current}>
          <PasswordInput
            id="pwd_current"
            value={current}
            onChange={(e) => {
              setCurrent(e.target.value);
              if (errors.current) setErrors((p) => ({ ...p, current: undefined }));
            }}
            autoComplete="current-password"
            error={!!errors.current}
          />
        </Field>

        <Field
          label="New password"
          htmlFor="pwd_next"
          hint={`Minimum ${MIN_LEN} characters.`}
          error={errors.next}
        >
          <PasswordInput
            id="pwd_next"
            value={next}
            onChange={(e) => {
              setNext(e.target.value);
              if (errors.next) setErrors((p) => ({ ...p, next: undefined }));
            }}
            autoComplete="new-password"
            error={!!errors.next}
          />
        </Field>

        <Field
          label="Confirm new password"
          htmlFor="pwd_confirm"
          error={errors.confirm}
        >
          <PasswordInput
            id="pwd_confirm"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              if (errors.confirm)
                setErrors((p) => ({ ...p, confirm: undefined }));
            }}
            autoComplete="new-password"
            error={!!errors.confirm}
          />
        </Field>

        <Button type="submit" loading={saving} className="rounded-xl">
          Update password
        </Button>
      </form>
    </section>
  );
}

function Field({
  label,
  hint,
  htmlFor,
  error,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2")}>
      <label
        htmlFor={htmlFor}
        className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-50"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-error">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-50">{hint}</p>
      ) : null}
    </div>
  );
}
