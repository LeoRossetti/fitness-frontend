import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'], // Разрешаем загрузку изображений с localhost
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
