import { env } from "@orchestra/env/web";
import { AUTH_BASE_PATH } from "@orchestra/shared/constants/auth";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      destination: `${env.API_URL}${AUTH_BASE_PATH}/:path*`,
      source: `${AUTH_BASE_PATH}/:path*`,
    },
  ],
  transpilePackages: ["@orchestra/shared", "@orchestra/ui"],
};

export default withNextIntl(nextConfig);
