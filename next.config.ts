import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'], // Разрешаем загрузку изображений с localhost
  },
};

export default nextConfig;
