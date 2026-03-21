import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // Domínio do UploadThing
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Adicionando Unsplash (Correção do erro)
      },
    ],
  },
};

export default nextConfig;