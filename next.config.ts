import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    qualities: [75, 85],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;