  import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  basePath: isProd ? '/apps' : '',
  assetPrefix: isProd ? '/apps' : '',
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
  async headers() {
    return [
      {
        source: '/:path*\\.(js|css|png|jpg|jpeg|svg|woff2|woff|eot|ttf|webp)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'ALLOWALL' },
          { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
        ],
      },
    ];
  },
  // In development (no basePath) all hardcoded /apps/* image/asset paths 404
  // because the files live at the public root. This rewrite tunnels them to
  // the correct location so icons work locally without touching every <Image>.
  async rewrites() {
    if (isProd) return [];
    return [
      {
        source: '/apps/:path*',
        destination: '/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/display-data/:crop',
        destination: '/display-data?crop=:crop',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
