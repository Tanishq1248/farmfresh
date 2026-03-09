import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============ IMAGE OPTIMIZATION ============
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60000, // 1 minute
  },

  // ============ SECURITY HEADERS ============
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://*.google.com https://*.googleapis.com data: blob:; script-src-elem 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; style-src-attr 'unsafe-inline'; img-src 'self' https: data: blob:; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data: blob:; connect-src 'self' https://*.firebase.com https://*.firebaseio.com https://*.firebaseapp.com https://identitytoolkit.googleapis.com https://*.googleapis.com https://cdnjs.cloudflare.com wss:; frame-ancestors 'self'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
    ];
  },

  // ============ COMPRESSION & OPTIMIZATION ============
  compress: true,
  poweredByHeader: false,

  // ============ TYPESCRIPT STRICT MODE ============
  typescript: {
    tsconfigPath: './tsconfig.json',
  },

  // ============ BUILD OPTIMIZATION ============
  productionBrowserSourceMaps: false,

  // ============ ENVIRONMENT VARIABLES ============
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
};

export default nextConfig;
