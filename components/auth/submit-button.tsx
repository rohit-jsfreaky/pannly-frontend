import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
}

/**
 * Primary auth-form submit button. Spinner-only loading state — the label
 * stays in place under an invisible span so the button doesn't change width.
 * Thin alias over <Button> so existing imports keep working.
 */
export function SubmitButton({ loading, children, ...rest }: Props) {
  return (
    <Button type="submit" loading={loading} block size="lg" {...rest}>
      {children}
    </Button>
  );
}
