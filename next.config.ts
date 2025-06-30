import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "picsum.photos" }],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
