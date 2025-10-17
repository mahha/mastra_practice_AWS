import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@mastra/*"],
  eslint: {
    // ビルド時に ESLint を無視
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
