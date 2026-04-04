import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    styledComponents: false,
  },
  compiler: {
    styledComponents: false,
  },
};

export default nextConfig;
