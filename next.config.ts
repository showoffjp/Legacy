import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      // Memorial gallery uploads travel as downscaled data URLs.
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
