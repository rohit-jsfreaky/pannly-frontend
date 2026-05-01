"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordInput } from "@/components/auth/password-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { ApiError } from "@/lib/api-client";
import { forgotPasswordReset } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth-context";
import {
  clearChallengeToken,
  readChallengeToken,
} from "@/lib/challenge-token";

const schema = z
  .object({
    new_password: z.string().min(8, "Must be at least 8 characters").max(128),
    confirm_password: z.string(),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const { setUser } = useAuth();

  const [serverError, setServerError] = useState<string | null>(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const token = readChallengeToken("reset");
    if (!token) {
      router.replace(
        `/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ""}` as Route,
      );
      return;
    }
    setTokenChecked(true);
  }, [email, router]);

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    const token = readChallengeToken("reset");
    if (!token) {
      router.replace("/forgot-password");
      return;
    }
    try {
      const res = await forgotPasswordReset({
        reset_token: token,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });
      clearChallengeToken("reset");
      setUser(res.user);
      router.replace("/feed");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "RESET_TOKEN_INVALID") {
          clearChallengeToken("reset");
          router.replace("/forgot-password");
          return;
        }
        setServerError(err.message);
      } else {
        setServerError("Something went wrong. Try again.");
      }
    }
  };

  if (!tokenChecked) return null;

  return (
    <AuthShell
      title="Pick a new password."
      subtitle={
        <>
          Resetting for{" "}
          <span className="font-medium text-ink-700">{email}</span>.
        </>
      }
      quote="A fresh password is just a few seconds away."
      attribution="The archive"
      footer={
        <p className="text-center">
          Changed your mind?{" "}
          <Link href="/login" className="font-medium text-moss-600 hover:underline">
            Back to login
          </Link>
        </p>
      }
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="new_password"
            className="font-mono text-xs font-semibold uppercase tracking-[0.05em] text-ink-50/70"
          >
            New password
          </label>
          <PasswordInput
            id="new_password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={Boolean(errors.new_password)}
            aria-invalid={Boolean(errors.new_password)}
            {...register("new_password")}
          />
          {errors.new_password ? (
            <p className="text-xs text-error">{errors.new_password.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirm_password"
            className="font-mono text-xs font-semibold uppercase tracking-[0.05em] text-ink-50/70"
          >
            Confirm new password
          </label>
          <PasswordInput
            id="confirm_password"
            autoComplete="new-password"
            placeholder="Type it again"
            error={Boolean(errors.confirm_password)}
            aria-invalid={Boolean(errors.confirm_password)}
            {...register("confirm_password")}
          />
          {errors.confirm_password ? (
            <p className="text-xs text-error">{errors.confirm_password.message}</p>
          ) : null}
        </div>

        {serverError ? (
          <div
            role="alert"
            className="rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
          >
            {serverError}
          </div>
        ) : null}

        <SubmitButton loading={isSubmitting} className="mt-2">
          Reset password
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
