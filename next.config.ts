import type { NextConfig } from "next";

const {withNextVideo} = require('next-video/process')

const nextConfig: NextConfig = {
   
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "cdn.sanity.io",
        protocol: "https",
        port: "",
      },
      {
        hostname: "img.icons8.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "img.clerk.com",
        protocol: "https",
        port: "",
      },
    ],
  },
};

export default withNextVideo(nextConfig);
