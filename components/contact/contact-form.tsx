"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Select, type SelectOption } from "@/components/ui/select";
import { ApiError } from "@/lib/api-client";
import {
  type ContactRequest,
  type InquiryType,
  sendContactMessage,
} from "@/lib/api/contact";
import { cn } from "@/lib/utils";

const INQUIRY_OPTIONS: SelectOption<InquiryType>[] = [
  { value: "support", label: "Support" },
  { value: "partnership", label: "Partnership" },
  { value: "feature", label: "Feature suggestion" },
  { value: "refund", label: "Refund question" },
];

const MESSAGE_MAX = 4000;

interface FieldErrors {
  name?: string;
  email?: string;
  inquiry_type?: string;
  message?: string;
  general?: string;
}

/**
 * Public contact form. POSTs to /v1/contact, which delivers the inquiry to
 * the admin inbox via Resend (with reply_to set to the submitter's email).
 *
 * On success, swaps to an inline thank-you state — no redirect, no toast lib.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [inquiry, setInquiry] = useState<InquiryType | "">("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const localErrors: FieldErrors = {};
    if (!name.trim()) localErrors.name = "Name is required.";
    if (!email.trim()) {
      localErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      localErrors.email = "Use a valid email address.";
    }
    if (!inquiry) localErrors.inquiry_type = "Pick one.";
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      localErrors.message = "Message is required.";
    } else if (trimmedMessage.length < 10) {
      localErrors.message = "Tell us a bit more — at least 10 characters.";
    }
    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const payload: ContactRequest = {
        name: name.trim(),
        email: email.trim(),
        inquiry_type: inquiry as InquiryType,
        message: trimmedMessage,
      };
      await sendContactMessage(payload);
      setSent(true);
    } catch (err) {
      setErrors({
        general:
          err instanceof ApiError
            ? err.message
            : "Couldn't send. Try again in a minute.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return <ThanksState onReset={() => resetAll()} />;
  }

  function resetAll() {
    setName("");
    setEmail("");
    setInquiry("");
    setMessage("");
    setErrors({});
    setSent(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field
          label="Name"
          htmlFor="name"
          error={errors.name}
        >
          <input
            id="name"
            type="text"
            value={name}
            maxLength={120}
            placeholder="Your name"
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
            }}
            className={inputCls(!!errors.name)}
            autoComplete="name"
          />
        </Field>

        <Field
          label="Email address"
          htmlFor="email"
          error={errors.email}
        >
          <input
            id="email"
            type="email"
            inputMode="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
            className={inputCls(!!errors.email)}
            autoComplete="email"
          />
        </Field>
      </div>

      <Field label="Inquiry type" error={errors.inquiry_type}>
        <Select<InquiryType | "">
          value={inquiry}
          onChange={(v) => {
            setInquiry(v);
            if (errors.inquiry_type)
              setErrors((p) => ({ ...p, inquiry_type: undefined }));
          }}
          options={INQUIRY_OPTIONS as SelectOption<InquiryType | "">[]}
          placeholder="Select an option"
          aria-label="Inquiry type"
          className={cn(
            "rounded-xl",
            errors.inquiry_type && "ring-1 ring-error/40",
          )}
        />
      </Field>

      <Field
        label="Message"
        htmlFor="message"
        error={errors.message}
        counter={`${message.length} / ${MESSAGE_MAX}`}
      >
        <textarea
          id="message"
          value={message}
          rows={6}
          maxLength={MESSAGE_MAX}
          placeholder="How can we help?"
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message)
              setErrors((p) => ({ ...p, message: undefined }));
          }}
          className={cn(inputCls(!!errors.message), "resize-y")}
        />
      </Field>

      {errors.general ? (
        <p
          role="alert"
          className="rounded-md border border-error/30 bg-plum-100/40 px-4 py-3 text-sm text-error"
        >
          {errors.general}
        </p>
      ) : null}

      <Button type="submit" loading={submitting} className="rounded-xl">
        Send message
        <Send className="h-4 w-4" strokeWidth={2} aria-hidden />
      </Button>
    </form>
  );
}

// =================================================================== //
//  Field wrapper + shared input classes                                //
// =================================================================== //

function Field({
  label,
  htmlFor,
  error,
  counter,
  children,
}: {
  label: string;
  /** Omit when the field's control isn't a native input/select/textarea
   *  (e.g. when wrapping the custom <Select> component). */
  htmlFor?: string;
  error?: string;
  counter?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={htmlFor}
          className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-50"
        >
          {label}
        </label>
        {counter ? (
          <span className="font-mono text-[11px] text-cream-400">{counter}</span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p role="alert" className="text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputCls(hasError: boolean): string {
  return cn(
    "w-full rounded-xl border bg-cream-50 px-4 py-3 text-base text-ink-700 outline-none transition-colors placeholder:text-cream-400",
    "focus:border-moss-500 focus:ring-1 focus:ring-moss-500/40",
    hasError ? "border-error/60" : "border-cream-300",
  );
}

// =================================================================== //
//  Thank-you state (post-submit)                                       //
// =================================================================== //

function ThanksState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl border border-moss-600/30 bg-moss-100/60 p-8 text-center">
      <span
        aria-hidden
        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cream-50 text-moss-700 shadow-soft"
      >
        <CheckCircle2 className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <h2 className="mb-2 font-display text-2xl text-moss-700">Message sent.</h2>
      <p className="mx-auto mb-6 max-w-md text-base leading-relaxed text-ink-700">
        Thanks for writing in. A human will read it and reply directly to your
        email — usually within 24 hours.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="font-mono text-[11px] uppercase tracking-wider text-moss-700 underline decoration-moss-600/40 underline-offset-4 hover:decoration-moss-600"
      >
        Send another message
      </button>
    </div>
  );
}
