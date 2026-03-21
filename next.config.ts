import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignora o TypeScript e ESLint no momento do Build para economizar a memória RAM da AWS
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // Domínio do UploadThing
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Adicionando Unsplash
      },
    ],
  },
};

export default nextConfig;