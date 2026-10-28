import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O Chrome manda Origin: http://127.0.0.1. Sem isso o HMR responde
  // "Unauthorized" e a página fica no HTML estático, sem o treino do dia.
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
