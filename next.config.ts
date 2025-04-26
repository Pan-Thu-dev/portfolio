import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      "drive.google.com",
      "lh3.googleusercontent.com", // Google Photos
      "storage.googleapis.com", // Firebase Storage
      "firebasestorage.googleapis.com", // Firebase Storage alternative URL
      "i.imgur.com", // Imgur
    ],
  },
};

export default nextConfig;
