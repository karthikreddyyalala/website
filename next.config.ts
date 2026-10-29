import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Type and lint errors were previously suppressed here, which hid real
  // failures rather than fixing them. Both checks are on.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
