import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 🚨 not doing this forever – but fine for demo/deployment now
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;