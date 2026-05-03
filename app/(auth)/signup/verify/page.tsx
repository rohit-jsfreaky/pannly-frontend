"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { OtpInput } from "@/components/auth/otp-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { saveChallengeToken } from "@/lib/challenge-token";
import { signupStart, signupVerify } from "@/lib/api/auth";

const RESEND_COOLDOWN = 60; // seconds — backend rate-limits at 3/email/hour anyway

function SignupVerifyPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // No email → user landed here directly. Bounce back.
  useEffect(() => {
    if (!email) router.replace("/signup");
  }, [email, router]);

  // Countdown ticker for the resend button.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = async (codeValue: string) => {
    if (verifying || codeValue.length < 6) return;
    setVerifying(true);
    setServerError(null);
    try {
      const { token } = await signupVerify(email, codeValue);
      saveChallengeToken("signup", token);
      router.push(`/signup/complete?email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
        if (err.code === "OTP_TOO_MANY_ATTEMPTS" || err.code === "OTP_EXPIRED") {
          // Code is dead — clear so the user can re-type after resending.
          setCode("");
        }
      } else {
        setServerError("Something went wrong. Try again.");
      }
    } finally {
      setVerifying(false);
    }
  };

  const onResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setServerError(null);
    try {
      await signupStart(email);
      setCooldown(RESEND_COOLDOWN);
      setCode("");
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
        if (err.code === "RATE_LIMITED") setCooldown(RESEND_COOLDOWN);
      } else {
        setServerError("Couldn't resend. Try again.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell
      title="Check your inbox."
      subtitle={
        <>
          We sent a 6-digit code to{" "}
          <span className="font-medium text-ink-700">{email || "your email"}</span>.
        </>
      }
      quote="Verification is the boring step that keeps the spam out and the signal in."
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
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          submit(code);
        }}
        className="flex flex-col gap-6"
      >
        <OtpInput
          value={code}
          onChange={setCode}
          onComplete={submit}
          disabled={verifying}
          error={Boolean(serverError)}
        />

        {serverError ? (
          <div
            role="alert"
            className="rounded-md border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
          >
            {serverError}
          </div>
        ) : null}

        <SubmitButton loading={verifying} disabled={code.length !== 6}>
          Verify code
        </SubmitButton>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            loading={resending}
            disabled={cooldown > 0}
            onClick={onResend}
            className="text-sm"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </Button>
        </div>
      </form>
    </AuthShell>
  );
}

export default function SignupVerifyPage() {
  return (
    <Suspense fallback={null}>
      <SignupVerifyPageInner />
    </Suspense>
  );
}
