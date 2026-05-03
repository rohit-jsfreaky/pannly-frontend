"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordInput } from "@/components/auth/password-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { TextInput } from "@/components/auth/text-input";
import { ApiError } from "@/lib/api-client";
import { signupComplete } from "@/lib/api/auth";
import { useAuth } from "@/lib/auth-context";
import {
  clearChallengeToken,
  readChallengeToken,
} from "@/lib/challenge-token";

const schema = z.object({
  display_name: z.string().max(80).optional(),
  password: z.string().min(8, "Must be at least 8 characters").max(128),
});

type FormData = z.infer<typeof schema>;

function SignupCompletePageInner() {
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

  // No challenge token in storage → user skipped the verify step. Send them back.
  useEffect(() => {
    const token = readChallengeToken("signup");
    if (!token) {
      router.replace(`/signup${email ? `?email=${encodeURIComponent(email)}` : ""}` as Route);
      return;
    }
    setTokenChecked(true);
  }, [email, router]);

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    const token = readChallengeToken("signup");
    if (!token) {
      router.replace("/signup");
      return;
    }
    try {
      const res = await signupComplete({
        signup_token: token,
        password: data.password,
        display_name: data.display_name || null,
      });
      clearChallengeToken("signup");
      setUser(res.user);
      router.replace("/feed");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "SIGNUP_TOKEN_INVALID") {
          clearChallengeToken("signup");
          router.replace(`/signup${email ? `?email=${encodeURIComponent(email)}` : ""}` as Route);
          return;
        }
        setServerError(err.message);
      } else {
        setServerError("Something went wrong. Try again.");
      }
    }
  };

  if (!tokenChecked) return null; // brief blank while we redirect

  return (
    <AuthShell
      title="Set your password."
      subtitle={
        <>
          Last step. We'll log you in as{" "}
          <span className="font-medium text-ink-700">{email}</span>.
        </>
      }
      quote="Pick something a password manager can hold. Then forget about it."
      attribution="The archive"
      footer={
        <p className="text-center">
          Wrong email?{" "}
          <Link href="/signup" className="font-medium text-moss-600 hover:underline">
            Start over
          </Link>
        </p>
      }
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="display_name"
            className="font-mono text-xs font-semibold uppercase tracking-[0.05em] text-ink-50/70"
          >
            Display name <span className="text-ink-50/50">(optional)</span>
          </label>
          <TextInput
            id="display_name"
            type="text"
            autoComplete="name"
            placeholder="What should we call you?"
            error={Boolean(errors.display_name)}
            aria-invalid={Boolean(errors.display_name)}
            {...register("display_name")}
          />
          {errors.display_name ? (
            <p className="text-xs text-error">{errors.display_name.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="font-mono text-xs font-semibold uppercase tracking-[0.05em] text-ink-50/70"
          >
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={Boolean(errors.password)}
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-xs text-error">{errors.password.message}</p>
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
          Create account
        </SubmitButton>
      </form>
    </AuthShell>
  );
}

export default function SignupCompletePage() {
  return (
    <Suspense fallback={null}>
      <SignupCompletePageInner />
    </Suspense>
  );
}
