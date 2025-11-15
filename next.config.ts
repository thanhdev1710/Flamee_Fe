import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "picsum.photos" },
      { hostname: "placehold.co" },
      { hostname: "cdn-icons-png.flaticon.com" },
    ],
    dangerouslyAllowSVG: true,
  },
  // output: "standalone",
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
