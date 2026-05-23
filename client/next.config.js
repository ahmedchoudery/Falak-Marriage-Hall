import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV !== 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['three', 'animejs'],

  // ── Dev proxy: forwards /api/* to Express on :3000 ──────────
  // rewrites() are ignored in the static export build (Vercel
  // handles routing via vercel.json) but work perfectly in
  // `next dev`, fixing the "<!DOCTYPE" JSON parse errors.
  ...(isDev && {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3000/api/:path*',
        },
      ];
    },
  }),
};

export default nextConfig;