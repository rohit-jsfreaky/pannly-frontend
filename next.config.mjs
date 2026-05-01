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
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
