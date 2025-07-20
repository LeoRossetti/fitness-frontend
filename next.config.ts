import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'], // Разрешаем загрузку изображений с localhost
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withSentryConfig(nextConfig, {
  // Suppresses source map uploading logs during build
  silent: true,
  
  // Upload a larger set of source maps for prettier stack traces
  widenClientFileUpload: true,

  // Routes browser requests to Sentry through a Next.js rewrite
  tunnelRoute: "/monitoring",
});
