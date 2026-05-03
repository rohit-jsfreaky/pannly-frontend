import { ImageResponse } from "next/og";

/**
 * Shared OG image template — cream background, moss wordmark top-left, big
 * Fraunces-style serif headline centred, tagline below.
 *
 * Avoids loading custom font binaries (which add 100-500KB to each render);
 * uses the system serif/sans stack which `next/og` substitutes with a built-in
 * fallback. The visual identity comes from colour and layout, not the font.
 */

export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png" as const;

const TOKENS = {
  cream100: "#F7F2EA",
  cream300: "#DFD4BE",
  cream400: "#7A7368",
  moss500: "#426456",
  moss600: "#2E4D3F",
  moss700: "#1F3A2E",
  ink700: "#0F1310",
  plum500: "#7B4F5C",
} as const;

interface RenderInput {
  /** The big Fraunces headline. Keep under ~70 chars for fit. */
  headline: string;
  /** Eyebrow line above the headline (mono uppercase). */
  eyebrow?: string;
  /** Sub-line below the headline (Inter, ink50). */
  sub?: string;
  /** Override the bottom-right tag chip. Defaults to "$3 · refunded if you ship". */
  tag?: string;
}

export function renderPannlyOg(input: RenderInput): ImageResponse {
  const tag = input.tag ?? "$3 · refunded if you ship";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: TOKENS.cream100,
          padding: "60px 72px",
          fontFamily:
            'Inter, "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
          color: TOKENS.ink700,
        }}
      >
        {/* Top row — wordmark */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span
            style={{
              fontFamily:
                '"Fraunces", "Georgia", "Times New Roman", serif',
              fontSize: 48,
              fontWeight: 600,
              color: TOKENS.moss500,
              letterSpacing: "-0.02em",
            }}
          >
            pannly
          </span>
          <span
            style={{
              fontFamily:
                '"Fraunces", "Georgia", "Times New Roman", serif',
              fontSize: 48,
              fontWeight: 600,
              color: TOKENS.plum500,
              lineHeight: 1,
            }}
          >
            .
          </span>
        </div>

        {/* Centre — headline + sub */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: 24,
          }}
        >
          {input.eyebrow ? (
            <div
              style={{
                fontFamily:
                  '"Geist Mono", "Menlo", "Consolas", ui-monospace, monospace',
                fontSize: 18,
                letterSpacing: "0.18em",
                color: TOKENS.cream400,
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              {input.eyebrow}
            </div>
          ) : null}
          <div
            style={{
              fontFamily:
                '"Fraunces", "Georgia", "Times New Roman", serif',
              fontSize: 68,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: TOKENS.ink700,
              maxWidth: 1000,
            }}
          >
            {input.headline}
          </div>
          {input.sub ? (
            <div
              style={{
                marginTop: 24,
                fontSize: 28,
                lineHeight: 1.4,
                color: TOKENS.moss700,
                maxWidth: 900,
              }}
            >
              {input.sub}
            </div>
          ) : null}
        </div>

        {/* Bottom row — tag chip + URL */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: `1px solid ${TOKENS.cream300}`,
          }}
        >
          <span
            style={{
              fontFamily:
                '"Geist Mono", "Menlo", "Consolas", ui-monospace, monospace',
              fontSize: 18,
              letterSpacing: "0.12em",
              color: TOKENS.cream400,
              textTransform: "uppercase",
            }}
          >
            pannly.getrevlio.com
          </span>
          <span
            style={{
              background: TOKENS.moss600,
              color: TOKENS.cream100,
              padding: "10px 22px",
              borderRadius: 12,
              fontSize: 22,
              fontWeight: 500,
            }}
          >
            {tag}
          </span>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
