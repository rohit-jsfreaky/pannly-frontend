"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordInput } from "@/components/auth/password-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { TextInput } from "@/components/auth/text-input";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

const schema = z.object({
  email: z.string().min(1, "Enter your email").email("That doesn't look like a valid email"),
  password: z.string().min(1, "Enter your password"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/feed";
  const { login } = useAuth();

  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await login(data.email, data.password);
      router.replace(next as Route);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "EMAIL_NOT_VERIFIED") {
          // Email exists but verification never completed — restart signup OTP flow.
          router.push(`/signup?email=${encodeURIComponent(data.email)}`);
          return;
        }
        setServerError(err.message);
      } else {
        setServerError("Something went wrong. Try again.");
      }
    }
  };

  return (
    <AuthShell
      title="Welcome back."
      subtitle="Log in with your email and password."
      quote="Most ideas die in the drafts folder. Pannly costs $3 to find one worth opening."
      attribution="The archive"
      footer={
        <p className="text-center">
          New to Pannly?{" "}
          <Link href="/signup" className="font-medium text-moss-600 hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="font-mono text-xs font-semibold uppercase tracking-[0.05em] text-ink-50/70"
          >
            Email
          </label>
          <TextInput
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            error={Boolean(errors.email)}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email ? <p className="text-xs text-error">{errors.email.message}</p> : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="password"
              className="font-mono text-xs font-semibold uppercase tracking-[0.05em] text-ink-50/70"
            >
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-moss-600 hover:underline">
              Forgot?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Your password"
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
          Log in
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
