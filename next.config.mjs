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
    // Content-Security-Policy in ENFORCING mode. The policy was monitored in
    // Report-Only for the first deploys; with the third-party allowlist now
    // stable (Plausible + analytics.pannly.com for scripts, Dodo for forms,
    // api.pannly.getrevlio.com for fetches) we graduate it to enforcing so it
    // actually provides XSS protection.
    //
    // 'unsafe-inline' on script-src is required for the JSON-LD blocks emitted
    // via dangerouslySetInnerHTML (every interior page renders one) AND for
    // Next.js's inline runtime bootstrap. Removing it requires switching to
    // nonce-based CSP, which is a larger refactor. 'unsafe-inline' on style-src
    // is required for Tailwind's inline styles.
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
      // it must be listed explicitly.
      "connect-src 'self' https://api.pannly.getrevlio.com https://plausible.io https://analytics.pannly.com",
      "form-action 'self' https://test.dodopayments.com https://live.dodopayments.com",
      "upgrade-insecure-requests",
    ].join("; ");

    // Permissions-Policy: lock down sensors we don't use AND opt out of
    // ad-relevance / federated APIs we have no plans for.
    const permissionsPolicy = [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      // Dodo redirects to its own checkout — we never invoke the Payment
      // Request API in-page, so explicitly opt out.
      "payment=()",
      // Opt out of Google's Topics API (advertising relevance signal).
      "browsing-topics=()",
      // Opt out of FLoC's successor and shared storage APIs we don't use.
      "interest-cohort=()",
    ].join(", ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: permissionsPolicy },
          // 2-year HSTS with subdomains and preload.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Enforcing now — flip back to Content-Security-Policy-Report-Only
          // for one deploy if a new third-party integration breaks unexpectedly.
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
