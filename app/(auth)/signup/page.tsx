"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AuthShell } from "@/components/auth/auth-shell";
import { SubmitButton } from "@/components/auth/submit-button";
import { TextInput } from "@/components/auth/text-input";
import { ApiError } from "@/lib/api-client";
import { signupStart } from "@/lib/api/auth";

const schema = z.object({
  email: z.string().min(1, "Enter your email").email("That doesn't look like a valid email"),
});

type FormData = z.infer<typeof schema>;

function SignupPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const prefill = params.get("email") ?? "";

  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: prefill },
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await signupStart(data.email);
      router.push(`/signup/verify?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "EMAIL_TAKEN") {
          setServerError("That email already has an account. Try logging in instead.");
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
      title="Create your account."
      subtitle="We'll send you a 6-digit code to verify your email."
      quote="The best ideas don't show up in search results. They surface in messy threads at 1 AM."
      attribution="The archive"
      footer={
        <p className="text-center">
          Already have an account?{" "}
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
          Send verification code
        </SubmitButton>
      </form>
    </AuthShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupPageInner />
    </Suspense>
  );
}
