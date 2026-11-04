import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Internal packages ship TypeScript source; let Next compile them.
  transpilePackages: ["@repo/ui"],
};

export default nextConfig;
