import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Jusqu'à 3 photos de 5 Mo chacune (voir MAX_PHOTO_SIZE dans
      // actions.ts), plus une marge pour les en-têtes multipart.
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
