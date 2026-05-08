import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "car-dealer-rs-bucket.s3.ap-south-1.amazonaws.com",
        pathname: "/listings/**",
      },
    ],
  },
};

export default nextConfig;
