import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "picsum.photos" },
      { hostname: "placehold.co" },
      { hostname: "cdn-icons-png.flaticon.com" },
      { hostname: "thanhdevne.s3.us-east-005.backblazeb2.com" },
      { hostname: "huit.edu.vn" },
    ],
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },
  output: "standalone",
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
