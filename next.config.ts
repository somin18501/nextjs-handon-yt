import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        port: "",
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        hostname: "giddy-canary-592.convex.cloud",
        port: "",
        protocol: "https",
      },
      {
        hostname: "quaint-panda-401.convex.cloud",
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
