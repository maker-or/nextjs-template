import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

const configuredDevOrigins = process.env.NEXT_ALLOWED_DEV_ORIGINS
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean) ?? [];
const localDevOrigins = Object.values(networkInterfaces())
  .flatMap((addresses) => addresses ?? [])
  .filter((address) => !address.internal && address.family === "IPv4")
  .map((address) => address.address);

const securityHeaders = [
  { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Allow this machine's current LAN addresses for local HMR without tying
  // the template to one developer's IP address.
  allowedDevOrigins: [...new Set([...configuredDevOrigins, ...localDevOrigins])],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
