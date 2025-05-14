import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com",
        protocol: "https",
        pathname: "/**",
      },
      {
        hostname: "plus.unsplash.com",
        protocol: "https",
        pathname: "/**",
      },
      {
        hostname: "i.pinimg.com",
        protocol: "https",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
