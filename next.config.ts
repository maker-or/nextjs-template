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

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow this machine's current LAN addresses for local HMR without tying
  // the template to one developer's IP address.
  allowedDevOrigins: [...new Set([...configuredDevOrigins, ...localDevOrigins])],
};

export default nextConfig;
