import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "woo.meowspaces.xyz",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      // Local WooCommerce from compose.yml
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
      },
      {
        protocol: "http",
        hostname: "wordpress",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
