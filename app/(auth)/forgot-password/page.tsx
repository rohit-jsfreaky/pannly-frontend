"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AuthShell } from "@/components/auth/auth-shell";
import { SubmitButton } from "@/components/auth/submit-button";
import { TextInput } from "@/components/auth/text-input";
import { ApiError } from "@/lib/api-client";
import { forgotPasswordStart } from "@/lib/api/auth";

const schema = z.object({
  email: z.string().min(1, "Enter your email").email("That doesn't look like a valid email"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      // Backend always returns 200 here (doesn't leak account existence).
      await forgotPasswordStart(data.email);
      router.push(`/forgot-password/verify?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
      } else {
        setServerError("Something went wrong. Try again.");
      }
    }
  };

  return (
    <AuthShell
      title="Reset your password."
      subtitle="If we have an account for that email, we'll send a 6-digit code."
      quote="Forgetting passwords is a feature, not a flaw — it means you're using a manager."
      attribution="The archive"
      footer={
        <p className="text-center">
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-moss-600 hover:underline">
            Log in
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

        {serverError ? (
          <div
            role="alert"
            className="rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
          >
            {serverError}
          </div>
        ) : null}

        <SubmitButton loading={isSubmitting} className="mt-2">
          Send reset code
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
