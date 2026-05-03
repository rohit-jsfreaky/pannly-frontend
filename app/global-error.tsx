"use client";

/**
 * Outermost error boundary.
 *
 * Catches errors thrown inside the ROOT layout (app/layout.tsx) — at this
 * point, even <html>/<body>/our fonts may not have rendered, so this file
 * MUST own its own <html> + <body> tags.
 *
 * Keep it dependency-free: no AuthProvider, no TopNav, no Tailwind classes
 * that depend on @theme tokens (use raw CSS vars or inline styles). If
 * Tailwind's CSS layer failed to load, class utilities won't apply.
 */
import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[global-error]", error.digest ?? "no-digest", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf9f7",
          color: "#1a2520",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "ui-monospace, 'Geist Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#717974",
              marginBottom: "1.5rem",
            }}
          >
            Something broke
          </p>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              margin: 0,
              marginBottom: "1rem",
              color: "#0f1310",
            }}
          >
            Pannly hit a fatal error.
          </h1>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "#414844",
              marginBottom: "2rem",
            }}
          >
            We're working on it. Try reloading — if the issue persists, email{" "}
            <a
              href="mailto:support@getrevlio.com"
              style={{ color: "#2a4c3f", textDecoration: "underline" }}
            >
              support@getrevlio.com
            </a>
            .
          </p>
          {error.digest ? (
            <p
              style={{
                fontFamily: "ui-monospace, 'Geist Mono', monospace",
                fontSize: 12,
                color: "#717974",
                marginBottom: "1.5rem",
              }}
            >
              Reference · {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              backgroundColor: "#2a4c3f",
              color: "#faf9f7",
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.75rem 1.5rem",
              fontSize: "0.95rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reload the page
          </button>
        </div>
      </body>
    </html>
  );
}
