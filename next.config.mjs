/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Produces a self-contained .next/standalone bundle that the Coolify Dockerfile copies.
  // Has no effect on `next dev` or local dev workflows.
  output: "standalone",
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      // OG images served from our own domain.
      { protocol: "https", hostname: "pannly.com" },
      { protocol: "https", hostname: "*.pannly.com" },
    ],
  },
  async headers() {
    // Content-Security-Policy in Report-Only mode for the first deploy so we
    // don't break a third-party widget by accident. Flip the header key to
    // `Content-Security-Policy` (no -Report-Only) once 7 days of clean reports
    // pass.
    //
    // 'unsafe-inline' on script-src is required for the JSON-LD blocks emitted
    // via dangerouslySetInnerHTML (every interior page renders one). 'unsafe-
    // inline' on style-src is required for Tailwind's inline styles in dev.
    // Plausible analytics whitelisted explicitly.
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "script-src 'self' 'unsafe-inline' https://plausible.io https://analytics.pannly.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      // 'self' = same-origin (pannly.getrevlio.com). The API lives on the
      // api.* subdomain which is a DIFFERENT origin from CSP's perspective, so
      // it must be listed explicitly. Without this every browser → backend
      // fetch trips a CSP report (and would be blocked once we flip CSP out
      // of Report-Only mode).
      "connect-src 'self' https://api.pannly.getrevlio.com https://plausible.io https://analytics.pannly.com",
      "form-action 'self' https://test.dodopayments.com https://live.dodopayments.com",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // 2-year HSTS with subdomains and preload — only meaningful in
          // production behind HTTPS. Coolify/Caddy serves https; the header
          // is safe in dev (browsers ignore HSTS over http://localhost).
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Content-Security-Policy-Report-Only", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
